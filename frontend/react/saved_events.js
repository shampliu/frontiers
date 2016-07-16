import React from 'react';
import ReactDOM from 'react-dom';

export class SavedEvents extends React.Component {

  getInitialState() {
    return {
      'events': {}
    }
  }

  render() {
    return (
      <div className="container">
        <h1 class="logo">Your Frontiers</h1>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
          <li>Item 4</li>
        </ul>
      </div>
    );
  }

  componentWillMount() {
    let http = new XMLHttpRequest();
    http.open('GET', '/events', true);
    http.withCredentials = true;
    http.addEventListener('load', function() {
      alert(this.responseText);
    });
    http.send();
  }
}

ReactDOM.render(<SavedEvents/>, document.querySelector("#react-start"));