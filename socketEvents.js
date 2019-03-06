module.exports = function (io) {

    io.on('connect', function (socket) {
        console.log('Connected: %s sockets connected, socketID: ' + socket.id);
        // let sessionid = socket.id

        //Disconnect
        // socket.on('disconnect', function () {
        //     console.log('Disconnected: %s sockets connected');

        // })
        //interacting with userprofile.js demo
        // socket.on('send profile', function(data){
        //     console.log(data);
        //     io.sockets.emit('return name', {msg: data});
        // })
    })

        

}