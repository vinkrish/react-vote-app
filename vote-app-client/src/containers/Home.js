import React, { Component } from "react";
import { Link } from "react-router-dom";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import "./Home.css";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      polls: []
    };
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }

    try {
        fetch("http://localhost:3000/api/polls", {
          method: "GET",
          headers: {
              'Content-Type': 'application/json',
              'Authorization': localStorage.getItem('token')
          }
        }).then(response => {
            response.json().then(polls => {
                this.setState({ polls });
            });
        });
      } catch (e) {
        alert(e.message);
        this.setState({ isLoading: false });
      }

    this.setState({ isLoading: false });
  
  }

  handlePollClick = event => {
    event.preventDefault();
    this.props.history.push(event.currentTarget.getAttribute("href"));
  }

  renderPollsList(polls) {
    return [{}].concat(polls).map(
      (poll, i) =>
        i !== 0
          ? <ListGroupItem
              key={poll._id}
              href={`/poll-detail/${poll._id}`}
              onClick={this.handlePollClick}
              header={poll.title}
            >
            </ListGroupItem>
          : <ListGroupItem
              key="new"
              href="/poll/add"
              onClick={this.handlePoleClick}
            >
              <h4>
                <b>{"\uFF0B"}</b> Create a new poll
              </h4>
            </ListGroupItem>
    );
  }

  renderLander() {
    return (
      <div className="lander">
        <h1>Poll</h1>
        <p>A simple voting app</p>
        <div>
          <Link to="/login" className="btn btn-info btn-lg">
            Login
          </Link>
          <Link to="/signup" className="btn btn-success btn-lg">
            Signup
          </Link>
        </div>
      </div>
    );
  }

  renderPolls() {
    return (
      <div className="polls">
        <PageHeader>Your Polls</PageHeader>
        <ListGroup>
          {!this.state.isLoading && this.renderPollsList(this.state.polls)}
        </ListGroup>
      </div>
    );
  }

  render() {
    return (
      <div className="Home">
        {this.props.isAuthenticated ? this.renderPolls() : this.renderLander()}
      </div>
    );
  }
}
