const User = require('../models/User');
/*
Vamos usar este MID, para indicar si mostrar alguna parte de la barra de sesion

sera un MID de aplicacion 
*/


function userLoggedMiddleware(req, res, next) {
	//res.locals son varibles que puedo compartir en todas las vistas 

	res.locals.isLogged = false;//por defecto sera falso, asta q se logue alguien

	let emailInCookie = req.cookies.userEmail;
	let userFromCookie = User.findByField('email', emailInCookie);//buscar el usuario con ese email de la cookie  

	if (userFromCookie) {
		// si encuentro por email, paso directo al usuario, por "sesion" para loguearlo de forma automatica 
		req.session.userLogged = userFromCookie;//para recordad el usuario en el servidor y navegador

		//la sesion no caduca como la cookie
	}

	//session es una variable global 
	if (req.session.userLogged) {
		//si realmente tengo a alguin loguado
		res.locals.isLogged = true;//si tengo a alguien en sesion, sera verdad

		//pasando variables locales, para que sean compartidas por distintas vistas 
		res.locals.userLogged = req.session.userLogged;
	}

	next();
}

module.exports = userLoggedMiddleware;