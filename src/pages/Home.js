import {
  IonContent, IonPage,
  IonGrid, IonRow,
  IonCol, IonImg,
  IonHeader, IonToolbar,
  IonTitle, IonButtons, IonIcon,
  IonButton
} from '@ionic/react';
import {
  logOutOutline
} from 'ionicons/icons';
import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
//import './Home.css';
import facturar from '../assets/images/facturar.jpeg'
import inventario from '../assets/images/inventario.jpg'
import usuarios from '../assets/images/usuarios.jpg'
import Swal from 'sweetalert2'

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logged: true,
      facturar: false,
      inventario: false,
      usuarios: false
    }
  }

  redirigir = (modulo) => {
    switch (modulo) {
      case 'factura':
        this.setState({ facturar: true });
        break;
      case 'inventario':
        this.setState({ inventario: true });
        break;
      case 'usuarios':
        this.setState({ usuarios: true });
        break;
    }
  }

  logout = () => {
    Swal.fire({
      title: 'Cerrar sesión',
      text: "¿Está seguro de cerrar la sesión?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'No',
      confirmButtonText: 'Sí',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('userData');
        this.setState({ logged: false });
      }
    })
  }

  render() {

    if (!this.state.logged) {
      return (<Redirect to={'/login'} />)
    }

    if (this.state.facturar) {
      return (<Redirect to={'/factura'} />)
    }

    if (this.state.inventario) {
      return (<Redirect to={'/inventario'} />)
    }
    
    if (this.state.usuarios) {
      return (<Redirect to={'/usuarios'} />)
    }

    return (
      <IonPage>
        <IonContent>
          <div>
            <IonHeader style={{ textAlign: "right" }}>
              <IonToolbar>

                <IonButtons slot="start">
                  <IonButton onClick={() => this.logout()} title="Cerrar sesión">
                    <IonIcon slot="icon-only" icon={logOutOutline} />
                  </IonButton>
                </IonButtons>

                <IonTitle style={{ fontFamily: "sans-serif" }}><b>PYMESYS</b></IonTitle>
              </IonToolbar>
            </IonHeader>
            <IonGrid>
              <IonRow>
                <IonCol size="6" onClick={() => this.redirigir('factura')} style={{
                  height: "140px", borderColor: "#C0C0C0",
                  borderWidth: "1px", borderStyle: "solid", backgroundSize: "cover"
                }}><IonImg src={facturar} style={{ height: "100%" }}></IonImg></IonCol>

                <IonCol size="6" onClick={() => this.redirigir('inventario')} style={{
                  height: "140px", borderColor: "#C0C0C0",
                  borderWidth: "1px", borderStyle: "solid"
                }}><IonImg src={inventario} style={{ height: "100%" }}></IonImg></IonCol>
              </IonRow>

              <IonRow>
                <IonCol size="6" onClick={() => this.redirigir('usuarios')} style={{
                  height: "140px", borderColor: "#C0C0C0",
                  borderWidth: "1px", borderStyle: "solid"
                }}><IonImg src={usuarios} style={{ height: "100%" }}></IonImg></IonCol>

                <IonCol size="6" style={{
                  height: "140px", borderColor: "#C0C0C0",
                  borderWidth: "1px", borderStyle: "solid"
                }}></IonCol>
              </IonRow>
            </IonGrid>
          </div>
        </IonContent>
      </IonPage >
    )
  }
}

export default Home;
