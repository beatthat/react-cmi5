import React, { Component } from 'react';
import './App.css';
import Cmi5AU from 'react-cmi5'
import ExampleQuestion from './ExampleQuestion';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Cmi5AU>
          <ExampleQuestion/>
        </Cmi5AU>
      </div>
    )
  }
}

export default App;
