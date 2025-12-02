const { pedidoModel } = require("../models/pedidoModel");
const { clienteModel } = require("../models/clienteModel");
const { entregaModel } = require("../models/entregaModel");
const { sql, getConnection } = require("../config/db");
const { UniqueIdentifier } = require("mssql");

const pedidoController = {
    /** 
     * 
     * @async
     * @function listarPedidos
     * @param {object} req - Objeto da requisição (recebido do cliente HTTP)
     * @param {object} res - Objeto da resposta (enviado ao cliente HTTP)
     * @returns {Promise<void>} - Retorna uma resposta JSON com a lista de produtos.
     * @throws - Mostra no console e retorna erro 500 se ocorrer falha ao buscar os pedidos.
    */
    // ---------------------
    // LISTAR TODOS OS PEDIDOS
    // GET /entregas
    // --------------------- 
    // LISTAR UM PEDIDO
    // GET /pedidos/:idPedido
    // --------------------- 

    listarPedidos: async (req, res) => {
        try {
            const { idPedido } = req.params; // Esse query pede o idProduto

            if (idPedido) { //
                if (idPedido.length != 36) { // Verifica se o idPedido tem 36 caracteres
                    return res.status(400).json({ erro: 'id do pedido inválido' });
                }

                const pedido = await pedidoModel.buscarUm(idPedido);
                return res.status(200).json(pedido);

            }

            const pedidos = await pedidoModel.buscarTodos();
            res.status(200).json(pedidos);

        } catch (error) {
            console.error('Erro ao listar pedido:', error);
            res.status(500).json({ message: 'Erro interno no servidor ao buscar pedido.' }); // {objeto js}
        }
    },

    // ---------------------
    // CRIAR UM NOVO PEDIDO
    // POST /clientes
    /*
        {
            "idCliente": "idCliente"
            "dataPedido": “XXXX-XX-XX”
            "tipoEntrega": “Calculado” || "Em transito" || "Cancelado" || "Entregue"
            "distanciaPedido": 123
            "cargaPedido": 123
            "valorKM": 123
            "valorKG": 123
            "estadoCliente": “xx”
            "cepCliente": 12312-123
        }
    */
    // --------------------- 

    criarPedido: async (req, res) => {
        try {
            const { idCliente, dataPedido, tipoEntrega, distanciaPedido, cargaPedido, valorKM, valorKG } = req.body;

            if (idCliente == undefined || dataPedido == undefined || tipoEntrega == undefined || distanciaPedido == undefined || cargaPedido == undefined || valorKM == undefined || valorKG == undefined) {
                return res.status(400).json({ erro: "Campos obrigatórios não preenchidos!" })
            }

            if (idCliente.length != 36) {
                return res.status(400).json({ erro: "Id do Cliente inválido!" })
            }

            const cliente = await clienteModel.buscarUm(idCliente);

            if (!cliente || cliente.length != 1) {
                return res.status(404).json({ erro: "Cliente não encontrado!" });
            }

            if (isNaN(distanciaPedido) || isNaN(cargaPedido) || isNaN(valorKM) || isNaN(valorKG)) {
                return res.status(400).json({ erro: "Caracteres inválidos!" });
            }

            let valorDistancia = distanciaPedido * valorKM

            let valorPeso = cargaPedido * valorKG

            let valorBase = valorDistancia + valorPeso
            let valorFinal = valorBase

            //acrescimoEntrega
            let acrescimoEntrega = 0
            if (tipoEntrega.toLowerCase() == "urgente") {
                acrescimoEntrega = valorFinal * 0.2
            }
            valorFinal = valorFinal + acrescimoEntrega
            //descontoEntrega
            let descontoEntrega = 0
            if (valorBase > 500) {
                descontoEntrega = valorBase * 0.1
            }

            //taxaEntrega
            let taxaEntrega = 0
            if (cargaPedido > 50) {
                taxaEntrega = 15
            }
            valorFinal = valorFinal + taxaEntrega - descontoEntrega
            let statusEntrega = "Calculado"

            await pedidoModel.inserirPedido(idCliente, valorDistancia, tipoEntrega, valorBase, valorPeso, valorFinal, dataPedido, distanciaPedido, cargaPedido, valorKM, valorKG, acrescimoEntrega, descontoEntrega, taxaEntrega, statusEntrega);

            res.status(201).json({ message: 'Pedido cadastrado com sucesso' });

        } catch (error) {
            console.error("Erro ao cadastrar pedido:", error);
            res.status(500).json({ erro: "Erro interno ao cadastrar pedido!" })
        }
    },

    // ---------------------
    // ATUALIZA UM PEDIDO
    // POST /clientes
    /*
        {
            "idPedido": "idPedido"
            "idCliente": "idCliente"
            "dataPedido": “XXXX-XX-XX”
            "tipoEntrega": “Calculado” || "Em transito" || "Cancelado" || "Entregue"
            "distanciaPedido": 123
            "cargaPedido": 123
            "valorKM": 123
            "valorKG": 123
            "estadoCliente": “xx”
            "cepCliente": 12312-123
        }
    */
    // --------------------- 

    atualizarPedido: async (req, res) => {
        try {
            const { idPedido, idCliente, dataPedido, tipoEntrega, distanciaPedido, cargaPedido, valorKM, valorKG } = req.body;

            if (!idPedido || idPedido.length !== 36) {
                return res.status(400).json({ erro: 'ID do pedido inválido. Deve conter 36 caracteres.' });
            }
            if (idCliente && idCliente.length !== 36) {
                return res.status(400).json({ erro: 'ID do cliente inválido. Deve conter 36 caracteres.' });
            }

            const pedido = await pedidoModel.buscarUm(idPedido);
            if (!pedido || pedido.length !== 1) {
                return res.status(404).json({ erro: 'Pedido não encontrado!' });
            }
            if (idCliente) {
                const cliente = await clienteModel.buscarUm(idCliente);
                if (!cliente || cliente.length !== 1) {
                    return res.status(404).json({ erro: 'Cliente não encontrado!' });
                }
            }

            const pedidoAtual = pedido[0];
            const idClienteAtualizado = idCliente ?? pedidoAtual.idCliente;
            const dataPedidoAtualizado = dataPedido ?? pedidoAtual.dataPedido;
            const tipoEntregaAtualizado = tipoEntrega ?? pedidoAtual.tipoEntrega;
            const distanciaPedidoAtualizado = distanciaPedido ?? pedidoAtual.distanciaPedido;
            const cargaPedidoAtualizado = cargaPedido ?? pedidoAtual.cargaPedido;
            const valorKMAtualizado = valorKM ?? pedidoAtual.valorKM;
            const valorKGAtualizado = valorKG ?? pedidoAtual.valorKG;

            await pedidoModel.atualizarPedido(idPedido, idClienteAtualizado, dataPedidoAtualizado, tipoEntregaAtualizado, distanciaPedidoAtualizado, cargaPedidoAtualizado, valorKMAtualizado, valorKGAtualizado);

            const pool = await getConnection()

            let querySQL = `SELECT distanciaPedido, valorKM, cargaPedido, valorKG, tipoEntrega FROM Pedidos
            WHERE idPedido = @idPedido`
            let result = await pool.request()
                .input('idPedido', sql.UniqueIdentifier, idPedido)
                .query(querySQL);
            let valorDistancia = distanciaPedido * valorKM

            let valorPeso = cargaPedido * valorKG

            let valorBase = valorDistancia + valorPeso
            let valorFinal = valorBase

            //acrescimoEntrega
            let acrescimoEntrega = 0
            if (tipoEntrega.toLowerCase() == "urgente") {
                acrescimoEntrega = valorFinal * 0.2
            }
            valorFinal = valorFinal + acrescimoEntrega
            //descontoEntrega
            let descontoEntrega = 0
            if (valorBase > 500) {
                descontoEntrega = valorBase * 0.1
            }

            //taxaEntrega
            let taxaEntrega = 0
            if (cargaPedido > 50) {
                taxaEntrega = 15
            }
            valorFinal = valorFinal + taxaEntrega - descontoEntrega
            let statusEntrega = "Calculado"

            await entregaModel.inserirEntrega(idPedido, valorDistancia, valorPeso, acrescimoEntrega, descontoEntrega, taxaEntrega, valorFinal, statusEntrega);

            res.status(200).json({ message: 'Pedido atualizado com sucesso!' });

        } catch (error) {
            console.error('Erro ao atualizar pedido:', error.stack || error);
            res.status(500).json({ erro: 'Erro no servidor ao atualizar pedido', detalhes: error.message || error.toString() });
        }
    },
}
module.exports = { pedidoController }
