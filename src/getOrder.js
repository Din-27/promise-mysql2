const pool = require('../config/config')

exports.getDataOrder = async(req, res) => {
  let array = []
  const data = await pool.query('SELECT * FROM order', (err, result) => {
    return array.push(result)
  })

  console.log(data)
}