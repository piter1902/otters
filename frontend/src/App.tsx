import React from 'react';
import Navbar from './Navbar';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';


const App = () => (
  <Router>
    <div>
      <Navbar />
      <div className="container">
        <Switch>
          <Route exact path="/">
            <p className="display-2">Hola mundo</p>
          </Route>
        </Switch>
      </div>
    </div>
  </Router>
)

export default App;
