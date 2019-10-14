//referencia para pdoer acceder a la libreria
const mysql = require('mysql');

//datos de conexión a la base de datos
const mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'prueba'
});

//validamos la conexión a la base de datos
mysqlConnection.connect(function (err) {
    if (err) {
        console.log(err);
        return;
    } else {
        console.log('me conecte');
    }
});
//exportamos el módulo
module.exports = mysqlConnection;