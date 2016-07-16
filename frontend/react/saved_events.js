import React from 'react';
import ReactDOM from 'react-dom';
var getEvent = require('./utils/events').getEvent;
var logout = require('./utils/auth').logout;
import moment from 'moment';

export class SavedEvents extends React.Component {

  constructor() {
    super();
    this.state = {
      'events': []
    }
  }

  render() {
    return (
      <div className="container">
        <h1 className="logo">Your Saved Frontiers</h1>
        <div className="ui link cards">
          {this.state.events.map((e) =>
            <div className="card">
              <div className="image">
                <img src={e.logo.url} />
              </div>
              <div className="content">
                <a className="header" dangerouslySetInnerHTML={{__html:e.name.html}} href={e.url}></a>
                <div className="meta">
                  <a>Event is <b>{e.status}</b></a>
                </div>
                <div className="description">
                  {e.description.text.substr(0,250)} ...
                </div>
              </div>
              <div className="extra content">
                <span>
                  <b>Starts:</b> {moment(e.start.local,'YYYY-MM-DD[T]hh:mm:ss').fromNow()}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

/*
{
  "name": {
      "text": "Silicon Valley Bike Summit 2016",
      "html": "Silicon Valley Bike Summit 2016"
  },
  "id": "25684863117",
  "url": "http://www.eventbrite.com/e/silicon-valley-bike-summit-2016-tickets-25684863117?aff=ebapi",
  "start": {
      "timezone": "America/Los_Angeles",
      "local": "2016-08-11T09:00:00",
      "utc": "2016-08-11T16:00:00Z"
  },
  "end": {
      "timezone": "America/Los_Angeles",
      "local": "2016-08-11T18:00:00",
      "utc": "2016-08-12T01:00:00Z"
  },
  "logo": {
      "id": "22489423",
      "url": "https://img.evbuc.com/http%3A%2F%2Fcdn.evbuc.com%2Fimages%2F22489423%2F11101632227%2F1%2Foriginal.jpg?h=200&w=450&rect=0%2C0%2C1024%2C512&s=a30b3a8cc85508fe8e31c0854a366f9d",
  }
}
*/

  componentWillMount() {
    let http = new XMLHttpRequest();
    http.open('GET', '/events', true);
    http.withCredentials = true;
    console.log('before')
    let _ = this;
    http.addEventListener('load', function() {
      let ids = JSON.parse(this.responseText);
      for (var i = 0; i < ids.length; i++) {
        getEvent(ids[i], function() {
          let event = JSON.parse(this.responseText);
          let new_events = _.state.events.slice();
          new_events.push(event);
          _.setState({events:new_events})
        });
      }
    });
    http.send();
  }
}

ReactDOM.render(<SavedEvents/>, document.querySelector("#react-start"));

var Navbar = React.createClass({
  handleLogout: function() {
    logout();
    window.location = '/logout';
  },
  render: function() {
    return (
      <div className="ui secondary menu">
        <a className="item" href="/">Home</a>
        <a className="item" href="/landing">Search Events</a>
        <a className="active item" href="/saved-events">Saved Events</a>
        <div className="right menu">
          <a className="ui item" onClick={this.handleLogout}>Logout</a>
        </div>
      </div>
    )
  }
})

ReactDOM.render(<Navbar />, document.querySelector("#navbar"));