lib = require("../main")
fs = require("fs")

bf = fs.readFileSync(process.argv[3]);
im = lib.loadImageBuffer(bf);

console.log("sasad")
console.log(process.argv[1])

path = process.argv[2];


lib.loadNetwork(path+"net.weights",path+"net.cfg",path+"net.names", (net) =>{
	lib.predict(im,net,(p) =>{
		data = lib.getpredictdata(p,im, null, (r) => console.log(r))
		lib.drawDetecions(im,p)
		lib.saveImage(im,"out2")
		lib.freeImage(im)
		lib.freeDetections(p)
	},0.1)
	
})

