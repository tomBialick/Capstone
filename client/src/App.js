import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

var context = new AudioContext(),
    gainNode = context.createGain(),
    oscillator = null;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gx: 0,
      gy: 0,
      gz: 0,
      tx: 0,
      ty: 0,
      tz: 0
    };
    this.playSound();
  }

  fetchHelper() {
    fetch('http://5halfcap.ngrok.io/phone', {method: 'GET'}).then((response) => response.json()).then((responseJson) => {
      var data = responseJson;
      this.setState({gx: data.body.gx, gy: data.body.gy, gz: data.body.gz, tx: data.body.tx, ty: data.body.ty, tz: data.body.tz});
      oscillator.frequency.setTargetAtTime((data.body.tx + data.body.gx + data.body.gy + data.body.gz), context.currentTime , 0.001);
      //console.log(responseJson);
    });
  }
  componentDidMount() {
    this.interval = setInterval(() => this.fetchHelper(), 100);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  playSound() {
    oscillator = context.createOscillator();
    oscillator.frequency.setTargetAtTime((this.state.tx + this.state.gx + this.state.gy + this.state.gz), context.currentTime, 0.01);
    oscillator.connect(context.destination);
    oscillator.start(context.currentTime);
  }

  render() {
    return (
      <div>
        <h1>Gx: {this.state.gx}</h1>
        <h1>Gy: {this.state.gy}</h1>
        <h1>Gz: {this.state.gz}</h1>
        <h1>Tx: {this.state.tx}</h1>
        <h1>Ty: {this.state.ty}</h1>
        <h1>Tz: {this.state.tz}</h1>
      </div>
    );
    /*
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );*/
  }
}

export default App;
