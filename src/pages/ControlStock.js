import {
    IonContent, IonPage,
    IonHeader, IonToolbar,
    IonBackButton, IonButtons, IonList,
    IonItem, IonLabel, IonSelect, IonSelectOption,
    IonInput, IonButton
} from '@ionic/react';
import React, { Component } from 'react'
import { url, prepararPost } from '../utilities/utilities.js';
import { connect } from 'react-redux'
import { getProductos } from '../actions/productosAction'
import { Redirect } from 'react-router-dom'
import Swal from 'sweetalert2'

import {
    arrowBackOutline
} from 'ionicons/icons';

const mapStateToProps = store => ({
    productos: store.productos
});

class ControlStock extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: url(),
            inventario_data: [],
            loading_productos: false,
        }
    }

    UNSAFE_componentWillMount() {
        this.getProductos();
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
                console.log(error);
            });
    }

    getProductoSeleccionado = (e) => {
        let producto_id = JSON.stringify(parseInt(e.target.value.id));

        let Parameters = '?action=getJSON&get=inventario_producto&id_prd=' + producto_id;

        fetch(this.state.url + Parameters)
            .then((res) => res.json())
            .then((responseJson) => {
                if (responseJson.length > 0) {
                    console.log(JSON.stringify(responseJson));
                    this.setState({
                        inventario_data: responseJson,
                    })
                } else {
                    alert("Ocurrió un error al recuperar los datos")
                }
            })
    }

    editarInfoInventario = (id) => {
        let input = document.getElementById(id);

        input.readonly = false;
        input.focus();
    }

    calcularNuevoStock = (stock_actual) => {
        let _stock_actual = parseInt(stock_actual);
        let _stock_ingresado = parseInt(document.getElementById('ingresar_stock').value);
        let nuevo_stock = _stock_actual + _stock_ingresado;

        if (document.getElementById('ingresar_stock').value != "") {
            document.getElementById('div_nuevo_stock').style.display = "inline";
        } else {
            document.getElementById('div_nuevo_stock').style.display = "none";
        }

        if (typeof (nuevo_stock) != NaN) {
            document.getElementById('nuevo_stock').value = nuevo_stock;
        } else {
            document.getElementById('nuevo_stock').value = stock_actual;
        }
    }

    modificarInfoInventario = (producto_id, stock_actual) => {
        Swal.showLoading();
        var ubicacion = "UBI_PRE";
        var stock = 0;
        var costo_unitario = document.getElementById('costo_unitario').value;
        var precio = document.getElementById('precio').value;

        if (document.getElementById('nuevo_stock').value != "") {
            stock = document.getElementById('nuevo_stock').value;
        } else {
            stock = stock_actual;
        }

        var valor = +stock * +costo_unitario

        if (+precio < +costo_unitario) {
            alert("El costo no puede ser mayor que el precio");
            return;
        }

        if (document.getElementById('ingresar_stock').value < 0) {
            alert("El stock a agregar no puede ser negativo.");
            return;
        }

        if (+costo_unitario <= 0) {
            alert("El costo unitario no puede ser 0 ni negativo.");
        } else {
            var values = {
                producto_id: producto_id, ubicacion: ubicacion,
                stock: stock, costo_unitario: costo_unitario, valor: valor
            }

            const requestOptions = prepararPost(values, "update_inventario", "updateJsons", "jsonSingle");

            fetch(this.state.url, requestOptions)
                .then((response) => {
                    if (response.status === 200) {
                        Swal.close();
                        Swal.fire({
                            title: '¡Éxito!',
                            text: 'Inventario actualizado correctamente',
                            icon: 'success',
                            confirmButtonText: 'Aceptar',
                            confirmButtonColor: 'lightseagreen'
                          });
                    }
                })
                .catch((error) => {
                    console.log("ERROR: " + error);
                });
        }
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
                    <h4 style={{ textAlign: "center" }}>CONTROL DE STOCK</h4>
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
                            this.state.inventario_data.length > 0 ?

                                this.state.inventario_data.map((item) => {
                                    return (
                                        <div>
                                            <IonInput type="hidden" id="id" value={item.id} key={item.id}></IonInput>
                                            <IonItem style={{ fontSize: "14px" }}>
                                                <IonLabel>Producto:</IonLabel>
                                            </IonItem>
                                            <IonItem>
                                                <IonInput type="text" id="nombre" value={item.nombre} key={item.id} readonly></IonInput>
                                            </IonItem>
                                            <IonItem style={{ fontSize: "14px" }}>
                                                <IonLabel>Código de Barra:</IonLabel>
                                            </IonItem>
                                            <IonItem>
                                                <IonInput type="text" id="barra" value={item.barra} key={item.id} readonly></IonInput>
                                            </IonItem>
                                            <IonItem style={{ fontSize: "14px" }}>
                                                <IonLabel>Costo unitario (L):</IonLabel>
                                            </IonItem>
                                            <IonItem>
                                                <IonInput type="number" id="costo_unitario" value={item.costo_unitario} key={item.id} readonly></IonInput>
                                                <IonButton onClick={() => this.editarInfoInventario('costo_unitario')}>Editar</IonButton>
                                            </IonItem>
                                            <IonItem style={{ fontSize: "14px" }}>
                                                <IonLabel>Precio:</IonLabel>
                                            </IonItem>
                                            <IonItem>
                                                <IonInput type="number" id="precio" value={item.precio} key={item.id} readonly></IonInput>
                                            </IonItem>
                                            <IonItem style={{ fontSize: "14px" }}>
                                                <IonLabel>Unidades en stock:</IonLabel>
                                            </IonItem>
                                            <IonItem>
                                                <IonInput type="number" id="stock" value={item.stock} key={item.id} readonly></IonInput>
                                            </IonItem>
                                            <IonItem style={{ fontSize: "14px" }}>
                                                <IonLabel>Ingresar stock:</IonLabel>
                                            </IonItem>
                                            <IonItem>
                                                <IonInput type="number" style={{ fontWeight: "bold", color: "green" }} id="ingresar_stock" onIonChange={() => this.calcularNuevoStock(item.stock)} key={item.id} placeholder="Ingrese las unidades"></IonInput>
                                            </IonItem>

                                            <div id="div_nuevo_stock" style={{ display: "none" }}>
                                                <IonItem style={{ fontSize: "14px" }}>
                                                    <IonLabel>Total stock (Stock actual <span style={{ fontWeight: "bold", color: "green" }}>+ Nuevas unidades</span>):</IonLabel>
                                                </IonItem>
                                                <IonItem>
                                                    <IonInput style={{ fontWeight: "bold", fontSize: "24px" }} type="number" id="nuevo_stock" key={item.id} readonly></IonInput>
                                                </IonItem>
                                            </div>
                                            <IonButton expand="block" onClick={() => this.modificarInfoInventario(item.id, item.stock)}>Guardar cambios</IonButton>
                                        </div>
                                    )
                                })
                                : ''
                        }

                    </IonList>
                </IonContent>
            </IonPage >
        )
    }
}

export default connect(mapStateToProps)(ControlStock);
