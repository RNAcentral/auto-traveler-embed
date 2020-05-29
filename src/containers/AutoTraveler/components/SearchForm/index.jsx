import React from 'react';
import {connect} from 'react-redux';

import * as actionCreators from 'actions/actions';
import {store} from "app.jsx";

import { FaSearch } from 'react-icons/fa';
import { FiTrash2 } from 'react-icons/fi';


class SearchForm extends React.Component {
  showExamples(linkColor){
    const examples = this.props.examples;
    return examples.map(example =>
      <li key={example.description}>
        <a className="custom-link" style={{color: linkColor}} onClick={() => this.exampleSequence(example.sequence)}>{example.description}</a>
        <small>{!!(example.urs) ? ` (${example.urs})` : " "}</small>
      </li>)
  }

  exampleSequence(sequence) {
    store.dispatch(actionCreators.onExampleSequence(sequence));
    store.dispatch(actionCreators.onSubmit(sequence));
  }

  onSubmit(event) {
    event.preventDefault();
    const state = store.getState();

    if (state.sequence && (state.sequence.length < 10 || state.sequence.length > 7000)) {
      store.dispatch(actionCreators.invalidSequence());
    } else if (state.sequence) {
      store.dispatch(actionCreators.onSubmit(state.sequence));
    }

    state.sequence = "";
  }

  render() {
    const searchButtonColor = this.props.customStyle && this.props.customStyle.searchButtonColor ? this.props.customStyle.searchButtonColor : "";
    const clearButtonColor = this.props.customStyle && this.props.customStyle.clearButtonColor ? this.props.customStyle.clearButtonColor : "#6c757d";
    const fixCss = this.props.customStyle && this.props.customStyle.fixCss && this.props.customStyle.fixCss === "true" ? "1.5rem" : "";
    const fixCssBtn = this.props.customStyle && this.props.customStyle.fixCss && this.props.customStyle.fixCss === "true" ? "38px" : "";
    const hideRnacentral = this.props.customStyle && this.props.customStyle.hideRnacentral && this.props.customStyle.hideRnacentral === "true" ? "none" : "initial";
    const linkColor = this.props.customStyle && this.props.customStyle.linkColor ? this.props.customStyle.linkColor : "#337ab7";
    return (
      <div className="rna">
        <div className="row">
          <div className="col-sm-9">
            <small className="text-muted" style={{display: hideRnacentral}}><img src={'https://rnacentral.org/static/img/logo/rnacentral-logo.png'} alt="RNAcentral logo" style={{width: "1%", verticalAlign: "text-top"}}/> Powered by <a className="custom-link mr-2" style={{color: linkColor}} target='_blank' href='https://rnacentral.org/'>RNAcentral</a></small>
            { this.props.jobId ? <small className="text-muted float-right">Job id: {this.props.jobId}</small> : ''}
          </div>
        </div>
        <form onSubmit={(e) => this.onSubmit(e)}>
          <div className="row mt-1">
            <div className="col-sm-9">
              <textarea style={{fontSize: fixCss}} className="form-control" id="sequence" name="sequence" rows="7" value={this.props.sequence} onChange={(e) => this.props.onSequenceTextareaChange(e)} placeholder="Enter RNA/DNA sequence (with an optional description in FASTA format) or job id" />
            </div>
            <div className="col-sm-3">
              <button className="btn btn-primary mb-2" style={{background: searchButtonColor, borderColor: searchButtonColor, fontSize: fixCss, height: fixCssBtn}} type="submit" disabled={!this.props.sequence ? "disabled" : ""}>
                <span className="btn-icon"><FaSearch /></span> Search
              </button><br />
              <button className="btn btn-secondary mb-2" style={{background: clearButtonColor, borderColor: clearButtonColor, fontSize: fixCss, height: fixCssBtn}} type="submit" onClick={ this.props.onClearSequence } disabled={!this.props.sequence ? "disabled" : ""}>
                <span className="btn-icon"><FiTrash2 /></span> Clear
              </button><br />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-9">
              {this.props.examples ? <div id="examples"><ul className="text-muted">Examples: {this.showExamples(linkColor)}</ul></div> : ""}
            </div>
          </div>
          {
            this.props.submissionError && (
              <div className="row">
                <div className="col-sm-9">
                  <div className="alert alert-danger">
                    { this.props.submissionError }
                  </div>
                </div>
              </div>
            )
          }
          {
            this.props.status === "invalidSequence" && (
              <div className="row">
                <div className="col-sm-9">
                  <div className="alert alert-warning">
                    {this.props.sequence.length < 10 ? "The sequence cannot be shorter than 10 nucleotides" : "The sequence cannot be longer than 7000 nucleotides"}
                  </div>
                </div>
              </div>
            )
          }
        </form>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  jobId: state.jobId,
  status: state.status,
  submissionError: state.submissionError,
  sequence: state.sequence,
  jobResult: state.jobResult,
});

const mapDispatchToProps = (dispatch) => ({
  onSequenceTextareaChange: (event) => dispatch(actionCreators.onSequenceTextAreaChange(event)),
  onClearSequence: () => dispatch(actionCreators.onClearSequence()),
});


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchForm);
