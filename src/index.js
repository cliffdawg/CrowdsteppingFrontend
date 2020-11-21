import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './store/store.js';
import { BrowserRouter, Switch } from 'react-router-dom'
import Route from 'react-router-dom/Route'
import './index.css';
import App from './App';
import App2 from './App2';
import Steps from './Steps';
import * as serviceWorker from './serviceWorker';

//ReactDOM.render(<App />, document.getElementById('root'));

// This is how to update the DOM with new pages at these routes
// For Redux, wrap the whole app in the store
ReactDOM.render(
	<Provider store={store}>
		<BrowserRouter>
		<div>
			<Switch>
				<Route exact path="/" component={App} />
				<Route path="/App2" component={App2} />
				<Route path="/Steps" component={Steps} />
			</Switch>
		</div>
		</BrowserRouter>
	</Provider>, 
	document.getElementById('root'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

// Link to backend with proxy in package.json