//add 

const button = document.querySelector('.btn');
const buttonx = document.querySelector('.btnx');
  button.addEventListener('click',(e)=>{
    e.preventDefault();
    button.classList.add('btn.clicked');
    document.querySelector('#telas').classList.add('blur');  
    document.querySelectorAll('#bg').forEach((element)=>{element.classList.add('expanded')});
    setTimeout(()=> {document.getElementById("card-4").style.display = "block"},900);
});
  buttonx.addEventListener('click',(e)=>{
    e.preventDefault();
    document.querySelector('#telas').classList.remove('blur');  
    document.querySelectorAll('#bg').forEach((element)=>{element.classList.remove('expanded')});
    setTimeout(()=> {document.getElementById("card-4").style.display = "none"},200);
});
     

/* BLUETOOTH */

function notification(message) {
  let notification = document.querySelector('.mdl-js-snackbar');
  notification.MaterialSnackbar.showSnackbar(
    {
      message: message
    }
  );
}

// WebBluetooth
let deviceCache = null;
let characteristicCache = null;
let readBuffer = '';

function log(data) {
  console.log(data);
}

let connect_bt = document.querySelector('#bluetooth');
connect_bt.addEventListener('click', function e() {
  connect();
  connect_bt.removeEventListener('click', e); //remove para que não acumule event listeners
});

function update_connect_bt(action_type) {
  if (action_type.toLowerCase() === 'connect') {
    connect_bt.classList.remove('active');
    connect_bt.querySelector('#bluetooth.active').textContent = 'Conectado';
    document.getElementById('add').addclassName = 'active';
    connect_bt.addEventListener('click', function e() { 
      connect(); connect_bt.removeEventListener('click', e); });
  }
  else if (action_type.toLowerCase() === 'disconnect') {
    connect_bt.classList.add('active');
    connect_bt.querySelector('#bluetooth.active').textContent = 'Desconectado';
    connect_bt.addEventListener('click', function e() { disconnect(); connect_bt.removeEventListener('click', e); });
  }
}


function connect() {
  return (deviceCache ? Promise.resolve(deviceCache) : 
    requestBluetoothDevice()).
    then(device => connectDeviceAndCacheCharacteristic(device)).
    then(characteristic => startNotifications(characteristic)).
    then(() => {
      update_connect_bt('Desconectado');
      notification('Bluetooth conectado a "' + deviceCache.name +'""');
    }).
    catch(error => log(error));
}

function requestBluetoothDevice() {
  log('Requisitando dispositivo Bluetooth');

  return navigator.bluetooth.requestDevice({
    filters: [{ services: [0xFFE0]}] //serviço do bluetooth
  }).then(device => {
    log('"' + device.name + '" Dispositivo Bluetooth selecionado');
    deviceCache = device;

    deviceCache.addEventListener('gattserverdisconnected',
        handleDisconnection);

    return deviceCache;
  })
}

function connectDeviceAndCacheCharacteristic(device) {
  if (device.gatt.connected && characteristicCache) {
    return Promise.resolve(characteristicCache);
  }

  log('Conectando ao servidor GATT');

  return device.gatt.connect().
      then(server => {
        log(' Servidor GATT conectado');
        return server.getPrimaryService(0xFFE0);
      }).
      then(service => {
        log('Serviço encontrado');

        return service.getCharacteristic(0xFFE1);
      }).
      then(characteristic => {
        log('Características encontradas');
        characteristicCache = characteristic;

        return characteristicCache;
      });
}

function startNotifications(characteristic) {
  log('Iniciando notificações');

  return characteristic.startNotifications().
      then(() => {
        log('Notificações iniciadas');

        characteristic.addEventListener('characteristicvaluechanged',
          handleCharacteristicValueChanged);
      });
}

function handleCharacteristicValueChanged(event) {
  let value = new TextDecoder().decode(event.target.value);

  for (let c of value) {
    if (c === '\n') {
      let data = readBuffer.trim();
      readBuffer = '';

      if (data) {
        evaluateData(data);
      }
    }
    else {
      readBuffer += c;
    }
  }
}

