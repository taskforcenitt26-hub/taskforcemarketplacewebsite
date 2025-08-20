// Importing the React library to build UI components
import React from 'react';

// Importing ReactDOM, which is responsible for rendering React components into the actual DOM (browser's HTML)
import ReactDOM from 'react-dom/client';

// Importing the CSS file for global styles (this will apply styles to the whole app)
import './index.css';

// Importing the main App component (the root component of your React application)
import App from './App';

// Creating a root DOM node where the React app will be rendered.
// "document.getElementById('root')" finds the <div id="root"></div> in your index.html
const root = ReactDOM.createRoot(document.getElementById('root'));

// Rendering the App component inside React.StrictMode.
// StrictMode helps highlight potential problems in your React app during development.
// The <App /> component will be injected inside the <div id="root"></div> in the HTML.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
