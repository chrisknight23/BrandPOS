# QR Code Server Setup Guide

This guide explains how to ensure all required servers are running for the QR code scan flow to work in your POS project.

---

## 1. Start the Express Server

This server handles QR scan and status endpoints.

**Command:**
```sh
node server.js
```
- You should see: `Server listening at http://localhost:3000`

---

## 2. Start the Vite Dev Server (POS App)

This runs your React frontend.

**Command:**
```sh
npm run dev
```
- You should see output like:
  - `Local:   http://localhost:3000/` (or another port if 3000 is in use)

---

## 3. Start ngrok to Expose the Express Server

ngrok gives you a public URL for devices to scan the QR code.

**Command:**
```sh
ngrok http 3000
```
- Copy the HTTPS URL shown (e.g., `https://a746-136-24-91-134.ngrok-free.app`)
- This URL must be used in your QR code and polling hook.

---

## 4. Update QR Code and Polling URLs

- Make sure the QR code encodes:
  - `https://<ngrok-url>/scan/{sessionId}`
- Make sure the polling hook uses:
  - `https://<ngrok-url>/status/{sessionId}`

If you restart ngrok, the URL may change—update both places if so.

---

## 5. Troubleshooting

- **Port in use?**
  - If you see `Port 3000 is in use`, either stop the other process or use the new port shown in the output.
- **CORS errors?**
  - For local testing, you may need to add CORS headers to your Express server.
- **QR code not working?**
  - Check that all servers are running and URLs match.
  - Use the ngrok web interface (http://127.0.0.1:4040) to see incoming requests.
- **Session ID mismatch?**
  - Make sure the sessionId in the QR code matches the one in the polling hook.

---

## 6. Quick Checklist

- [ ] Express server running on port 3000
- [ ] Vite dev server running (React app)
- [ ] ngrok running and public URL copied
- [ ] QR code and polling hook use the correct ngrok URL

---

_Refer to this guide whenever you need to set up or debug the QR code scan flow!_ 