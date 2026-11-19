import { Amplify } from 'aws-amplify';

import amplifyconfig from './amplifyconfiguration.js';
Amplify.configure(amplifyconfig);

/* @refresh reload */
import { render } from '@solidjs/web';

import App from './App.jsx';

render(() => <App />, document.getElementById('root') as HTMLElement);
