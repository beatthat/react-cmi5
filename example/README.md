# react-cmi5-assignable-unit-app-example
An example CMI5 assignable unit that connects to an LMS (the XAPI backend of an LMS) and reads/writes an xapi statement

## USAGE

For a quick test, run the following from the root of this project:

```
npm start
``` 

The above starts React, but you need to adjust the example url to include valid cmi5 query params for an example user and activityId. The url below should be valid (unless the access_token for the user expired)

http://localhost:3000/?fetch=http://qa-pal.ict.usc.edu/api/1.0/cmi5/accesstoken2basictoken?access_token=41c847e0-fccd-11e8-8b7f-cf001aed3365&endpoint=http://qa-pal.ict.usc.edu/api/1.0/cmi5/&activityId=http://pal.ict.usc.edu/lessons/cmi5-ex1&registration=957f56b7-1d34-4b01-9408-3ffeb2053b28&actor=%7B%22objectType%22:%20%22Agent%22,%22name%22:%20%22taflearner1%22,%22account%22:%20%7B%22homePage%22:%20%22http://pal.ict.usc.edu/xapi/users%22,%22name%22:%20%225c0eec7993c7cf001aed3365%22%7D%7D

...using the above or a newly constructed valid url (see below for breakdown of how to construct a url), the following scenario is supported:

## Integration in a React App

To integrate this cmi5 implementation in a React app, you can use these steps:

#### Include the cmi5.js lib

Add the ```cmi5.js``` lib to your ```public``` folder, then include ```cmi5.js``` in your ```index.html```, e.g.

```
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

#### Wrap a Question with Component Cmi5AssignableUnit

Include ```Cmi5AssignableUnit.js``` in your src and wrap use it to wrap a question, e.g.

```jsx
import React, { Component } from 'react';
import './App.css';
import Cmi5AssignableUnit from './Cmi5AssignableUnit';
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

## Node/React Scripts

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
