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
  }
}

ReactDOM.render(<SavedEvents/>, document.querySelector("#react-start"));