const express = require('express');
const session = require('express-session');
const cookies = require('cookie-parser');

const app = express();

const userLoggedMiddleware = require('./middlewares/userLoggedMiddleware');

//configuramos la secion
app.use(session({
	secret: "Shhh, It's a secret",
	resave: false, 
	saveUninitialized: false,
}));

app.use(cookies());

app.use(userLoggedMiddleware);// si o si va despues de "session" y "cookies"

app.use(express.urlencoded({ extended: false }));

app.use(express.static('./public'));
app.listen(3000, () => console.log('Servidor levantado en el puerto 3000'));

// Template Engine
app.set('view engine', 'ejs');

// Routers
const mainRoutes = require('./routes/mainRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/', mainRoutes);
app.use('/user', userRoutes);

//nota 
//el esquema MVC 
//M: modelos (simulamos una BD) 
//V: vistas
//C: controller
