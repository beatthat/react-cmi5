# react-cmi5
React wrapper component for an xapi/cmi5 assignable unit @see https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#au_requirements

## Integration in a React App

To integrate this cmi5 implementation in a React app, you can use these steps:

#### Install react-cmi5

```
npm install --save react-cmi5
```

#### Include the cmi5.js lib

`npm install react-cmi5` will have copied `cmi5.js` to the `public` folder at the root of your React project.

You must include ```cmi5.js``` in your ```index.html```, e.g.

```html
<head>
  <script src="%PUBLIC_URL%/cmi5.js"></script>
  <!--
    Notice the use of %PUBLIC_URL% in the tags above.
    It will be replaced with the URL of the `public` folder during the build.
    Only files inside the `public` folder can be referenced from the HTML.

    Unlike "/favicon.ico" or "favicon.ico", "%PUBLIC_URL%/favicon.ico" will
    work correctly both with client-side routing and a non-root public URL.
    Learn how to configure a non-root public URL by running `npm run build`.
  -->
</head>
```

NOTE: the reason this is included as a downloadable script instead of a normal node package dependency is because that is how the cmi5.js lib is currently distributed (already bundled code). In a future release it would be good to tease apart the cmi5.js contents into npm packages and remove the need for the script-tag include.

#### Wrap a Question with Component Cmi5AssignableUnit

Include the ```Cmi5AU``` React component in your src and wrap use it to wrap a question, e.g.

```jsx
import React, { Component } from 'react';
import './App.css';
import Cmi5AU from 'react-cmi5';
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
```

...then in your question component when you're ready to submit a result, call one of the injected property functions `passed` or `failed`, e.g.

```jsx
import React, { Component } from 'react';

export default class ExampleQuestion extends Component {
  render()
  {
    // props includes special actions for passed({score:1.0}) and failed({score: 0.0 })
    // These are wrappers for cmi.passed and cmi.failed
    // that make sure cmi has initialized before score is actually sent
    const {passed, failed} = this.props

    const onSubmit = () => {
      const score = this.state.score // score was set when user chose a radio-button answer
      if(score > 0) {
        this.props.passed(score)
      }
      else {
        this.props.failed(score)
      }
      this.props.terminate() // MUST call terminate to end the session
    }

    return (
      <div>
        question form here
        <button onClick={onSubmit}>submit</button>
      </div>
    )
   }
 }

```
