const express = require("express");
const router = express.Router();
const { clienteController } = require("../controllers/clienteController");

// GET /clientes/:idCliente -> Lista apenas um dos clientes
router.get("/clientes/:idCliente", clienteController.listarClientes);

// GET /clientes -> Lista todos os clientes
router.get("/clientes", clienteController.listarClientes);

// POST /clientes -> Cria um novo cliente
router.post("/clientes", clienteController.criarCliente);

// PUT /clientes -> Atualiza um cliente
router.put("/clientes/:idCliente", clienteController.atualizarCliente);

// DELETE /clientes -> Deleta um cliente
router.delete("/clientes/:idCliente", clienteController.deletarCliente);

module.exports = { clienteRoutes: router };