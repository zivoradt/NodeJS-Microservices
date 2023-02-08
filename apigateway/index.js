import express from "express";
import cors from 'cors';
import proxy from "express-http-proxy";

const PORT = 8000;
const app = express();

app.use(express.json());
app.use(cors());

app.use('/customer', proxy('http://localhost:8001'));
app.use('/products', proxy('http://localhost:8002')); // Products
app.use('/shopping', proxy('http://localhost:8003'));

app.listen(PORT, ()=>{
    console.log(`Customer lisening to Port: ${PORT}`);
})