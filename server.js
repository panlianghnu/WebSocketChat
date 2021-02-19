var app = require('express')()    // 封装 http 
var ws = require('nodejs-websocket')
var clientList = []   // 保存🧍‍♂各个客户端的socket连接

app.get('/',(req, res) => {
	res.sendFile(__dirname + '/chat.html')   // 返回页面
})
app.listen(7777,'localhost')

var server = ws.createServer((socket) => {    // 处理聊天
	var username = socket.path
	console.log(username + ' 加入群聊')
	clientList.push(socket)
	broadcast(username + ' 加入群聊')

	socket.on('text',(data) => {
		console.log(username + ': '+data)
		broadcast(username + ': ' + data)
	})

	socket.on('close',(err) => {
		console.log(username + ' 退出群聊')
		deleteSocketFromList(socket)
		broadcast(username + ' 退出群聊')
	})
}).listen(8888)

function broadcast(data){
	for(var i=0;i<clientList.length;i++){
		if(clientList[i] !== null){
			clientList[i].send(data)
		}
	}
}

function deleteSocketFromList(socket){
	for(var i=0;i<clientList.length;i++){
		if(clientList[i] === socket){  // delete this
			clientList[i] = null
		}
	}
}