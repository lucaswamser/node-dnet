lib = require("../main")
fs = require("fs")
var glob = require("glob")


bf = fs.readFileSync('test.JPG');
im = lib.loadImageBuffer(bf);


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

