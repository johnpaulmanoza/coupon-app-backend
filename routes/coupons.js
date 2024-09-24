// routes/coupons.js
const express = require('express');
const { createCoupon, redeemCoupon } = require('../controllers/couponController');
const router = express.Router();
const { authenticate, authorizeMerchant } = require('../middleware/auth');

// Only merchants can create coupons
router.post('/create', authenticate, authorizeMerchant, createCoupon);

// Any authenticated user can redeem a coupon
router.post('/redeem', authenticate, redeemCoupon);

module.exports = router;
