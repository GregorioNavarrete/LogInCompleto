function guestMiddleware(req, res, next) {
	if (req.session.userLogged) {
		//si tiene algo en "secion "  lo redirecciona y no deja entrar
		//a las rutas "registro y login" 
		//con el boton ni co la url, se puede parasr esta restriccion
		return res.redirect('/user/profile');
	}
	next();
}

module.exports = guestMiddleware;