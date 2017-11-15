lib = require("../main")
fs = require("fs")
var glob = require("glob")


<<<<<<< HEAD
lib.loadNetwork("/home/lucas/temp/trains/darknet19_448.conv.23","/home/lucas/temp/trains/isolador/net.cfg","/home/lucas/temp/trains/isolador/net.names", (net) =>{
	//lib.saveWeights(net,"teste.weights")
	t = lib.loadTrain(net,['/home/lucas/temp/trains/isolador/images/DJI_0003.JPG','/home/lucas/temp/trains/isolador/images/DJI_0005.JPG'])
	
	for (var index = 0; index < 100; index++) {
		lib.trainP(t,index)
	}
=======
bf = fs.readFileSync('test.JPG');
im = lib.loadImageBuffer(bf);
>>>>>>> 2d1cc5fa072538f870a3af480858938038c10d3c


lib.loadNetwork("/home/vants/trains/Cruzetas/backup.weights","/home/vants/trains/Cruzetas/net.cfg","/home/vants/trains/Cruzetas/net.names", (net) =>{
	lib.saveWeights(net,"inicio.weights")

	glob("/home/vants/trains/Cruzetas/images/**/*.JPG", '', function (er, files) {
		t = lib.loadTrain(net,files)
		for (var index = 0; index < 20000; index++) {
			console.log(index)
			lib.trainP(t,index)
			if (index % 100 === 0 && index != 0){
			lib.saveWeights(net,"/home/vants/trains/Cruzetas/backup.weights")
			
			}
		}
		lib.saveWeights(net,"fim.weights")

	})

			

	
})

