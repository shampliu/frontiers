import React from 'react';
import ReactDOM from 'react-dom';
var getEvent = require('./utils/events').getEvent;

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
        <h1 class="logo">Your Frontiers</h1>
        <p>{JSON.stringify(this.state)}</p>
        <ul>
          {this.state.events.map((e) =>
            <li>{JSON.stringify(e)}</li>
          )}
        </ul>
      </div>
    );
  }

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