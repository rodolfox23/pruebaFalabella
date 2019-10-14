const express = require('express');
const router = express.Router();
//instanciamos para poder conectarnos
const mysqlConnection = require('../database');
//instanciamos para llamar las apis
var request = require('request');

//-------------------------------------------------------------------------//
router.get('/Beers', (req, res) => {

    mysqlConnection.query('SELECT * FROM beeritem', (err, rows, fields) => {
        const respuesta = {
            respuesta: "200",
            description: "Operacion exitosa",
            items: rows
        };
        if (!err) {
            res.json(respuesta);
        } else {
            res.json(err);
        }
    });
});

//-------------------------------------------------------------------------//


//--------------------------------------------------------------------------//

router.post('/Beers', (req, res) => {

    const { id, Name, Brewery, Country, Price, Currency } = req.body;
    var validado = 1;

    if (!id) {
        res.json("El campo id es requerido");
        validado = 0;
    }

    if (!Name) {
        res.json("El campo Name es requerido");
        validado = 0;
    }

    if (!Brewery) {
        res.json("El campo Brewery es requerido");
        validado = 0;
    }

    if (!Country) {
        res.json("El campo Brewery es requerido");
        validado = 0;
    }
    if (!Price) {
        res.json("El campo Brewery es requerido");
        validado = 0;
    }
    if (!Price) {
        res.json("El campo Brewery es requerido");
        validado = 0;
    }

    if (validado == 1) {
        mysqlConnection.query('SELECT * FROM beeritem where id= ?', [id], (err, rows, fields) => {
            if (rows[0]) {
                const respuesta1 = {
                    respuesta: "409",
                    description: "El ID de la cerveza ya existe",
                };
                res.json(respuesta1);
            } else {
                mysqlConnection.query('INSERT INTO beeritem SET ? ',
                    {
                        id,
                        Name,
                        Brewery,
                        Country,
                        Price,
                        Currency
                    }
                    , (err, result) => {
                        if (!err) {
                            const respuesta2 = {
                                respuesta: "201",
                                description: "Cerveza creada",
                            };
                            res.json(respuesta2);
                        } else {
                            const respuesta3 = {
                                respuesta: "400",
                                description: "Request invalida",
                            };
                            res.json(respuesta3);
                        }
                    });
            }
        });
    }

});



//--------------------------------------------------------------------------//




//--------------------------------------------------------------------------//

router.get('/beers/:beerID', (req, res) => {
    const { beerID } = req.params;
    if (beerID) {
        mysqlConnection.query('SELECT * FROM beeritem where id= ?', [beerID], (err, rows, fields) => {
            if (!err) {
                if (rows[0].id) {
                    const respuesta1 = {
                        respuesta: "200",
                        description: "Operación exitosa",
                        valores: rows //no fue pedido pero me parecio importante
                    };
                    res.json(respuesta1);
                } else {
                    const respuesta2 = {
                        respuesta: "404",
                        description: "El Id de la cerveza no existe",
                    };
                    res.json(respuesta2);
                }
            } else {
                res.json(err);
            }
        });
    } else {
        res.json("El campo beerID es requerido");
    }
});

//--------------------------------------------------------------------------//


//--------------------------------------------------------------------------//
//No me queda muyclaro esta parte 
router.get('/beets/:beerID/boxprice', (req, res) => {

    const { beerID } = req.params;

    mysqlConnection.query('SELECT * FROM beerbox where id= ?', [beerID], (err, rows, fields) => {
        if (!err) {

            request.get("http://apilayer.net/api/live?access_key=9bef11defe583b46a4679f28cfccdced&currencies=USD&source=" + rows[0].Currency + "&format=1", (error, response, body) => {

                var monedaHomologar = JSON.parse(body).quotes.USDEUR;

                if (!rows[0]) {
                    const respuesta2 = {
                        respuesta: "404",
                        description: "El Id de la cerveza no existe",
                    };
                    res.json(respuesta2);
                } else {
                    var conversion = monedaHomologar * rows[0].PriceTotal
                    const respuesta1 = {
                        respuesta: "200",
                        description: "Operación exitosa",
                        valor: rows[0].quantity * conversion 
                    };
                };
                res.json(respuesta1);
            });
        } else {
            res.json(err);
        }
    });
});

//--------------------------------------------------------------------------//
module.exports = router;