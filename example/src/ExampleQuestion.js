import React, { Component } from 'react';

/**
 * An example question that can be wrapped as a child of Cmi5AssignableUnit.
 *
 * The import piece to note is the use of the injected action properties
 * 'passed' and 'failed', which the question can use to submit results.
 */
export default class ExampleQuestion extends Component {

  constructor(props) {
    super(props);
    this.state = {
      score: 0
    }
    this.onSelectAnswer = this.onSelectAnswer.bind(this);
  }

  onSelectAnswer(e) {
    this.setState({
      ...this.state,
      score: e.target.value
    })
    // console.log(`score: ${e.target.value}`)
  }

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

      this.props.terminate()
    }

    return (
      <div className="row">
        <div className="col-lg-1 col-md-1 col-sm-1">
          <div>1 + 1 = ?</div>
          <div className="form-group">
            <input type="radio" id="r1" className="form-control" name="answer"
              value="0" onChange={(e) => this.onSelectAnswer(e)}
            />
            <label htmlFor="r1">0</label>
          </div>
          <div className="form-group">
            <input type="radio" id="r2" className="form-control" name="answer"
              value="0" onChange={(e) => this.onSelectAnswer(e)}
            />
            <label htmlFor="r2">1</label>
          </div>
          <div className="form-group">
            <input type="radio" id="r3" className="form-control" name="answer"
              value="1" onChange={(e) => this.onSelectAnswer(e)}
            />
            <label htmlFor="r3">2</label>
          </div>
          <div className="form-group">
            <input type="radio" id="r4" className="form-control" name="answer"
              value="0" onChange={(e) => this.onSelectAnswer(e)}
            />
            <label htmlFor="r4">3</label>
          </div>
          <div className="form-group">
            <button htmlFor="button" id="submitbutton" className="btn" onClick={onSubmit}>submit</button>
          </div>
        </div>
      </div>
    )
   }
 }
