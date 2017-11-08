lib = require("../main")
fs = require("fs")

bf = fs.readFileSync('image.jpg');
im = lib.loadImageBuffer(bf);


lib.loadNetwork("/var/trains/generico/net.weights","/var/trains/generico/net.cfg","/var/trains/generico/net.names", (net) =>{
	lib.predict(im,net,(p) =>{
		data = lib.getpredictdata(p,im, null, (r) => console.log(r))
		lib.drawDetecions(im,p)
		lib.saveImage(im,"out2")
	})
	
})

