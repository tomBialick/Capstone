import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

var context = new AudioContext(),
    gainNode = context.createGain(),
    oscillator = null;

gainNode.connect(context.destination);

var analyserNode = context.createAnalyser()
var dataArray
const canvas = document.createElement('canvas');
canvas.style.position = 'absolute';
canvas.style.top = 0;
canvas.style.left = 0;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);
const canvasCtx = canvas.getContext('2d');
canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

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
      altitude: 1
    };
    this.playSound();
  }

  fetchHelper() {
    fetch('http://5halfcap.ngrok.io/phone', {method: 'GET'}).then((response) => response.json()).then((responseJson) => {
      var data = responseJson;
      this.setState({gx: parseFloat(data.body.gx), gy: parseFloat(data.body.gy), gz: parseFloat(data.body.gz), tx: parseFloat(data.body.tx), ty: parseFloat(data.body.ty), tz: parseFloat(data.body.tz), altitude: parseFloat(data.body.height), wave: data.body.wave});
      oscillator.frequency.setTargetAtTime(((parseFloat(data.body.ty)) * 10), context.currentTime , 0.001);
      gainNode.gain.setTargetAtTime(this.calculateGain(parseFloat(data.body.height)), context.currentTime, 0.001);
      oscillator.type = data.body.wave;
      dataArray = new Float32Array(analyserNode.frequencyBinCount)
      analyserNode.getFloatFrequencyData(dataArray)
      //console.log(responseJson);
    });
  }
  componentDidMount() {
    this.interval = setInterval(() => this.fetchHelper(), 100);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  calculateGain(height) {
    return ((parseFloat(height) / 1) * 10) + 0;
  }

  playSound() {
    oscillator = context.createOscillator();
    oscillator.type = this.state.wave;
    oscillator.frequency.setTargetAtTime(((this.state.ty) * 10), context.currentTime, 0.01);
    gainNode.gain.setTargetAtTime(this.calculateGain(this.state.altitude), context.currentTime, 0.01);
    oscillator.connect(gainNode);
    oscillator.start(context.currentTime);
    dataArray = new Float32Array(analyserNode.frequencyBinCount)
    analyserNode.getFloatFrequencyData(dataArray)
  }

  function draw() {
    //Schedule next redraw
    requestAnimationFrame(draw);

    //Get spectrum data
    analyserNode.getFloatFrequencyData(dataArray);

    //Draw black background
    canvasCtx.fillStyle = 'rgb(0, 0, 0)';
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

  //Draw spectrum
    const barWidth = (canvas.width / bufferLength) * 2.5;
    let posX = 0;
    for (let i = 0; i < bufferLength; i++) {
      const barHeight = (dataArray[i] + 140) * 2;
      canvasCtx.fillStyle = 'rgb(' + Math.floor(barHeight + 100) + ', 50, 50)';
      canvasCtx.fillRect(posX, canvas.height - barHeight / 2, barWidth, barHeight / 2);
      posX += barWidth + 1;
    }
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
      <div>
        {this.draw()}
      </div>
    );
  }
}

export default App;
