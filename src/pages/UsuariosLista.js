import {
  IonContent, IonPage,
  IonHeader, IonToolbar,
  IonTitle, IonButtons,
  IonBackButton, IonList,
  IonItem, IonLabel, IonSelect,
  IonSelectOption, IonButton, IonInput
} from '@ionic/react';
import {
  arrowBackOutline
} from 'ionicons/icons';
import React, { Component } from 'react'
import { saltingCode, prepararPost, url } from '../utilities/utilities.js';
import { Redirect } from 'react-router-dom'
//import './Home.css';
import Swal from 'sweetalert2'
import { MD5 } from '../utilities/crypto.js';

class UsuariosLista extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: url(),
      usuarios: [],
      usuario_data: [],
      loading_usuarios: false,
      activo: 1
    }
  }

  UNSAFE_componentWillMount() {
    this.getUsuarios();
  }

  getUsuarios = () => {

    this.setState({ loading_usuarios: true });

    let Parameters = '?action=getJSON&get=usuarios';

    fetch(this.state.url + Parameters)
      .then((res) => res.json())
      .then((responseJson) => {

        this.setState({
          usuarios: responseJson,
          loading_usuarios: false,
        });

        Swal.close();
      })
      .catch((error) => {
        console.log(error)
      });
  }

  getUsuarioSeleccionado = (e) => {
    let usuario_id = JSON.stringify(parseInt(e.target.value.id));

    let Parameters = '?action=getJSON&get=usuario_data&id_usr=' + usuario_id;

    fetch(this.state.url + Parameters)
      .then((res) => res.json())
      .then((responseJson) => {
        if (responseJson.length > 0) {
          console.log(JSON.stringify(responseJson));
          this.setState({
            usuario_data: responseJson,
            activo: JSON.stringify(parseInt(responseJson[0].activo))
          })
        } else {
          alert("Ocurrió un error al recuperar los datos.")
        }
      });
  }

  editarInfoUsuario = (id) => {
    let input = document.getElementById(id);

    input.readonly = false;
    input.focus();
  }

  modificarUsuario = () => {
    Swal.showLoading();
    //Modificar información de un usuario

    var id = document.getElementById('id').value;
    var nombre = document.getElementById('nombre').value;
    //var usuario = document.getElementById('usuario').value;
    var clave = document.getElementById('clave').value;
    var clave_hidden = document.getElementById('clave_hidden').value;
    var activo = document.getElementById('activo').value;
    var fec_act = "NOW()";
    var user_data = JSON.parse(localStorage.getItem('userData'));

    clave = (clave.length > 0) ? MD5(clave + saltingCode) : clave_hidden;

    var valuesUsuario = {
      id: id, nombre: nombre, clave: clave,
      activo: activo, fec_act: fec_act, usr_act: user_data[0].usuario
    }

    const requestOptionsUsuario = prepararPost(valuesUsuario, "update_usuario", "updateJsons", "jsonSingle");

    fetch(this.state.url, requestOptionsUsuario)
      .then((response) => {
        if (response.status === 200) {
          Swal.fire({
            title: '¡Éxito!',
            text: 'Información del usuario actualizada correctamente',
            icon: 'success',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: 'lightseagreen'
          });
        }
      })
      .catch((error) => {
        console.log("ERROR: " + error)
      });
  }

  render() {

    if (this.state.loading_usuarios) {
      return <h1>
        {Swal.showLoading()}
      </h1>;
    }

    const customActionSheetOptions = {
      header: 'Seleccione un usuario',
      subHeader: 'Usuarios:'
    };

    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/usuarios" icon={arrowBackOutline} />
              <IonTitle><b>Lista de usuarios</b></IonTitle>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <IonContent>

          <IonList>
            <IonItem>
              <IonLabel>Seleccione producto:</IonLabel>
              <IonSelect onIonChange={(e) => this.getUsuarioSeleccionado(e)} interface="action-sheet" interfaceOptions={customActionSheetOptions} cancelText="Cerrar lista">
                {
                  this.state.usuarios.map((item) => {
                    return (
                      <IonSelectOption value={item} key={item.id}>{item.nombre + " (" + item.tipo + ")"}</IonSelectOption>
                    )
                  })
                }
              </IonSelect>
            </IonItem>

            {
              this.state.usuario_data.length > 0 ?

                this.state.usuario_data.map((item) => {
                  return (
                    <div>
                      <IonInput type="hidden" id="id" value={ item.id }></IonInput>
                      <IonItem style={{ fontSize: "14px" }}>
                        <IonLabel>Nombre:</IonLabel>
                      </IonItem>
                      <IonItem>
                        <IonInput type="text" id="nombre" value={item.nombre} key={ item.id } readonly></IonInput>
                        <IonButton onClick={() => this.editarInfoUsuario('nombre')}>Editar</IonButton>
                      </IonItem>
                      <IonItem style={{ fontSize: "14px" }}>
                        <IonLabel>Usuario:</IonLabel>
                      </IonItem>
                      <IonItem>
                        <IonInput type="text" id="usuario" value={item.usuario}  readonly></IonInput>
                        <IonButton onClick={() => this.editarInfoUsuario('usuario')}>Editar</IonButton>
                      </IonItem>

                      <IonInput type="hidden" id="clave_hidden" value={item.clave} ></IonInput>
                      <IonItem style={{ fontSize: "14px" }}>
                        <IonLabel>Clave:</IonLabel>
                      </IonItem>
                      <IonItem>
                        <IonInput type="password" id="clave" readonly></IonInput>
                        <IonButton onClick={() => this.editarInfoUsuario('clave')}>Editar</IonButton>
                      </IonItem>

                      <IonItem style={{ fontSize: "14px" }}>
                        <IonLabel>Tipo:</IonLabel>
                      </IonItem>
                      <IonItem>
                        <IonInput type="text" id="tipo" value={item.tipo} ></IonInput>
                      </IonItem>

                      <IonItem style={{ fontSize: "14px" }}>
                        <IonLabel>Fecha Ingresa:</IonLabel>
                      </IonItem>
                      <IonItem>
                        <IonInput type="text" id="fecha_ingresa" value={item.fecha_ingresa} readonly></IonInput>
                      </IonItem>

                      <IonItem style={{ fontSize: "14px" }}>
                        <IonLabel>Usuario Ingresa:</IonLabel>
                      </IonItem>
                      <IonItem>
                        <IonInput type="text" id="usuario_ingresa" value={item.usuario_ingresa} readonly></IonInput>
                      </IonItem>

                      <IonItem>
                        <IonLabel>¿Activo?</IonLabel>
                        <IonSelect okText="Aceptar" id="activo" value={item.activo} cancelText="Cancelar" placeholder={item.activo == 1 ? 'Activo' : 'Inactivo'} interface="action-sheet">
                          <IonSelectOption value="1">Activo</IonSelectOption>
                          <IonSelectOption value="0">Inactivo</IonSelectOption>
                        </IonSelect>
                      </IonItem>

                      <IonButton expand="block" onClick={() => this.modificarUsuario()}>Guardar cambios</IonButton>
                    </div>
                  )
                })
                : ''
            }
          </IonList>
        </IonContent>
      </IonPage>
    )
  }
}

export default UsuariosLista;
