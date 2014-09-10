
var textualization = require('./textualization');

var jade = require('jade');
var fs = require('fs');

module.exports = new Renderer();
function Renderer(){
	var renderer = this;
	var cache = {};

	renderer.refresh = function(){
		var reloads = Object.keys(cache);
		cache = {};
		for(var t in reloads){
			renderer.load(reloads[t]);
		}
		return module.exports;
	}
	renderer.load = function(path){
		try {
			var source = fs.readFileSync(path,'utf8');
			cache[path]=jade.compile(source,{filename:path,pretty:true,debug:false,compileDebug:true});
			console.log(textualization.t12n('templates.cache-ok',{path:path}));
			delete source;
			return true;
		} catch(error){
			console.log(textualization.t12n('templates.cache-error',{path:path}),error);
			return false;
		}
	}
	renderer.preload = function(path){
		if(!cache[path]){
			renderer.load(path);
		}
		return module.exports;
	}
	renderer.render = function(path,locals){
		//if(cache[path] || load(path)){
		if(renderer.load(path)){
			return cache[path](locals);
		} else {
			return "";
		}
	}
}