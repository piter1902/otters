import React from 'react';
import Navbar from './Navbar';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import UserProfile from './user/UserProfile';


const App = () => (
  <Router>
    <div>
      <Navbar />
      <div className="container">
        <Switch>
          <Route exact path="/">
            <p className="display-2">Hola mundo</p>
          </Route>
          {/* Perfil del usuario propio */}
          <Route exact path="/cuenta">
            <UserProfile />
          </Route>
        </Switch>
      </div>
    </div>
  </Router>
)

export default App;
