const express = require('express');
const app = express();
const port = 3000;

// In-memory store for demo purposes
const scanStatus = {};

// Endpoint hit by QR code scan
app.get('/scan/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  scanStatus[sessionId] = true;
  res.send('QR code scanned!');
});

// POS app polls this endpoint
app.get('/status/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  res.json({ scanned: !!scanStatus[sessionId] });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
}); 