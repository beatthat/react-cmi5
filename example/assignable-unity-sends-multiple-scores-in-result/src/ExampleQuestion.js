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
      knowledgeComponents: {
        a: 0,
        b: 0,
        c: 0,
        d: 0
      }
    }
    this.onKnowledgeComponentScoreUpdated = this.onKnowledgeComponentScoreUpdated.bind(this);
  }

  onKnowledgeComponentScoreUpdated(topicId, e) {
    const score = e.target.value / 100.0
    this.setState({
      ...this.state,
      knowledgeComponents: {
        ...this.state.knowledgeComponents,
        [topicId]: score
      }
    })
  }

  render()
  {
    // props includes special actions for passed({score:1.0}) and failed({score: 0.0 })
    // These are wrappers for cmi.passed and cmi.failed
    // that make sure cmi has initialized before score is actually sent
    const {passed, failed, terminate} = this.props

    const onSubmit = () => {

      // just make the score the avg of all the knowledge-component scores
      const score = Object.getOwnPropertyNames(this.state.knowledgeComponents).reduce((acc, cur, i) => {
        return ((acc * (i)) + this.state.knowledgeComponents[cur]) / (i + 1)
      }, 0)

      const extensions = {
        "https://pal.ict.usc.edu/xapi/vocab/exts/result/kc-scores": 
        Object.getOwnPropertyNames(this.state.knowledgeComponents).reduce((acc, cur, i) => {
          return [
            ...acc, 
            {
              kc: cur, // just for reference, in this extension domain, 'kc' is a knowledge component 
              score: this.state.knowledgeComponents[cur]}
          ]
        }, [])
      }
      if(score > 0) {
        passed(score, extensions)
      }
      else {
        failed(score, extensions)
      }

      terminate()
    }

    return (
      <div className="row">
        <div className="col-lg-1 col-md-1 col-sm-1">
          <div>KNOWLEDGE-0COMPONENT SCORES:</div>
          <div className="form-group">
          {
            ['a', 'b', 'c', 'd'].map(id => {
              return (
                <div key={id}>
                  <label>Knowledge Component {id.toUpperCase()}</label>
                  <input type="range" min="0" max="100" value={this.state.knowledgeComponents[id] * 100.0 || 0} className="slider" id={id}
                    onChange={(e) => this.onKnowledgeComponentScoreUpdated(id, e)}
                  />
                  <label>: {this.state.knowledgeComponents[id] || 0}</label>
                </div>
              )
            })
          }
          </div>
          <div className="form-group">
            <button htmlFor="button" id="submitbutton" className="btn" onClick={onSubmit}>submit</button>
          </div>
        </div>
      </div>
    )
   }
 }
