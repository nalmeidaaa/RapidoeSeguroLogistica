const { entregaModel } = require("../models/entregaModel");
const { sql, getConnection } = require("../config/db");

const entregaController = {
    /**
     *
     * @async
     * @function listarEntrega
     * @param {object} req - Objeto da requisição (recebido do cliente HTTP)
     * @param {object} res - Objeto da resposta (enviado ao cliente HTTP)
     * @returns {Promise<void>} - Retorna uma resposta JSON com a lista de entregas.
     * @throws - Mostra no console e retorna erro 500 se ocorrer falha ao buscar as entregas.
    */
    listarEntrega: async (req, res) => {
        try {
            const { idEntrega } = req.query;

            if (idEntrega) {
                if (idEntrega.length != 36) {
                    return res.status(400).json({ erro: 'id da entrega inválido' });
                }

                const entrega = await entregaModel.buscarUm(idEntrega);
                return res.status(200).json(entrega);
            }

            const entregas = await entregaModel.buscarTodos();
            res.status(200).json(entregas);

        } catch (error) {
            console.error('Erro ao listar entrega:', error);
            res.status(500).json({ message: 'Erro interno no servidor ao buscar entrega.' });
        }
    },


    //-------------
    // CRIAR UMA NOVA ENTREGA
    // POST /entregas
    /*
    {
        "idPedido": "DE2D1E90-0091-4203-8D13-9BEB51A90A4C",
	    "statusEntrega": "Entregue"
    }
     */
    //-------------

    criarEntrega: async (req, res) => {
        try {
            const pool = await getConnection()
            const { idPedido, statusEntrega } = req.body;
            let querySQL = `SELECT distanciaPedido, valorKM, cargaPedido, valorKG, tipoEntrega FROM Pedidos
            WHERE idPedido = @idPedido`
            let result = await pool.request()
                .input('idPedido', sql.UniqueIdentifier, idPedido)
                .query(querySQL);

            const rs = result.recordset[0]

            let valorDistancia = rs.distanciaPedido * rs.valorKM;
            let valorPeso = rs.cargaPedido * rs.valorKG
            
            let valorBase = valorDistancia + valorPeso
            let valorFinal = valorBase

            //acrescimoEntrega
            let acrescimoEntrega = 0
            if (rs.tipoEntrega.toLowerCase() == "urgente") {
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
            if (rs.cargaPedido > 50) {
                taxaEntrega = 15
            }
            valorFinal = valorFinal + taxaEntrega - descontoEntrega
            console.log({ valorFinal });

            await entregaModel.inserirEntrega(idPedido, valorDistancia, valorPeso, acrescimoEntrega, descontoEntrega, taxaEntrega, valorFinal, statusEntrega);

            res.status(201).json({ message: 'Entrega cadastrada com sucesso!' });

        } catch (error) {
            console.error('Erro ao criar entrega:', error);
            res.status(500).json({ erro: 'Erro no servidor ao criar entrega' });
        }
    },

    deletarEntrega: async (req, res) => {
        try {
            const { idEntrega } = req.params;

            if (idEntrega.length != 36) {
                return res.status(400).json({ erro: 'id da entrega inválido' });
            }

            const entrega = await entregaModel.buscarUm(idEntrega);

            if (!entrega || entrega.length !== 1) {
                return res.status(404).json({ erro: 'Entrega não encontrada!' });
            }

            await entregaModel.deletarEntrega(idEntrega);

            res.status(200).json({ message: 'Entrega deletada com sucesso!' });

        } catch (error) {
            console.error('Erro ao deletar entrega', error);
            res.status(500).json({ erro: 'Erro no servidor ao deletar entrega' });
        }
    }
}

module.exports = { entregaController }
