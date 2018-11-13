import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

var context = new AudioContext(),
    gainNode = context.createGain(),
    oscillator = null;




/*var dataArray
const canvas = document.createElement('canvas');
canvas.style.position = 'absolute';
canvas.style.top = 0;
canvas.style.left = 0;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);
const canvasCtx = canvas.getContext('2d');
canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
dataArray = new Float32Array(analyserNode.frequencyBinCount)
analyserNode.getFloatFrequencyData(dataArray)
*/

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
      fillVal: '#9933ff',
      canvasVal: '#ffffff'
    };
    this.handleCanvasChange = this.handleCanvasChange.bind(this);
    this.handleFillChange = this.handleFillChange.bind(this);
    this.playSound();
  }

  createVisual() {
    var analyser = context.createAnalyser()
    let canvas = this.refs.analyzerCanvas;
    let ctx = canvas.getContext('2d');

    var canvasColor = this.state.canvasVal
    var fillColor = this.state.fillVal
    console.log(fillColor)

    gainNode.connect(analyser);
    gainNode.connect(context.destination);
    analyser.connect(context.destination);

    function renderFrame(){
      let freqData = new Uint8Array(analyser.frequencyBinCount)
      requestAnimationFrame(renderFrame)
      analyser.getByteFrequencyData(freqData)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      if(canvasColor) {
        ctx.fillStyle = canvasColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
      if(fillColor) {
        ctx.fillStyle = fillColor;
      }
      else {
        ctx.fillStyle = '#9933ff';
      }
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
      this.setState({gx: parseFloat(data.body.gx), gy: parseFloat(data.body.gy), gz: parseFloat(data.body.gz), tx: parseFloat(data.body.tx), ty: parseFloat(data.body.ty), tz: parseFloat(data.body.tz), altitude: parseFloat(data.body.height), wave: data.body.wave});
      oscillator.frequency.setTargetAtTime(((parseFloat(data.body.tx)) * 15), context.currentTime , 0.001);
      gainNode.gain.setTargetAtTime(this.calculateGain(parseFloat(data.body.height)), context.currentTime, 0.001);
      oscillator.type = data.body.wave;
      //console.log(responseJson);
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
    return ((height/100) * 1) + 0
  }

  playSound() {
    oscillator = context.createOscillator();
    oscillator.type = this.state.wave;
    oscillator.frequency.setTargetAtTime(((this.state.tx) * 15), context.currentTime, 0.01);
    gainNode.gain.setTargetAtTime(this.calculateGain(this.state.altitude), context.currentTime, 0.01);
    oscillator.connect(gainNode);
    oscillator.start(context.currentTime);
  }

  handleCanvasChange(e) {
    e.preventDefault();
    this.setState({canvasVal: e.target.value});
  }

  handleFillChange(e) {
    e.preventDefault();
    this.setState({fillVal: e.target.value});
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
        <form>
          <input type="text" name="canvasColor" placeholder="#ffffff" value={this.state.canvasVal} onChange={this.handleCanvasChange} style={{float:'left'}}/>
          <input type="text" name="barColor" placeholder="#9933ff" value={this.state.fillVal} onChange={this.handleFillChange} style={{float:'left'}}/>
        </form>
        <canvas ref="analyzerCanvas" id="analyzer" style={{width:'100%',height:'100%'}}>
        </canvas>
      </div>
    );
  }
}

export default App;
