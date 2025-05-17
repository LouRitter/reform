const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

const uploadRoute = require('./routes/upload');
app.use('/api/upload', uploadRoute);

const transformRoute = require('./routes/transform');
app.use('/api/transform', transformRoute);

app.get('/', (req, res) => {
  res.send('Content Reform API is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});