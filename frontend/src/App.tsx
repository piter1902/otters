import React, { useState } from 'react';
import Navbar from './Navbar';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import UserProfile from './user/UserProfile';
import AdminPage from './user/AdminPage';
import EstadisticasCovid from './estadisticas/EstadisticasCovid';
import Login from './login/Login';
import Register from './login/Register';


function App() {
  const [token, setToken] = useState();

  return (
    <Router>
      <Switch>
        {/* Login page */}
        {/* Se dejan fuera para evitar la Navbar */}
        <Route exact path="/login">
          <Login></Login>
        </Route>
        <Route exact path="/register">
          <Register></Register>
        </Route>
        <div>
          <Navbar />
          <div className="container">
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
            </Route>
            {/* Estadisticas COVID */}
            <Route exact path="/estadisticas">
              <EstadisticasCovid />
            </Route>

          </div>
        </div>
      </Switch>
    </Router>
  );
}

export default App;
