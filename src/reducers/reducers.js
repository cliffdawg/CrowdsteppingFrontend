let defaultState = {
	username: localStorage.getItem('username') || 'No Username',
	userID: localStorage.getItem('userID') || 'No UserID',
	origin: localStorage.getItem('origin') || 'No Origin',
}

// This returns a changed store based on received action
const reducers = (state = defaultState, action) => {
	switch(action.type) {
		case 'UPDATE-USERNAME':
		 localStorage.setItem('username', action.payload);
		 return {
		 	...state,
		 	username: action.payload
		 }
		 case 'UPDATE-USERID':
		 localStorage.setItem('userID', action.payload);
		 return {
		 	...state,
		 	userID: action.payload
		 }
		 case 'UPDATE-ORIGIN':
		 localStorage.setItem('origin', action.payload);
		 return {
		 	...state,
		 	origin: action.payload
		 }
		 default: return state;
	}
}

export default reducers;