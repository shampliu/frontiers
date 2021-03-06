// Landing page
// let user select options for events cards

var cities = ["Los Angeles", "San Francisco", "Atlanta", "Singapore", "Quebec"];
var logout = require('./utils/auth').logout;

var React      = require('react'),
    ReactDOM   = require('react-dom'),
    Tinderable = require('./components/Tinderable'),
    events     = require('./utils/events');


var radiuses = [{title: "3 mile", value: 3},
                {title: "5 miles", value: 5},
                {title: "10 miles", value: 10},
                {title: "25 miles", value: 25},
                {title: "50 miles", value: 50}];

let searchTab = "search";
let tinderTab = "tinder";

var categoryDict = {};
var LandingPage = React.createClass({
  getInitialState: function() {
    return {searchSat: false, locationSat: false, possibleCategories: [], categories: [],
      radius: 3, active: searchTab, cards: [],
      lat: 0, lng: 0, loading: false};
  },
  enterGeo: function(geolocation) {
    if (geolocation.lat) {
      console.log("lat: ", geolocation.lat);
      this.setState({lat: geolocation.lat});
    }
    if (geolocation.lng) {
      console.log("lng: ", geolocation.lng);
      this.setState({lng: geolocation.lng});
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
  enterRadius: function(radius) {
    // console.log("got radius", radius);
    this.setState({radius: radius});
  },
  enterCategories: function(categories) {
    // console.log("got categories", categories);
    var ids = [];
    var catStrings = categories.split(",");
    for (var c = 0; c < catStrings.length; c++) {
      if (categoryDict[catStrings[c]]) {
        ids.push(categoryDict[catStrings[c]])
      }
    }
    this.setState({categories: ids});
  },
  formSatisfied: function() {
    return this.state.searchSat || this.state.locationSat;
  },
  activateTinder: function(cards) {
    this.setState({active: tinderTab, cards: cards, loading: false});
  },
  convertEvent: function(event) {
    var card = {};

    if (event.name && event.name.text) {
      card["title"] = event.name.text;
    }
    else {
      card["title"] = "Untitled";
    }
    if (event.description && event.description.text) {
      card["text"] = event.description.text;
    }
    if (event.logo && event.logo.url) {
      card["image"] = event.logo.url;
    }
    else {
      card["image"] = "http://placehold.it/300x300";
    }
    if (event.id) {
      card["id"] = event.id;
    }
    else {
      card["id"] = "123";
    }
    if (event.start && event.start.timezone) {
      card["location"] = event.start.timezone;
    }
    else {
      card["location"] = "San Francisco";
    }
    if (event.start && event.start.local) {
      card["startTime"] = event.start.local;
    }
    else {
      card["startTime"] = "Soon";
    }
    if (event.url) {
      card["url"] = event.url;
    }
    else {
      card["url"] = "http://yahoo.com"
    }
    return card;
  },
  handleSubmit: function() {
    if (this.formSatisfied()) {
      this.setState({loading: true});
      // var categoriesFilter = events.genCategoryFilter(this.state.categories)
      var radiusFilter = this.state.radius + "mi";
      var filters = {radius: radiusFilter, categories: this.state.categories};
      var activateTab = this.activateTinder;
      var convert = this.convertEvent;
      events.getEvents(this.state.lat, this.state.lng, filters, function(success, data) {
        // this.setState({loading: false});
        // if (success) {
          let events = data.events;
          var cards = [];
          for (var e = 0; e < events.length; e++) {
            cards.push(convert(events[e]));
          }
          activateTab(cards);
        // }
      });
    }
  },
  // handleLogout: function() {
  //   console.log("should log out");
  // },
  componentDidMount: function() {
    var readCategories = this.readCategories;
    events.getCategories(function() {
      readCategories(this.responseText);
    });
  },
  readCategories: function(response) {
    var categories = [];
    categoryDict = {};
    var catDicts = JSON.parse(response)["categories"];
    if (catDicts) {
      for (var c = 0; c < catDicts.length; c++) {
        categories.push(catDicts[c]["name"]);
        categoryDict[catDicts[c]["name"]] = catDicts[c]["id"];
      }
    }
    this.setState({possibleCategories: categories});
  },
  handleRemoveCard: function(cardId) {
    this.setState({
      cards: this.state.cards.filter(function(c) {
        return c.id !== cardId;
      })
    });
  },
  render: function() {
    if (this.state.active === searchTab && !this.state.loading) {
      var tabContent =
      <div>
        <LocationFinder enterGeo={this.enterSearchGeo} satisfied={this.state.searchSat} />
        <CurrentLocationButton enterGeo={this.enterLocationGeo} satisfied={this.state.locationSat} />
        <MultipleDropdown options={this.state.possibleCategories} onSubmit={this.enterCategories} />
        <InlineDropdown title="Show me events within " options={radiuses} defaultItem={radiuses[1]} onSubmit={this.enterRadius} />
        <SubmitButton satisfied={this.formSatisfied()} onSubmit={this.handleSubmit} />
      </div>;
    }
    else if (this.state.loading) {
      var tabContent = 
        <div className="ui segment noSegmentStyling">
          <div className="ui active inverted dimmer noSegmentStyling">
            <div className="ui text loader">Asking Around...</div>
          </div>
          <p></p>
        </div>
    }
    else if (this.state.active === tinderTab) {
      var tabContent = <div id="tinder-start">
                        <Tinderable cardData={this.state.cards} removeCard={this.handleRemoveCard} />
                      </div>;
    }
    return (
      <div className="container">
        <h4 className="ui dividing header" id="dividing-header">Search Events</h4>
        {tabContent}
      </div>
    );
  },
  // handleLogout: function() {
  //   logout();
  //   window.location = '/logout';
  // }
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
          <input id="autocomplete" placeholder="Search Location" type="text" />
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
  componentDidMount: function() {
    var valueDict = {};
    for (var o = 0; o < this.props.options.length; o++) {
      valueDict[this.props.options[o].title] = this.props.options[o].value;
    }
    var onSubmit = this.props.onSubmit;
    $('.ui.inlineDropdown')
      .dropdown('setting', 'onChange', function(e){onSubmit(valueDict[e]);});
  },
  render: function() {
    var menuItems = this.props.options.map(function(item) {
      return <div className="item" key={item.value}>
                {item.title}
              </div>;
    });
    return (
      <div className="inlineDropdown">
        <span>
          {this.props.title}
          <div className="ui inline dropdown inlineDropdown">
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
        <button className={buttonClassName} onClick={this.props.onSubmit} disabled={!this.props.satisfied}>Explore Events</button>
      </div>
    );
  }
});

/**
@prop options: list of items: {title: "", value: int}
*/
var MultipleDropdown = React.createClass({
  getInitialState: function() {
    return {"selected": []};
  },
  submitIt: function(value) {
    this.props.onSubmit(value);
  },
  componentDidMount: function() {
    var submitIt = this.submitIt;
    $('.ui.multiSelectDropdown')
      .dropdown('setting', 'onChange', function(e){submitIt(e)});
  },
  render: function() {
    var menuItems = this.props.options.map(function(value) {
      return <div className="item" key={value} data-value={value}>
                {value}
              </div>;
    });
    return (
      <div className="multipleDropdown">
        <div className="ui fluid multiple search selection dropdown multiSelectDropdown">
            <i className="dropdown icon"></i>
            <div className="default text">
              Select Categories
            </div>
            <div className="menu">
              {menuItems}
            </div>
          </div>
      </div>
    );
  }
});

ReactDOM.render(<LandingPage />, document.querySelector("#react-start"));

var Navbar = React.createClass({
  handleLogout: function() {
    logout();
    window.location = '/logout';
  },
  render: function() {
    return (
      <div className="ui secondary menu">
        <div className="item">
          <img src="/img/logo.png"></img>
        </div>
        <a className="active item" href="/landing"><i className="search icon"/>Search Events</a>
        <a className="item" href="/saved-events"><i className="marker icon" />Saved Events</a>
        <a className="item" href="https://github.com/shampliu/frontiers"><i className="code icon" />Contribute</a>
        <div className="right menu">
          <a className="ui item" onClick={this.handleLogout}><i className="sign in icon"/>Logout</a>
        </div>
      </div>
    )
  }
})

ReactDOM.render(<Navbar />, document.querySelector("#navbar"));
