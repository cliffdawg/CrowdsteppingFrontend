import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { usernameAction, userIDAction, originAction } from './actions/actions.js';
import { BrowserRouter as Router } from 'react-router-dom';
import Route from 'react-router-dom/Route'
import { Redirect } from 'react-router'
import logo from './logo.svg';
import * as api from './api';
import App from './App';
import './App2.css';
import Goal from './Goal'
import UserPanel from './UserPanel';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Ripples from 'react-ripples'


class Popup extends Component {
  render() {
    return (
      <div className="popup">
        <div className="popup_inner">
          <h1>{this.props.text}</h1>
            <div className="Create-new-goal">
            <div className="group">      
              <input
                className="Custom-input"
                type="text" required
                maxlength='64'
                onChange={this.props.updateGoal}
              />
              <span className="Custom-highlight"></span>
              <span className="Custom-bar"></span>
              <label className="Custom-label">Goal</label>
            </div>
              <Ripples>
                <button className="Button-style" onClick={this.props.createGoal} style={{ height : '30px', width : '100px' }}>
                  Create
                </button>
              </Ripples>
            </div>
          <Ripples>
            <button className="Button-style" onClick={this.props.closePopup} style={{ height : '30px', width : '100px' }}> 
              Done 
            </button>
          </Ripples>
        </div>
      </div>
    );
  }
}

class App2 extends Component {

  constructor() {
        super();
        this.state = {
            number: 0,
            toApp: false,
            toSteps: false,
            toStepsGoal: '',
            signOut: false,
            goal: '',
            goals: [],
            popUp: false
        };
        // Arrow functions declared in constructor are the only ones that can be accessed by rendered components
        // and provide access to the current state
        this.refreshNumber = () => { 
            this.getNumber();
        };

        this.createGoal = () => {
            this.postGoal();
        };

        this.toSteps = () => {
            this.presentSteps();
        };

        // Until arrow functions, every new function defined its own this value. 
        // This proved to be annoying with an object-oriented style of programming.
        // Arrow functions capture the this value of the enclosing context.
        // Binding a new function to this instance means it can be used by it.
        this.presentApp = this.presentApp.bind(this);
        this.setGoals = this.setGoals.bind(this);
        this.presentPopUp = this.presentPopUp.bind(this);
        this.signOut = this.signOut.bind(this);

  }

  componentDidMount() {
        const token = localStorage.getItem('token');
        console.log(`App2 user: ${this.props.username}, id: ${this.props.userID}, token: ${token}`);

        this.setGoals(token);
  }

  // Display toast notification
  notify = (message) => {
    if (message === 'Token is not valid' || message === 'Token is not supplied' || message === 'Token cannot be validated!') {
      // Send back to sign in page due to expired token
      this.props.originAction('tokenExpired');
      this.presentApp();
    } else {
      toast.error(message, {
        position: 'bottom-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }

  async getNumber(){
    const num = await api.getNumber();
    this.setState({ number: num });
  }

  presentApp() {
    this.setState({ toApp: true });
  }

  presentSteps() {
    this.setState({ toSteps: true });
  }

  // This is one of the methods to be passed as a prop to the Popup component to click out of it from there
  presentPopUp() {
    this.setState({ popUp: !this.state.popUp });
  }

  signOut() {
    localStorage.removeItem('token');
    this.setState({ signOut: true });
  }

  goToSteps = (goal) => {
    this.setState({ toStepsGoal: goal });
    this.presentSteps();
  }

  updateGoal = (e) => {
        this.setState({
            goal: e.target.value
        });
  }

  async setGoals(token) {
        const goals = await api.getGoals(token);
        // Goals is a RowDataPacket of rows that can be subscripted
        // and each one's values are accessed by property ID's
        if (goals.success === true) {
          console.log(`setGoals: ${goals.data[0].username}`);
          this.setState({
              goals: goals.data
          });
          console.log(`goals: ${this.state.goals}`);
        } else {
          console.log(`setGoals failed: ${goals.message}`);
          this.notify(goals.message);
        }
  }

  async postGoal() {
    const token = localStorage.getItem('token');
    const { goal } = this.state;
    console.log(`${goal}`);
    const newGoal = {
            goal: goal,
            username: this.props.username
        };
    const createResult = await api.createGoal(newGoal, token);
    // This checking is needed for 503 service unavailable
    // typeof(createResult) !== 'undefined'
    if (createResult.success === true) {
      console.log(`createResult success: ${createResult.message}`);
      this.setGoals(token);
      this.presentPopUp();
    } else {
      console.log(`createResult fail: ${createResult.message}`);
      this.notify(createResult.message);
      this.presentPopUp();
    }
  }

  render() {

    if (this.state.toApp === true || this.state.signOut === true) {
      return <Redirect to="/App" />
    }

    if (this.state.toSteps === true) {
      return <Redirect to={{
            pathname: "/Steps",
            state: { goal: this.state.toStepsGoal }
        }}/>
    }

      const { goals } = this.state;
      let cards;
      if (goals.length !== 0) {
          cards = goals.map((goal, key) => (
            <Goal 
              key={key}
              title={goal.goal}
              userID={goal.username}
              timeStamp={this.formatDate(goal.timeStamp)}
              event={this.goToSteps.bind(this)}
            />
          ));
      } else {
          cards = (<h1 style={{ fontSize: '3vw' }}>
              It is currently very empty.
          </h1>);
      }

    // Green highlighted terms are props. Props are passed to subcomponent and can be data, errors, or methods.
    // Subcomponents reference props by green names, passing in methods can serve as callbacks
    return (

      <div className="App2">
        <ToastContainer />
        <header className="App2-header">
          <div className="Top-bar">
            <Ripples>
              <button className="Button-style" onClick={this.presentPopUp} style={{ height : '30px', width : '100px' }}>
                Create
              </button>
            </Ripples>
            <p className="App2-title">
              CrowdStepping
            </p>
            <div className="Redirect-buttons">
              <Ripples>
                <button className="Button-style" onClick={this.signOut} style={{ height : '30px', width : '100px' }}>
                  Sign Out
                </button>
              </Ripples>
            </div>
          </div>
        </header>
        <footer>
          <UserPanel currentUser={this.props.username} />
        </footer>
        <div className="Goals-grid">
          {cards}
        </div>
        {this.state.popUp ? 
          <Popup
            text='Create a Goal'
            closePopup={this.presentPopUp.bind(this)}
            updateGoal={this.updateGoal.bind(this)}
            createGoal={this.createGoal}
          />
          : null
        }
      </div>
    );
  }

  formatDate(date) {
    var newDate = new Date(date);
    console.log(`Date: ${newDate}`);
    var hours = newDate.getHours();
    var minutes = newDate.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return newDate.getMonth()+1 + "/" + newDate.getDate() + "/" + newDate.getFullYear() + "  " + strTime;
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
export default connect(mapStateToProps, mapDispatchToProps)(App2);
