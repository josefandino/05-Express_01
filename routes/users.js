const expres = require('express');
const Joi = require('joi');
const ruta = expres.Router();

const users = [
  { id: 1, nombre: 'Melisa', },
  { id: 2, nombre: 'Mercedes', },
  { id: 3, nombre: 'Janeth', },
  { id: 4, nombre: 'Diana', },
  { id: 5, nombre: 'Jenny', },
  { id: 6, nombre: 'Yolanda', },
];

ruta.get('/', (req, res) => {
  res.send('Hola mundo desde express');
});

ruta.get('/', (req, res) => {
  res.send(users);
})

ruta.get('/:id', (req, res) => {
  let user = existUser(req.params.id);
  if (!user) res.status(404).send('El usuario no fue encontrado');
  res.send(user)
})

ruta.post('/', (req, res) => {

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

ruta.put('/:id', (req, res) => {
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


ruta.delete('/:id', (req, res) => {

  let user = existUser(req.params.id);
  if (!user) {
    res.status(404).send('El usuario no fue encontrado');
    return;
  }

  const index = users.indexOf(user);
  users.splice(index, 1);
  res.send(users);
});

function existUser(id) {
  return(users.find(u => u.id === parseInt(id)));
}

function validateUser(name) {
  const schema = Joi.object({
    nombre: Joi.string().min(3).max(20).required()
  });
  return(schema.validate({ nombre: name }));
}

module.exports = ruta;