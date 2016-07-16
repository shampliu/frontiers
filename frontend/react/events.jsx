var React     = require('react'),
    ReactDOM  = require('react-dom'),
    events    = require('./utils/events');

    var Events = React.createClass({
      render: function() {
        return (
          <div>test</div>
        );
      }
    });

ReactDOM.render(<LandingPage />, document.querySelector("#react-start"));
