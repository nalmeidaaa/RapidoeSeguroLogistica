const { entregaModel } = require("../models/entregaModel");
const { clienteModel } = require("../models/clienteModel");

const { sql, getConnection } = require("../config/db");
const { Transaction } = require("mssql");

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

    // ---------------------
    // LISTAR TODAS AS ENTREGAS
    // GET/entregas
    // ---------------------  

    // ---------------------
    // LISTAR APENAS UMA ENTREGA
    // GET/entregas/:@idEntrega
    // ---------------------  

    listarEntrega: async (req, res) => {
        try {
            const { idEntrega } = req.params;

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
    // ATUALIZA UMA ENTREGA
    // POST /entregas
    /*
    {
        "idEntrega": "DE2D1E90-0091-4203-8D13-9BEB51A90A4C",
        "statusEntrega": "Entregue"
    }
     */
    //-------------

    atualizarEntrega: async (req, res) => {
        try {
            const { idEntrega, statusEntrega } = req.body;

            if (idEntrega.length != 36) {
                return res.status(400).json({ erro: 'id da entrega inválido.' });
            }

            if (statusEntrega == "Calculado" || statusEntrega == "Em transito" || statusEntrega == "Entregue" || statusEntrega == "Cancelado") {

                await entregaModel.atualizarEntrega(idEntrega, statusEntrega);
                res.status(200).json({ message: 'Entrega atualizada com sucesso!' });
            } else {
                return res.status(400).json({ erro: 'Status de entrega inválido.' });
            }

        } catch (error) {
            console.error('Erro ao atualizar entrega:', error);
            res.status(500).json({ erro: 'Erro no servidor ao atualizar entrega' });
        }
    },

    // ---------------------
    // DELETAR UM CLIENTE EXISTENTE
    // DELETE/clientes/:@idCliente
    // ---------------------  

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
