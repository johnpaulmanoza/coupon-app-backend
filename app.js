// app.js
const express = require('express');
const userRoutes = require('./routes/users');
const couponRoutes = require('./routes/coupons');
require('dotenv').config();

const app = express();
app.use(express.json()); // parse incoming JSON

app.get('/', (req, res) => {
  res.send('Coupy API');
});

app.use('/api/users', userRoutes);
app.use('/api/coupons', couponRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
