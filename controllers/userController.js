const bcryptjs = require('bcryptjs');
/*
	me da 2 metodos interesantes 
	let hash =bcryptjs.hashSync('clave',10);


	bcryptjs.compareSync('clave',hash);  si son iguales => true 
 */
const {	validationResult } = require('express-validator');

const User = require('../models/User');

const controller = {
	register: (req, res) => {
		return res.render('userRegisterForm');
	},
	processRegister: (req, res) => {
		const resultValidation = validationResult(req);

		//si tengo errores de validacion corta aca el metodo
		if (resultValidation.errors.length > 0) {
			return res.render('userRegisterForm', {
				errors: resultValidation.mapped(),
				oldData: req.body
			});
		}
		//si pasa las validaciones sigue la ejecucion

		//voy hacer una validacion "no alla usuario con mismo imail"
		let userInDB = User.findByField('email', req.body.email);
		if (userInDB) {
			 //si encuentra un usuario con el mismo mail, mandara esta alerta !!
			return res.render('userRegisterForm', {
				errors: {
					email: {
						msg: 'Este email ya está registrado'
					}
				},
				oldData: req.body //para que me mantenga la info del formulario, asi corrija el usurio  
			});
		}
		//definimos los campos del nuevo usuario que vamos a agregar al JSON
		let userToCreate = {
			...req.body,//todo q nos dio el usuario
			password: bcryptjs.hashSync(req.body.password, 10),//la clave encreiptada, se pisa con la del body!!!!!!
			avatar: req.file.filename//y el nombre de la imagen cargada en el servidor
		}

		let userCreated = User.create(userToCreate);

		return res.redirect('/user/login');
	},
	login: (req, res) => {
		return res.render('userLoginForm');
	},
	loginProcess: (req, res) => {
		//Cuando el usuario quiere ingresar a su cuenta
		//queremos verificar si tenemos "req.body" registrada


		let userToLogin = User.findByField('email', req.body.email);//me da un usuario 
		
		//si encontro alguien por email
		if(userToLogin) {
			let isOkThePassword = bcryptjs.compareSync(req.body.password, userToLogin.password);

			//si la contraseña iniciada es igual a la contraseña en la BD
			if (isOkThePassword) {
				delete userToLogin.password;//para q no se conserve en la secion

				req.session.userLogged = userToLogin;//son todos los datos que se vana a guardar en la secion

				if(req.body.remember_user) {
					//si hay algo != undifaned


					//lo que va durar la cookie en la nav, por 60seg =1000 * 60
					//defino el campo, y lo q manda 
					res.cookie('userEmail', req.body.email, { maxAge: (1000 * 60) * 60 })
				}

				return res.redirect('/user/profile');//si todo sale bien !!! 
			} 

			//si la contraseña iniciada es distinta a la contraseña en la BD
			return res.render('userLoginForm', {
				errors: {
					email: {
						msg: 'Las credenciales son inválidas'
					}
				}
			});
		}


		//si no encontro alguien por email
 		return res.render('userLoginForm', {
			//lo cargo al "errors" para 
			errors: {
				email: {
					msg: 'No se encuentra este email en nuestra base de datos'
				}
			}
		});
	},
	profile: (req, res) => {
		//vemos que mostramos una vista con los valores que hay en las "secion " (coki)
		return res.render('userProfile', {
			user: req.session.userLogged
		});
	},

	logout: (req, res) => {
		res.clearCookie('userEmail');//para destruir la cookie
		req.session.destroy();//borra todo lo que este en secion
		return res.redirect('/');
	}
}

module.exports = controller;