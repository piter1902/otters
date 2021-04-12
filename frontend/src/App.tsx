import React from 'react';
import Navbar from './Navbar';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import UserProfile from './user/UserProfile';
import AdminPage from './user/AdminPage';
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
          {/* Perfil del usuario propio */}
          <Route exact path="/cuenta">
            <UserProfile />
          </Route>
          {/* Página del administrador */}
          <Route exact path="/admin">
            <AdminPage />
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
