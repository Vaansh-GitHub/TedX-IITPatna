import express from 'express';
import dotenv from "dotenv";
import connectDB from "./database/connect.js";
import {createBullBoard } from '@bull-board/api';
import {BullMQAdapter} from '@bull-board/api/bullMQAdapter';
import {ExpressAdapter} from '@bull-board/express';
import { myQueue } from './services/redis_queue/queue.js';

import adminRouter from "./routes/admin.routes.js";
import productRouter from "./routes/product.routes.js";
import cartRouter from "./routes/cart.routes.js";
import mailRouter from "./routes/mail.routes.js";

dotenv.config({ path: "./config/.env" });
const app = express();
const PORT = process.env.PORT || 3000;

//Connect to MongoDB
connectDB();

//Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Bull Board SetUp
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');
const {setQueues, replaceQueues, addQueue, removeQueue } = createBullBoard({
  queues: [ new BullMQAdapter(myQueue) ],
  serverAdapter: serverAdapter,
});

//Routes
app.use("/admin/products", adminRouter);
app.use("/products", productRouter);
app.use("/cart", cartRouter);
app.use("/email", mailRouter);
app.use("/admin/queues", serverAdapter.getRouter());

app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`);
});