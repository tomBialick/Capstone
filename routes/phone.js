var express = require('express');
var router = express.Router();

var X = 0;
var Y = 0;
var Z = 0;

router.get('/', (req, res, next) => {
  res.send(JSON.stringify({body: {x: X, y: Y, z: Z}}))
})

/*
 * JSON structure is:
 *  {
 *    body: {
 *            x: <val>
 *            y: <val>
 *            z: <val>
 *          }
 *  }
 */

router.post('/', (req, res, next) => {

  X = req.body.x
  Y = req.body.y
  Z = req.body.z

  res.send("ok")

})



module.exports = router;
