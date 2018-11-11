var express = require('express');
var router = express.Router();

var gX = 0;
var gY = 0;
var gZ = 0;
var tX = 0;
var tY = 0;
var tZ = 0;
var waveform = "sine"

router.get('/', (req, res, next) => {
  res.send({body: {gx: gX, gy: gY, gz: gZ, tx: tX, ty: tY, tz: tZ, wave: waveform}})
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

  gX = req.body.gx
  gY = req.body.gy
  gZ = req.body.gz
  tX = req.body.tx
  tY = req.body.ty
  tZ = req.body.tz
  waveform = req.body.wave

  res.send("ok")

})



module.exports = router;
