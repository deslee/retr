import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Sprint from './components/Sprint';
import LandingPage from './components/LandingPage';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/sprints/:sprintId/">
          <Sprint />
        </Route>
        <Route>
          <LandingPage />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
