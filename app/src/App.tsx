import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Sprint from './components/Sprint';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/sprints/:sprintId/">
          <Sprint />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
