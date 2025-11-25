const express = require("express");
const router = express.Router();
const { entregaController } = require("../controllers/entregaController");

/**
 * Define as rotas relacionadas aos pedidos
 * 
 * @module entregaRoutes
 * 
 * @description
 * - GET /entregas -> Lista as entregas do banco de dados
 * - POST /entregas -> Cria uma nova entrega e os seus itens com os dados enviados pelo cliente HTTP
 * - DELETE /entregas -> Deleta uma entrega
 */
router.get("/entregas", entregaController.listarEntrega);
router.get("/entregas/:idEntrega", entregaController.listarEntrega);
router.post("/entregas", entregaController.criarEntrega);
router.delete("/entregas/:idEntrega", entregaController.deletarEntrega);

module.exports = { entregaRoutes: router };