function disconnect() {
  if (deviceCache) {
    log('Desconectando de "' + deviceCache.name + '" ');
    deviceCache.removeEventListener('gattserverdisconnected',
        handleDisconnection);

    if (deviceCache.gatt.connected) {
      deviceCache.gatt.disconnect();
      log('"' + deviceCache.name + '"Dispositivo Bluetooh desconectado');
    }
    else {
      log('"' + deviceCache.name +
          '" Dispositivo já está desconectado');
    }
  }

  if (characteristicCache) {
    characteristicCache.removeEventListener('characteristicvaluechanged',
        handleCharacteristicValueChanged);
    characteristicCache = null;
  }

  notification('Desconectou de ' + deviceCache.name)
  deviceCache = null;

  update_connect_bt('Conectar');
}

function handleDisconnection(event) {
  let device = event.target;

  log('"' + device.name +
      '" Dispositivo desconectado, tentando reconectar"');

  connectDeviceAndCacheCharacteristic(device).
      then(characteristic => startNotifications(characteristic)).
      catch(error => log(error));
}


// CADASTRAR

function cadastrar() {
  document.getElementById("tela-login").style.display = "none";
  document.getElementById("inicio").style.display = "block";
}

// ABRIR TELA API

function tela_api() {
  document.getElementById("inicio").style.display = "none";
  document.getElementById("api").style.display = "block";
}

function voltar_api() {
  document.getElementById("api").style.display = "none";
  document.getElementById("inicio").style.display = "block"; 
}


// PERFIL

function perfil() {
  document.getElementById("inicio").style.display = "none";
  document.getElementById("perfil").style.display = "block";
}

function voltar_perfil() {
  document.getElementById("perfil").style.display = "none";
  document.getElementById("inicio").style.display = "block"; 
}

// NOTIFICAÇÃO 

function notif() {
  document.getElementById("inicio").style.display = "none";
  document.getElementById("notif").style.display = "block";
}

function voltar_notif() {
  document.getElementById("notif").style.display = "none";
  document.getElementById("inicio").style.display = "block"; 
}

var elems = document.getElementsByClassName('section');
// ATENÇÃO

function abrir_atencao() {
  for (var i=0;i<elems.length;i+=1){
  elems[i].style.display = 'none';
  }
  document.getElementById("tela-atencao").style.display = "block";
}

function atencao() {
  setTimeout(abrir_atencao,10000);
}

function voltar_atencao() {
  document.getElementById("tela-atencao").style.display = "none";
  document.getElementById("inicio").style.display = "block"; 
}

function abrir_mapa() {
  document.getElementById("tela-atencao").style.display = "none";
  document.getElementById("tela-alerta").style.display = "none";
  document.getElementById("api").style.display = "block";
}

// ALERTA
function abrir_alerta() {
  for (var i=0;i<elems.length;i+=1){
  elems[i].style.display = 'none';
  }
  document.getElementById("tela-alerta").style.display = "block";
}

function alerta() {
  setTimeout(abrir_alerta,4000);
}

function voltar_alerta() {
  document.getElementById("tela-alerta").style.display = "none";
  document.getElementById("inicio").style.display = "block"; 
}

// DISTANCIA

var rangeSlider = document.getElementById("rs-range-line");
var rangeBullet = document.getElementById("rs-bullet");

rangeSlider.addEventListener("input", showSliderValue, false);

function showSliderValue() {
  rangeBullet.innerHTML = rangeSlider.value;
  var bulletPosition = (rangeSlider.value /rangeSlider.max);
  rangeBullet.style.left = (bulletPosition * 278) + "px";
}

// SAIR DA CONTA

function sair() {
    window.location.reload();
} 



/* API */  
  var map;
  function initMap() {
    map = new google.maps.Map(
        document.getElementById('map'),
            {center: new google.maps.LatLng(-23.563834,
                -46.653047), zoom: 16});
     var icons = {
      filho: {
        url: 'pin.svg',
        scaledSize: new google.maps.Size(50, 50),
      },
      mae: {
        url: 'pin.svg',
        scaledSize: new google.maps.Size(35, 35),
      }
    };
    var features = [
      {
        position: {lat: -23.563834, lng: -46.653047},
        type: 'mae'
      }, {
          position: {lat: -23.563715, lng: -46.653921},
          type: 'filho'
       }
    ];
     // Create markers.
    for (var i = 0; i < features.length; i++) {
      var marker = new google.maps.Marker({
        position: features[i].position,
        icon: icons[features[i].type],
        map: map,
      });
    };
  }