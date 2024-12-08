const loginRouter = require('./login');
const registerRouter = require('./register');
const productRouter = require('./admin/product');
const categoryRouter = require('./admin/category');
const cart = require('./cart');
const order = require('./order');
const homeRouter = require('./home');
const userRouter = require('./user');
const tokenRouter = require('./refreshToken');
function route(app) {

    app.use('/login', loginRouter);
    app.use('/register',registerRouter);
    app.use('/refresh', tokenRouter);

    //admin

    app.use('/admin/product',productRouter);
    app.use('/category',categoryRouter);
    app.use('/user',userRouter)
    
    //home
    app.use('/',homeRouter);
    
    app.use('/cart', cart);

    app.use('/order',order);
}

module.exports = route;
