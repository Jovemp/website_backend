var restful = require('node-restful');
var mongoose = restful.mongoose;


module.exports = function () {
    var Menu = mongoose.Schema({
        descricao: { type: String, required: true },
        tela_principal: { type: Boolean, required: true },
        link: { type: String },
        corpo: { type: String},
        lista_produto: { type: Boolean, required: true},
        contato: {type: Boolean, required: true},
        order: { type: Number, required: true}
    });


    var Model = restful.model('menu', Menu);

    Model.methods(['get', 'post', 'put', 'delete']);

    return Model;
}