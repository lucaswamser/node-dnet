lib = require("../main")
fs = require("fs")


lib.loadNetwork("/home/lucas/temp/trains/darknet19_448.conv.23","/home/lucas/temp/trains/isolador/net.cfg","/home/lucas/temp/trains/isolador/net.names", (net) =>{
	//lib.saveWeights(net,"teste.weights")
	t = lib.loadTrain(net,['/home/lucas/temp/trains/isolador/images/DJI_0003.JPG','/home/lucas/temp/trains/isolador/images/DJI_0005.JPG'])
	
	for (var index = 0; index < 100; index++) {
		lib.trainP(t,index)
	}

})

