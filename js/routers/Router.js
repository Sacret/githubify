'use strict';

import React from 'react';
import { render } from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';
//
import LoginPage from '../pages/LoginPage';
import MainPage from '../pages/MainPage';

render((
  <Router history={hashHistory}>
    <Route path="/"      component={LoginPage} />
    <Route path=":uname" component={MainPage} />
  </Router>
), document.getElementById('content'));
