import React, { Component } from 'react'

const CMI_STATUS = {
  NONE: 0,
  LOADING: 1,
  READY: 2,
  TERMINATED: 3,
  ERROR: -1
}

/**
 * 
 * A reusable wrapper Component that handles cmi initialization
 * for a cmi5 assignable unit (e.g. a question, a video, an arbitraty learning resource),
 * which should be a child component.
 *
 * Cmi5AssignableUnit injects common cmi actions for the child component to call.
 * Generally an assessment-type assignable unit, like a question,
 * should call either 'passed(score)' or 'failed(score)',
 * whereas a non-assessment-type assignable unit, like a video,
 * should call 'completed'.
 * 
 * ALL assignable units MUST call 'terminate' at the end of their session
 * to signal the to LMS that no more xapi statements are coming and it's safe
 * to close the assignable unit.
 *
 * Finally, injects the cmi api instance to the child as 'cmi'. 
 * The child can use props.cmi for broader xapi access, e.g. to read and write non-cmi statements.
 * 
 * IMPORTANT NOTE: this component requires that you have include the cmi5.js library as a script, 
 * e.g. in your index.html:
 * 
 * <head>
 *  <script src="libs/cmi5.js"></script>
 * </head>
 * 
 * @see ../public/cm5.js
 */
class Cmi5AssignableUnit extends Component {

  constructor(props) {
    super(props)
    this.state = {
      cmiStatus: CMI_STATUS.NONE
    }
    this.passed = this.passed.bind(this)
    this.failed = this.failed.bind(this)
    this.completed = this.completed.bind(this)
    this.terminate = this.terminate.bind(this)
    this._submitScore = this._submitScore.bind(this)
    this._execCmiOrQueue = this._execCmiOrQueue.bind(this)
  }
  
/**
 * A function for the assignable unit to call when the user passes an assessment (e.g. answers a question correctly.
 * 
 * @param {number|XAPI Score} score 
 *  
 * For arguments, accepts either a single normalized score (0.0-1.0) value
 * or an object that's a valid XAPI Result Score (https://github.com/adlnet/xAPI-Spec/blob/master/xAPI-Data.md#2451-score)
 * 
 * @see https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#verbs_failed} score 
 */
  passed(score) {
    this._submitScore(score, true)
  }

/**
 * A function for the assignable unit to call when the user fails an assessment (e.g. answers a question incorrectly.
 * 
 * @param {number|XAPI Score} score 
 *  
 * For arguments, accepts either a single normalized score (0.0-1.0) value
 * or an object that's a valid XAPI Result Score (https://github.com/adlnet/xAPI-Spec/blob/master/xAPI-Data.md#2451-score)
 * 
 * @see https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#verbs_failed} score 
 */
  failed(score) {
    this._submitScore(score, false)
  }

  /**
   * A function for the assignable unit to call, 
   * when it's a non-assessment type resource (no score)
   * and the user has completed it, e.g. finished watching a video.
   * 
   * @see https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#verbs_completed
   */
  completed() {
    this._execCmiOrQueue(() => {
      this.state.cmi.completed()
    })
  }

/**
 * Required function the assignable unit MUST call, 
 * to signal to the LMS (container that launched the assignable unit)
 * that the user's session is complete (no additional xapi statements will be sent)
 * @see https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#verbs_terminated
 */
  terminate() {
    this._execCmiOrQueue(() => {
      this.state.cmi.terminate()
    })
  }

/**
   * @private
   * submit a score if cmi is ready,
   * or if cmi is not ready, store the action for later execution.
   */
  _submitScore(result, isPassing) {
    const score = isNaN(Number(result))? result: { scaled: Number(result) }

    this._execCmiOrQueue(() => {
      if(isPassing) {
        this.state.cmi.passed(score)
      }
      else {
        this.state.cmi.failed(score)
      }
    })
  }

  /**
   * @private
   * Execute an action (generally a cmi call) if cmi is ready,
   * or if cmi is not ready, store the action for later execution.
   * 
   * @param {*} action - a function to call if/when cmi is ready
   */
  _execCmiOrQueue(action) {

    if(this.state.cmiStatus !== CMI_STATUS.READY) {
      // save the action to submit when cmi is ready
  
      this.setState({
        ...this.state,
        actionsPendingCmiReady: Array.isArray(this.state.actionsPendingCmiReady)?
          [...this.state.actionsPendingCmiReady, action] : [action]
      })

      return
    }

    try {
      action()
    }
    catch(cmiErr) {
        console.err(`cmi action failed: ${cmiErr.message}\n${cmiErr.stack}`)
    }
  }

  componentDidMount()
  {
    try {
      const Cmi5 = window.Cmi5
      const cmi = new Cmi5(window.location.href)

      cmi.start((err, result) => {
        if(err) {
          this.setState({
            ...this.state,
            cmiStatus: CMI_STATUS.ERROR,
            cmiMessage: err.message
          })
          console.error(err)
          return
        }

        console.log('ok!')
        this.setState({
          ...this.state,
          cmiStatus: CMI_STATUS.READY,
        })
      })

      this.setState({
        ...this.state,
        cmi: cmi
      })
    }
    catch(errInit) {
      console.error(`error loading cmi: ${errInit.message}`)
      this.setState({
        ...this.state,
        cmiStatus: CMI_STATUS.NONE,
        cmiMessage: errInit.message
      })
    }

  }

  render()
  {
    console.log(`render state.cmiStatus=${this.state.cmiStatus}`)
    switch(this.state.cmiStatus) {
      case CMI_STATUS.READY:
        if(Array.isArray(this.state.actionsPendingCmiReady)) {
          this.actionsPendingCmiReady.forEach(a => a())
        }
        break
      case CMI_STATUS.ERROR:
        console.error(`cmi error: ${this.state.cmiMessage}`)
        break
      default:
        console.log(`cmi status updated to ${this.state.cmiStatus}`)
    }

    const { children } = this.props
    const assignableUnit = React.Children.map(children, child =>
      React.cloneElement(child, {
        cmi: this.state.cmi,
        terminate: this.terminate, // action that MUST be called to signal end of the session
        passed: this.passed, // action for child to call on passed an assessment (with score)
        failed: this.failed, // action for child to call on failed an assessment (with score)
        completed: this.completed // action for child to call on completion of a non-assessment resource, e.g. finished watching video
       }
     )
    )

    return(
    <div>
        <div>{assignableUnit}</div>
    </div>
    )
   }
 }

 export default Cmi5AssignableUnit
