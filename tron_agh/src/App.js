import React from 'react';

import './App.css';
import {Route, Switch} from "react-router-dom";

import Game from './components/Game/Game';
import Home from './components/Home/Home';

import logo from './logo.png';

function App() {
  return (
    <div className="App">
        <header>
            <img alt="logo" src={logo}/>
        </header>
      <div className="page-wrapper">
          <Switch>

              <Route exact path='/' component={Home}/>
              <Route exact path='/home' component={Home}/>
              <Route path="/game" component={Game}/>
          </Switch>
      </div>
    </div>
  );
}

export default App;
