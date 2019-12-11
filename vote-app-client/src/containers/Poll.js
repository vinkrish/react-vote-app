import React, { Component } from "react";
import { Button } from "react-bootstrap";
import Select from "react-select";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import "./Poll.css";
import CanvasJSReact from '../assets/canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

export default class Poll extends Component {
  constructor(props) {
    super(props);

    this.file = null;

    this.state = {
      isLoading: null,
      isDeleting: null,
      poll: {
        title: null,
        options: [],
        votes: []
      },
      selectedOption: null,
      attachmentURL: null
    };
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
        return;
      }
  
      try {
          fetch(`http://localhost:3000/api/polls/${this.props.match.params.id}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }
          }).then(response => {
              response.json().then(poll => {
                   this.setState({ poll });
              });
          });
        } catch (e) {
          alert(e.message);
          this.setState({ isLoading: false });
        }
  
    this.setState({ isLoading: false });
  }

  validateForm() {
    return this.state.selectedOption;
  }

  formatFilename(str) {
    return str.replace(/^\w+-/, "");
  }

  handleChange = event => {
    this.setState({selectedOption: event})
  }

  handleFileChange = event => {
    this.file = event.target.files[0];
  }

  handleSubmit = async event => {
    event.preventDefault();

    if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
      alert(`Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE/1000000} MB.`);
      return;
    }

    const vote = {
        user: 'vinkrish',
        votedOption: this.state.selectedOption.value
    }

    try {
        fetch(`http://localhost:3000/api/polls/${this.props.match.params.id}`, {
          method: "PATCH",
          body: JSON.stringify(vote),
          headers: {
              'Content-Type': 'application/json',
              'Authorization': localStorage.getItem('token')
          }
        }).then(response => {
            response.json().then(poll => {
                this.setState({ poll });
            });
            this.setState({ isLoading: false });
        });
      } catch (e) {
        alert(e.message);
        this.setState({ isLoading: false });
      }

    this.setState({ isLoading: true });
  }

  getChartData() {
    const pieChartLabels = this.state.poll.options;
    const votes = this.state.poll.votes;
    let pieChartData = [];
    let dataPoints = [];
    for (let i = 0; i < pieChartLabels.length; i++) {
      pieChartData.push(votes.filter(x => {
        return x.votedOption === pieChartLabels[i];
      }).length);
      dataPoints.push({y: pieChartData[i], label: pieChartLabels[i]});
    }
    // pieChartData = pieChartData.splice(pieChartLabels.length);
    const options = {
      title: {
        text: "Vote Result"
      },
      data: [{
        type: "pie",
        startAngle: 90,
        toolTipContent: "<b>{label}</b>: {y}%",
        showInLegend: "true",
        legendText: "{label}",
        indexLabelFontSize: 12,
        indexLabel: "{label} - {y}%",
        dataPoints: dataPoints
      }]
    }
    return options;
  }

  deleteVote = event => {
    event.preventDefault();

    try {
      fetch(`http://localhost:3000/api/polls/${this.props.match.params.id}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        }
      }).then(response => {
          this.setState({ isLoading: false });
          this.props.history.push("/");

      });
    } catch (e) {
      alert(e.message);
      this.setState({ isLoading: false });
    }
    this.setState({ isLoading: true });
  }

  render() {
    const { selectedOption } = this.state;
    let chartOptions = this.getChartData();

    return (
      <div className="Poll">
        {this.state.poll &&
          <form onSubmit={this.handleSubmit}>
            <label>
                Vote for your preference:
                <Select 
                    value={selectedOption} 
                    onChange={this.handleChange} 
                    options={this.state.poll.options.map( opt => { return {value: opt, label: opt} })}/>
            </label>
            <LoaderButton
              block
              bsStyle="primary"
              bsSize="small"
              disabled={!this.validateForm()}
              type="submit"
              isLoading={this.state.isLoading}
              text="Save"
              loadingText="Saving…"
            />
            <Button bsStyle="danger" bsSize="small" block onClick={this.deleteVote}>Delete</Button>
          </form>}
          <br></br>
          <CanvasJSChart options = { chartOptions }
            /* onRef={ref => this.chart = ref} */
          />
      </div>
    );
  }
}