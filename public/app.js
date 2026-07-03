let ranks = {};
let selectedRank = null;

function setStatus(text) {
  const box = document.getElementById("status");
  if (box) box.textContent = text || "";
}

function getInputValue(id) {
  const box = document.getElementById(id);
  return box ? box.value || "" : "";
}

function getPlayer() {
  const player = getInputValue("player").trim();
  if (!/^[a-zA-Z0-9_]{3,16}$/.test(player)) {
    throw new Error("Enter a valid Minecraft Java username.");
  }
  return player;
}

function getCoupon() {
  return getInputValue("coupon").trim().toUpperCase();
}

async function boot() {
  const config = await fetch("/api/config").then(r => r.json());
  ranks = config.ranks || {};
  renderRanks();

  if (!config.paypalClientId) {
    setStatus("PayPal client ID is missing. Add PAYPAL_CLIENT_ID in Vercel Environment Variables.");
    return;
  }

  const script = document.createElement("script");
  script.src = `https://www.paypal.com/sdk/js?client-id=${config.paypalClientId}&currency=USD`;
  script.onload = renderPayPal;
  script.onerror = () => setStatus("PayPal failed to load. Check PAYPAL_CLIENT_ID.");
  document.body.appendChild(script);
}

function renderRanks() {
  const box = document.getElementById("ranks");
  if (!box) return;

  box.innerHTML = "";

  for (const [id, rank] of Object.entries(ranks)) {
    const card = document.createElement("article");
    card.className = "rank";
    card.innerHTML = `
      <h3 style="color:${rank.color}">${rank.name}</h3>
      <div class="price">$${rank.price}</div>
      <p>${rank.desc}</p>
    `;

    card.onclick = () => {
      selectedRank = id;
      document.querySelectorAll(".rank").forEach(el => el.classList.remove("selected"));
      card.classList.add("selected");

      const selected = document.getElementById("selected");
      if (selected) selected.textContent = `Selected: ${rank.name} - $${rank.price}`;

      setStatus("");
    };

    box.appendChild(card);
  }
}

async function redeemFree(rankId, player, coupon) {
  const freeRes = await fetch("/api/redeem-free", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rankId, player, coupon })
  });

  const result = await freeRes.json();

  if (!freeRes.ok) {
    throw new Error(result.error || "Coupon failed.");
  }

  setStatus(result.message || "Coupon redeemed.");
}

function renderPayPal() {
  if (!window.paypal) {
    setStatus("PayPal failed to load.");
    return;
  }

  paypal.Buttons({
    createOrder: async () => {
      if (!selectedRank) throw new Error("Pick a rank first.");

      const player = getPlayer();
      const coupon = getCoupon();

      setStatus("Creating checkout...");

      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rankId: selectedRank, player, coupon })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Could not create PayPal order.");
      }

      if (data.free) {
        await redeemFree(selectedRank, player, coupon);
        throw new Error("FREE_COUPON_REDEEMED");
      }

      return data.id;
    },

    onApprove: async (data) => {
      setStatus("Payment approved. Capturing payment...");

      const res = await fetch("/api/capture-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: data.orderID })
      });

      const result = await res.json();
      setStatus(result.message || result.error || "Done.");
    },

    onCancel: () => setStatus("Checkout cancelled."),

    onError: (err) => {
      if (err && err.message === "FREE_COUPON_REDEEMED") return;
      setStatus((err && err.message) || "PayPal checkout error.");
    }
  }).render("#paypal-button-container");
}

boot().catch(err => setStatus(err.message));
