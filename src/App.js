import React from 'react';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import { Route, Redirect } from 'react-router-dom'
import Login from './pages/Login.js'
import Home from './pages/Home.js'
import Factura from './pages/Factura'
import Inventario from './pages/Inventario';
import MatriculaProductos from './pages/MatriculaProductos'
import EditarInfoProductos from './pages/EditarInfoProductos'
import ControlStock from './pages/ControlStock';
import Usuarios from './pages/Usuarios';
import UsuariosLista from './pages/UsuariosLista';
import UsuarioCrear from './pages/UsuarioCrear';

function App(props) {

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/login" component={Login} exact />
          <Route path="/home" component={Home} exact />
          <Route path="/factura" component={Factura} exact />
          <Route path="/inventario" component={Inventario} exact />
          <Route path="/matricula-productos" component={MatriculaProductos} exact />
          <Route path="/editar-info-productos" component={EditarInfoProductos} exact />
          <Route path="/control-stock" component={ControlStock} exact />
          <Route path="/usuarios" component={Usuarios} exact />
          <Route path="/usuarios-lista" component={UsuariosLista} exact />
          <Route path="/usuario-crear" component={UsuarioCrear} exact />
          
          <Redirect to="/login" />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
}

export default App;