import {
  IonContent, IonPage,
  IonHeader, IonToolbar, IonButtons,
  IonBackButton, IonList, IonItem, IonLabel,
  IonSelect, IonSelectOption, IonInput, IonButton
} from '@ionic/react';
import { Component } from 'react'
import { Redirect } from 'react-router-dom'
import {
  arrowBackOutline
} from 'ionicons/icons';

import { url, prepararPost } from '../utilities/utilities.js';
import { connect } from 'react-redux'
import { getProductos } from '../actions/productosAction'
import Swal from 'sweetalert2'

const mapStateToProps = store => ({
  productos: store.productos
});

class EditarInfoProductos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: url(),
      loading_productos: false,
      productos: [],
      producto_data: [],
      aplica_isv: 1,
      activo: 1
    }
  }

  getProductos = () => {

    this.setState({ loading_productos: true });

    let Parameters = '?action=getJSON&get=productos';

    fetch(this.state.url + Parameters)
      .then((res) => res.json())
      .then((responseJson) => {
        
        //Guardamos la lista de productos que vienen del API en el store de Redux
        this.props.dispatch(getProductos(responseJson))

        this.setState({
          loading_productos: false,
          productos: this.props.productos.list
        });

        Swal.close();
      })
      .catch((error) => {
        console.log(error)
      });
  }

  UNSAFE_componentWillMount() {
    this.getProductos();
  }

  getProductoSeleccionado = (e) => {
    let producto_id = JSON.stringify(parseInt(e.target.value.id));

    let Parameters = '?action=getJSON&get=producto_data&id_prd=' + producto_id;

    fetch(this.state.url + Parameters)
      .then((res) => res.json())
      .then((responseJson) => {
        if (responseJson.length > 0) {
          console.log(JSON.stringify(responseJson));
          this.setState({
            producto_data: responseJson,
            aplica_isv: JSON.stringify(parseInt(responseJson[0].aplica_isv)),
            activo: JSON.stringify(parseInt(responseJson[0].activo))
          })
        } else {
          alert("Ocurrió un error al recuperar los datos")
        }
      })
  }

  editarInfoProducto = (id) => {
    let input = document.getElementById(id);

    input.readonly = false;
    input.focus();
  }

  modificarProducto = () => {
    Swal.showLoading();
    //Modificar propiedades del producto
    let id = document.getElementById("id").value;
    let barra = document.getElementById("barra").value;
    let nombre = document.getElementById("nombre").value;
    let precio = document.getElementById("precio").value;
    let aplica_isv = document.getElementById("aplica_isv").value;
    let activo = document.getElementById("activo").value;
    let fec_act = "NOW()";
    let usr_act = "admin";
    
    nombre = nombre.replace("'", "\\'");
    nombre = nombre.replace(", ", ",");

    var values = {
      id: id, nombre: nombre, aplica_isv: aplica_isv, activo: activo,
      fec_act: fec_act, usr_act: usr_act
    }

    const requestOptions = prepararPost(values, "update_producto", "updateJsons", "jsonSingle");

    fetch(this.state.url, requestOptions)
      .then((response) => {
        if (response.status === 200) {
          console.log("Información de producto actualizada correctamente.")
        }
      })
      .catch((error) => {
        console.log("ERROR: " + error)
      });

    //Modificar precio del producto
    var valuesPrdPrecio = {
      producto_barra: barra, precio: precio,
      fec_act: fec_act
    }

    const requestOptionsProductoPrecio = prepararPost(valuesPrdPrecio, "update_producto_precio", "updateJsons", "jsonSingle");

    fetch(this.state.url, requestOptionsProductoPrecio)
      .then((response) => {
        if (response.status === 200) {
          Swal.fire({
            title: '¡Éxito!',
            text: 'Información del producto actualizada correctamente',
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

    if (this.state.loading_productos) {
      return <h1>
        { Swal.showLoading() }
      </h1>;
    }

    const customActionSheetOptions = {
      header: 'Seleccione un producto',
      subHeader: 'Productos:'
    };

    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/inventario" icon={arrowBackOutline} />
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <h4 style={{ textAlign: "center" }}>EDITAR INFO DE PRODUCTO</h4>
          <IonList>
            <IonItem>
              <IonLabel>Seleccione producto:</IonLabel>
              <IonSelect onIonChange={(e) => this.getProductoSeleccionado(e)} interface="action-sheet" interfaceOptions={customActionSheetOptions} cancelText="Cerrar lista">
                {
                  this.state.productos.map((item) => {
                    return (
                      <IonSelectOption value={item} key={item.id}>{item.nombre}</IonSelectOption>
                    )
                  })
                }
              </IonSelect>
            </IonItem>
            {
              this.state.producto_data.length > 0 ?

                this.state.producto_data.map((item) => {
                  return (
                    <div>
                      <IonInput type="hidden" id="id" value={item.id} ></IonInput>
                      <IonItem style={{ fontSize: "14px" }}>
                        <IonLabel>Producto:</IonLabel>
                      </IonItem>
                      <IonItem>
                        <IonInput type="text" id="nombre" value={item.nombre} readonly></IonInput>
                        <IonButton onClick={() => this.editarInfoProducto('nombre')}>Editar</IonButton>
                      </IonItem>
                      <IonItem style={{ fontSize: "14px" }}>
                        <IonLabel>Código de Barra:</IonLabel>
                      </IonItem>
                      <IonItem>
                        <IonInput type="text" id="barra" value={item.barra} readonly></IonInput>
                      </IonItem>
                      <IonItem style={{ fontSize: "14px" }}>
                        <IonLabel>Precio:</IonLabel>
                      </IonItem>
                      <IonItem>
                        <IonInput type="number" id="precio" value={item.precio} readonly></IonInput>
                        <IonButton onClick={() => this.editarInfoProducto('precio')}>Editar</IonButton>
                      </IonItem>
                      
                      <IonItem>
                        <IonLabel>¿Aplica ISV?</IonLabel>
                        <IonSelect okText="Aceptar" id="aplica_isv" value={item.aplica_isv} cancelText="Cancelar" placeholder={item.aplica_isv == 1 ? 'Sí aplica' : 'No aplica'} interface="action-sheet">
                          <IonSelectOption value="1">Sí aplica</IonSelectOption>
                          <IonSelectOption value="0">No aplica</IonSelectOption>
                        </IonSelect>
                      </IonItem>
                      
                      <IonItem>
                        <IonLabel>Activo</IonLabel>
                        <IonSelect okText="Aceptar" id="activo" value={item.activo} cancelText="Cancelar" placeholder={item.activo == 1 ? 'Sí' : 'No'} interface="action-sheet">
                          <IonSelectOption value="1">Sí</IonSelectOption>
                          <IonSelectOption value="0">No</IonSelectOption>
                        </IonSelect>
                      </IonItem>

                      <IonButton expand="block" onClick={() => this.modificarProducto()}>Guardar cambios</IonButton>
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

export default connect(mapStateToProps)(EditarInfoProductos);