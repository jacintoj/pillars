
var textualization = require('./textualization');
var t12n = textualization.t12n;

var Gangway = require('./Gangway');
var precasts = require('./precasts');

var http = require('http');
var MongoClient = require('mongodb').MongoClient;

module.exports = App;
function App(){
	var app = this;

	var running = false;
	Object.defineProperty(app,"running",{
		enumerable : true,
		get : function(){return running;},
	});

	Object.defineProperty(app,"languages",{
		enumerable : true,
		get : function(){return textualization.langs;},
		set : function(set){
			textualization.langs = set;
		}
	});

	var database = false;
	Object.defineProperty(app,"database",{
		enumerable : true,
		get : function(){return database;},
		set : function(set){
			var name = false;
			if(typeof set === "string"){
				name = set;
			} else if(set.name) {
				name = set.name;
			}
			if(name){
				var url = set.url || 'localhost';
				var port = set.port || 27017;
				if(database){
					// shutdown;
				}
				MongoClient.connect(
					"mongodb://"+url+":"+port+"/"+name,{
						db:{native_parser:false},
						server: {
							socketOptions: {connectTimeoutMS: 500,auto_reconnect: true}
						},
						replSet: {},
						mongos: {}
					},function(error, db) {
						if(error) {
							console.log(t12n('server.database.connection-error',{name:name,url:url,port:port}),error);
						} else {
							database = db;
							console.log(t12n('server.database.connection-ok',{name:name,url:url,port:port}));
						}
					}
				);
			}
		}
	});


	var server = http.createServer();
	Object.defineProperty(app,"server",{
		enumerable : true,
		get : function(){return server;}
	});
	server.pool = {};
	server.gangways = {};
	server.port;
	server.hostname;
	server.timeout = 20*1000;

	process.on('SIGINT', function() {
		server.close(function() {
			running = false;
			process.exit(0);
		});
	});

	server
	.on('error',function(error){
		running = false;
		console.log(t12n('server.error',{hostname:server.hostname,port:server.port}),error);
	})
	.on('listening',function(){
		server.timer=Date.now();console.log(t12n('server.listening',{hostname:server.hostname,port:server.port}));
	})
	.on('close',function(){
		running = false;
		console.log(t12n('server.closed',{
			hostname:server.hostname,
			port:server.port,
			timer:parseInt((Date.now()-server.timer)/1000/60*100)/100
		}));
	})
	.on('connection',function(socket){
		socket.poolid = Date.now().toString(36)+Math.round(Math.random()*10).toString(36);
		server.pool[socket.poolid] = socket;
		socket.timer = Date.now();
		socket.on('close',function(had_error){
			console.log(t12n('server.socket-closed',{
				had_error:had_error,
				poolid:socket.poolid,
				timer:parseInt((Date.now()-socket.timer)/1000/60*100)/100
			}));
			delete server.pool[socket.poolid];
		});
		console.log(t12n('server.socket-open',{poolid:socket.poolid}));
	})
	.on('request',function(req,res){
		router(new Gangway(app,req,res));
	})

	app.start = function(port,hostname){
		if(running){
			app.stop(starter);
		} else {
			starter();
		}
		function starter(){
			running = true;
			server.port = port || 3000;
			server.hostname = hostname || undefined;
			server.listen(server.port, server.hostname);
		}
		return app;
	};

	app.stop = function(callback){
		if(running){
			server.close(function() {
				server.port = undefined;
				server.hostname = undefined;
				if(callback){callback();}
			});
		}
		return app;
	}

	var pillars = {};
	Object.defineProperty(app,"pillars",{
		enumerable : true,
		get : function(){return pillarsOrdered;}
	});

	var pillarsOrdered = [];
	function pillarsOrder(){
		var pillarsArray = [];
		for(var i in pillars){pillarsArray.push(pillars[i]);}
		pillarsOrdered = pillarsArray.sort(function(a,b){
			return a.priority - b.priority || 0;
		});
	}

	app.add = function(pillar){
		if(pillars[pillar.id]){
			app.remove(pillar.id);
		}
		pillar.on('priorityUpdate',pillarsOrder);
		pillar.on('idUpdate',pillarIdChange);
		pillars[pillar.id] = pillar;
		pillarsOrder();
		return app;
	}

	app.get = function(pillarid){
		return pillars[pillarid] || false;
	}

	app.remove = function(pillarid){
		if(pillars[pillarid]){
			pillars[pillarid].removeListener('priorityUpdate', pillarsOrder);
			pillars[pillarid].removeListener('idUpdate',pillarIdChange);
			delete pillars[pillarid];
			pillarsOrder();
		}
		return app;
	}

	function pillarIdChange(oldid,newid){
		if(pillars[oldid] && oldid != newid){
			if(pillars[newid]){
				app.remove(newid);
			}
			pillars[newid] = pillars[oldid];
			delete pillars[oldid];
		}
	}

	Object.defineProperty(app,"routes",{
		enumerable : true,
		get : function(){
			var routes = [];
			for(var ip in app.pillars){
				var pillar = app.pillars[ip];
				routes[ip]={
					pillar:pillar.id,
					host: pillar.config.host,
					path: pillar.config.path,
					beams:[]
				};
				var beams = pillar.beams;
				for(var ib in beams){
					var beam = beams[ib];
					routes[ip].beams.push({
						beam: beam.id,
						method: beam.config.method,
						path: beam.config.path,
						priority: beam.priority
					});
				}
			}
			return routes;
		}
	});

	app
		.add(precasts.pillarsLogin)
		.add(precasts.pillarsStatic)
	;

}




function router(gw){
	if(!gw.encoding){
		gw.encoding = "identity";
		gw.error(406);
	}	else if(gw.textualization.langs.length>0 && !gw.language){
		gw.error(404);
	} else {
		if(!checkRoutes(gw)){gw.error(404);}
	}
	function checkRoutes(){
		for(var ip in gw.app.pillars){
			var pillar = gw.app.pillars[ip];
			if(pillar.host.test(gw.host) && pillar.path.test(gw.path)){
				var beams = pillar.beams;
				var beamPath = gw.path.replace(pillar.path,'');
				for(var ib in beams){
					var beam = beams[ib];
					if(beam.method.test(gw.method) && beam.path.test(beamPath)){
						gw.pillar = pillar;
						gw.beam = beam;
						gw.pillarPath = gw.path.match(pillar.path).shift();
						gw.beamPath = beamPath;
						if((gw.beam.session || gw.beam.account) && !gw.session){
							gw.getSession(function(error){
								if(error){
									gw.error(500,error);
								} else {
									beamPrepare();
								}
							});
						} else {
							beamPrepare();
						}
						return true;
					}
				}
			}
		}
		return false;
		function beamPrepare(){
			if(gw.beam.account && !gw.user) {
					gw.error(403);
			} else if(gw.content.length>gw.beam.maxlength){
				gw.error(413);
			} else if(!gw.contentReady) {
				gw.readContents(beamLauncher,gw.beam.upload);
			} else {
				beamLauncher();
			}
		}
		function beamLauncher(){
			var params = gw.beam.params;
			var matches = gw.beamPath.match(gw.beam.path).slice(1);
			for(var i in params){
				var param = params[i];
				gw.params[param] = decodeURIComponent(matches[i] || '');
			}
			gw.beam.launch(gw);
		}
	}
}

