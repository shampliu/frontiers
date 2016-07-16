import React from 'react';
import ReactDOM from 'react-dom';
// var eventbrite_login_uri = require('../config').EVENTBRITE_OAUTH_URI;
// import { EVENTBRITE_OAUTH_URI } from '../config';
// https://www.eventbrite.com/oauth/authorize?response_type=token&client_id=YOUR_CLIENT_KEY

export class Login extends React.Component {
  render() {
    return (
      <div className="container">
        <h1 class="logo">Frontiers</h1>
        <button className="login-eventbrite" onClick={this.handleLogin}>Login with EventBrite</button>
      </div>
    );
  }

  handleLogin() {
    // window.location = eventbrite_login_uri;
  }
}

ReactDOM.render(<Login/>, document.querySelector("#react-start"));