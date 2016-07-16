// Landing page
// let user select options for events cards

var cities = ["Los Angeles", "San Francisco", "Atlanta", "Singapore", "Quebec"];


var React     = require('react'),
    ReactDOM  = require('react-dom');

export class LandingPage extends React.Component {
  render() {
    return (
      <div className="container">
        <div className="ui three item menu">
          <a className="active item">Settings</a>
          <a className="item">Events</a>
          <a className="item">Log Out</a>
        </div>
        <LocationFinder />
      </div>
    );
  }
}

var autocomplete;
var componentForm = {
        street_number: 'short_name',
        // route: 'long_name',
        locality: 'long_name',
        // administrative_area_level_1: 'short_name',
        country: 'long_name',
        postal_code: 'short_name'
      };

var LocationFinder = React.createClass({
  // getInitialState: function() {
  //   return {"loading": true, "value": "", "matches": []};
  // },
  // queryCities: function(query) {
  //   var matching = [];
  //   for (var c = 0; c < cities.length; c++) {
  //     if (cities[c].includes(query)) {
  //       matching.push(cities[c]);
  //     }
  //   }
  //   return matching;
  // },
  // resetLoading: function(e) {
  //   this.setState({loading: false});
  // },
  // handleChange: function(e) {
  //   var value = e.target.value;
  //   // set loading icon
  //   this.setState({loading: false});
  //   if (value === "") {
  //     this.setState({value: value, matches: []});
  //   }
  //   else {
  //     // cute loading animation for 0.5 seconds
  //     this.setState({loading: true});
  //     setTimeout(this.resetLoading, 500);
  //     this.setState({value: value, matches: this.queryCities(value)});
  //   }
  // },
  autocompleted: function() {
    // Get the place details from the autocomplete object.
    var place = autocomplete.getPlace();

    // for (var component in componentForm) {
    //   document.getElementById(component).value = '';
    //   document.getElementById(component).disabled = false;
    // }

    // Get each component of the address from the place details
    // and fill the corresponding field on the form.
    // for (var i = 0; i < place.address_components.length; i++) {
      // var addressType = place.address_components[i].types[0];
      // console.log(place.address_components[i]);
      // if (componentForm[addressType]) {
      //   var val = place.address_components[i][componentForm[addressType]];
      //   // document.getElementById(addressType).value = val;
      //   console.log(val);
      // }
    // }
    var lat = place.geometry.location.lat(),
    lng = place.geometry.location.lng();
    console.log(lat);
    console.log(lng);
  },
  componentDidMount: function() {
    autocomplete = new google.maps.places.Autocomplete(
      /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
      {types: ['geocode']});
    autocomplete.addListener('place_changed', this.autocompleted);

  },
  render: function() {
    return (
      <div className="ui icon input loading">
        <input id="autocomplete" placeholder="Explore Location" type="text" />
      </div>
    );
  }
});

ReactDOM.render(<LandingPage />, document.querySelector("#react-start"));
