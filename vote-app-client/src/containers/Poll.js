import React, { Component } from "react";
import Select from "react-select";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import "./Poll.css";

export default class Poll extends Component {
  constructor(props) {
    super(props);

    this.file = null;

    this.state = {
      isLoading: null,
      isDeleting: null,
      poll: null,
      selectedOption: null,
      attachmentURL: null
    };
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
        return;
      }
  
      try {
          fetch(`https://poll-vote-app.herokuapp.com/api/polls/${this.props.match.params.id}`, {
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

  savePoll() {
  }

  deleteNote() {
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
        fetch(`https://poll-vote-app.herokuapp.com/api/polls/${this.props.match.params.id}`, {
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

  render() {
    const { selectedOption } = this.state;
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
              bsSize="large"
              disabled={!this.validateForm()}
              type="submit"
              isLoading={this.state.isLoading}
              text="Save"
              loadingText="Saving…"
            />
          </form>}
      </div>
    );
  }
}