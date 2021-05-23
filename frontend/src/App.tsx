import React from 'react';
import Navbar from './Navbar';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import UserProfile from './user/UserProfile';
import AdminPage from './user/AdminPage/AdminPage';
import EstadisticasCovid from './estadisticas/EstadisticasCovid';
import Login from './auth/Login';
import Register from './auth/Register';
import PostList from './posts/PostList';
import PetitionList from './petitions/PetitionList';
import CreatePost from './posts/CreatePost';
import CreatePetition from './petitions/CreatePetition';
import PostDetalle from './posts/PostDetalle';
import PeticionDetalle from './petitions/PeticionDetalle';
import NotFoundComponent from './NotFoundComponent';
import useToken from './auth/Token/useToken';
import PrivateRoute from './PrivateRoute';
import AuthenticationRoute from './AuthenticationRoute';


const App = () => {

  return (
    <Router>
      <Switch>
        {/* Login page */}
        {/* Se dejan fuera para evitar la Navbar */}
        <AuthenticationRoute path="/login" Component={Login}></AuthenticationRoute>
        <AuthenticationRoute path="/register" Component={Register}></AuthenticationRoute>
        <div>
          <Navbar />
          <div className="container">
            {/* Perfil del usuario propio */}
            <PrivateRoute path="/cuenta" Component={UserProfile} ></PrivateRoute>
            {/* Página del administrador */}
            <PrivateRoute path="/admin" Component={AdminPage} ></PrivateRoute>
            {/* Estadisticas COVID (página principal) */}
            <Route exact path="/">
              <Redirect to="/estadisticas" />
            </Route>
            <PrivateRoute path="/estadisticas" Component={EstadisticasCovid} ></PrivateRoute>
            {/* Vista detallada de post */}
            <PrivateRoute path="/postDetalle/:id" Component={PostDetalle} ></PrivateRoute>
            {/* Vista detallada de peticion */}
            <PrivateRoute path="/peticionDetalle/:id" Component={PeticionDetalle} ></PrivateRoute>
            {/* Foro */}
            <PrivateRoute path="/foro" Component={PostList} ></PrivateRoute>
            {/* Ayuda */}
            <PrivateRoute path="/peticionesayuda" Component={PetitionList} ></PrivateRoute>
            {/* Creación de posts */}
            <PrivateRoute path="/createPost" Component={CreatePost} ></PrivateRoute>
            {/* Creación de peticiones */}
            <PrivateRoute path="/createPetition" Component={CreatePetition} ></PrivateRoute>
            {/* Error */}
            <Route exact path="/error">
              <NotFoundComponent />
            </Route>
            {/* <Redirect to="/error" /> */}
          </div>
        </div>
      </Switch>
    </Router>
  );
}

export default App;