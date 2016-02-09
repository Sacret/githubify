'use strict';

import React from 'react';
import { render } from 'react-dom';
import { Router, Route } from 'react-router';
//
import LoginPage from '../pages/LoginPage';
import MainPage from '../pages/MainPage';
//
import History from '../history/History';

render((
  <Router history={History}>
    <Route path="/"      component={LoginPage} />
    <Route path=":uname" component={MainPage} />
  </Router>
), document.getElementById('content'));
