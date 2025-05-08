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

// Endpoint hit by QR code scan (now redirects to the main /ul/ endpoint)
app.get('/scan/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  if (!scanStatus[sessionId]) {
    scanStatus[sessionId] = { scanned: false, handoffComplete: false, amount: null, appReady: false };
  }
  scanStatus[sessionId].scanned = true;
  console.log('✅ Scan endpoint accessed, redirecting to app page:', sessionId);
  
  res.redirect(`/app/${sessionId}`);
});

// Direct Universal Link endpoint - optimized for being intercepted by iOS before page loads
app.get('/direct/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  if (!scanStatus[sessionId]) {
    scanStatus[sessionId] = { scanned: false, handoffComplete: false, amount: null, appReady: false };
  }
  scanStatus[sessionId].scanned = true;
  console.log('✅ Direct link accessed, session marked as scanned:', sessionId);
  
  // Serve a minimal page with just the Smart Banner
  res.setHeader('Content-Type', 'text/html');
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Open App</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="apple-itunes-app" content="app-id=6445987069, app-argument=https://chrisk.ngrok.app/scan/${sessionId}">
    </head>
    <body style="margin:0;padding:0;"></body>
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

// Dev helper: Reset a session's status for testing (without server restart)
app.post('/reset-session/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  if (sessionId) {
    scanStatus[sessionId] = { scanned: false, handoffComplete: false, amount: null, appReady: false };
    console.log('🔄 DEV: Reset session status for:', sessionId);
    res.json({ success: true, message: 'Session reset successfully' });
  } else {
    res.status(400).json({ success: false, message: 'Session ID is required' });
  }
});

// App link endpoint (now redirects to the main /ul/ endpoint)
app.get('/applink/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  if (!scanStatus[sessionId]) {
    scanStatus[sessionId] = { scanned: false, handoffComplete: false, amount: null, appReady: false };
  }
  scanStatus[sessionId].scanned = true;
  console.log('✅ App link landing page accessed for session:', sessionId);
  
  // Redirect to the main Universal Link handler
  res.redirect(`/ul/${sessionId}`);
});

// Landing page for QR codes - this is what the QR codes will point to
app.get('/landing/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  if (!scanStatus[sessionId]) {
    scanStatus[sessionId] = { scanned: false, handoffComplete: false, amount: null, appReady: false };
  }
  scanStatus[sessionId].scanned = true;
  console.log('✅ Landing page accessed for session:', sessionId);
  
  // Serve a transition page optimized for triggering the iOS System Modal
  res.setHeader('Content-Type', 'text/html');
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Opening LocalCashApp</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          text-align: center;
          padding: 60px 20px;
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
        }
        .logo {
          width: 80px;
          height: 80px;
          background-color: #00B843;
          border-radius: 20px;
          margin: 0 auto 20px auto;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 40px;
          font-weight: bold;
        }
        .loading {
          margin: 30px 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .dot {
          width: 10px;
          height: 10px;
          background: #00B843;
          border-radius: 50%;
          margin: 0 5px;
          animation: pulse 1.5s infinite ease-in-out;
        }
        .dot:nth-child(2) {
          animation-delay: 0.3s;
        }
        .dot:nth-child(3) {
          animation-delay: 0.6s;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(0.7); opacity: 0.5; }
          50% { transform: scale(1); opacity: 1; }
        }
        .hidden {
          position: absolute;
          width: 0;
          height: 0;
          overflow: hidden;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">$</div>
        <h2>Opening LocalCashApp</h2>
        <p>Please wait while we open the app...</p>
        <div class="loading">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
      </div>
      
      <!-- Hidden iframe used for triggering the system modal -->
      <iframe id="universal-link-frame" class="hidden"></iframe>
      
      <script>
        // Function to attempt to open the app via Universal Link
        function tryOpenApp() {
          // Attempt 1: Try opening with a direct Universal Link navigation
          // This approach is most likely to trigger the iOS System Modal
          window.location.href = 'https://chrisk.ngrok.app/direct/${sessionId}';
          
          // Fallback: If the app doesn't open within 2.5 seconds, try another method
          setTimeout(function() {
            // Attempt 2: Try using iframe for Universal Link (may work better on some iOS versions)
            var frame = document.getElementById('universal-link-frame');
            frame.src = 'https://chrisk.ngrok.app/direct/${sessionId}';
            
            // Attempt 3: Final fallback - redirect to the full page with smart banner
            setTimeout(function() {
              window.location.href = 'https://chrisk.ngrok.app/ul/${sessionId}';
            }, 1500);
          }, 2500);
        }
        
        // Start the app opening sequence after a brief display of the loading screen
        setTimeout(tryOpenApp, 1000);
      </script>
    </body>
    </html>
  `);
});

// Main Universal Link handler - simplified to one clean page with just the Smart Banner
app.get('/ul/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  if (!scanStatus[sessionId]) {
    scanStatus[sessionId] = { scanned: false, handoffComplete: false, amount: null, appReady: false };
  }
  scanStatus[sessionId].scanned = true;
  console.log('✅ Direct link accessed, session marked as scanned:', sessionId);
  
  // Serve a minimal page with just the Smart Banner
  res.setHeader('Content-Type', 'text/html');
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Open App</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="apple-itunes-app" content="app-id=6445987069, app-argument=https://chrisk.ngrok.app/scan/${sessionId}">
    </head>
    <body style="margin:0;padding:0;"></body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});