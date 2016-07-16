import React from 'react';
import ReactDOM from 'react-dom';
var eventbrite_login_uri = require('../config').EVENTBRITE_OAUTH_URI;
// import { EVENTBRITE_OAUTH_URI } from '../config';
// https://www.eventbrite.com/oauth/authorize?response_type=token&client_id=YOUR_CLIENT_KEY

export class Login extends React.Component {
  render() {
    return (
      <div>
        <div className="bg"></div>
        <div className="ui card inner">
          <div className="content">
            <div className="header"><h2>Frontiers.</h2></div>
          </div>
          <div className="content">
            <div className="ui small feed">
              <div className="event">
                <div className="content">
                  <div className="summary">
                     <a>Discover events around you.</a>
                  </div>
                </div>
              </div>
              <div className="event">
                <div className="content">
                  <div className="summary">
                     <a>Explore new frontiers</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="extra content">
            <button className="ui button blue login-eventbrite" onClick={this.handleLogin}>Login with Eventbrite</button>
          </div>
        </div>

      </div>



    );
  }

  handleLogin() {
    window.location = eventbrite_login_uri;
  }
}

ReactDOM.render(<Login/>, document.querySelector("#react-start"));