lib = require("node-dnet")
fs = require("fs")
var Jimp = require("jimp");

bf = fs.readFileSync('image.jpg');
im = lib.loadImageBuffer(bf);
network = new lib.Network("/var/trains/generico/net.weights","/var/trains/generico/net.cfg","/var/trains/generico/net.names")


p = network.predict(im)
data = lib.getpredictdata(p,im, function(obj){
Jimp.read(bf, function (err, lenna) {
    if (err) throw err;
        lenna.crop(obj.box.x, obj.box.y,obj.box.w, obj.box.h).getBuffer(Jimp.MIME_JPEG,  function (err, lenna) {
 	  obj.image = lenna;
        })
});
}, function(r){
  console.log(r)
})
lib.drawDetecions(im,p)
lib.saveImage(im,"out2")
