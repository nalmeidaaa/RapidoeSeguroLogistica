const { pedidoModel } = require("../models/pedidoModel");
const { clienteModel } = require("../models/clienteModel");
const { produtoModel } = require("../models/produtoModel")

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
    listarPedidos: async (req, res) => {
        try {
            const { idPedido } = req.query; // Esse query pede o idProduto

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

            await pedidoModel.inserirPedido(idCliente, dataPedido, tipoEntrega, distanciaPedido, cargaPedido, valorKM, valorKG);

            res.status(201).json({ message: 'Pedido cadastrado com sucesso' });

        } catch (error) {
            console.error("Erro ao cadastrar pedido:", error);
            res.status(500).json({ erro: "Erro interno ao cadastrar pedido!" })
        }
    },
    atualizarPedido: async (req, res) => {
        try {
            const { idPedido } = req.params;
            const { idCliente, dataPedido } = req.body

            if (idPedido.length != 36) {
                return res.status(400).json({ erro: 'id do pedido inválido' });
            }
            const pedido = await pedidoModel.buscarUm(idPedido);
            if (!pedido || pedido.length !== 1) { //Se pedido não for válido, ou se tiver mais de um,
                return res.status(404).json({ erro: 'Pedido não encontrado!' })
            }

            if (idCliente) {
                if (idCliente.length != 36) {
                    return res.status(400).json({ erro: 'id do cliente inválido' });
                }
                const cliente = await clienteModel.buscarUm(idCliente);
                if (!cliente || cliente.length !== 1) { //Se cliente não for válido, ou se tiver mais de um,
                    return res.status(404).json({ erro: 'Cliente não encontrado!' })
                }
            }

            const pedidoAtual = pedido[0]

            const idClienteAtualizado = idCliente ?? pedidoAtual.idCliente; // Se o idCliente for desconhecido, nome Atualizado será o nome do cliente atual
            const dataPedidoAtualizado = dataPedido ?? pedidoAtual.dataPedido;

            await pedidoModel.atualizarPedido(idPedido, idClienteAtualizado, dataPedidoAtualizado);

            res.status(200).json({ message: 'Pedido atualizado com sucesso!' });

        } catch (error) {
            console.error('Erro ao atualizar pedido', error);
            res.status(500).json({ erro: 'Erro no servidor ao atualizar pedido' });
        }
    },
}
module.exports = { pedidoController }