function authMiddleware(req, res, next) {
	if (!req.session.userLogged) {
		//si no hay nadie en secion, se tiene que dirigir a login !!!
		return res.redirect('/user/login');
	}
	next();
}

module.exports = authMiddleware;