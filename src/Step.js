import './Step.css'
import Ripples from 'react-ripples'
import React, { useState } from 'react';

// Setting style inline has format of thisProperty, setting in CSS file has format of this-property
// This is a function component, a component that doesn't require state or lifecycle
const Step = ({index, step, userID, timeStamp, status, userEndorsed, endorse, oppose, inserting, prepare}) => {

	// Hooks are functions that let us hook into the React state and lifecycle features
	// useState is a Hook that lets you add React state to function components
	// 'disabled' is a new state variable preserved between re-renders and 'setDisabled' is the function to update it
	const [disabled, setDisabled] = useState(false);

	return (

	<div className="step" style={{ marginLeft : status ? 0 : 140, background : status ? 'rgb(5,93,177)' : 'rgb(56,46,107)', 
		background : status ? 'radial-gradient(circle, rgba(5,93,177,1) 30%, rgba(0,212,255,1) 90%, rgba(255,255,255,1) 100%)' : 'radial-gradient(circle, rgba(56,46,107,1) 30%, rgba(104,21,255,1) 90%, rgba(255,255,255,1) 100%)' }} >
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
				<button onClick={() => { endorse(step, userEndorsed); setDisabled(true); setTimeout(() => setDisabled(false), 4000); }} 
					disabled={disabled} style={{ color : (userEndorsed === 1) ? '#FFFFFF' : '#8E62BD', fontSize : 15, fontFamily : 'Josefin Sans', border : 0, borderRadius : '10px', backgroundColor: (userEndorsed === 1) ? '#FF1493' : '#FFFFFF', height : '30px', width : '100px' }}>
           			Endorse
         		</button>
         	</Ripples>
         	<Ripples>
          		<button onClick={() => { oppose(step, userEndorsed); setDisabled(true); setTimeout(() => setDisabled(false), 4000); }} 
          			disabled={disabled} style={{ color : (userEndorsed === 0) ? '#FFFFFF' : '#8E62BD', fontSize : 15, fontFamily : 'Josefin Sans', border : 0, borderRadius : '10px', backgroundColor: (userEndorsed === 0) ? '#FF1493' : '#FFFFFF', height : '30px', width : '100px' }}>
            		Oppose 
          		</button>
          	</Ripples>
		</div>

		{inserting ? <img src={require('./assets/insertIcon.png')} alt='Ins' onClick={() => prepare(index)} style={{ position : 'absolute', marginLeft : status ? '34vw' : '28.5vw', marginTop : '80px' }} width='100' height='100' /> : null}

	</div>
	);

}

export default Step;