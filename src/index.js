const express =require('express');
const app =express();

//configuracion de servidor
app.set('port',process.env.PORT || 3000);
//midelawares
app.use(express.json());
//routes
app.use(require('../src/routes/cervesas'));
//mostrar los detalles por consola
app.listen(app.get('port'),()=>{
console.log('server on port,app',app.get('port'));

});