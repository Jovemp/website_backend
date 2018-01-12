var express = require('express');
var load = require('express-load');
var helmet = require('helmet');
var bodyParser = require('body-parser');
var compression = require('compression');
var cookieParser = require('cookie-parser');
var cors = require("cors");

module.exports = function () {
	var app = express();

	// Formatar Json
	app.set("json spaces", 4);

	// Criando variavel para port no app
	app.set('port', 3005);

	// Criando um middleware de paginas staticas
	app.use(express.static('./public'));

	// Criando variavel para o ejs
	app.set('view engine', 'ejs');
	app.set('views', './app/views');



	// Criando middleware para aceitar post e delete
	app.use(cors());
	app.use(compression());
	app.use(bodyParser.urlencoded({extended: false}));
	app.use(bodyParser.json());
	//app.use(require('skipper')());
	//app.use(require('method-override')());
	//app.use(cookieParser());
	/*app.use(helmet.hidePoweredBy({ setTo: 'PHP 5.5.14' }));
	app.use(helmet.frameguard());
	app.use(helmet.xssFilter());
	app.use(helmet.dnsPrefetchControl());
	app.use(helmet.noSniff());
	app.use(helmet.hsts());*/

	// Carregando scripts das pastas models, controllers, routes e adicionando 
	// propriedades referentes no app
	// {cwd: 'app'} -> para direcionar para pasta app não a pasta raiz
	load('config',{ cwd: 'app' })
		.then('models')
		.then('routes')
		.into(app);


	return app;

}