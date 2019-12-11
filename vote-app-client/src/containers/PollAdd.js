import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import "./PollAdd.css";

export default class PollAdd extends Component {
  constructor(props) {
    super(props);

    this.file = null;

    this.state = {
      isLoading: null,
      title: "",
      options: ""
    };
  }

  createPoll(poll) {
    try {
        fetch("http://localhost:3000/api/polls", {
          method: "POST",
          body: JSON.stringify(poll),
          headers: {
              'Content-Type': 'application/json',
              'Authorization': localStorage.getItem('token')
          }
        }).then(response => {
            response.json().then(data => {
              this.props.history.push("/");
            });
        });
      } catch (e) {
        alert(e.message);
        this.setState({ isLoading: false });
      }
  }

  validateForm() {
    return this.state.title.length > 0 && this.state.options.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
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

    this.setState({ isLoading: true });

    try {
        let options = [];
        const lines = this.state.options.split('\n');
        for (let i = 0; i < lines.length; i++) {
            options.push(lines[i]);
        }
        this.createPoll({
            title: this.state.title,
            options: options
        });
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }

  render() {
    return (
      <div className="PollAdd">
        <h2>Create New Poll</h2>
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="title">
          <ControlLabel>Title</ControlLabel>
            <FormControl
              onChange={this.handleChange}
              value={this.state.title}
              type="text"
            />
          </FormGroup>
          <FormGroup controlId="options">
          <ControlLabel>Options</ControlLabel>
            <FormControl
              onChange={this.handleChange}
              value={this.state.options}
              componentClass="textarea"
            />
          </FormGroup>
          <FormGroup controlId="file">
            <ControlLabel>Attachment</ControlLabel>
            <FormControl onChange={this.handleFileChange} type="file" />
          </FormGroup>
          <LoaderButton
            block
            bsStyle="primary"
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
            isLoading={this.state.isLoading}
            text="Create"
            loadingText="Creating…"
          />
        </form>
      </div>
    );
  }
}
