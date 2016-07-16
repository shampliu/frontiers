// Landing page
// let user select options for events cards


var React     = require('react'),
    ReactDOM  = require('react-dom');


var radiuses = [{title: "1 mile", value: 1},
                {title: "3 miles", value: 3},
                {title: "5 miles", value: 5},
                {title: "10 miles", value: 10},
                {title: "25 miles", value: 25}];

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
        <InlineDropdown title="Show me events within " options={radiuses} defaultItem={radiuses[1]} />
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

/**
@prop enterGeo(geolocation): function to call with current location
@prop satisfied: should indicate to user that the field has been filled
*/
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
    var buttonTitle = this.state.searching ? "" : (this.props.satisfied ? "Located" : "Current Location");
    var buttonClassName = this.state.searching ? "ui button formButton loading" : (this.props.satisfied ? "ui button formButton satisfiedButton" : "ui button formButton");
    return (
      <div className="currentLocationButton loading">
        <button className={buttonClassName} onClick={this.getLocation} disabled={this.props.satisfied}>{buttonTitle}</button>
      </div>
    );
  }
});

/**
@prop title: text to display next to options
@prop options: list of items: {title: "", value: int}
@prop defaultItem: first item to display: {title: "", value: int}
*/
var InlineDropdown = React.createClass({
  printIt: function(value) {
    console.log("yeah bro", value);
  },
  componentDidMount: function() {
    var valueDict = {};
    for (var o = 0; o < this.props.options.length; o++) {
      valueDict[this.props.options[o].title] = this.props.options[o].value;
    }
    $('.ui.dropdown')
      .dropdown('setting', 'onChange', function(e){console.log(valueDict[e]);});
  },
  render: function() {
    var printIt = this.printIt;
    var menuItems = this.props.options.map(function(item) {
      // let boundClick = printIt.bind(this, item.value);
      return <div className="item" key={item.value}>
                {item.title}
              </div>;
    });
    return (
      <div className="radiusDropdown">
        <span>
          {this.props.title}
          <div className="ui inline dropdown">
            <div className="text">
              <div className="item">
                {this.props.defaultItem.title}
              </div>
            </div>
            <i className="dropdown icon"></i>
            <div className="menu">
              {menuItems}
            </div>
          </div>
        </span>
      </div>
    );
  }
});

/**
@prop submit: function to call when submitting form
@prop satisfied: should indicate to user that the field has been filled
*/
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
