import React from 'react';
import ReactDOM from 'react-dom';

const title = 'My super React Webpack Babel Setup';
const app = document.getElementById('app');

ReactDOM.render(<div>{title}</div>, app);

module.hot.accept();
