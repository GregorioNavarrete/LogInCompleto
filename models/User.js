/*
  vamos a tener las funciones que queremos hacer al logear un usuario.
  Para tener toda la funcionalidad que me permite guardar o modificar valores de la BD 

  es como un "userServises"
*/

// 4. Editar la información de un usuario

const fs = require('fs');

const User = {
	//la direccion de la BD
	fileName: './database/users.json',

	getData: function () {
		//para tranforma el JSON a un ARRAY con el metodo ".parse"
		return JSON.parse(fs.readFileSync(this.fileName, 'utf-8'));
	},

	generateId: function () {
		//es un metodo para genera el siguinte "id" para asignar al nuevo usuario
		//????? no buscabamos el "id" mas alto siempre ?
		let allUsers = this.findAll();
		let lastUser = allUsers.pop();//este me da el ultimo usuario 
		if (lastUser) {
			//si es true, osea el ARRY JSON tien elementos
			return lastUser.id + 1;
		}
		return 1;//seria el primer eleneto del JSON 
	},

	findAll: function () {
		//para ontener todos los usuarios
		return this.getData();
	},

	findByPk: function (id) {
		//buscamos un usuario por su "primary key"
		let allUsers = this.findAll();
		let userFound = allUsers.find(oneUser => oneUser.id === id);
		return userFound;
	},

	findByField: function (field, text) {
		//vamos a buscar un usuariio segun un campo
		//si es un campo repetido, nos dara el primero como "country"
		let allUsers = this.findAll();
		let userFound = allUsers.find(oneUser => oneUser[field] === text);
		return userFound;
	},

	create: function (userData) {
		//agrego un nuevo usuario y lo agrego al JSON
		let allUsers = this.findAll();
		//creo el OBJ, le asigno un "id"y le asigno los campos q mando el usuario
		let newUser = {
			id: this.generateId(),
			...userData
		}
		allUsers.push(newUser);
		fs.writeFileSync(this.fileName, JSON.stringify(allUsers, null,  ' '));
		return newUser;
	},

	delete: function (id) {
		//para eliminar el usuario con un "id" espesifico 
		let allUsers = this.findAll();
		//vamos a poner todos los usuarios, menos el queremos eliminar 
		let finalUsers = allUsers.filter(oneUser => oneUser.id !== id);
		fs.writeFileSync(this.fileName, JSON.stringify(finalUsers, null, ' '));
		return true;
	}
}

module.exports = User;//par usarlo en el "controlador"

/******interesante forma de probar los metodo si ejecutar toda la pagina
 ******util para ver que tipos de "valores limites" o "tipos de datos" que pueden romper TODO
 ******y solucioinarlo con una "simple verificacion de caso " 

	console.log(User.findByPk(2));


	//y por la terminar ejecuto solo un archivo 

	$ node models/User.js

	//nos regresarai 
	{
		un obj con ese id
	}

*/