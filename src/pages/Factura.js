import {
  IonContent, IonPage,
  IonItemDivider, IonList, IonInput,
  IonItem, IonLabel, IonButton, IonBackButton,
  IonToolbar, IonHeader, IonButtons, IonGrid, IonRow,
  IonCol, IonFooter, IonTitle
} from '@ionic/react';
import {
  arrowBackOutline
} from 'ionicons/icons';

import { Component } from 'react'
import { BarcodeScanner } from "@ionic-native/barcode-scanner";
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { prepararPost, getTodayDate, url } from '../utilities/utilities.js'
import Swal from 'sweetalert2'
//import './Factura.css';

class Factura extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: url(),
      factura: false,
      hoy: getTodayDate(1),
      encodedText: '',
      scanned: false,
      lista_factura: [],
      elemento_eliminado: false,
      subtotal: 0.00,
      isv_factura: 0.00,
      max_id_factura: 0,
      sending: false
    }
    defineCustomElements(window);
  }

  componentDidMount() {
    if (localStorage.getItem('lista_factura')) {
      localStorage.removeItem('lista_factura');
    }
  }
  
  escanear = async () => {
    const data = await BarcodeScanner.scan();

    this.setState({ encodedText: data.text });

    /*
    let x = Math.floor((Math.random() * 100) + 1);
    let barcode = "";
    console.log(x);
    if (x > 0 && x < 25) {
      barcode = "750894621491";
    } else if (x > 25 && x < 50) {
      barcode = "7420000401226";
    } else if (x > 50 && x < 75) {
      barcode = "7401005905780";
    } else {
      barcode = "7420073804832";
    }
    */

    let Parameters = '?action=getJSON&get=producto_factura&barcode=' +  this.state.encodedText;
    //let Parameters = '?action=getJSON&get=producto_factura&barcode=' + barcode;

    fetch(this.state.url + Parameters)
      .then((res) => res.json())
      .then((responseJson) => {

        if (!localStorage.getItem('lista_factura')) {
          let firstItem = JSON.stringify(responseJson);
          localStorage.setItem('lista_factura', firstItem);
          let firstItemActualizarState = JSON.parse(localStorage.getItem('lista_factura'))

          if (responseJson[0].aplica_isv == 1) {
            this.setState({ scanned: true, subtotal: responseJson[0].total_pre_x_cant, isv_factura: responseJson[0].total_pre_x_cant * 0.15, lista_factura: firstItemActualizarState });
          } else if (responseJson[0].aplica_isv == 0) {
            this.setState({ scanned: true, subtotal: responseJson[0].total_pre_x_cant, isv_factura: 0.00, lista_factura: firstItemActualizarState });
          }

        } else {
          var a = JSON.parse(localStorage.getItem('lista_factura')) || [];
          var b = localStorage.getItem('lista_factura');
          var arrayParsed = JSON.parse(b);

          //Verificamos si el nuevo item está o no en la copia de la localStorage actual
          function getProductoPorId(id) {
            return arrayParsed.filter(
              function (arrayParsed) {
                return arrayParsed.id == id;
              }
            );
          }

          // Si el producto no existe la .length será igual a 0, si ya existe la .length será igual a 1
          var itemExiste = getProductoPorId(responseJson[0].id);

          // Si el elemento no existe, lo metemos en la localStorage
          if (itemExiste.length == 0) {
            a.push(responseJson[0]);

            localStorage.setItem('lista_factura', JSON.stringify(a));

            var b = localStorage.getItem('lista_factura');
            var arrayParsed = JSON.parse(b);

            localStorage.setItem('lista_factura', JSON.stringify(arrayParsed));

            this.setState({ lista_factura: arrayParsed });

            //Hacemos la sumatoria de precios en la factura actual
            var subtotal = 0.00;
            for (let i = 0; i < arrayParsed.length; i++) {
              subtotal += parseFloat(arrayParsed[i].total_pre_x_cant);
            }
            this.setState({ subtotal: subtotal });

            //Calculamos el isv si este aplica, para mostrarlo en la parte inferior de la pantalla de factura
            if (responseJson[0].aplica_isv == 1) {
              this.setState({ isv_factura: this.state.isv_factura + (responseJson[0].total_pre_x_cant * 0.15) });
            } else if (responseJson[0].aplica_isv == 0) {
              this.setState({ isv_factura: this.state.isv_factura + 0.00 });
            }

          } else {
            Swal.fire({
              title: 'Atención',
              text: 'Este producto ya está en la factura, si desea modificar la cantidad de este producto utilice el espacio de la columna Uni.',
              icon: 'info',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: 'lightseagreen'
            });
          }
        }
      })
      .catch((error) => {
        alert(error)
      });
  }

  cambiarSubtotalProducto = (event, idPre, arrProductos, key) => {
    let cantidad = event.target;
    let cantidadActual = cantidad.value;
    let precio = parseFloat(document.getElementById(idPre).value).toFixed(2);
    var totalPrecios = 0.00;

    //Actualizamos el valor total de los precios del producto (precio X cantidad) y lo guardamos en el arrProductos
    for (var i = 0; i < arrProductos.length; i++) {
      if (i === key) {
        //Calculamos el isv si este aplica, para mostrarlo en la parte inferior de la pantalla de factura
        if (arrProductos[i].aplica_isv == 1) {
          this.setState({ isv_factura: this.state.isv_factura - (arrProductos[i].total_pre_x_cant * 0.15) + (parseFloat(precio * cantidadActual).toFixed(2) * 0.15) });
        } else if (arrProductos[i].aplica_isv == 0) {
          this.setState({ isv_factura: this.state.isv_factura + 0.00 });
        }

        //Finalmente actualizamos los datos que se insertarán en la localStorage
        arrProductos[i].cantidad = cantidadActual;
        arrProductos[i].total_pre_x_cant = parseFloat(precio * cantidadActual).toFixed(2);
        break;
      }
    }

    //Formateamos el arreglo para guardarlo nuevamente en la localStorage
    localStorage.setItem('lista_factura', JSON.stringify(arrProductos));

    for (var i = 0; i < arrProductos.length; i++) {
      totalPrecios += parseFloat(arrProductos[i].total_pre_x_cant);
    }
    this.setState({ subtotal: totalPrecios });
  }

  eliminarProducto = (arrProductos, key) => {
    var totalPrecios = 0.00;
    var isv_recalculado = 0.00;

    //Traemos el objeto de productos, buscamos el índice en función al key de .map() y eliminamos ese elemento
    arrProductos.splice(key, 1);

    //Formateamos el arreglo para guardarlo nuevamente en la localStorage
    localStorage.setItem('lista_factura', JSON.stringify(arrProductos));

    //Actualizamos totales de productos (precio X cantidad) para que se reflejen en la vista
    for (var i = 0; i < arrProductos.length; i++) {
      totalPrecios += parseFloat(arrProductos[i].total_pre_x_cant);

      //Calculamos el isv si este aplica, para mostrarlo en la parte inferior de la vista de factura
      if (arrProductos[i].aplica_isv == 1) {
        isv_recalculado += arrProductos[i].total_pre_x_cant * 0.15;
      }
    }
    this.setState({ elemento_eliminado: true, subtotal: totalPrecios, isv_factura: isv_recalculado });

    // Si el arreglo viene vacío, eliminamos la localStorage
    if (arrProductos.length == 0) {
      localStorage.removeItem('lista_factura');
    }
  }

  procesarFactura = () => {
    var lista_factura = JSON.parse(localStorage.getItem('lista_factura'));
    var flag_cantidad_no_valida = false;

    for (var i = 0; i < lista_factura.length; i++) {
      if (lista_factura[i].cantidad == 0 || lista_factura[i].cantidad < 0 || lista_factura[i].cantidad == undefined
        || lista_factura[i].cantidad == "" || lista_factura[i].cantidad == null) {
        flag_cantidad_no_valida = true;
      }
    }

    if (!flag_cantidad_no_valida) {
      this.setState({
        sending: true,
      });
      
      //INICIO ESTRUCTURA FACTURA RESUMEN

      var cliente_id = "CLI_1"; //
      var fecha = "NOW()"; //
      var total = 0.00;
      var isv = 0.00;
      var CAI = "CAI1"; //
      var impreso = 1;//
      var estado = "C"; //C => Cerrado, A => Abierto
      var usr_ing = "admin";//

      for (let x = 0; x < lista_factura.length; x++) {
        total += parseFloat(lista_factura[x].total_pre_x_cant);
        if (lista_factura[x].aplica_isv == 1) {
          isv += (lista_factura[x].total_pre_x_cant * 0.15);
        }
      }

      let values = {
        cliente_id: cliente_id, fecha: fecha, total: total, isv: isv,
        CAI: CAI, impreso: impreso, estado: estado, usr_ing: usr_ing
      }

      //FIN ESTRUCTURA FACTURA RESUMEN

      //Asignamos a una variable lo que devuelva prepararPost() que contiene todo el armado de la petición
      const requestOptions = prepararPost(values, "factura_resumen", "setJsons", "jsonSingle");

      fetch(this.state.url, requestOptions)
        .then((response) => {
          if (response.status === 200) {

            //BLOQUE PARA PROCESAR Y GUARDAR EL DETALLE DE LA FACTURA
            setTimeout(() => {
              //INICIO ESTRUCTURA FACTURA DETALLE
              let ParametersMaxIdFacturaDetalle = '?action=getJSON&get=max_factura_id';

              fetch(this.state.url + ParametersMaxIdFacturaDetalle)
                .then((res) => res.json())
                .then((responseJson) => {

                  if (responseJson.length > 0) {

                    this.setState({
                      max_id_factura: responseJson[0].factura_id,
                    });

                    setTimeout(() => {
                      var values = {};
                      var values_arr = [];

                      var fd_max_factura_id = this.state.max_id_factura;
                      var fd_cliente_id = "CLI_1"; //
                      var fd_isv = 0.00;
                      var fd_lote = "";
                      var fd_vendedor = "";
                      var fd_descuento = 0.00;

                      for (let y = 0; y < lista_factura.length; y++) {

                        if (lista_factura[y].aplica_isv == 1) {
                          fd_isv = lista_factura[y].total_pre_x_cant * 0.15;
                        } else {
                          fd_isv = 0.00;
                        }

                        values = {
                          factura_id: fd_max_factura_id, cliente_id: fd_cliente_id, producto_id: lista_factura[y].id,
                          cantidad: lista_factura[y].cantidad, subtotal: lista_factura[y].total_pre_x_cant, lote: fd_lote,
                          vendedor: fd_vendedor, descuento: fd_descuento, isv: fd_isv
                        }

                        values_arr.push(values);
                      }
                      console.log(JSON.stringify(values_arr));

                      const requestOptionsFacturaDetalle = prepararPost(values_arr, "factura_detalle", "setJsons", "jsonArray");

                      fetch(this.state.url, requestOptionsFacturaDetalle)
                        .then((response) => {
                          if (response.status === 200) {

                            // LÓGICA PARA ACTUALIZAR EL STOCK DE CADA PRODUCTO, EN FUNCION DE LA CANTIDAD
                            // DE CADA PRODUCTO EN LA FACTURA
                            for (let z = 0; z < lista_factura.length; z++) {
                              
                              let ParametersStockPrd = '?action=getJSON&get=stock_prd&id_prd=' + lista_factura[z].id;

                              fetch(this.state.url + ParametersStockPrd)
                                .then((res) => res.json())
                                .then((responseJson) => {

                                  var valuesActualizaStock = {
                                    producto_id: lista_factura[z].id,
                                    stock: responseJson[0].stock - lista_factura[z].cantidad
                                  }

                                  const requestOptionsActualizaStock = prepararPost(valuesActualizaStock, "update_stock", "updateJsons", "jsonSingle");
                                  
                                  fetch(this.state.url, requestOptionsActualizaStock)
                                    .then((response) => {
                                      if (response.status === 200) {
                                        Swal.close();

                                        this.setState({
                                          sending: false
                                        });

                                        Swal.fire({
                                          title: '¡Éxito!',
                                          text: 'Factura realizada correctamente.',
                                          icon: 'success',
                                          confirmButtonText: 'Aceptar',
                                          confirmButtonColor: 'lightseagreen'
                                        });
                                      }
                                    })
                                    .catch((error) => {
                                      console.log("ERROR: " + error)
                                    });

                                })
                            }
                          } else {
                            Swal.fire({
                              title: 'Error',
                              text: 'Ocurrió un error al generar la factura, la transacción no se completó',
                              icon: 'error',
                              confirmButtonText: 'Aceptar',
                              confirmButtonColor: 'red'
                            });
                          }
                        })
                    }, 1000);

                  } else {
                    alert("Hubo un error")
                  }
                })
              //FIN ESTRUCTURA FACTURA DETALLE
            }, 1000);

          }
        })
    } else {
      Swal.fire({
        title: 'Atención',
        text: 'Hay cantidades incorrectas, por favor verifique el listado de productos.',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: 'lightseagreen'
      });
    }

  }

  render() {
    var arr = this.state.lista_factura;
    var subtotal = this.state.subtotal;

    if (this.state.sending) {
      return <div>
        { Swal.showLoading()}
      </div>
    }

    setTimeout(() => {
      if (arr.length > 0) {
        document.getElementById('proc_fact').disabled = false;
      } else {
        document.getElementById('proc_fact').disabled = true;
      }
    }, 500);

    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/home" icon={arrowBackOutline} />
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList>
            <h4 style={{ textAlign: "center" }}>FACTURA</h4>
            <IonItem>
              <span style={{ fontSize: "12px" }}>Hoy es: {this.state.hoy}</span>
            </IonItem>
            <IonItem>
              <IonLabel style={{ fontSize: "12px" }}>Cliente:</IonLabel>
              <IonInput style={{ fontSize: "12px" }} placeholder="Nombre del cliente"></IonInput>
            </IonItem>

            <IonButton expand="full" fill="solid" onClick={() => this.escanear()}>Escanear producto</IonButton>
            {/*<IonItem>
              <IonLabel>Barra:</IonLabel>
              <IonInput id="barra" placeholder="Barra del producto"></IonInput>
              <IonButton onClick={() => this.scan()}>Agregar</IonButton>
            </IonItem>*/}

            {
              this.state.scanned === true ?
                <IonGrid>
                  <IonRow style={{ textAlign: "center", fontSize: "12px" }}>
                    <IonCol size="2">Cód.</IonCol>
                    <IonCol size="3">Prd.</IonCol>
                    <IonCol size="2">Pre.</IonCol>
                    <IonCol size="2">Uni.</IonCol>
                    <IonCol size="2">Subt.</IonCol>
                    <IonCol size="1">X</IonCol>
                  </IonRow>
                </IonGrid>
                : ''
            }

            {
              this.state.scanned === true ?

                Object.keys(arr).map((keyName, keyIndex) => {
                  return (
                    <IonGrid>
                      <IonRow style={{ textAlign: "center", fontSize: "12px" }}>
                        <IonCol size="2" style={{ paddingTop: "10px" }}>{arr[keyIndex]['id']}</IonCol>
                        <IonCol size="3" style={{ paddingTop: "10px" }}>{arr[keyIndex]['nombre']}</IonCol>
                        <IonCol size="2" style={{ paddingTop: "10px" }}><IonInput type="hidden" id={"pre" + arr[keyIndex]['id']} value={arr[keyIndex]['precio']}></IonInput>{arr[keyIndex]['precio']}</IonCol>
                        <IonCol size="2" style={{ paddingTop: "0px" }}><IonInput type="number" id={"uni" + arr[keyIndex]['id']} value={arr[keyIndex]['cantidad']} onIonChange={(e) => this.cambiarSubtotalProducto(e, "pre" + arr[keyIndex]['id'], arr, keyIndex)}></IonInput></IonCol>
                        <IonCol size="2" style={{ paddingTop: "0px" }}><IonInput type="text" id={"sub" + arr[keyIndex]['id']} value={arr[keyIndex]['total_pre_x_cant']} readonly></IonInput></IonCol>
                        <IonCol key={keyIndex} size="1" style={{ paddingTop: "0px" }}><IonButton color="danger" onClick={() => this.eliminarProducto(arr, keyIndex)} id={"sub" + arr[keyIndex]['id']} >X</IonButton></IonCol>
                      </IonRow>
                    </IonGrid>
                  )
                })
                : ''
            }
          </IonList>
        </IonContent>
        <IonFooter className="ion-no-border">
          <IonToolbar>

            <IonButton id="proc_fact" class="x" expand="full" fill="solid" disabled="true" onClick={() => this.procesarFactura()}>Procesar factura</IonButton>

            <IonTitle style={{ fontSize: "0.80em" }}>Subtotal: {"L. " + parseFloat(subtotal).toFixed(2) + " | "}
              ISV: {"L. " + parseFloat(this.state.isv_factura).toFixed(2) + " | "}
              Total: {"L. " + parseFloat(subtotal * 1.15).toFixed(2)}
            </IonTitle>
          </IonToolbar>
        </IonFooter>
      </IonPage >
    )
  }
}

export default Factura;
