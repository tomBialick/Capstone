var express = require('express');
var router = express.Router();

var gX = 0;
var gY = 0;
var gZ = 0;
var tX = 0;
var tY = 0;
var tZ = 0;
var waveform = "sine"
var phoneNum = 0
var altitude = 0
var buttonHeld = "0"

router.get('/', (req, res, next) => {
  res.send({body: {gx: gX, gy: gY, gz: gZ, tx: tX, ty: tY, tz: tZ, wave: waveform, height: altitude, held: buttonHeld}})
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

  if (req.body.phone === "0"){
    gX = req.body.gx
    gY = req.body.gy
    gZ = req.body.gz
    tX = req.body.tx
    tY = req.body.ty
    tZ = req.body.tz
    waveform = req.body.wave
  }
  if (req.body.phone === "1"){
    altitude = req.body.ty
    buttonHeld = req.body.held
    //Altimeter is garbage for this
    //altitude =
  }


  res.send("ok")

})



module.exports = router;
