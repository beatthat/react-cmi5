import React, { Component } from 'react';
import './App.css';
import Cmi5AssignableUnit from 'react-cmi5-assignable-unit'
import ExampleQuestion from './ExampleQuestion';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Cmi5AssignableUnit>
          <ExampleQuestion/>
        </Cmi5AssignableUnit>
      </div>
    )
  }
}

export default App;
