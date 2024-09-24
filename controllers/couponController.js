// controllers/couponController.js
const connection = require('../config/db');

const createCoupon = (req, res) => {
  const { code, limit } = req.body;
  const { user_id } = req.user; // get merchant id from token

  const query = `INSERT INTO Coupons (coupon_code, merchant_id, max_redemptions) VALUES (?, ?, ?)`;
  connection.query(query, [code, user_id, limit], (err, result) => {
    if (err) return res.status(500).send({ error: err.message });
    res.status(201).send({ message: 'Coupon created successfully' });
  });
};

const redeemCoupon = (req, res) => {
  const { code } = req.body;
  const { user_id } = req.user; // get user id from token

  // Check coupon validity and redemption count
  const query = `SELECT * FROM Coupons WHERE coupon_code = ?`;
  connection.query(query, [code], (err, results) => {
    if (err) return res.status(500).send({ error: err.message });
    if (results.length === 0) return res.status(404).send({ message: 'Coupon not found' });

    const coupon = results[0];
    if (coupon.redemption_count >= coupon.max_redemptions) return res.status(400).send({ message: 'Coupon limit reached' });

    // Mark the coupon as redeemed by the user
    const redemptionQuery = `INSERT INTO CouponRedemptions (user_id, coupon_id) VALUES (?, ?)`;
    connection.query(redemptionQuery, [user_id, coupon.coupon_id], (err, result) => {
      if (err) return res.status(500).send({ error: err.message });
      
      // Update coupon redemption count
      const updateQuery = `UPDATE Coupons SET redemption_count = COALESCE(redemption_count, 0) + 1, max_redemptions = max_redemptions - 1 WHERE coupon_id = ? AND max_redemptions > 0`;
      connection.query(updateQuery, [coupon.coupon_id], (err, result) => {
        if (err) return res.status(500).send({ error: err.message });
        res.status(200).send({ message: 'Coupon redeemed successfully' });
      });
    });
  });
};

module.exports = { createCoupon, redeemCoupon };
