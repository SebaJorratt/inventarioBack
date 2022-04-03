import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import mysql from 'mysql';
import myconn from 'express-myconnection';

const app = express();

// Middleware
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Opciones de mysql
const dbOptions ={
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'inventario'
}

//Middlewares
app.use(myconn(mysql, dbOptions, 'single'))

// Rutas 
app.use('/api', require('./routes/api'));
app.use('/auth', require('./routes/auth'));

// Middleware para Vue.js router modo history
const history = require('connect-history-api-fallback');
app.use(history());
app.use(express.static(path.join(__dirname, 'public')));





app.set('puerto', process.env.PORT || 3000);
app.listen(app.get('puerto'), () => {
  console.log('Entrada en el puerto '+ app.get('puerto'));
});

