module.exports = function (io) {

    var connections = [];
    io.on('connection', function (socket) {
        connections.push(socket);
        console.log('Connected: %s sockets connected, socketID: ' + socket.id, connections.length);

        //Disconnect
        socket.on('disconnect', function (data) {
            connections.splice(connections.indexOf(socket), 1);
            console.log('Disconnected: %s sockets connected', connections.length);
        })
        //interacting with userprofile.js demo
        // socket.on('send profile', function(data){
        //     console.log(data);
        //     io.sockets.emit('return name', {msg: data});
        // })
    })

        

}