var updateRoute = require('../utils/updateRoute');
var auth = require('../utils/auth');
var Pedido = require('mongoose').model('Pedido');

var io = null;

module.exports = {
  enviarPedidoActualizadoSocket: function(pedido) {
    io.to(pedido._id).emit('pedidoActualizado', pedido);
    io.to(pedido.tiendaId).emit('pedidoActualizado', pedido);
  },
  init: function(server) {
    io = require('socket.io')(server);

    io.of('/socketMotorizado')
      .on('connection', function(socket) {
        socket.on('iniciar', function(data) {
          if(!data.token){
            console.log("token no recibido");
            return;
          }
          if(!data.pedidoId){ 
            console.log("pedidoId no recibido");
            return;
          }
          auth.validTokenMotorizado(data.token, function(err){
            if(err){
              console.log("error validando Motorizado");
              return;
            }
            socket.join(data.pedidoId);
            Pedido.findOne({
              _id: data.pedidoId
            }, function(err, pedido){
              if(err){
                console.log("error buscanod el pedido con id "+data.pedidoId);
                return;
              }
              if(!pedido){
                console.log("Pedido  de id "+ data.pedidoId+" no encontrado");
                return;
              }
              socket.emit('pedidoActualizado', pedido);
            });
          });
        });
        socket.on('actualizarUbicacion', function(data) {
          if(!(data.latitud && ldata.longitud && data.idPedido) ){
            console.log("actualizarUbicacion/socket: no se recibieron latitud,longitud,idPedido");
            return;
          }
          updateRoute(data.idPedido, data.latitud, data.longitud,
            function(pedido) {
              socket.emit('pedidoActualizado', pedido);
            });
        });
      });
    io.of('/socketUsuario')
      .on('connection', function(socket) {
        socket.on('iniciar', function(data) {
          // validar token data.token
          // considerar conseguir id pedido por token de motori<.;
          if(!data.token){
            console.log("token no recibido");
            return;
          }
          if(!data.pedidoId){
            console.log("pedidoId no recibido");
            return;
          }
          auth.validTokenUsuario(data.token, function(err, usuario){
            if(err){
              console.log("error validadnto el token");
              return
            }
            socket.join(data.pedidoId);
            Pedido.findOne({
              _id: data.pedidoId
            }, function(err, pedido){
              if(err){
                console.log("error buscanod el pedido con id "+data.pedidoId);
                return;
              }
              if(!pedido){
                console.log("Pedido  de id "+ data.pedidoId+" no encontrado");
                return;
              }
              socket.emit('pedidoActualizado', pedido);
            });
          });
        });
      });
    io.of('/socketTienda')
      .on('connection', function(socket) {

        socket.on('iniciar', function(data) {
          // validar token data.token
          // considerar conseguir id tienda por token de tienda
          if(!data.token){
            console.log("token no recibido");
            return;
          }
          auth.validTokenTienda(data.token, function(err, tienda){
            if(err){
              console.log("error validando tienda");
              return;
            }
            socket.join(tienda.id);
            console.log("socekt/socektTieda/join a "+tienda.id);
            socket.emit('ack', 'connected');
          });
        });

      });

  }
};
