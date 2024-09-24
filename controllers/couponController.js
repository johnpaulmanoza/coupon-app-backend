// controllers/couponController.js
const connection = require('../config/db');

const createCoupon = (req, res) => {
  const { code, limit } = req.body;
  const { id: merchantId } = req.user; // get merchant id from token

  const query = `INSERT INTO Coupons (code, merchantId, limit) VALUES (?, ?, ?)`;
  connection.query(query, [code, merchantId, limit], (err, result) => {
    if (err) return res.status(500).send({ error: err.message });
    res.status(201).send({ message: 'Coupon created successfully' });
  });
};

const redeemCoupon = (req, res) => {
  const { code } = req.body;
  const { id: userId } = req.user; // get user id from token

  // Check coupon validity and redemption count
  const query = `SELECT * FROM Coupons WHERE code = ?`;
  connection.query(query, [code], (err, results) => {
    if (err) return res.status(500).send({ error: err.message });
    if (results.length === 0) return res.status(404).send({ message: 'Coupon not found' });

    const coupon = results[0];
    if (coupon.redemptionCount >= coupon.limit) return res.status(400).send({ message: 'Coupon limit reached' });

    // Mark the coupon as redeemed by the user
    const redemptionQuery = `INSERT INTO Redemptions (userId, couponId) VALUES (?, ?)`;
    connection.query(redemptionQuery, [userId, coupon.id], (err, result) => {
      if (err) return res.status(500).send({ error: err.message });
      
      // Update coupon redemption count
      const updateQuery = `UPDATE Coupons SET redemptionCount = redemptionCount + 1 WHERE id = ?`;
      connection.query(updateQuery, [coupon.id], (err, result) => {
        if (err) return res.status(500).send({ error: err.message });
        res.status(200).send({ message: 'Coupon redeemed successfully' });
      });
    });
  });
};

module.exports = { createCoupon, redeemCoupon };
