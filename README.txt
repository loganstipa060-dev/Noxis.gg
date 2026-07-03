NOXIS STORE - RCON FINAL

This version uses RCON instead of the HTTP /rank endpoint.

Upload all files inside this folder to GitHub, commit, and Vercel will redeploy.

Required Vercel Environment Variables:
PAYPAL_CLIENT_ID
PAYPAL_CLIENT_SECRET
PAYPAL_ENV=sandbox

Required RCON Environment Variables:
MINECRAFT_RCON_HOST=noxissmp.falixsrv.me
MINECRAFT_RCON_PORT=25575
MINECRAFT_RCON_PASSWORD=your rcon password from server.properties

server.properties:
enable-rcon=true
rcon.password=your rcon password
rcon.port=25575

Test coupon:
TEST100

If it fails with "connection refused" or "timeout", Falix is not exposing the RCON port publicly.
