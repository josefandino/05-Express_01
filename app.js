const inicioDebug = require('debug')('app:inicio');
const debug = require('debug')('app:db');
const usuarios = require('./routes/users');
const express = require('express');
const morgan = require('morgan');
const config = require('config');

const app = express();

// const auth = require('./authenticated');
// const logger = require('./logger');

app.use(express.json()); //body
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/api/users', usuarios);

// Configuration de entornos
console.log('Aplication: ' + config.get('nombre'));
console.log('Versión APP: ' + config.get('version'));
console.log('Serve DB: ' + config.get('configDB.host'));


// Midleware 
// app.use(logger);
// app.use(auth);

// Uso de un midleware de tercero - Morgan
if (app.get('env') === 'development') {
  
  app.use(morgan('tiny'));
  // console.log('---> Morgan habilitado <---')
  debug('===> Morgan está habilitado <===');
}

// Trabajo con las bases de datos 
debug('Conectando con la Base de Datos... ');





const port = process.env.PORT || 3000; 
app.listen(port, () => {
  console.log(`Escuchando en el PORT: http://localhost:${port}`);
})

