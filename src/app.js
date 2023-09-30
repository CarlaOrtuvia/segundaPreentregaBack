import express from 'express'
import mongoose from 'mongoose'
import { engine } from 'express-handlebars';
import { Server }  from 'socket.io'
import dotenv from 'dotenv';
import exphbs from 'express-handlebars';
import Handlebars from 'handlebars';


import viewRouter from './routes/views.routes.js'


import { __dirname } from './utils.js';
import { messageModel } from "./dao/models/message.models.js"
import { productModel } from './dao/models/products.model.js';
import path from 'path';
import apiRouter from './routes/api.routes.js';

const viewsRouter = viewRouter;
const apisRouter = apiRouter;
dotenv.config();
const app = express()
const PORT = 5060


const server =  app.listen(PORT, () => {
    console.log(`Server on Port ${PORT}`)
})


// conexion a la base de datos de mongodb
mongoose.connect(`mongodb+srv://carlitaortuvia:${process.env.passmongodb}@cluster0.rvdrpi8.mongodb.net/`)
.then(() => console.log('BDD conectada'))
.catch(() => console.log('Error en conexion a BDD'))

//Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const hbs = exphbs.create({
    defaultLayout: 'main', // si tienes un layout principal, coloca su nombre aquí
    handlebars: Handlebars, 
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
});

app.engine('handlebars', hbs.engine) //Defino que motor de plantillas voy a utilizar y su config
app.set('view engine', 'handlebars') //Setting de mi app de hbs
app.set('views', path.resolve(__dirname, './views')) //Resolver rutas absolutas a traves de rutas relativas
app.use('/home', express.static(path.join(__dirname, '/public'))) //Unir rutas en una sola concatenandolas
app.use('/realtimeproducts', express.static(path.join(__dirname, '/public')))

// RUTAS
app.use('/',viewsRouter)
app.use('/api', apisRouter)


// Socket.io
const io = new Server(server);

io.on('connection', (socket)=> {
    console.log('servidor de socket io conectado')

    socket.on('add-message', async ({email, mensaje}) => {
        console.log(mensaje)
        await messageModel.create({email: email, message: mensaje})
        const messages = await messageModel.find();
        socket.emit('show-messages', messages);
    })

    socket.on('display-inicial', async() =>{
        const messages = await messageModel.find();
        socket.emit('show-messages', messages);
    })

    socket.on('add-product', async (nuevoProd) => {
        const { title, description, price, code, stock, category } = nuevoProd;
        await productModel.create({title: title, description: description, price: price, code: code, stock: stock, category: category});
        const products = await productModel.find();
        socket.emit('show-products', products);
    })

    socket.on('update-products', async () => {
        const products = await productModel.find();
        socket.emit('show-products', products);
    });

    socket.on('remove-product', async ({ code }) => {
        try {
            console.log("inicio remove socket")
            await productModel.deleteOne({ code: code });
            const products = await productModel.find();
            socket.emit('show-products', products);
        }catch (error) {
            console.error('Error eliminando producto:', error);
        }

    })
})