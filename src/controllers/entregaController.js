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

            
            //quero mostrar o valor da distancia no console como um objeto js

            // const { valorPeso } = result

            // const { descontoEntrega } = result

            // const { valorFinal } = result




            // result = await pool.request()
            //     .input('idPedido', sql.UniqueIdentifier, idPedido)
            //     // .input('valorDistancia', sql.Decimal(10, 2), valorDistancia)
            //     // .input('valorPeso', sql.Decimal(10, 2), valorPeso)
            //     // .input('acrescimoEntrega', sql.Decimal(10, 2), acrescimoEntrega)
            //     // .input('descontoEntrega', sql.Decimal(10, 2), descontoEntrega)
            //     // .input('taxaEntrega', sql.Decimal(10, 2), taxaEntrega)
            //     // .input('valorFinal', sql.Decimal(10, 2), valorFinal)
            //     // .input('statusEntrega', sql.VarChar(50), statusEntrega)
            //     .query(querySQL);
            // result.json(result.recordset)
            // console.log(result.json(result.recordset))

            // // Variáveis que a gente vai precisar:
            // // pedidosDistanciaPedido
            // // pedidosValorKM
            // // pedidosCargaPedido
            // // pedidosTipoEntrega
            // // pedidosValorKG
            // //pedidosDistanciaPedido = 

            // valorDistancia = distanciaPedido * valorKM
            // valorPeso = cargaPedido * valorKG
            // valorBase = valorDistancia + valorPeso

            // //acrescimoEntrega
            // let acrescimoEntrega = 0
            // if (tipoEntrega.toLowerCase() == "urgente") {
            //     acrescimoEntrega = valorBase * 0.2
            // }

            // valorFinal = valorBase + acrescimoEntrega

            // //descontoEntrega
            // descontoEntrega = 0
            // if (valorFinal > 500) {
            //     descontoEntrega = valorFinal * 0.1
            // }
            // valorFinal = valorFinal - descontoEntrega

            // //taxaEntrega
            // let taxaEntrega = 0
            // if (cargaPedido > 50) {
            //     taxaEntrega = 15
            // }
            // valorFinal = valorFinal + taxaEntrega

            // console

            // // querySQL = `
            // //     INSERT INTO Entregas(idPedido, valorDistancia, valorPeso, acrescimoEntrega, descontoEntrega, taxaEntrega, valorFinal, statusEntrega)
            // //     VALUES(@idPedido, @valorDistancia, @valorPeso, @acrescimoEntrega, @descontoEntrega, @taxaEntrega, @valorFinal, @statusEntrega)
            // // `;




            // // querySQL = `
            // //     INSERT INTO Entregas(idPedido, valorDistancia, valorPeso, acrescimoEntrega, descontoEntrega, taxaEntrega, valorFinal, statusEntrega)
            // //     VALUES(@idPedido, @valorDistancia, @valorPeso, @acrescimoEntrega, @descontoEntrega, @taxaEntrega, @valorFinal, @statusEntrega)
            // // `;

            // // await pool.request()
            // //     .query(querySQL)

            // // Colunas que não serão pedidas:
            // // valorDistancia
            // // valorPeso
            // // acrescimoEntrega
            // // valorFinal
            // // taxaEntrega
            // // descontoEntrega

            // // Coisas que devem ser calculadas: 
            // // valorDistancia: Pedidos.distanciaPedido x Pedidos.valorKM
            // // valorPeso: Pedidos.cargaPedido x Pedidos.valorKG
            // // valor base da entrega: valorDistancia + valorPeso
            // // acrescimoEntrega: se Pedidos.tipoEntrega = Urgente; +20% de acréscimo
            // // valorFinal: valor base da entrega + acrescimoEntrega
            // // descontoEntrega: se valorFinal for maior que 500, terá 10% de desconto
            // // taxaEntrega: Se Pedidos.cargaPedido for maior que 50kg, terá uma taxa fixa de 15 reais

            // if (idPedido == undefined || valorDistancia == undefined || valorPeso == undefined || acrescimoEntrega == undefined || descontoEntrega == undefined || taxaEntrega == undefined || valorFinal == undefined || statusEntrega == undefined) {
            //     return res.status(400).json({ erro: "Campos obrigatórios não preenchidos!" })
            // }

            // // if (idPedido == undefined || statusEntrega == undefined) {
            // //     return res.status(400).json({ erro: "Campos obrigatórios não preenchidos!" })
            // // }

            // if (idPedido.length != 36) {
            //     return res.status(400).json({ erro: "Id do Pedido inválido!" })
            // }



            await entregaModel.inserirEntrega(idPedido, valorDistancia, valorPeso, acrescimoEntrega, descontoEntrega, taxaEntrega, valorFinal, statusEntrega);

            res.status(201).json({ message: 'Entrega cadastrada com sucesso!' });

        } catch (error) {
            console.error('Erro ao criar entrega:', error);
            res.status(500).json({ erro: 'Erro no servidor ao criar entrega' });
        }
    },

    atualizarEntrega: async (req, res) => {
        try {
            const { idEntrega } = req.params;
            const { idPedido, valorDistancia, valorPeso, acrescimoEntrega, descontoEntrega, taxaEntrega, valorFinal, statusEntrega } = req.body;

            if (idEntrega.length != 36) {
                return res.status(400).json({ erro: 'id da entrega inválido' });
            }

            const entrega = await entregaModel.buscarUm(idEntrega);
            if (!entrega || entrega.length !== 1) {
                return res.status(404).json({ erro: 'Entrega não encontrada!' });
            }

            const entregaAtual = entrega[0];

            const idPedidoAtualizado = idPedido ?? entregaAtual.idPedido;
            const valorDistanciaAtualizado = valorDistancia ?? entregaAtual.valorDistancia;
            const valorPesoAtualizado = valorPeso ?? entregaAtual.valorPeso;
            const acrescimoEntregaAtualizado = acrescimoEntrega ?? entregaAtual.acrescimoEntrega;
            const descontoEntregaAtualizado = descontoEntrega ?? entregaAtual.descontoEntrega;
            const taxaEntregaAtualizado = taxaEntrega ?? entregaAtual.taxaEntrega;
            const valorFinalAtualizado = valorFinal ?? entregaAtual.valorFinal;
            const statusEntregaAtualizado = statusEntrega ?? entregaAtual.statusEntrega;

            await entregaModel.atualizarEntrega(idEntrega, idPedidoAtualizado, valorDistanciaAtualizado, valorPesoAtualizado, acrescimoEntregaAtualizado, descontoEntregaAtualizado, taxaEntregaAtualizado, valorFinalAtualizado, statusEntregaAtualizado);

            res.status(200).json({ message: 'Entrega atualizada com sucesso!' });

        } catch (error) {
            console.error('Erro ao atualizar entrega', error);
            res.status(500).json({ erro: 'Erro no servidor ao atualizar entrega' });
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
