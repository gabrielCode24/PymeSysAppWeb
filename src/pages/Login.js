import {
    IonContent, IonItem,
    IonInput, IonLabel, IonPage,
    IonRow, IonCol, IonButton
}
    from '@ionic/react';
import { Component } from 'react'
import { Redirect } from 'react-router-dom'
import Swal from 'sweetalert2'
import { MD5 } from '../utilities/crypto'
import { url, saltingCode } from '../utilities/utilities.js';
// import './Home.css';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usuario: '',
            password: '',
            salting_code: saltingCode,
            loading: true,
            usuarioActual: '',
            autenticado: false,
            url: url()
        }
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    login = () => {
        if (this.state.usuario && this.state.password) {
            let usuario = this.state.usuario;
            let saltingCode = this.state.salting_code;
            let password = MD5(this.state.password + saltingCode);

            let Parameters = '?action=getJSON&get=usuario&usuario=' + usuario + '&password=' + password;

            console.log(this.state.url + Parameters)
            fetch(this.state.url + Parameters)
                .then((res) => res.json())
                .then((responseJson) => {

                    if (responseJson.length > 0) {
                        let activo = JSON.stringify(parseInt(responseJson[0].activo));
                        
                        //Si el usuario está activo
                        if (activo == 1) {
                            localStorage.setItem("userData", JSON.stringify(responseJson));

                            this.setState({
                                loading: false,
                                autenticado: true
                            });
                        } else { //Si no
                            Swal.fire({
                                title: 'Error',
                                text: 'Usuario bloqueado, contacte a un usuario administrador.',
                                icon: 'error',
                                confirmButtonText: 'Aceptar',
                                confirmButtonColor: 'red'
                            });
                        }

                    } else {
                        Swal.fire({
                            title: 'Error',
                            text: '¡Usuario y/o contraseña incorrectos!',
                            icon: 'error',
                            confirmButtonText: 'Aceptar',
                            confirmButtonColor: 'red'
                        });
                    }
                })
                .catch((error) => {
                    alert(error)
                });
        }
    }

    render() {

        if (localStorage.getItem('userData')) {
            return (<Redirect to={'/home'} />)
        }

        if (this.state.autenticado) {
            return (<Redirect to={'/home'} />)
        }

        return (
            <IonPage>
                <IonContent>
                    <h1 style={{ textAlign: "center", fontFamily: "sans-serif" }}><b>PYMESYS</b></h1>
                    <IonItem lines="full">
                        <IonLabel position="floating">Nombre de usuario</IonLabel>
                        <IonInput name="usuario" type="text" onIonChange={this.onChange} required></IonInput>
                    </IonItem>

                    <IonItem lines="full">
                        <IonLabel position="floating">Contraseña</IonLabel>
                        <IonInput name="password" type="password" onIonChange={this.onChange} required></IonInput>
                    </IonItem>

                    <IonRow>
                        <IonCol>
                            <IonButton type="submit" color="primary" onClick={() => this.login()} expand="block">Entrar</IonButton>
                        </IonCol>
                    </IonRow>
                </IonContent>
            </IonPage>
        )
    }
}

export default Login;