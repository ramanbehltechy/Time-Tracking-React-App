import React, { Component } from 'react';
import { HashRouter,Route, Switch } from "react-router-dom";
import './App.css';
import DashBoard from './Dashboard'
import SignIn from './SignIn'
class App extends Component {
  render() {
    return (
      <HashRouter>
      <Switch>
        <Route  exact path="/" component={SignIn} />
        <Route  path="/dashboard" component={DashBoard} />
      </Switch>
      
      </HashRouter>
    );
  }
}

export default App;
