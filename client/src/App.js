import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

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
  }

  fetchHelper() {
    fetch('http://5halfcap.ngrok.io/phone', {method: 'GET'}).then((response) => response.json()).then((responseJson) => {
      var data = responseJson;
      this.setState({gx: data.body.gx, gy: data.body.gy, gz: data.body.gz, tx: data.body.tx, ty: data.body.ty, tz: data.body.tz});
      //console.log(responseJson);
    });
  }
  componentDidMount() {
    this.interval = setInterval(() => this.fetchHelper(), 250);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div>
        <h1>gX: {this.state.gx}</h1>
      </div>
    );
    /*
    <h1>gY: {this.state.gy}</h1>
    <h1>gZ: {this.state.gz}</h1>
    <h1>tX: {this.state.tx}</h1>
    <h1>tY: {this.state.ty}</h1>
    <h1>tZ: {this.state.tz}</h1>
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
