// Landing page
// let user select options for events cards

var React     = require('react'),
    ReactDOM  = require('react-dom');

export class LandingPage extends React.Component {
  render() {
    return (
      <div className="container">
        <div className="jumbotron">
          <h1>Jumbotron</h1>
          <p>This is a cool hero unit, a cool jumbotron-style component for calling extra attention to featured content or information.</p>
          <p><a class="btn btn-primary btn-lg">Learn more</a></p>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<LandingPage />, document.querySelector("#react-start"));
