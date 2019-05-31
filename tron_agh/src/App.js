import React from 'react';

import './App.css';
import {Route, Switch, Link} from "react-router-dom";

import Game from './components/Game/Game';
import Home from './components/Home/Home';
import Rooms from './components/Rooms/Rooms';
import Results from './components/Results/Results';
import Credits from './components/Credits/Credits';

import logo from './logo.png';
import LoginPage from "./components/LoginPage/LoginPage";

function App() {
  return (
    <div className="App">
        <header>
            <Link to="/home">
              <img alt="logo" src={logo}/>
            </Link>
        </header>
      <div className="page-wrapper">
          <Switch>
              <Route exact path='/' component={LoginPage}/>
              <Route exact path='/home' component={Home}/>
              <Route exact path='/results' component={Results}/>
              <Route path="/rooms" component={Rooms}/>
              <Route path="/game" component={Game}/>
              <Route path="/credits" component={Credits}/>
          </Switch>
      </div>
    </div>
  );
}

export default App;
