
'statusCodes':function(){
	switch(code){
		case 400:
			return 'Solicitud erronea';
		case 403:
			return 'No tienes las credenciales necesarias para acceder a este recurso';
		case 404:
			return 'La página no existe';
		case 406:
			return 'Codificación incompatible';
		case 408:
			return 'Tiempo de solicitud agotado';
		case 413:
			return 'El tamaño de la solicitud supera el limite establecido';
		case 500:
			return 'Error interno del servidor';
		default:
			return 'Error desconocido';
	}
},
'server':{
	'error':"Error en el servidor ".red+"%(hostname)s:%(port)s".yellow,
	'listening':"Servidor escuchando en ".green+"%(hostname)s:%(port)s".yellow,
	'closed':"Servidor detenido ".red+"%(hostname)s:%(port)s".yellow+" %(timer)sm".grey,
	'socket-closed': function(){return "%(poolid)s".magenta+" Socket cerrado".red+(had_error?' (error en la transmisión)'.yellow:'')+" %(timer)sm".grey;},
	'socket-open': "%(poolid)s".magenta+" Socket abierto".green,
	'database':{
		'connection-ok':"Base de datos ".green+"'%(name)s'".yellow+" connectada en ".green+"%(url)s:%(port)s".yellow,
		'connection-error':"Error en la base de datos ".red+"'%(name)s'".yellow+" en ".red+"%(url)s:%(port)s".yellow
	}
},
'textualization':{
	'langs':function(){
		if(langs && langs.length>0){
			return "Lenguajes de textualización habilitados: ".cyan+langs.join(',').yellow;
		} else {
			return "No existen lenguajes habilitados para textualización".cyan;
		}
	},
	'load-ok':"Hoja de textualización cargada ".cyan+"(%(count)s nodos)".yellow+": ".cyan+"'%(path)s'".yellow+", lenguaje: ".cyan+"%(lang)s".yellow,
	'load-error':"Error al carga la hoja de textualización: ".red+"'%(path)s'".yellow+", lenguaje: ".red+"%(lang)s".yellow,
	'heap-rewrite':"Nodo de textualización sobrescrito ".red+"'%(element)s'".yellow+": ".red+"'%(path)s'".yellow+", languaje: ".red+"%(lang)s".yellow
},
'templates':{
	'ok':"Plantilla ".cyan+"'%(path)s'".yellow+" cargada".cyan,
	'error':"Error al cargar la plantilla ".red+"'%(path)s'".yellow,
	'msg':"No existe el template '%(path)s'."
},
'gangway':{
	'session':{
		'database-error':"No es posible acceder al almacén de sesiones",
		'insert-error':"No ha sido posible crear la sesión",
		'update-error':"No ha sido posible actualizar los datos de sesión"
	},
	'unlinktemp':{
		'ok':"Archivo temporal %(file)s' borrado".green.inverse.white,
		'error':"Error al borrar el archivo temporal '%(file)s'".red.inverse.white
	},
	'close':(PILLARS.requestIds?"%(poolid)s %(id)s ".magenta:'')+"%(method)s:".cyan+" %(path)s".white+" [%(code)s]".cyan+"  %(size)sbytes %(timer)sms".grey,
	'error':{
		'h1':"Error %(code)s %(explain)s, disculpe las molestias"
	}
},
'config':{
	'unknow': "Variable de entorno desconocida".red+" %(prop)s =".cyan+" %(value)s".yellow,
	'ok': "Variable de entorno modificada".green+" %(prop)s =".cyan+" %(value)s".yellow
},
'login':{
	'title':"Acceder",
	'h1':"Introduce tu nombre de usuario y contraseña",
	'ok':"Todo correcto, estas dentro",
	'fail':"Usuario y/o contraseña erroneos, prueba de nuevo",
	'user':{
		'label':"Usuario",
		'placeholder':"Nombre de usuario"
	},
	'password':{
		'label':"Contraseña",
		'placeholder':"Tu tremendisimamente segura contraseña"
	},
	'redirect':{
		'label':"Redirección",
		'placeholder':"URL para redirigir en caso de exito, si en serio"
	},
	'submit':"Enviar",
},
'static':{
	'title': "Listando directorio %(path)s",
	'h1': "%(path)s"
},
'env':{
	'uploadsDirectory':{
		'alert':'Directorio de subida de archivos sin definir'.yellow.reverse,
		'error':'No existe el directorio para subida de archivos: '.red+'%(path)s'.magenta,
		'ok':'Directorio de subida de archivos correcto en: '.green+'%(path)s'.yellow
	},
	'tempDirectory':{
		'alert':'Directorio temporal sin definir'.yellow.reverse,
		'error':'No existe el directorio temporal: '.red+'%(path)s'.magenta,
		'ok':'Directorio temporal correcto en '.green+'%(path)s'.yellow
	}
}




