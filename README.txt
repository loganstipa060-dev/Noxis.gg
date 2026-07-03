NOXIS STORE COMPLETE

Upload all files inside this folder to GitHub and deploy on Vercel.

Required Vercel Environment Variables:
PAYPAL_CLIENT_ID
PAYPAL_CLIENT_SECRET
PAYPAL_ENV=sandbox

For automatic Fabric mod rank delivery:
MINECRAFT_RANK_ENDPOINT=http://noxissmp.falixsrv.me:8080/rank
MINECRAFT_RANK_SECRET=your secret from config/noxis-webstore.properties

Test coupon:
TEST100

When TEST100 is used, it skips PayPal and tries to send the rank straight to your Fabric mod.

If you see "Minecraft server could not be reached", Falix is blocking port 8080.
