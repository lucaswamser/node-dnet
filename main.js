var ffi = require('ffi');
var Struct = require('ref-struct');
var ArrayType = require('ref-array');
var StringArray = ArrayType('string');

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
  'train_detector_i': [ 'void', ['pointer',StringArray,'int'] ],
  'load_train_t': [ 'pointer', ['pointer',StringArray,'int'] ],
  'train_t': [ 'void', ['pointer','int'] ],
  'free_detections': [ 'void', [DetectionArray,'int'] ],
  'free_image':['void',[Image]],
  'save_weights_i' : [ 'void', ['pointer','string'] ],
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
  obj.box.x  = ((b.x-b.w/2.)*100);
  obj.box.y =  ((b.y-b.h/2.)*100);
  obj.box.w  = ((b.w)*100);
  obj.box.h  = ((b.h)*100)
  if (ag) 
   ag(obj);
  out.push(obj);
  }
 cb(out);
}

exports.drawDetecions = function (img,a){
 lib.draw_detections_im(img,a,a.length)
}

exports.saveImage = function (img,name){
 lib.save_image(img,name)
}

exports.readImageBuffer = function (img){
 lib.save_image(img,"/tmp/dknetout")
 if (fs.existsSync("/tmp/dknetout.jpg"))
  return fs.readFileSync("/tmp/dknetout.jpg");
 if (fs.existsSync("/tmp/dknetout.png"))
  return fs.readFileSync("/tmp/dknetout.png"); 
}

exports.freeDetections = function (a){
  lib.free_detections(a,a.length)
 }

 exports.freeImage = function (im){
  lib.free_image(im)
 }


exports.loadNetwork =  function (weights,cfg,names, cb) { 
	if (!(fs.existsSync(weights) && fs.existsSync(cfg) && fs.existsSync(names))){
	    throw new Error('Network not found')
	}else{
	lib.load_network_p.async(cfg, weights,0, (err,res) =>{
 		network = {}
		network.name = weights;
		network.cfg = cfg;
		network.names = names;
		network.net = res;
		cb(network);
  });
}
}



exports.predict = function (im,network,cb,thresh = 0.25){
 var a = new DetectionArray(200) // by length
 lib.predict.async(network.net,im,thresh,network.names,a,(err,res) =>{
	var out = new DetectionArray(res) // by length
	for (i = 0; i < res; i++) { 
	  out[i]= a[i]
	 }
	cb(out)
 });
}

exports.train = function (network,imgs){
  lib.train_detector_i(network.net,new StringArray(imgs),imgs.length);
 }

 exports.loadTrain = function (network,imgs){
  imgsv = []
  for (var i in imgs) {
    val = imgs[i];
    if (fs.existsSync(imgs[i].replace(imgs[i].split('.').pop(),"txt")) && fs.existsSync(imgs[i])) {
	imgsv.push(imgs[i])
    }	
  }
  console.log(imgsv)
  return lib.load_train_t(network.net,new StringArray(imgsv),imgsv.length-1);
 }


 exports.trainP = function (traind,i){
  lib.train_t(traind,i);
 }
 
 

 exports.saveWeights = function (network,name){
  lib.save_weights_i(network.net,name);
 }
 
 



