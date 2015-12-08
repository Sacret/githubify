'use strict';

import React from 'react';
import { render } from 'react-dom';
import { Router, Route } from 'react-router';
//
import MainPage from '../pages/MainPage';

render((
  <Router>
    <Route path="/"         component={MainPage} />
  </Router>
), document.getElementById('content'));
