import React from 'react';
import { connect } from 'react-redux';
import * as actionCreators from 'actions/actions';
import {ALIGN_CENTER, INITIAL_VALUE, POSITION_LEFT, ReactSVGPanZoom, TOOL_NONE} from 'react-svg-pan-zoom';
import { SvgLoader } from 'react-svgmt';
import { saveSvgAsPng } from 'save-svg-as-png';
import { MdColorLens } from 'react-icons/md';
import { RiImage2Line, RiFileCodeLine, RiFileCopy2Line } from "react-icons/ri";
import { BsToggles } from "react-icons/bs";

const miniatureProps = { position: TOOL_NONE }
const toolbarProps = { position: POSITION_LEFT, SVGAlignY: ALIGN_CENTER, SVGAlignX: ALIGN_CENTER }


class Results extends React.Component {
  constructor(props) {
    super(props);
    this.state = {tool: TOOL_NONE, value: INITIAL_VALUE}
    this.viewerRef = React.createRef();
    this.doFirstFit = true;
  }

  componentDidUpdate() {
    if (this.doFirstFit && this.viewerRef.current) {
      this.viewerRef.current.fitToViewer("center", "center");
      this.doFirstFit = false;
    }
    if (!this.props.jobId && !this.doFirstFit) {
      this.setState({tool: TOOL_NONE, value: INITIAL_VALUE});
      this.doFirstFit = true;
    }
  }

  changeTool(nextTool) {
    this.setState({tool: nextTool})
  }

  changeValue(nextValue) {
    this.setState({value: nextValue})
  }

  downloadPNG() {
    let div = document.createElement('div');
    div.innerHTML = this.props.svg;
    saveSvgAsPng(div.firstChild, this.props.jobId + ".png", {backgroundColor: 'white', scale: 3});
  }

