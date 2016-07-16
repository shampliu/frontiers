//require("./node_modules/bootstrap/dist/css/bootstrap.min.css")
import React from 'react';
import ReactDOM from 'react-dom';

export class App extends React.Component {
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

ReactDOM.render(<App/>, document.querySelector("#react-start"));
