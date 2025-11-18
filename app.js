require("dotenv").config();
const express = require('express'); //Serve para importar os requirimentos 
const app = express(); //Serve para criar uma instância do express 

// const { } = require("./src/routes/produtoRoutes");
const {clienteRoutes} = require('./src/routes/clienteRoutes');
const {pedidoRoutes} = require('./src/routes/pedidoRoutes');
const {entregaRoutes} = require('./src/routes/entregaRoutes');

const PORT = 8081; //Serve para inserir uma porta 

app.use(express.json());

app.use('/', clienteRoutes)
app.use('/', pedidoRoutes)
app.use('/', entregaRoutes)

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
})