let ranks = {};
let selectedRank = null;

const statusBox = () => document.getElementById("status");

function setStatus(text) {
  statusBox().textContent = text || "";
}

function getPlayer() {
  const player = document.getElementById("player").value.trim();
  if (!/^[a-zA-Z0-9_]{3,16}$/.test(player)) {
    throw new Error("Enter a valid Minecraft Java username.");
  }
  return player;
}

async function boot() {
  const config = await fetch("/api/config").then(r => r.json());
  ranks = config.ranks;

  renderRanks();

  if (!config.paypalClientId) {
    setStatus("PayPal client ID is missing. Add it in Vercel Environment Variables.");
    return;
  }

  const script = document.createElement("script");
  script.src = `https://www.paypal.com/sdk/js?client-id=${config.paypalClientId}&currency=USD`;
  script.onload = renderPayPal;
  script.onerror = () => setStatus("PayPal failed to load.");
  document.body.appendChild(script);
}

function renderRanks() {
  const box = document.getElementById("ranks");
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
      document.getElementById("selected").textContent = `Selected: ${rank.name} - $${rank.price}`;
      setStatus("");
    };
    box.appendChild(card);
  }
}

function renderPayPal() {
  paypal.Buttons({
    createOrder: async () => {
      if (!selectedRank) throw new Error("Pick a rank first.");
      const player = getPlayer();

      setStatus("Creating PayPal checkout...");
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rankId: selectedRank, player })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not create PayPal order.");
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
    onError: (err) => setStatus(err.message || "PayPal checkout error.")
  }).render("#paypal-button-container");
}

boot().catch(err => setStatus(err.message));
