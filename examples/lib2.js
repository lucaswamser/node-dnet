lib = require("node-dnet")
fs = require("fs")
var Jimp = require("jimp");

network = new lib.Network("/var/trains/generico/net.weights","/var/trains/generico/net.cfg","/var/trains/generico/net.names")

bf = fs.readFileSync('dog.jpg');
im = lib.loadImageBuffer(bf)
p = network.predict(im)
data = lib.getpredictdata(p,im, function(obj){
Jimp.read(bf, function (err, lenna) {
    if (err) throw err;
        lenna.crop(obj.box.x, obj.box.y,obj.box.w, obj.box.h).write(obj.classname+".jpg"); // save
    });
});


console.log(data)
lib.drawDetecions(im,p)
lib.saveImage(im,"out2")
