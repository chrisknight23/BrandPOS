const express = require('express');
const cors = require('cors'); // ✅ Enable CORS
const path = require('path'); // ✅ For serving the AASA file

const app = express();
const port = 3001;

app.use(cors()); // ✅ Allow cross-origin requests from localhost:3000

// Serve the Apple App Site Association file for Universal Links
app.get('/.well-known/apple-app-site-association', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.sendFile(path.join(__dirname, 'apple-app-site-association'));
});

// Sanity check route
app.get('/test', (req, res) => {
  console.log('✅ Received request at /test');
  res.send('Hello from your Express server!');
});

// In-memory store for demo purposes
// Now stores amount and appReady as well
const scanStatus = {};

// New endpoint: Register a session with an amount
app.post('/register-session', express.json(), (req, res) => {
  const { sessionId, amount } = req.body;
  if (!sessionId || typeof amount === 'undefined') {
    return res.status(400).json({ error: 'sessionId and amount are required' });
  }
  scanStatus[sessionId] = { scanned: false, handoffComplete: false, amount, appReady: false };
  console.log('✅ Registered session:', sessionId, 'with amount:', amount);
  res.json({ success: true });
});

// New endpoint: Mark app as ready
app.post('/app-ready/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  if (!scanStatus[sessionId]) {
    return res.status(404).json({ error: 'Session not found' });
  }
  scanStatus[sessionId].appReady = true;
  console.log('✅ App ready for session:', sessionId);
  res.json({ success: true });
});

// Endpoint hit by QR code scan (now serves minimal page that triggers the App Clip / Universal Link dialog)
app.get('/scan/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  if (!scanStatus[sessionId]) {
    scanStatus[sessionId] = { scanned: false, handoffComplete: false, amount: null, appReady: false };
  }
  scanStatus[sessionId].scanned = true;
  console.log('✅ Session marked as scanned:', sessionId);
  
  // Serve a completely blank page that just triggers the redirect
  res.setHeader('Content-Type', 'text/html');
  res.send(`<!DOCTYPE html>
<html>
<head>
  <title>Loading...</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="apple-itunes-app" content="app-id=6445987069,app-argument=https://chrisk.ngrok.app/scan/${sessionId}">
  <style>
    body {
      background: #fff;
      margin: 0;
      padding: 0;
      height: 100vh;
    }
  </style>
</head>
<body>
  <script>
    // This helps trigger the Universal Link action sheet
    window.location.href = "https://chrisk.ngrok.app/scan/${sessionId}";
  </script>
</body>
</html>`)
});

// NEW: Direct Universal Link endpoint for QR codes - this is what should be encoded in QR codes
app.get('/direct/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  if (!scanStatus[sessionId]) {
    scanStatus[sessionId] = { scanned: false, handoffComplete: false, amount: null, appReady: false };
  }
  scanStatus[sessionId].scanned = true;
  console.log('✅ Direct link accessed, session marked as scanned:', sessionId);
  
  // Send a minimal response that will be used only if the app doesn't open
  res.setHeader('Content-Type', 'text/html');
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Opening App...</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="refresh" content="0;url=https://chrisk.ngrok.app/scan/${sessionId}">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; text-align: center; padding: 40px 20px;">
      <p>Opening LocalCashApp...</p>
      <p>If the app doesn't open, <a href="https://chrisk.ngrok.app/scan/${sessionId}" style="color: #00B843; font-weight: bold;">tap here</a>.</p>
    </body>
    </html>
  `);
});

// Endpoint for iOS app to mark handoff as complete (unchanged)
app.post('/handoff-complete/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  if (!scanStatus[sessionId]) {
    scanStatus[sessionId] = { scanned: false, handoffComplete: false, amount: null, appReady: false };
  }
  scanStatus[sessionId].handoffComplete = true;
  console.log('✅ Handoff complete for session:', sessionId);
  res.json({ success: true });
});

// POS app polls this endpoint (now returns amount and appReady)
app.get('/status/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const status = scanStatus[sessionId] || { scanned: false, handoffComplete: false, amount: null, appReady: false };
  console.log('Checking status for sessionId:', sessionId, '→', status);
  res.json({ scanned: !!status.scanned, handoffComplete: !!status.handoffComplete, amount: status.amount, appReady: !!status.appReady });
});

// NEW: Dedicated QR code landing page that focuses on the Smart App Banner
app.get('/applink/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  if (!scanStatus[sessionId]) {
    scanStatus[sessionId] = { scanned: false, handoffComplete: false, amount: null, appReady: false };
  }
  scanStatus[sessionId].scanned = true;
  console.log('✅ App link landing page accessed for session:', sessionId);
  
  // Serve a minimal page that prominently displays the Smart App Banner
  res.setHeader('Content-Type', 'text/html');
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Open LocalCashApp</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <!-- Apple Smart Banner - THIS is what creates the blue OPEN button -->
      <meta name="apple-itunes-app" content="app-id=6445987069,app-argument=https://chrisk.ngrok.app/scan/${sessionId}">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          text-align: center;
          padding: 20px;
          font-size: 16px;
          background: #f8f8f8;
          color: #333;
          margin: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
        }
        .container {
          max-width: 500px;
          margin: 0 auto;
        }
        .message {
          margin: 30px 0;
          padding: 20px;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .arrow-up {
          width: 0; 
          height: 0; 
          border-left: 20px solid transparent;
          border-right: 20px solid transparent;
          border-bottom: 20px solid #00B843;
          margin: 0 auto 10px auto;
        }
        .hint {
          color: #00B843;
          font-weight: bold;
          font-size: 18px;
          margin-bottom: 20px;
        }
        .fallback {
          margin-top: 40px;
          color: #666;
        }
        .manual-link {
          display: inline-block;
          background: #00B843;
          color: white;
          text-decoration: none;
          padding: 16px 32px;
          border-radius: 24px;
          font-size: 18px;
          font-weight: bold;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="arrow-up"></div>
        <div class="hint">Tap "OPEN" at the top of the screen</div>
        
        <div class="message">
          <p>We're trying to open LocalCashApp...</p>
          <p>If you don't see an "OPEN" button at the top of the screen, try the button below:</p>
          
          <a href="https://chrisk.ngrok.app/scan/${sessionId}" class="manual-link">Open in App</a>
          
          <p class="fallback">Session ID: ${sessionId}</p>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Pure Universal Link endpoint - no HTML, just a redirect to help trigger the App Clip dialog
app.get('/ul/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  if (!scanStatus[sessionId]) {
    scanStatus[sessionId] = { scanned: false, handoffComplete: false, amount: null, appReady: false };
  }
  scanStatus[sessionId].scanned = true;
  console.log('✅ Universal Link endpoint accessed for session:', sessionId);
  
  // Respond with a redirect to the scan endpoint
  res.redirect(`https://chrisk.ngrok.app/scan/${sessionId}`);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});