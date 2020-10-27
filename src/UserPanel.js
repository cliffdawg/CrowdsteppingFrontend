import React, { Component } from 'react';
import './UserPanel.css';

class UserPanel extends Component {

  render() {
  	// h1 is big title, h2 is subtitle, p is content 
    return <p className="User-Panel">{'User: ' + this.props.currentUser}</p>;
  }
  
}

export default UserPanel;