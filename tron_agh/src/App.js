import React from 'react';

import Menu from './components/Menu/Menu';
import Banner from './components/Banner/Banner'

import './App.css';
import {Route, Switch} from "react-router-dom";

import Game from './components/Game/Game';

import logo from './logo.png';

function App() {
  return (
    <div className="">

          <Switch>

              <Route exact path='/' component={Menu}/>
              <Route exact path='/home' component={Menu}/>
              <Route to="/game" component={Game}/>
          </Switch>

    </div>
  );
}

export default App;
