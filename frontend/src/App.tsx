import React from 'react';
import Navbar from './Navbar';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import UserProfile from './user/UserProfile';
import ExternalUserProfile from './user/ExternalUserProfile';
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


const App = () => {

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
            {/* Perfil del usuario propio */}
            <Route exact path="/cuenta">
              <UserProfile />
            </Route>
            {/* Perfil de otro usuario */}
            <Route exact path="/perfil/:id">
              <ExternalUserProfile />
            </Route>
            {/* Página del administrador */}
            <Route exact path="/admin">
              <AdminPage />
            </Route>
            {/* Estadisticas COVID (página principal) */}
            <Route exact path="/">
              <Redirect to="/estadisticas" />
            </Route>
            <Route exact path="/estadisticas">
              <EstadisticasCovid />
            </Route>
            {/* Vista detallada de post */}
            <Route exact path="/postDetalle/:id">
              <PostDetalle />
            </Route>
            {/* Vista detallada de peticion */}
            <Route exact path="/peticionDetalle/:id">
              <PeticionDetalle />
            </Route>
            {/* Foro */}
            <Route exact path="/foro">
              <PostList />
            </Route>
            {/* Ayuda */}
            <Route exact path="/peticionesayuda">
              <PetitionList />
            </Route>
            {/* Creación de posts */}
            <Route exact path="/createPost">
              <CreatePost />
            </Route>
            {/* Creación de peticiones */}
            <Route exact path="/createPetition">
              <CreatePetition />
            </Route>
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