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
        socket.on('room', function(room){
            room = room;
            console.log('room: ' + room);
            socket.join(room);
            
            io.sockets.in(room).emit('room', room);
            io.sockets.in(room).emit('message', 'anyone in this room yet?');
        })

        socket.on('userMessage', function(room){
            room=room
            console.log("The room is (user message): "+ room)
            socket.emit('userMessage', room);
        })

        socket.on('initializeChatGroupsDiv', function(room){
            console.log("in initialize chats socket")
            socket.emit('initializeChatGroupsDiv', room)
        })
    })
    
    
        

}