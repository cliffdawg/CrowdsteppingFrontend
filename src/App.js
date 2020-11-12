import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { usernameAction, userIDAction, originAction } from './actions/actions.js';
import { BrowserRouter as Router } from 'react-router-dom';
import Route from 'react-router-dom/Route'
import { Redirect } from 'react-router'
import logo from './logo.svg';
import * as api from './api';
import App2 from './App2';
import './App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Ripples from 'react-ripples'

// Redux store and web tokens are kept in browser memory

class App extends Component {

  constructor(props) {
        super();
        this.state = {
            number: 0,
            toApp2: false,
            username: '',
            userID: -1,
            password: '',
            username2: '',
            email: '',
            password2: '',
            loginDisabled: false,
            signupDisabled: false
        };

        // Arrow functions declared in constructor are the only ones that can be accessed by rendered components
        // and provide access to the current state

        // Cannot name declared functions the same as actual state's functions
        this.refreshNumber = () => { 
            this.getNumber();
        };
        this.toApp2 = () => {
            this.presentApp2();
        };
        this.login = () => {
            this.logIn();
        };
        this.signup = () => {
            this.signUp();
        };

  }

  componentDidMount() {
    window.scrollTo(0, 0);
    if (this.props.origin === 'tokenExpired') {
      this.notify('Please sign in!');
    }
  }

  // Display toast notification
  notify = (message) => {
    toast.error(message, {
      position: 'bottom-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

    if (message === 'Please sign in!') {
      this.props.originAction('No Origin');
    }
  }

  async getNumber() {
        const num = await api.getNumber();
        this.setState({ 
            number: num 
        });
  }

  async presentApp2() {
    const token = localStorage.getItem('token');
    const verifyResult = await api.verifyToken(token);
    if (verifyResult.success === true) {
        this.setState({ 
            toApp2: true 
        });
    } else {
        console.log(`verifyResult: ${verifyResult.message}`);
    }  
  }

  updateUsername = (e) => {
        this.setState({
            username: e.target.value
        });
  }

  updatePassword = (e) => {
        this.setState({
            password: e.target.value
        });
  }

  updateUsername2 = (e) => {
        this.setState({
            username2: e.target.value
        });
  }

  updateEmail = (e) => {
        this.setState({
            email: e.target.value
        });
  }

  updatePassword2 = (e) => {
        this.setState({
            password2: e.target.value
        });
  }

  async logIn() {
    const { username, password } = this.state;
    console.log(`${username}, ${password}`);
    const newLogin = {
            username: username,
            password: password
        };
    const loginResult = await api.signIn(newLogin);
    
    if (loginResult.success === true) {
      console.log(`loginResult: ${loginResult.data}`);
      localStorage.setItem('token', loginResult.data[0]);

      this.setState({
          userID: loginResult.data[1]
      });

      this.props.usernameAction(username);
      this.props.userIDAction(loginResult.data[1]);
      this.toApp2();
    } else {
      console.log(`loginResult: ${loginResult.message}`);
      this.notify(loginResult.message);
    }
  }

  async signUp() {
    const { username2, email, password2 } = this.state;
    console.log(`${username2}, ${email}, ${password2}`);
    const newSignup = {
            username: username2,
            email: email,
            password: password2
        };
    const signupResult = await api.signUp(newSignup);
    
    if (signupResult.success === true) {
      console.log(`signupResult token and id: ${signupResult.token}, ${signupResult.userID}`);
      localStorage.setItem('token', signupResult.token);
      this.props.usernameAction(username2);
      this.props.userIDAction(signupResult.userID);
      this.toApp2();
    } else {
      console.log(`signupResult: ${signupResult.message}`);
      this.notify(signupResult.message);
    }
  }


  //** addd loading animation for buttons like login later

  render() {

    if (this.state.toApp2 === true) {
        return <Redirect to="/App2" />
    }

    return (
      <div className="App">
        <ToastContainer />
        <header className="App-header">
          <img src={require('./assets/crowd.png')} alt='Crowdstepping logo' 
            style={{ height : '250px', width : '250px' }} />
          <a className="App-title" style={{ marginTop : '3vh' }}>
            Crowdstepping
          </a>
          <div className="group" style={{ marginTop : '5vh' }}>      
            <input
              className="Custom-input"
              type="text" required
              maxlength='50'
              onChange={this.updateUsername}
            />
            <span className="Custom-highlight"></span>
            <span className="Custom-bar"></span>
            <label className="Custom-label">Username</label>
          </div>
          <div className="group">      
            <input 
              className="Custom-input"
              type="password" required
              maxlength='50'
              onChange={this.updatePassword}
            />
            <span className="Custom-highlight"></span>
            <span className="Custom-bar"></span>
            <label className="Custom-label">Password</label>
          </div>
          <Ripples>
            <button className="Button-style" onClick={() => { this.logIn(); this.setState({ loginDisabled: true }); setTimeout(() => this.setState({ loginDisabled: false }), 4000); }} 
                disabled={this.state.loginDisabled} style={{ height : '30px', width : '100px' }}>
              Login
            </button>
          </Ripples>
          <div className="group" style={{ marginTop : '5vh' }}>      
            <input
              className="Custom-input"
              type="text" required
              maxlength='50'
              onChange={this.updateUsername2}
            />
            <span className="Custom-highlight"></span>
            <span className="Custom-bar"></span>
            <label className="Custom-label">Username</label>
          </div>
          <div className="group">      
            <input
              className="Custom-input"
              type="text" required
              maxlength='50'
              onChange={this.updateEmail}
            />
            <span className="Custom-highlight"></span>
            <span className="Custom-bar"></span>
            <label className="Custom-label">Email</label>
          </div>
          <div className="group">      
            <input
              className="Custom-input"
              type="password" required
              maxlength='50'
              onChange={this.updatePassword2}
            />
            <span className="Custom-highlight"></span>
            <span className="Custom-bar"></span>
            <label className="Custom-label">Password</label>
          </div>
          <Ripples>
            <button className="Button-style" onClick={() => { this.signUp(); this.setState({ signupDisabled: true }); setTimeout(() => this.setState({ signupDisabled: false }), 4000); }} 
                disabled={this.state.signupDisabled} style={{ height : '30px', width : '100px' }}>
              Sign Up
            </button>
          </Ripples>
          <div style={{ fontSize : '5px', marginTop: '5vh' }}>Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> </div>
        </header>
      </div>
    );
  }
}

// Passes this data from store to component in form of props.
// This returns the props the component uses
const mapStateToProps = (state) => {
  console.log(`State: ${state.state.username}`);
  return {
    username: state.state.username,
    userID: state.state.userID,
    origin: state.state.origin
  }
}

// Attach to component's props and will dispatch the action in question 
// to the reducer to be turned into state in the store.
// This creates the action to call to change the store
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ usernameAction, userIDAction, originAction }, dispatch);
}

// This links them all together
export default connect(mapStateToProps, mapDispatchToProps)(App);
