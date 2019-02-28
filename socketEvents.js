module.exports = function (io) {

    var connections = [];
    io.on('connection', function (socket) {
        connections.push(socket);
        console.log('Connected: %s sockets connected', connections.length);

        //Disconnect
        socket.on('disconnect', function (data) {
            connections.splice(connections.indexOf(socket), 1);
            console.log('Disconnected: %s sockets connected', connections.length);
        })
    })

}