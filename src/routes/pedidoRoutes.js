const express = require("express");
const router = express.Router();
const { pedidoController } = require("../controllers/pedidoController");

/**
 * Define as rotas relacionadas aos pedidos
 * 
 * @module pedidoRoutes
 * 
 * @description
 * - GET /pedidos -> Lista todos os pedidos do banco de dados
 * - GET /pedidos/:idPedido -> Lista apenas um pedido do banco de dados
 * - POST /pedidos -> Cria um novo pedido e os seus itens com os dados enviados pelo cliente HTTP
 * - PUT /pedidos -> Atualiza um produto
 * - DELETE /pedidos -> Deleta um produto
 */
router.get("/pedidos/:idPedido", pedidoController.listarPedidos);
router.get("/pedidos", pedidoController.listarPedidos);
router.post("/pedidos", pedidoController.criarPedido);
router.put("/pedidos/:idPedido", pedidoController.atualizarPedido);
// router.delete("/pedidos/:idPedido", pedidoController.deletarPedido);

module.exports = { pedidoRoutes: router };

