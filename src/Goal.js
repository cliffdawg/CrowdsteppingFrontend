import React from 'react';
import './Goal.css'

const Goal = ({title, userID, timeStamp, event}) => (
	<div className='goal' onClick={() => event(title)}>
		<div className='goal-title'>
			<label>
            	{title}
          	</label>
		</div>
		<div className='goal-identifiers'>
			<div>
				{userID}
			</div>
			<div>
				{timeStamp}
			</div>
		</div>
	</div>
);

export default Goal;