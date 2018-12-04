import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

var context = new AudioContext(),
    Dilla = require('dilla'),
    dilla = new Dilla(context, {"tempo": 120, "beatsPerBar": 4, "loopLength": 2}),
    dillaGain = context.createGain(),
    dillaOsc = null,
    gainNode = context.createGain(),
    oscillator = null,
    convolver = context.createConvolver(),
    analyser = context.createAnalyser()

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gx: 0,
      gy: 0,
      gz: 0,
      tx: 0,
      ty: 0,
      tz: 0,
      wave: "sine",
      altitude: 1,
      play: 0,
      isToggleOn: false
    };
    this.toggleMetro = this.toggleMetro.bind(this)
    this.playSound();
  }

  impulseResponse( duration, decay, reverse ) {
      var sampleRate = context.sampleRate;
      var length = sampleRate * duration;
      var impulse = context.createBuffer(2, length, sampleRate);
      var impulseL = impulse.getChannelData(0);
      var impulseR = impulse.getChannelData(1);

      if (!decay)
          decay = 2.0;
      for (var i = 0; i < length; i++){
        var n = reverse ? length - i : i;
        impulseL[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
        impulseR[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
      }
      return impulse;
  }

  sensorToMidiToFreq(angle) {
    //angle is +/- 90
    //midi is 0 to 127
    angle += 90
    var midiNote = Math.floor((angle/1.875));
    var result = 27.5 * Math.pow(2, ((midiNote - 21) / 12));
    return result
  }

  createVisual() {
    let canvas = this.refs.analyzerCanvas;
    let ctx = canvas.getContext('2d');

    gainNode.connect(analyser);
    gainNode.connect(context.destination);
    analyser.connect(context.destination);

    function renderFrame(){
      let freqData = new Uint8Array(analyser.frequencyBinCount)
      requestAnimationFrame(renderFrame)
      analyser.getByteFrequencyData(freqData)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#9933ff';
      let bars = 100;
      for (var i = 0; i < bars; i++) {
        let bar_x = i * 3;
        let bar_width = 2;
        let bar_height = -(freqData[i] / 2);
        ctx.fillRect(bar_x, canvas.height, bar_width, bar_height)
      }
    };
    renderFrame()
  }

  fetchHelper() {
    fetch('http://5halfcap.ngrok.io/phone', {method: 'GET'}).then((response) => response.json()).then((responseJson) => {
      var data = responseJson;
      this.setState({gx: parseFloat(data.body.gx), gy: parseFloat(data.body.gy), gz: parseFloat(data.body.gz), tx: parseFloat(data.body.tx), ty: parseFloat(data.body.ty), tz: parseFloat(data.body.tz), altitude: parseFloat(data.body.height), wave: data.body.wave, play: data.body.held});
      oscillator.frequency.setTargetAtTime(this.sensorToMidiToFreq(parseFloat(data.body.tx)), context.currentTime , 0.001);
      dillaOsc.type = data.body.metroWave
      if (data.body.held === "1") {
        gainNode.gain.setTargetAtTime(this.calculateGain(parseFloat(data.body.height)), context.currentTime, 0.001);
      }
      else {
        gainNode.gain.setTargetAtTime(this.calculateGain(0), context.currentTime, 0.001);
      }
      oscillator.type = data.body.wave;
    });
  }
  componentDidMount() {
    this.interval = setInterval(() => this.fetchHelper(), 100);
    this.createVisual()
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  calculateGain(height) {
    return ((height/50) * 1.5) + 0
  }

  playSound() {
    oscillator = context.createOscillator();
    oscillator.type = this.state.wave;
    oscillator.frequency.setTargetAtTime(((this.state.tx) * 15), context.currentTime, 0.01);
    if (this.state.play === "1") {
      gainNode.gain.setTargetAtTime(this.calculateGain(this.state.altitude), context.currentTime, 0.01);
    }
    else {
      gainNode.gain.setTargetAtTime(this.calculateGain(0), context.currentTime, 0.01);
    }
    //oscillator.connect(gainNode);
    oscillator.connect(convolver);
    convolver.buffer = this.impulseResponse(.4,2,false);
    convolver.connect(gainNode)
    oscillator.start(context.currentTime);

    var high = {
      'position': '*.1.01',
      'freq': 220,
      'duration': 15
    };
    var low = { 'freq': 110, 'duration': 15 };

    dilla.set('metronome', [
      high,
      ['*.>1.01', low]
    ]);

    dilla.on('step', function (step) {
      if (step.event === 'start') {
        dillaOsc = step.context.createOscillator();
        dillaGain = step.context.createGain();
        dillaOsc.connect(dillaGain);
        dillaGain.connect(analyser);
        dillaGain.connect(step.context.destination);
        dillaOsc.frequency.value = step.args.freq;
        dillaGain.gain.setValueAtTime(.65, step.time);
        dillaOsc.start(step.time);
      }
      else if (step.event === 'stop' && dillaOsc) {
        dillaGain.gain.setValueAtTime(.65, step.time);
        dillaGain.gain.linearRampToValueAtTime(0, step.time + 0.1);
        dillaOsc.stop(step.time + 0.1);
        dillaOsc = null;
        dillaGain = null;
      }
    });
  }

  toggleMetro() {
    if (!this.state.isToggleOn) {
      dilla.start()
    }
    else {
      dilla.clear()
      dilla.stop()
    }
    this.setState(state => ({
      isToggleOn: !state.isToggleOn
    }));
  }

/*
<h1>Gx: {this.state.gx}</h1>
<h1>Gy: {this.state.gy}</h1>
<h1>Gz: {this.state.gz}</h1>
<h1>Tx: {this.state.tx}</h1>
<h1>Ty: {this.state.ty}</h1>
<h1>Tz: {this.state.tz}</h1>
<h1>Al: {this.state.altitude}</h1>
*/
  render() {
    return (
      <div style={{width:'100%',height:'100%'}}>
        <button onClick={this.toggleMetro}>Toggle Metronome</button>
        <canvas ref="analyzerCanvas" id="analyzer" style={{width:'100%',height:'100%'}}>
        </canvas>
      </div>
    );
  }
}

export default App;
