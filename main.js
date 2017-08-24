var ffi = require('ffi');
var Struct = require('ref-struct');
var ArrayType = require('ref-array');
var ref = require('ref')
var fs = require('fs')

var Image = Struct({
  'w': 'int',
  'h': 'int',
  'c': 'int',
  'data': 'pointer'
});

var Box = Struct({
  'x': 'float',
  'y': 'float',
  'w': 'float',
  'h': 'float'
});


var Detection = Struct({
  'b': Box,
  'classindex': 'int',
  'classname': 'string',
  'prob': 'float'
});


var DetectionArray = ArrayType(Detection);

var lib = ffi.Library('libdarknet', {
  'load_network_p': [ 'pointer', [ 'string','string','int' ] ],
  'load_image_color': [ Image, [ 'string','int','int' ] ],
  'save_image': [ 'void', [ Image,'string'] ],
  'draw_detections_im': [ 'void', [ Image,DetectionArray,'int'] ],
  'predict': [ 'int', [ 'pointer',Image, 'float','string',DetectionArray] ]
});



exports.loadImage = function (img){
 a = lib.load_image_color(img,0,0);
  if (a.w == 0)
	throw new Error("Invalid Image")
 return a;
}

exports.loadImageBuffer = function (buffer){
 fs.writeFileSync("/tmp/dknetin", buffer);
 a = lib.load_image_color("/tmp/dknetin",0,0);
 if (a.w == 0)
	throw new Error("Invalid Image")
 return a;
}

exports.getpredictdata = function (a,im,ag,cb){
 out = []

for (i = 0; i < a.length; i++) { 
  obj = {}
  obj.classname = a[i].classname;
  obj.prob = a[i].prob;
  obj.box = {}
  b = a[i].b;
  obj.box.x  = parseInt((b.x-b.w/2.)*im.w);
  obj.box.y =  parseInt((b.y-b.h/2.)*im.h);
  obj.box.w  = parseInt(b.w*im.w);
  obj.box.h  = parseInt(b.h*im.h)
  if (ag) 
   ag(obj);
  out.push(obj);
  }
 cb(out);
}

exports.drawDetecions = function (img,a){
 console.log(a.length)
 lib.draw_detections_im(img,a,a.length)
}

exports.saveImage = function (img,name){
 lib.save_image(img,name)
}

exports.readImageBuffer = function (img){
 lib.save_image(img,"/tmp/dknetout")
 return fs.readFileSync("/tmp/dknetout.jpg")
}


exports.Network = function (weights,cfg,names) { 

if (!(fs.existsSync(weights) && fs.existsSync(cfg) && fs.existsSync(names))){
    var err = new Error('Network not found')
    throw err
}

this.name = weights;
this.cfg = cfg;
this.names = names;
this.net = lib.load_network_p(cfg, weights,0);




this.predict = function (im,thresh = 0.25){
 var a = new DetectionArray(200) // by length
 count = lib.predict(this.net,im,thresh,this.names,a)
 var out = new DetectionArray(count) // by length
 for (i = 0; i < count; i++) { 
  out[i]= a[i]
 }
 return out;
}

};


