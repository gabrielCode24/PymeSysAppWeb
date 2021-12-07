//Función genérica para preparar solicitudes POST en el formato de la app (action - set - data)
export function prepararPost(values, set, action = "setJsons", structure = "jsonSingle") {

  if (structure == "jsonSingle") {
    let data = [];

    //Ingresamos en un arreglo el JSON guardado en variable values
    data.push(values);
    const requestMetaData = { //Armamos los datos necesarios para hacer el request POST
      action: action,
      set: set,
      data: JSON.stringify(data)
    }

    //Formateamos requestMetaData de JSON a formato de URL (ej. => &x=1&y=2&z=3)
    var formBody = [];
    for (var property in requestMetaData) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(requestMetaData[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&"); 

    //Finalmente preparamos toda la estructura del request que enviaremos a la función fetch para hacer el POST
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      body: formBody
    };
    console.log(requestOptions);
    return requestOptions;

  } else if (structure == "jsonArray") {
    let data = values;

    //Ingresamos en un arreglo el JSON guardado en variable values
    //data.push(values);

    const requestMetaData = { //Armamos los datos necesarios para hacer el request POST
      action: "setJsons",
      set: set,
      data: JSON.stringify(data)
    }

    //Formateamos requestMetaData de JSON a formato de URL (ej. => &x=1&y=2&z=3)
    var formBody = [];
    for (var property in requestMetaData) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(requestMetaData[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    //Finalmente preparamos toda la estructura del request que enviaremos a la función fetch para hacer el POST
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      body: formBody
    };

    return requestOptions;

  }
  return;
}

export function getTodayDate(params) {
  let options = {};
  let d = new Date();
  let date = '';

  switch (params) {
    case 1:
      options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      break;

    case 2:
      date = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()
      return date;
  }

  date = d.toLocaleDateString("es-MX", options);

  return date;
}

export function url(){
  return 'https://pymesys.000webhostapp.com/api/pymesys.php';
}

export var saltingCode = "3Zh8m^dM0kYzwobQjif&XHKmdl6z#J";