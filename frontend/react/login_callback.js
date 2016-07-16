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

  handleLogin() {
    var hash = window.location.hash;
    var token = '';
    if (hash !== "") {
      // try {
      //   token = hash.substr(hash.indexOf('access_token=')+'access_token='.length);
      // } catch {}
    }
    localStorage.setItem('access_token', token);
    // get primary email from eventbrite, store that too
    // window.location = '/';
  }
}

ReactDOM.render(<LoginCallback/>, document.querySelector("#react-start"));