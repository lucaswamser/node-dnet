lib = require("../main")
fs = require("fs")

bf = fs.readFileSync(process.argv[3]);
im = lib.loadImageBuffer(bf);

path = process.argv[2];

lib.loadNetwork(path+"backup.weights",path+"net.cfg",path+"net.names", (net) =>{
	lib.predict(im,net,(p) =>{
		data = lib.getpredictdata(p,im, null, (r) => console.log(r))
		lib.drawDetecions(im,p)
		lib.saveImage(im,"out2")
	},0.1)
	
})

