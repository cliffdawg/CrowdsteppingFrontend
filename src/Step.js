import React, { useState } from 'react';
import './Step.css'
import Ripples from 'react-ripples'

// Setting style inline has format of thisProperty, setting in CSS file has format of this-property
// This is a function component, a component that doesn't require state or lifecycle
const Step = ({index, step, userID, timeStamp, status, userEndorsed, endorse, oppose, prepare}) => {

	// Hooks are functions that let us hook into the React state and lifecycle features
	// useState is a Hook that lets you add React state to function components
	// 'disabled' is a new state variable preserved between re-renders and 'setDisabled' is the function to update it
	const [disabled, setDisabled] = useState(false);

	return (

	<div className="step" style={{ marginLeft : status ? 0 : 140, backgroundColor : status ? 'blue' : 'green' }} >
		<div className="step-info">
			<div className="step-title">
				<label>
	            	{step}
	          	</label>
			</div>
			<div className="step-identifiers">
				<div>
					{userID}
				</div>
				<div>
					{timeStamp}
				</div>
			</div>
		</div>
		<div className="step-buttons">
			<Ripples>
				<button className="Button-style" onClick={() => { endorse(step, userEndorsed); setDisabled(true); setTimeout(() => setDisabled(false), 4000); }} 
					disabled={disabled} style={{ border : 0, borderRadius : '10px', backgroundColor: (userEndorsed === 1) ? '#FF1493' : '#FFFFFF', height : '30px', width : '100px' }}>
           			Endorse
         		</button>
         	</Ripples>
         	<Ripples>
          		<button className="Button-style" onClick={() => { oppose(step, userEndorsed); setDisabled(true); setTimeout(() => setDisabled(false), 4000); }} 
          			disabled={disabled} style={{ border : 0, borderRadius : '10px', backgroundColor: (userEndorsed === 0) ? '#FF1493' : '#FFFFFF', height : '30px', width : '100px' }}>
            		Oppose 
          		</button>
          	</Ripples>
		</div>

		<img src={require('./assets/insertIcon.png')} alt='Ins' onClick={() => prepare(index)} style={{ position : 'absolute', marginLeft : status ? '35vw' : '29.5vw', marginTop : '80px' }} width='128' height='128' />

	</div>
);

}

export default Step;