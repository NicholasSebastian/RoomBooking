import React from 'react';
import ReactDOM from 'react-dom';
import { createGlobalStyle } from 'styled-components';
import App from './App';

// eslint-disable-next-line no-extend-native
Date.prototype.toJSON = function () {
  const timezoneOffsetInHours = -(this.getTimezoneOffset() / 60);
  const sign = timezoneOffsetInHours >= 0 ? '+' : '-';
  const leadingZero = (Math.abs(timezoneOffsetInHours) < 10) ? '0' : '';

  const correctedDate = new Date(this.getTime());
  correctedDate.setHours(this.getHours() + timezoneOffsetInHours);
  const iso = correctedDate.toISOString().replace('Z', '');

  return iso + sign + leadingZero + Math.abs(timezoneOffsetInHours).toString() + ':00';
}

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  * {
    box-sizing: border-box;
    color: #222323;
    font-family: 'Roboto Condensed', sans-serif;
  }
`;

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyle />
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);