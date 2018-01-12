var restful = require('node-restful');
var mongoose = restful.mongoose;


module.exports = function () {
    var Usuario = mongoose.Schema({
        usuario: { type: String, required: true },
        senha: { type: String, required: true },
        ativo: { type: Boolean, required: true }
    });


    var Model = restful.model('usuario', Usuario);

    Model.methods(['get', 'post', 'put', 'delete']);

    return Model;
}