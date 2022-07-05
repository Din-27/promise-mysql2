const express = require('express')
const order = require('../src/order')
const {getDataOrder} = require('../src/getOrder')
const router = express.Router()

router.post('/order', order.createOrder)
router.get('/order', getDataOrder)

module.exports = router