var restful = require('node-restful');
var mongoose = restful.mongoose;
var multer = require('multer');
var upload = multer({ dest: './public/img/' });
var path = require('path');


module.exports = function () {
    var Produto = mongoose.Schema({
        nome: { type: String, required: true },
        descricao: { type: String, required: true },
        imagem: { type: String },
        ativo: { type: Boolean, required: true },
        order: { type: Number, required: true}
    });

    var storage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, './public/img');
        },
        filename: function (req, file, callback) {
            callback(null, Date.now('nano') + path.extname(file.originalname));
        }
    });
    var upload = multer({ storage: storage }).any();


    var Model = restful.model('produto', Produto);

    Model.methods(['get', 'post', 'put', 'delete']);

    /*Model.before('post', function (req, res, next) {
        var photos = "";
        upload(req, res, function (err) {
            if (err) {
                console.log(err);
                return res.end("Error uploading file.");
            }
            else {
                console.log(req.files.length);
                for (var i = 0; i < req.files.length; i++) {
                    photos = req.files[i]['filename'];
                }
                req.body.imagem = photos;
                req.body.descricao = req.headers['descricao'];
                req.body.nome = req.headers['nome']
                req.body.ativo = req.headers['ativo'];
                req.body.order = req.headers['order'];
                next();
            }
        });
    });*/

    return Model;
}