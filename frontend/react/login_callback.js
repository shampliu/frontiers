// from './utils/functions' import get
import React from 'react';
import ReactDOM from 'react-dom';

export class LoginCallback extends React.Component {
  render() {
    // handleLogin();
    return (<div></div>);
  }

  componentDidMount() {
    var url = "https://www.eventbriteapi.com/v3/users/me/";
    var http = new XMLHttpRequest();
    var http2 = new XMLHttpRequest();

    var hash = window.location.hash;
    var token = hash.substr(hash.indexOf('access_token=')+'access_token='.length);

    var params = "?token=" + token;

    var user_url = "/user/"

    http.open("GET", url+params, true);
    http.setRequestHeader('Accept', 'application/json');
    http.setRequestHeader('Content-Type', 'application/json');
    http.onreadystatechange = function()
    {
      var data = JSON.parse(http.responseText);
      var email = data["emails"].map(function(e) { if (e.primary) { return e.email }})

      localStorage.setItem('email', email);
      localStorage.setItem('access_token', token);

      http2.open("GET", user_url + email, true);
      http2.onreadystatechange = function() {
        window.location = '/';
      }
      http2.send();
      // window.location = '/';
    }
    http.send();

    // var token = '';
    // if (hash !== "") {
    //   try {
    //     token = hash.substr(hash.indexOf('access_token=')+'access_token='.length);
    //   } catch(e) {}
    // }
    // get primary email from eventbrite, store that too
    // window.location = '/landing';
  }
}

ReactDOM.render(<LoginCallback/>, document.querySelector("#react-start"));