// from './utils/functions' import get
import React from 'react';
import ReactDOM from 'react-dom';

export class LoginCallback extends React.Component {
  render() {
    // handleLogin();
    return (
      <div className="container">
        <p>Hold on a moment... We're finalizing your login.</p>
      </div>
    );
  }

  componentDidMount() {
    var url = "https://www.eventbriteapi.com/v3/users/me/";
    var http = new XMLHttpRequest();
    var http2 = new XMLHttpRequest();

    var hash = window.location.hash;
    var token = hash.substr(hash.indexOf('access_token=')+'access_token='.length);

    var params = "?token=" + token;

    var user_url = "/user/"


    http.open("POST", url+params, true);
    http.onreadystatechange = function()
    {
        if(http.readyState == 4 && http.status == 200) {
          var data = JSON.parse(http.responseText);
          var email = data["emails"].map(function(e) { if (e.primary) { return e.email }})

          http2.open("GET", user_url + email[0], true);
          http2.onreadystatechange = function() {

          }
          http2.send(null);
        }
    }
    http.send(null);

    var token = '';
    if (hash !== "") {
      try {
        token = hash.substr(hash.indexOf('access_token=')+'access_token='.length);
      } catch(e) {}
    }
    localStorage.setItem('access_token', token);
    // get primary email from eventbrite, store that too
    window.location = '/landing';
  }
}

ReactDOM.render(<LoginCallback/>, document.querySelector("#react-start"));