import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Main from './pages/Main';
import Repo from './pages/Repo';
export default function Router(){
  return(
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Main} />
        <Route exact path="/repo/:name" component={Repo} />
      </Switch>
    </BrowserRouter>
  )
}