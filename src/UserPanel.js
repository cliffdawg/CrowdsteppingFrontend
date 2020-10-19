import React, { Component } from 'react';

class UserPanel extends Component {

  render() {
  	// h1 is big title, h2 is subtitle, p is content 
    return <p>{'User: ' + this.props.currentUser}</p>;
  }
}

export default UserPanel;