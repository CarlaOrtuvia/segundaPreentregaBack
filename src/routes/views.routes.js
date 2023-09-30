import express from "express";
import { CartManager } from "../dao/mongomanagers/cartMongoManager.js"

const viewsRouter = express.Router();


viewsRouter.get('/home', (req, res) => {
    res.render('home', {
        js: "chat.js",
        css: "chat.css",
        title: "Chat"
        
    });
})

viewsRouter.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', {
        css: "style.css",
        title: "Products",
        js: "realtime.js"

    })
})

viewsRouter.get('/carts/:cid', async (req, res) => {
    try {
        const cid = req.params.cid;
        const cart = await CartManager.findById(cid);
        console.log(cart)

        if (cart) {
            res.render('carts', { products: cart.products });
        } else {
            res.status(404).send({ respuesta: 'Error', mensaje: 'Carrito no encontrado' });
        }

    } catch (error) {
        res.status(400).send({ respuesta: 'Error', mensaje: error.message });
    }
});


viewsRouter.get('/chat', (req, res) => {
    res.render('chat', {
        js: "chat.js",
        css: "chat.css",
        title: "chat",
    });
});

export default viewsRouter;