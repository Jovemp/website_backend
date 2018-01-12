var restful = require('node-restful');
var mongoose = restful.mongoose;
var multer = require('multer');
var upload = multer({ dest: './public/img/' });
var path = require('path');


module.exports = function (app) {
    var Principal = mongoose.Schema({
        nome: { type: String, required: true },
        descricao_breve: { type: String, required: true },
        imagem: { type: String, required: true },
        sobre: { type: String },
        endereco: { type: String },
        telefone: [{ type: String }],
        email: [{ type: String }],
        email_contato: {type: String},
        senha_email: {type: String},
        servico_email: {type: String},
        assunto_email: {type: String},
        dominio: {type: String}
    });

    var storage = multer.diskStorage({
        destination: function (req, file, callback) {
            console.log(file);
            callback(null, './public/img');
        },
        filename: function (req, file, callback) {
            console.log(file);
            callback(null, Date.now('nano') + path.extname(file.originalname));
        }
    });
    var upload = multer({ storage: storage }).any();

    var Model = restful.model('principal', Principal);

    Model.methods(['get', 'post', 'put', 'delete']);

    

    return Model;
}