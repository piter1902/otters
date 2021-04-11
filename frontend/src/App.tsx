import React from 'react';
import Navbar from './Navbar';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import EstadisticasCovid from './estadisticas/EstadisticasCovid';


const App = () => (
  <Router>
    <div>
      <Navbar />
      <div className="container">
        <Switch>
          <Route exact path="/">
            <p className="display-2">Hola mundo</p>
          </Route>
          {/* Estadisticas COVID */}
          <Route exact path="/estadisticas">
            <EstadisticasCovid />
          </Route>
        </Switch>
      </div>
    </div>
  </Router>
)

export default App;
