import {
  IonContent, IonPage,
  IonHeader, IonToolbar,
  IonTitle, IonButtons, IonIcon,
  IonButton, IonList, IonItem,
  IonLabel, IonInput, IonSelect,
  IonSelectOption, IonBackButton
} from '@ionic/react';
import {
  arrowBackOutline
} from 'ionicons/icons';
import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
//import './Home.css';
import { url, prepararPost, saltingCode } from '../utilities/utilities.js';
import Swal from 'sweetalert2'
import { MD5 } from '../utilities/crypto.js';

class UsuarioCrear extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: url(),
      tipo_usuario: 2,
      saltingCode: saltingCode,
      sending: false,
    }
  }

  opcionSeleccionadaTipoUsuario = (e) => {
    let tipo_usuario = e.target.value;
    this.setState({ tipo_usuario: tipo_usuario });
  }

  registrarUsuario = () => {
    var nombre = document.getElementById('nombre').value;
    var usuario = document.getElementById('usuario').value;
    var clave = document.getElementById('clave').value;
    var repetir_clave = document.getElementById('repetir_clave').value;
    var saltingCode = this.state.saltingCode;
    var tipo_usuario = this.state.tipo_usuario;
    var fec_ing = "NOW()";
    var user_data = JSON.parse(localStorage.getItem('userData'));
    
    if (clave == repetir_clave) {

      let Parameters = '?action=getJSON&get=verificar_usuario_existe&usr=' + usuario;

      fetch(this.state.url + Parameters)
        .then((res) => res.json())
        .then((responseJson) => {
          if (responseJson.length > 0) {
            Swal.fire({
              title: 'Usuario ya existe',
              text: 'El usuario de acceso ya existe, favor elija otro usuario.',
              icon: 'error',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: 'red'
            });
          } else {
            this.setState({ sending: true });

            var values = {
              nombre: nombre, usuario: usuario, clave: MD5(clave + saltingCode),
              tipo: tipo_usuario, fec_ing: fec_ing, usr_ing: user_data[0].usuario
            }

            const requestOptions = prepararPost(values, "usuarios", "setJsons", "jsonSingle");

            fetch(this.state.url, requestOptions)
              .then((response) => {
                if (response.status === 200) {
                  Swal.close();
                  
                  this.setState({
                    sending: false
                  });
                  
                  Swal.fire({
                    title: '¡Éxito!',
                    text: 'El usuario se ha creado correctamente',
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: 'lightseagreen'
                  });
                }
              })
          }
        })

    } else {
      Swal.fire({
        title: 'Algo falló',
        text: 'Las contraseñas no coinciden.',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: 'yellow'
      });
    }

  }

  render() {

    if (this.state.sending) {
      return <div>
        { Swal.showLoading() }
      </div>
    }

    return (
      <IonPage>
        <IonContent>
          <IonHeader style={{ textAlign: "right" }}>
            <IonToolbar>

              <IonButtons slot="start">
                <IonBackButton defaultHref="/usuarios" icon={arrowBackOutline} />
              </IonButtons>

              <IonTitle style={{ fontFamily: "sans-serif" }}><b>CREAR USUARIO</b></IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonList>
            <IonItem>
              <IonLabel>Nombre:</IonLabel>
              <IonInput id="nombre" type="text" placeholder="Nombre del usuario"></IonInput>
            </IonItem>

            <IonItem>
              <IonLabel>Usuario:</IonLabel>
              <IonInput id="usuario" type="text" placeholder="Usuario"></IonInput>
            </IonItem>

            <IonItem>
              <IonLabel>Clave:</IonLabel>
              <IonInput id="clave" type="password" placeholder="Clave"></IonInput>
            </IonItem>

            <IonItem>
              <IonLabel>Rescriba la clave:</IonLabel>
              <IonInput id="repetir_clave" type="password" placeholder="Rescriba la clave"></IonInput>
            </IonItem>

            <IonItem>
              <IonLabel>Tipo de Usuario</IonLabel>
              <IonSelect okText="Aceptar" cancelText="Cancelar" onIonChange={(e) => this.opcionSeleccionadaTipoUsuario(e)} placeholder="Vendedor" interface="action-sheet">
                <IonSelectOption value="2">Vendedor</IonSelectOption>
                <IonSelectOption value="1">Administrador</IonSelectOption>
              </IonSelect>
            </IonItem>
            <IonButton expand="block" onClick={() => this.registrarUsuario()}>Registrar Producto</IonButton>
          </IonList>

        </IonContent>
      </IonPage >
    )
  }
}

export default UsuarioCrear;