  downloadSVG() {
    let svgBlob = new Blob([this.props.svg], {type:"image/svg+xml;charset=utf-8"});
    let svgUrl = URL.createObjectURL(svgBlob);
    let downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = this.props.jobId + ".svg";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  sourceLink(source, linkColor){
    let link = "#";
    if (source.toLowerCase() === "crw") {
      link = "http://www.rna.ccbb.utexas.edu/";
    } else if (source.toLowerCase() === "rfam") {
      link = "https://rfam.org/";
    } else if (source.toLowerCase() === "ribovision") {
      link = "http://apollo.chemistry.gatech.edu/RiboVision/";
    } else if (source.toLowerCase() === "gtrnadb") {
      link = "http://gtrnadb.ucsc.edu/";
    }
    return <a className="custom-link" style={{color: linkColor}} href={link} target="_blank">{source}</a>
  }

  render() {
    let title = {
      color: this.props.customStyle && this.props.customStyle.titleColor ? this.props.customStyle.titleColor : "#007c82",
      fontSize: this.props.customStyle && this.props.customStyle.titleSize ? this.props.customStyle.titleSize : "28px",
    };
    const fixCss = this.props.customStyle && this.props.customStyle.fixCss && this.props.customStyle.fixCss === "true" ? "1.5rem" : "";
    const linkColor = this.props.customStyle && this.props.customStyle.linkColor ? this.props.customStyle.linkColor : "#337ab7";
    const width = parseFloat(this.props.width) > 900 ? parseFloat(this.props.width) : 900;
    const height = parseFloat(this.props.height) > 600 ? parseFloat(this.props.height) : 600;

    return (
      <div className="rna">
        {
          this.props.jobId && this.props.status === "error" && (
            <div className="row" key={`error-div`}>
              <div className="col-sm-9">
                <div className="alert alert-danger">
                  There was an error. Let us know if the problem persists by raising an issue on <a href="https://github.com/RNAcentral/r2dt-web/issues" target="_blank">GitHub</a>.
                </div>
              </div>
            </div>
          )
        }
        {
          this.props.jobId && !this.props.svg && this.props.status === "FINISHED" && (
            <div className="row" key={`error-div`}>
              <div className="col-sm-9">
                <div className="alert alert-warning">
                  The sequence did not match any of the templates. If you think it's an error, please <a href="https://github.com/RNAcentral/r2dt-web/issues" target="_blank">get in touch</a>.
                </div>
              </div>
            </div>
          )
        }
        {
          this.props.jobId && this.props.svg && this.props.status === "FINISHED" && [
            <div className="row" key={`results-div`}>
              <div className="col-sm-12">
                <span style={title}>Secondary structure </span>
                {
                  (this.props.template === "error" || this.props.source === "error") ? <p className="text-muted mt-3">
                    Generated by <a className="custom-link" style={{color: linkColor}} href="https://github.com/RNAcentral/r2dt" target="_blank">R2DT</a>. <a className="custom-link" style={{color: linkColor}} href="https://rnacentral.org/help/secondary-structure" target="_blank">Learn more →</a>
                  </p> : <p className="text-muted mt-3">
                    Generated by <a className="custom-link" style={{color: linkColor}} href="https://github.com/RNAcentral/r2dt" target="_blank">R2DT</a> using the <i>{this.props.template}</i> template provided by {this.sourceLink(this.props.source, linkColor)}. <a className="custom-link" style={{color: linkColor}} href="https://rnacentral.org/help/secondary-structure" target="_blank">Learn more →</a>
                  </p>
                }
                <div className="btn-group mt-3 mb-3" role="group" aria-label="button options">
                  <button className="btn btn-outline-secondary" style={{fontSize: fixCss}} onClick={() => this.props.toggleColors(this.props.svg)}><span className="btn-icon"><MdColorLens size="1.2em"/></span> Toggle colours</button>
                  <button className="btn btn-outline-secondary" style={{fontSize: fixCss}} onClick={() => this.props.toggleNumbers(this.props.svg)}><span className="btn-icon"><BsToggles size="1.2em"/></span> Toggle numbers</button>
                  <button className="btn btn-outline-secondary" style={{fontSize: fixCss}} onClick={() => this.downloadPNG()}><span className="btn-icon"><RiImage2Line size="1.2em"/></span> Save PNG</button>
                  <button className="btn btn-outline-secondary" style={{fontSize: fixCss}} onClick={() => this.downloadSVG()}><span className="btn-icon"><RiFileCodeLine size="1.2em"/></span> Save SVG</button>
                  <button className="btn btn-outline-secondary" style={{fontSize: fixCss}} onClick={() => navigator.clipboard.writeText(this.props.notation)}><span className="btn-icon"><RiFileCopy2Line size="1.2em"/></span> Copy dot-bracket notation</button>
                </div>
                <ReactSVGPanZoom
                  width={width}
                  height={height}
                  ref={this.viewerRef}
                  tool={this.state.tool} onChangeTool={tool => this.changeTool(tool)}
                  value={this.state.value} onChangeValue={value => this.changeValue(value)}
                  toolbarProps={toolbarProps}
                  miniatureProps={miniatureProps}
                  background={"#fff"}
                  style={{ outline: '1px solid #6c757d' }}
                >
                  <svg width={parseFloat(this.props.width)} height={parseFloat(this.props.height)}>
                    <SvgLoader svgXML={this.props.svg} />
                  </svg>
                </ReactSVGPanZoom>
                <div className="mt-3">
                  <strong>Colour legend</strong>
                  <ul className="list-unstyled">
                    <li className="mt-1"><span className="traveler-black traveler-key"></span> Same as the template</li>
                    <li className="mt-1">
                      <span className="traveler-green traveler-key"></span> Modified compared to the template.
                      <strong> Tip:</strong> Hover over green nucleotides for more details
                    </li>
                    <li className="mt-1"><span className="traveler-red traveler-key"></span> Inserted nucleotides</li>
                    <li className="mt-1"><span className="traveler-blue traveler-key"></span> Repositioned compared to the template</li>
                    <li className="mt-1"><strong>Tip:</strong> Hover over the nucleotides to see nucleotide numbers</li>
                  </ul>
                </div>
              </div>
            </div>
          ]
        }
        {
          this.props.jobId && this.props.svg && this.props.status === "FINISHED" && this.props.notation && [
            <div className="row" key={`notation-div`}>
              <div className="col-sm-12">
                <p className="mt-3 notation-title">Dot-bracket notation</p>
                {
                  this.props.notation === "error" ? <div className="alert alert-danger">
                    There was an error loading the dot-bracket notation. Let us know if the problem persists by raising an issue on <a href="https://github.com/RNAcentral/r2dt-web/issues" target="_blank">GitHub</a>.
                  </div> : <pre className="notation">
                    <span className="notation-font">{this.props.notation}</span>
                  </pre>
                }
              </div>
            </div>
          ]
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    jobId: state.jobId,
    status: state.status,
    submissionError: state.submissionError,
    sequence: state.sequence,
    width: state.width,
    height: state.height,
    svg: state.svg,
    notation: state.notation,
    template: state.template,
    source: state.source
  };
}

function mapDispatchToProps(dispatch) {
  return {
    toggleColors: (svg) => dispatch(actionCreators.onToggleColors(svg)),
    toggleNumbers: (svg) => dispatch(actionCreators.onToggleNumbers(svg))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Results);
