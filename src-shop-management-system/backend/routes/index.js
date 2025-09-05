import auth from './authRoutes.js';
import cart from './cartRoutes.js';
import order from './orderRoutes.js';
import product from './productRoutes.js';
import user from './userRoutes.js';
import categoryRoutes from "./categoryRoutes.js";

export default (app) => {
  app.use('/api/auth', auth);
  app.use('/api/cart', cart);
  app.use('/api/orders', order);
  app.use('/api/products', product);
  app.use('/api/users', user);
  app.use("/api/categories", categoryRoutes);
};