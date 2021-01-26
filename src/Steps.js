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
import './Steps.css';
import Step from './Step'
import UserPanel from './UserPanel';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Ripples from 'react-ripples'


class Popup extends Component {
  render() {
    return (
      <div className="popup2">
        <div className="popup_inner2">
          <h1>{this.props.text}</h1>
            <div className="Create-new-step">
              <div className="group">      
                <input
                  className="Custom-input"
                  type="text" required
                  maxLength='100'
                  onChange={this.props.updateStep}
                />
                <span className="Custom-highlight"></span>
                <span className="Custom-bar"></span>
                <label className="Custom-label">Step</label>
              </div>
              <Ripples>
                <button className="Button-style" onClick={this.props.createStep} disabled={this.props.createDisabled} style={{ height : '30px', width : '100px' }}>
                  Create step
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

class Steps extends Component {

  constructor(props) {
        super(props);
        this.state = {
            toApp: false,
            toApp2: false,
            signOut: false,
            goal: '',
            showProposed: true,
            showInsert: false,
            step: '',
            steps: [],
            votes: [],
            index: 0,
            popUp: false,
            createDisabled: false
        };
        // Arrow functions declared in constructor are the only ones that can be accessed by rendered components
        // and provide access to the current state

        this.toApp2 = () => {
            this.presentApp2();
        };

        console.log(`Steps user, id, and goal: ${this.props.username}, ${this.props.userID}, ${this.props.location.state.goal}`);

        // Until arrow functions, every new function defined its own this value. 
        // This proved to be annoying with an object-oriented style of programming.
        // Arrow functions capture the this value of the enclosing context.
        // Binding a new function to this instance means it can be used by it.
        this.presentApp = this.presentApp.bind(this);
        this.showProposed = this.showProposed.bind(this);
        this.showInsert = this.showInsert.bind(this);
        this.signOut = this.signOut.bind(this);
    }

  componentDidMount() {
        window.scrollTo(0, 0);
        this.setState({ goal: this.props.location.state.goal });
        this.setSteps(this.props.location.state.goal);
        this.setVotes(this.props.location.state.goal);
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

  presentApp() {
    this.setState({ toApp: true });
  }

  // This is one of the methods to be passed as a prop to the Popup component to click out of it from there
  presentPopUp() {
    this.setState({ popUp: !this.state.popUp });
  }

  signOut() {
    localStorage.removeItem('token');
    this.setState({ signOut: true });
  }

  updateStep = (e) => {
        this.setState({
            step: e.target.value
        });
  }

  prepareInsert(index) {
    console.log(`index: ${index}`);
    this.setState({
        index: index
    });
    this.presentPopUp();
  }

  async createStep() {

    this.setState({ createDisabled: true }); 
    setTimeout(() => this.setState({ createDisabled: false }), 5000);

    console.log(`createStep: ${this.state.step}`);
    let stepsIndex;
    let stepsCount = this.state.steps.length;
    if (this.state.index === -1) {
      // At first insert
      if (stepsCount === 0) {
        // Base index is as large as possible for steps to-be-inserted before while having addition space left for steps to-be-inserted after
        // JavaScript numbers allow for 15 digits max, so 2^46 for clean divisions by half before going into decimal between steps for inserts
        // 2^46 also doesn't overflow 15 digits when doubled, which is important because averages between stepsIndexes need to be calculated
        // Also doesn't overflow 20 integer decimals given in table, and has enough addition space left for ~3000 increments of 2^33
        stepsIndex = 70368744177664;
      } else {
        // Can be able to be a decimal value
        stepsIndex = this.state.steps[0].stepsIndex/2;
      }
    } else if (this.state.index === stepsCount - 1) {
      // At last insert
      stepsIndex = this.state.steps[stepsCount - 1].stepsIndex + 8589934592;
    } else {
      // At insert in the middle
      stepsIndex = (this.state.steps[this.state.index].stepsIndex + this.state.steps[this.state.index + 1].stepsIndex)/2;
    }
    console.log(`createStep stepsIndex: ${stepsIndex}`);
    const token = localStorage.getItem('token');
    const prospectiveStep = {
      goal: this.state.goal,
      step: this.state.step,
      username: this.props.username,
      stepsIndex: stepsIndex
    }; 
    console.log(`prospectiveStep: ${prospectiveStep.goal}, ${prospectiveStep.step}, ${prospectiveStep.username}, ${prospectiveStep.stepsIndex}`);
    const createResult = await api.createStep(prospectiveStep, token);
    if (createResult.success === true) {
      console.log(`Success: ${createResult.message}, stepsIndex: ${stepsIndex}`);
      this.setSteps(prospectiveStep.goal);
      this.presentPopUp();
    } else {
      console.log(`Failed: ${createResult.message}`);
      this.notify(createResult.message);
      this.presentPopUp();
    }
  }

  async endorseStep(step, userEndorsed) {
        const token = localStorage.getItem('token');
        const specificStep = {
            userID: this.props.userID,
            goal: this.state.goal,
            step: step,
            endorsed: true
        };
        console.log(`specificStep: ${specificStep.goal}, ${specificStep.step}, ${specificStep.endorsed}`);

        // var is global/function scoped, let is block scoped
        let endorseResult;

        // 0 is opposed, 1 is endorsed, -1 is none
        if (userEndorsed === 1) {
          console.log('negating endorse');
          endorseResult = await api.negateStep(specificStep, token);
        } else if (userEndorsed === 0) {
          console.log('switching endorse');
          endorseResult = await api.switchStep(specificStep, token);
        } else {
          endorseResult = await api.patchStep(specificStep, token);
        }

        if (endorseResult.success === true) {
          console.log(`endorseResult success: ${endorseResult.message}`);
          this.setSteps(this.state.goal)
        } else {
          console.log(`endorseResult failed: ${endorseResult.message}`);
          this.notify(endorseResult.message);
        }
  }

  async opposeStep(step, userEndorsed) {
        const token = localStorage.getItem('token');
        const specificStep = {
            userID: this.props.userID,
            goal: this.state.goal,
            step: step,
            endorsed: false
        };
        console.log(`specificStep: ${specificStep.goal}, ${specificStep.step}, ${specificStep.endorsed}`);

        // var is global/function scoped, let is block scoped
        let opposeResult;

        // 0 is opposed, 1 is endorsed, -1 is none
        if (userEndorsed === 0) {
          console.log('negating oppose');
          opposeResult = await api.negateStep(specificStep, token);
        } else if (userEndorsed === 1) {
          console.log('switching oppose');
          opposeResult = await api.switchStep(specificStep, token);
        } else {
          opposeResult = await api.patchStep(specificStep, token);
        }

        if (opposeResult.success === true) {
          console.log(`opposeResult success: ${opposeResult.message}`);
          this.setSteps(this.state.goal)
        } else {
          console.log(`opposeResult failed: ${opposeResult.message}`);
          this.notify(opposeResult.message);
        }
  }

  presentApp2() {
        this.setState({ toApp2: true });
  }

  async setSteps(goal) {
        const forGoal = {
             goal: goal
        };
        const token = localStorage.getItem('token');
        const steps = await api.getSteps(forGoal, token);
        // Goals is a RowDataPacket of rows that can be subscripted
        // and each one's values are accessed by property ID's
        console.log(`setSteps message: ${steps.message}`);
        if (steps.success === true) {
          console.log(`setSteps: ${steps.data[0]}, ${steps.data[1][0].username}`);
          this.setState({
              steps: steps.data[0]
          });
          console.log(`steps: ${this.state.steps}`);
          this.setVotes(goal);
        } else {
          console.log(`setSteps failed: ${steps.message}`);
          this.notify(steps.message);
        }
  }

  // Retrieves the votes table from database
  async setVotes(goal) {
        const forUser = {
             username: this.props.username,
             goal: goal
        };
        const token = localStorage.getItem('token');
        const votes = await api.getVotes(forUser, token);
        // Votes is a RowDataPacket of rows that can be subscripted
        // and each one's values are accessed by property ID's
        console.log(`setVotes message: ${votes.message}`);
        if (votes.success === true) {
          console.log(`setvotes: ${votes.data}`);

          // Convert to a step:endorsed dictionary
          var votesDictionary = {};
          for (var i = 0; i < votes.data.length; i++) {
            votesDictionary[votes.data[i].step] = votes.data[i].endorsed;
          }

          this.setState({
              votes: votesDictionary
          });
          console.log(`votes: ${this.state.votes}`);
        } else {
          console.log(`setVotes failed: ${votes.message}`);
          this.notify(votes.message);
        }
  }

  async showProposed() {
        this.setState({
              showProposed: !this.state.showProposed
        });
  }

  async showInsert() {
        this.setState({
              showInsert: !this.state.showInsert
        });
  }

  render() {

    if (this.state.toApp === true || this.state.signOut === true) {
      return <Redirect to="/" />
    }

    if (this.state.toApp2 === true) {
      return <Redirect to="/Goals" />
    }

      const { steps } = this.state;
      const { votes } = this.state;

      // Reduce takes a callback with the parameters of accumulator (stepsStatus), currentValue (step), and index (index), {} is the initial value of empty array
      // stepsStatus needed because passing props to Step component needs immediate endorsed status, preferable to dynamically retrieving it in props
      var stepsStatus = steps.reduce(function(stepsStatus, step, index) {

        // If votes object has no key equal to step
        if (!(step.step in votes)) {
          stepsStatus[step.step] = -1;
        } else {
          // Assign endorsed status to step
          stepsStatus[step.step] = votes[step.step];
        }
        return stepsStatus;
      }, {})

      let cards;
      if (steps.length !== 0) {
          
          if (this.state.showProposed === false) {
            const cardsFiltered = steps.filter(function(step) {
              return step.approved === 1;
            });

            // 'step' is the Step data and 'key' is the index in cardsFiltered. 'key' is for React internal use, so also have an 'index' prop
            cards = cardsFiltered.map((step, key) => (
              <Step 
                key={key}
                index={key}
                step={step.step}
                userID={step.username}
                timeStamp={this.formatDate(step.timeStamp)}
                status={step.approved}
                userEndorsed={stepsStatus[step.step]}
                endorse={this.endorseStep.bind(this)}
                oppose={this.opposeStep.bind(this)}
                inserting={this.state.showInsert}
                prepare={this.prepareInsert.bind(this)}
              />
            ));

          } else {

            cards = steps.map((step, key) => (
              <Step 
                key={key}
                index={key}
                step={step.step}
                userID={step.username}
                timeStamp={this.formatDate(step.timeStamp)}
                status={step.approved}
                userEndorsed={stepsStatus[step.step]}
                endorse={this.endorseStep.bind(this)}
                oppose={this.opposeStep.bind(this)}
                inserting={this.state.showInsert}
                prepare={this.prepareInsert.bind(this)}
              />
            ));
          }
      } else {
          cards = (<h1 style={{ fontSize: '3vw' }}>
              There are no steps right now.
          </h1>);
      }

    return (
      <div className="Steps">
        <ToastContainer />
        <header className="Steps-header-overall">
        <header className="Steps-header">  
          <Ripples>
            <button className="Button-style" onClick={this.toApp2} style={{ height : '30px', width : '150px' }}>
              Back to goals
            </button>
          </Ripples>  
          <Ripples>
            <button className="Button-style" onClick={this.signOut} style={{ height : '30px', width : '150px' }}>
              Sign Out
            </button>
          </Ripples>
        </header>
        <header className="Steps-header">
          <Ripples>
            <button className="Button-style" onClick={this.showProposed} style={{ height : '60px', width : '150px' }}>
              Show Unapproved
            </button>
          </Ripples>
          <Ripples>
            <button className="Button-style" onClick={this.showInsert} style={{ height : '60px', width : '150px' }}>
              Insert New Step
            </button>
          </Ripples>
        </header>
        <p style={{ marginTop: '20px', fontSize: '20px', fontFamily: 'Cabin', textAlign: 'center', color: '#FFFFFF', backgroundColor: '#a2f2be' }}>{'Goal:  ' + this.props.location.state.goal}</p>
        <p style={{ marginTop: '0px', fontSize: '20px', fontFamily: 'Cabin', textAlign: 'center', color: '#FFFFFF', backgroundColor: '#a2f2be' }}>{'User:  ' + this.props.username}</p>
        </header>
        {this.state.showInsert ? <img src={require('./assets/insertIcon.png')} alt='Ins' onClick={() => this.prepareInsert(-1)} style={{ position : 'absolute', marginLeft : '30vw', marginTop : '-20px' }} width='100' height='100' /> : null}
        <div className="Steps-list">
          {cards}
        </div>
        {this.state.popUp ? 
          <Popup
            text='Create a Step'
            closePopup={this.presentPopUp.bind(this)}
            updateStep={this.updateStep.bind(this)}
            createStep={this.createStep.bind(this)}
            createDisabled={this.state.createDisabled}
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
export default connect(mapStateToProps, mapDispatchToProps)(Steps);

