NOXIS VERCEL PAYPAL STORE

This version is made for Vercel.

WHAT IT DOES:
- Shows a professional red/black Noxis store.
- Lets a player pick a rank and enter their Minecraft username.
- Uses PayPal Checkout for card/debit/PayPal payment.
- After payment, calls your Fabric server endpoint with:
  rank set <player> <rank>

IMPORTANT:
- Do not collect card numbers yourself. PayPal handles payment safely.
- Use PayPal Sandbox first.
- If you are under 18, a parent/guardian should own the PayPal account.
- Automatic in-game delivery needs your Fabric rank mod to expose an HTTP endpoint.

VERCEL ENVIRONMENT VARIABLES:
PAYPAL_CLIENT_ID
PAYPAL_CLIENT_SECRET
PAYPAL_ENV=sandbox
MINECRAFT_RANK_ENDPOINT
MINECRAFT_RANK_SECRET

DEPLOY STEPS:
1. Upload this folder to GitHub.
2. Go to vercel.com.
3. Add New Project.
4. Import the GitHub repo.
5. Add the environment variables above.
6. Deploy.
7. Open the Vercel URL.
