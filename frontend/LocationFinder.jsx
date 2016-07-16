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
 export modules = LocationFinder;
