const inicioDebug = require('debug')('app:inicio');
const debug = require('debug')('app:db');
const express = require('express');
const morgan = require('morgan');
const config = require('config');
const Joi = require('joi');
const app = express();

// const auth = require('./authenticated');
// const logger = require('./logger');

app.use(express.json()); //body
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

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

const users = [
  { id:1, nombre:'Melisa',   },
  { id:2, nombre:'Mercedes', },
  { id:3, nombre:'Janeth',   },
  { id:4, nombre:'Diana',    },
  { id:5, nombre:'Jenny',    },
  { id:6, nombre:'Yolanda',  },
]


app.get('/', (req, res) => {
  res.send('Hola mundo desde express');
});

app.get('/api/usuarios', (req, res) => {
  res.send(users);
})

app.get('/api/usuarios/:id', (req, res) => {
  let user = existUser(req.params.id);
  if (!user) res.status(404).send('El usuario no fue encontrado');
  res.send(user)
})

app.post('/api/usuarios', (req, res) => {

  // let body = req.body;
  // console.log(body.nombre)
  // res.json({body})

  const schema = Joi.object({
    nombre: Joi.string()
      .min(3)
      .max(20)
      .required(),
  });
  const { error, value } = validateUser(req.body.nombre);
  if (!error) {
    const user = {
      id: users.length + 1,
      nombre: value.nombre
    };
    users.push(user);
    res.send(user);
  } else {
    const message = error.details[0].message;
    res.status(400)
      .send(message)
  }
  
  // if (!req.body.nombre || req.body.nombre.length <=3 || req.body.nombre.length >= 20) {
  //   //Bad Request
  //   res.status(400)
  //     .send('Este campo no puede estar vacio, debe ingresar un nombre que tenga mínimo 3 y máximo 20  letras');
  //   return;
  // }
  // const user = {
  //   id: users.length + 1,
  //   nombre: req.body.nombre
  // };
  // users.push(user);
  // res.send(user);
});

app.put('/api/usuarios/:id', (req, res) => {
  let user = existUser(req.params.id);
  if (!user) {
    res.status(404).send('El usuario no fue encontrado');
    return;
  }

  const { error, value } = validateUser(req.body.nombre);
  if (error) {
    const message = error.details[0].message;
    res.status(400).send(message);
    return;
  }

  user.nombre = value.nombre;
  res.send(user);
  

});


app.delete('/api/usuarios/:id', (req, res) => {

  let user = existUser(req.params.id);
  if (!user) {
    res.status(404).send('El usuario no fue encontrado');
    return;
  }

  const index = users.indexOf(user);
  users.splice(index, 1);
  res.send(users);
});

const port = process.env.PORT || 3000; 
app.listen(port, () => {
  console.log(`Escuchando en el PORT: http://localhost:${port}`);
})

function existUser(id) {
  return(users.find(u => u.id === parseInt(id)));
}

function validateUser(name) {
  const schema = Joi.object({
    nombre: Joi.string().min(3).max(20).required()
  });
  return(schema.validate({ nombre: name }));
}