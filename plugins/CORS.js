// jshint strict:true, node:true, camelcase:true, curly:true, maxcomplexity:15, newcap:true
"use strict";

var pillars = require('../index');
var crier = require('crier').addGroup('pillars').addGroup('midleware').addGroup('CORS');
var Midleware = require('../lib/Midleware');

var midleware = module.exports = new Midleware({
  id: 'CORS'
}, function (gw, done) {
  if (gw.origin) {
    var cors = gw.routing.check('cors', pillars.config.cors);
    if (cors === true || (Array.isArray(cors) && cors.indexOf(gw.origin) >= 0)) {
      gw.cors.origin = gw.origin;
      gw.cors.credentials = true;
      gw.cors.headers = gw.req.headers['access-control-request-headers']?gw.req.headers['access-control-request-headers'].split(','):false;
      gw.cors.methods = Array.isArray(gw.routing.inheritance.method)?gw.routing.inheritance.method.concat(['OPTIONS', 'HEAD']):['GET','PUT','POST','DELETE','OPTIONS', 'HEAD'];
    }
  }
  done();
});
