lib = require("../main")
fs = require("fs")


lib.loadNetwork("/home/lucas/temp/trains/darknet19_448.conv.23","/home/lucas/temp/trains/isolador/net.cfg","/home/lucas/temp/trains/isolador/net.names", (net) =>{
	//lib.saveWeights(net,"teste.weights")
	t = lib.loadTrain(net,['/home/lucas/temp/trains/isolador/images/DJI_0003.JPG','/home/lucas/temp/trains/isolador/images/DJI_0005.JPG'])
	z
	lib.trainP(t,0)
	lib.trainP(t,1)
	lib.trainP(t,2)

})

