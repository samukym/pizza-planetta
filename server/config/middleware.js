var jwt = require('jsonwebtoken'),
  Usuario = require('mongoose').model('Usuario'),
  Motorizado = require('mongoose').model('Motorizado'),
  Tienda = require('mongoose').model('Tienda'),
  Pizza = require('mongoose').model('Pizza'),

module.exports = {
  validTokenUsuario: function(req, res, next) {
    // obtener token por post
    var token = req.body.token;
    // console.log('token',token);
    if (token) {
      jwt.verify(token, app.get('superSecret'), function(err, decoded) {
        if (err) {
          res.send({
            error: true,
            message: 'Token no valido o no existe 1'
          });
          return;
        }
        Usuario.findByToken(token, function(err, usuario) {
          if (!usuario) {
            res.send({
              error: true,
              message: 'Token no valido o no existe 2'
            });
            return;
          }
          req.session.user = usuario;
          if (req.session.user.tipo === Usuario.getTipo()) {
            next();
          } else {
            res.send({
              error: true,
              message: 'No tiene permiso para realizar esta acción'
            });
            return;
          }
        });
      });
    } else {
      res.send({
        error: true,
        message: 'Token no valido o no existe3'
      });
    }
  },
  validTokenMotorizado: function(req, res, next) {
    console.log('validTokenMotorizado');
    var token = req.body.token;
    if (!token) {
        res.send({
          error: true,
          message: 'Token no valido o no existe'
        });
        return;
      }
      Motorizado.findByToken(token, function(err, motorizado) {
        if(err){
          res.send({
            error: true,
            message: 'Error en  buscar token motorizado'
          });
          return;
        }
        if (!motorizado) {
          res.send({
            error: true,
            message: 'Token no valido o no existe'
          });
          return;
        }
        req.session.user = motorizado;
        if (req.session.user.tipo === Motorizado.getTipo()) {
          next();
        } else {
          res.send({
            error: true,
            message: 'No tiene permiso para realizar esta acción'
          });
          return;
        }
      });
  },
  validTokenTienda: function(req, res, next) {
    console.log('validTokenTienda');
    var token = req.body.token;
    if (token) {
      jwt.verify(token, app.get('superSecret'), function(err, decoded) {
        if (err) {
          res.send({
            error: true,
            message: 'Token no valido o no existe 11'
          });
          return;
        }
        Tienda.findByToken(token, function(err, tienda) {
        console.log("Tienda.findByToken2",tienda);
          if (!tienda) {
            res.send({
              error: true,
              message: 'Token no valido o no existe 12'
            });
            return;
          }
          req.session.user = tienda;
          if (req.session.user.tipo === Tienda.getTipo()) {
            next();
          } else {
            res.send({
              error: true,
              message: 'No tiene permiso para realizar esta acción'
            });
            return;
          }
        });
      });
    } else {
      res.send({
        error: true,
        message: 'Token no valido o no existe 13'
      });
    }
  },
  findPizza: function(req, res, next) {
    Pizza.findOne({
      _id: req.body.idPizza
    }, function(err, pizza) {
      if (err) {
        res.send({
          error: true,
          message: 'error buscando la pizza'
        });
        return;
      }
      if (!pizza) {
        res.send({
          error: true,
          message: 'Esta pizza no existe'
        });
        return;
      }
      var tamano = {};
      for (var i in pizza.tamanos) {
        if (pizza.tamanos[i].codigo === req.body.codTamano) {
          tamano = pizza.tamanos[i];
        }
      }
      var nuevaPizza = {
        nombre: pizza.nombre,
        detalle: pizza.detalle,
        comentario: req.body.comentario,
        cantidad: req.body.cantidad,
        tamano: tamano,
        ingredientes: pizza.ingredientes
      };
      req.nuevaPizza = nuevaPizza;
      next();
    });
  }
};
