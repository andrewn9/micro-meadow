const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 5500;

app.use(express.static(path.join(__dirname, 'app')));

app.use('/js/lib/peerjs', express.static(path.join(__dirname, 'node_modules/peerjs/dist')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'app', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
