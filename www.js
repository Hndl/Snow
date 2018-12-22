'use explicit'
'use strict'

/*
 	2017 Nov 23	hndl 	-	removed the unused packages.
						-	now that we are using STRICT - had to include var/let against several var



 */

const util 								= require("util");
const fs 								= require("fs");
const readline							= require("readline");

var express 							= require("express");
var bodyParser 							= require("body-parser");

var app 								= express();


const HTTP_OK							= 200;
const HTTP_ERR							= 404;
const HTTP_IATP							= 418;


function setIPWhiteList( _a){
	console.log('whiteList:' + _a);
	try{
		IP_WHITELIST=_a.split(',');
	}catch(e){
		util.log(`[WARNING] ip whitelist unassigned! - $[err}`);
	}
}
function getIPWhiteList(){
	return (IP_WHITELIST);
}
function getIP(_r){
	let _ip = _r.connection.remoteAddress.split(':')[3];
	if (_ip == null ){
		_ip="";
	}
	return (_ip);
}

function allowed( _ip ){
	return (true);
	var b=false;
	var _ipwl=getIPWhiteList();
	if (_ipwl == null){
		util.log(`[WARN] default restricted, no IP whitelist supplied --ip`);
		return (b);
	}

	for ( var i = 0 ;i<_ipwl.length ; i++){
		if ( _ipwl[i].trim().toLowerCase()==='any' || _ipwl[i].trim() === _ip.trim()){
			b=true;
			i=_ipwl.length+1;
		}
	}
	util.log(`[INFO] [Auth:${b}] IP:${_ip} Allowed:'${getIPWhiteList()}'`);
	return (b);
}

function auth( req, res, next){
	try{
		if ( allowed( getIP(req) )){
			next();
		}else{
			res.status( HTTP_ERR).send('unauthorised');
		}
	} catch ( err ){
		util.log(`auth exception ${err}`);
		res.status( HTTP_ERR).send('unauthorised - unexpected - unwanted');
	}
	
}

/**
 *
 * MAIN
 *
 **/

 
 setIPWhiteList( 'localhost,127.0.0.1,any');

//app.use(bodyParser.json());
app.use(auth,bodyParser.urlencoded({ extended: false }));

app.use(auth,function(req, res, next) {
	util.log(` std route:${req.method} request for '${req.url}'`);
	next();
});
app.use(auth,express.static("./public"));


console.log(`Basic WWWW up @3000`);
app.listen(3000);

			
