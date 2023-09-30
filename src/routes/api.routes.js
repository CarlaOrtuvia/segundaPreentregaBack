import express from "express";
import userRouter from './users.routes.js';
import productRouter from './product.routes.js';
import cartRouter from './cart.routes.js';
import messageRouter from './message.routes.js';

const apiRouter = express.Router();


apiRouter.use('/users', userRouter)
apiRouter.use('/products', productRouter)
apiRouter.use('/carts', cartRouter)
apiRouter.use('/message', messageRouter)


export default apiRouter;