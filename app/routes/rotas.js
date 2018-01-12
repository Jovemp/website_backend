const express = require('express');
var fs = require('fs');
var multiparty = require('connect-multiparty');
var path = require('path');
var nodemailer = require('nodemailer');
var crypto = require('crypto-js');

module.exports = function (app) {

    const router = express.Router();


    app.use('/api', router);
    var principal = app.models.principal;
    var menu = app.models.menu;
    var produto = app.models.produto;
    var usuario = app.models.usuario;
    var password = '$#%$INDU#VRET$';

    principal.register(router, '/principal');
    menu.register(router, '/menu');
    produto.register(router, '/produto');
    usuario.register(router, '/usuario');

    router.route('/login').post(function (req, res) {
        var login = req.body;
        usuario.find({
            usuario: login.usuario,
            senha: login.senha,
            ativo: true
        })
            .then(result => {
                if (result.length > 0) {
                    res.status(201).json(result[0]);
                } else {
                    res.status(201).send(false);
                }
            })
    });

    router.route('/altera-senha').post(function (req, res) {
        var senha = req.body;

        var usu = {
            senha: senha.senhaNova
        }

        usuario.update({
            _id: senha._id,
            usuario: senha.usuario,
            senha: senha.senhaAtual
        }, { $set: usu}, function (err, raw) {
            if (err) {
                res.send(err);
            }
            res.send(raw);
        });
    });

    router.route('/contato').post(function (req, res) {
        var email = req.body;
        principal.find()
            .then(result => {

                var dec = crypto.AES.decrypt(result[0].senha_email, password).toString(crypto.enc.Utf8);;

                var transporter = nodemailer.createTransport({
                    service: result[0].servico_email,
                    auth: {
                        user: result[0].email_contato,
                        pass: dec
                    }
                });

                var mailOptions = {
                    from: result[0].nome + ' <' + result[0].email_contato + '>',
                    to: result[0].email[0],
                    subject: result[0].assunto_email,
                    text: 'Nome: ' + email.nome + ' ' +
                    'Telefone: ' + email.telefone + ' ' +
                    'E-Mail: ' + email.email + ' ' +
                    'Mensagem: ' + email.message
                };


                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        res.status(401).json(error);
                    }
                    res.status(201).json(info);
                });
            })

    });

    router.route('/upload_file').post(multiparty(), function (req, res) {
        var photos = "";
        var path_public = __dirname + '/../../public/img';
        var arquivo = req.files.file;
        var temporario = req.files.file.path;
        photos = +Date.now('nano') + path.extname(req.files.file.originalFilename);
        var saveTo = path_public + '/' + photos;
        fs.rename(temporario, saveTo, function (err) {
            if (err) {
                res.status(500).json({ error: err })
            }
            res.json({ link: "http://localhost:3005/img/" + photos });
        });
    });

    router.get('/load_images', function (req, res) {
        // Retorna um array com string dos arquivos da pasta pública.
        var path_public = __dirname + '/../../public/img';
        fs.readdir(path_public, function (err, fotos) {
            var retorno = [];
            for (var i = 0; i < fotos.length; i++) {
                retorno.push({
                    url: 'http://localhost:3005/img/' + fotos[i],
                    thumb: 'http://localhost:3005/img/' + fotos[i],
                    tag: fotos[i],
                    id: fotos[i].substring(0, 13)
                });
            }
            res.status(200).json(retorno);
        });
    });

    router.delete('/load_images', function (req, res) {
        var imagem = req.body.src;
        var id = req.body.id;

        var path_public = __dirname + '/../../public/img';

        imagem = imagem.substring(imagem.indexOf(id));

        console.log(imagem);

        fs.stat(path_public + '/' + imagem, function (err, stats) {
            if (err) {
                console.log(err);
                res.status(401);
            }

            fs.unlink(path_public + '/' + imagem, function (err) {
                if (err) return console.log(err);
                res.status(202).json(req.body);
            });
        });

    });



}