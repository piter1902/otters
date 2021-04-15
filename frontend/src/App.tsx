import React from 'react';
import Navbar from './Navbar';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import UserProfile from './user/UserProfile';
import AdminPage from './user/AdminPage';
import EstadisticasCovid from './estadisticas/EstadisticasCovid';
import PostList from './posts/PostList';
import PetitionList from './petitions/PetitionList';
import CreatePost from './posts/CreatePost';



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
          </Route>
          {/* Estadisticas COVID */}
          <Route exact path="/estadisticas">
            <EstadisticasCovid />
          </Route>
          {/* Foro */}
          <Route exact path="/foro">
            <PostList />
          </Route>
          {/* Ayuda */}
          <Route exact path="/peticionesayuda">
            <PetitionList />
          </Route>
          <Route exact path="/createPost">
            <CreatePost />
          </Route>
        </Switch>
      </div>
    </div>
  </Router>
)

export default App;