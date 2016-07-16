// Landing page
// let user select options for events cards


var React     = require('react'),
    ReactDOM  = require('react-dom');

var LandingPage = React.createClass({
  getInitialState: function() {
    return {searchSat: false, locationSat: false};
  },
  enterGeo: function(geolocation) {
    if (geolocation.lat) {
      console.log("lat: ", geolocation.lat);
    }
    if (geolocation.lng) {
      console.log("lng: ", geolocation.lng);
    }
  },
  enterSearchGeo: function(geolocation) {
    this.setState({searchSat: true, locationSat: false})
    this.enterGeo(geolocation);
  },
  enterLocationGeo: function(geolocation) {
    this.setState({searchSat: false, locationSat: true})
    this.enterGeo(geolocation);
  },
  formSatisfied: function() {
    return this.state.searchSat || this.state.locationSat;
  },
  render: function() {
    return (
      <div className="container">
        <div className="ui three item menu">
          <a className="active item">Settings</a>
          <a className="item">Events</a>
          <a className="item">Log Out</a>
        </div>
        <LocationFinder enterGeo={this.enterSearchGeo} satisfied={this.state.searchSat} />
        <CurrentLocationButton enterGeo={this.enterLocationGeo} satisfied={this.state.locationSat} />
        <SubmitButton satisfied={this.formSatisfied()} />
      </div>
    );
  }
});

var autocomplete;
var LocationFinder = React.createClass({
  autocompleted: function() {
    // Get the place details from the autocomplete object.
    var place = autocomplete.getPlace();
    var geolocation = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng()
    };
    this.props.enterGeo(geolocation);
  },
  componentDidMount: function() {
    autocomplete = new google.maps.places.Autocomplete(
      /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
      {types: ['geocode']});
    autocomplete.addListener('place_changed', this.autocompleted);

  },
  render: function() {
    var iconClassName = this.props.satisfied ? "satisfied checkmark icon" : "search icon";
    return (
      <div className="LocationFinder">
        <div className="ui icon input">
          <i className={iconClassName}></i>
          <input id="autocomplete" placeholder="Search Frontiers" type="text" />
        </div>
      </div>
    );
  }
});

var CurrentLocationButton = React.createClass({
  getInitialState: function() {
    return {searching: false};
  },
  setSearching: function(searching) {
    this.setState({"searching": searching});
  },
  getLocation: function() {
    if (navigator.geolocation) {
      this.setState({searching: true});
      var setSearching = this.setSearching;
      var enterGeo = this.props.enterGeo;
      navigator.geolocation.getCurrentPosition(function(position) {
        var geolocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        enterGeo(geolocation);
        setSearching(false);
      }, function(error) {
        console.log(error);
        setSearching(false);
      });
    }
  },
  render: function() {
    var buttonTitle = this.state.searching ? "Locating..." : (this.props.satisfied ? "Located" : "Current Location");
    var buttonClassName = this.props.satisfied ? "ui button formButton satisfiedButton": "ui button formButton";
    return (
      <div className="currentLocationButton loading">
        <button className={buttonClassName} onClick={this.getLocation} disabled={this.props.satisfied}>{buttonTitle}</button>
      </div>
    );
  }
});

var SubmitButton = React.createClass({
  render: function() {
    var buttonClassName = this.props.satisfied ? "ui button formButton satisfiedButton": "ui button formButton unsatisfiedForm";
    return (
      <div className="currentLocationButton">
        <button className={buttonClassName} onClick={this.props.submit} disabled={!this.props.satisfied}>Explore Events</button>
      </div>
    );
  }
});

ReactDOM.render(<LandingPage />, document.querySelector("#react-start"));
