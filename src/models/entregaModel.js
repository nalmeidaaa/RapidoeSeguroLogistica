const { sql, getConnection } = require("../config/db");

const entregaModel = {
    buscarTodos: async () => {
        try {
            const pool = await getConnection();

            const querySQL = 'SELECT * FROM Entregas';

            const result = await pool.request().query(querySQL);

            return result.recordset;

        } catch (error) {
            console.error('Erro ao buscar entregas: ', error);
            throw error;
        }
    },

    buscarUm: async (idEntrega) => {
        try {
            const pool = await getConnection();

            const querySQL = 'SELECT * FROM Entregas WHERE idEntrega = @idEntrega';

            const result = await pool.request()
                .input('idEntrega', sql.UniqueIdentifier, idEntrega)
                .query(querySQL);

            return result.recordset;

        } catch (error) {
            console.error('Erro ao buscar entrega: ', error);
            throw error;
        }
    },

    inserirEntrega: async (idPedido, valorDistancia, valorPeso, acrescimoEntrega, descontoEntrega, taxaEntrega, valorFinal, statusEntrega) => {
        try {
            const pool = await getConnection();

            const querySQL = `
                INSERT INTO Entregas(idPedido, valorDistancia, valorPeso, acrescimoEntrega, descontoEntrega, taxaEntrega, valorFinal, statusEntrega)
                VALUES(@idPedido, @valorDistancia, @valorPeso, @acrescimoEntrega, @descontoEntrega, @taxaEntrega, @valorFinal, @statusEntrega)
            `;

            await pool.request()
                .input('idPedido', sql.UniqueIdentifier, idPedido)
                .input('valorDistancia', sql.Decimal(10, 2), valorDistancia)
                .input('valorPeso', sql.Decimal(10, 2), valorPeso)
                .input('acrescimoEntrega', sql.Decimal(10, 2), acrescimoEntrega)
                .input('descontoEntrega', sql.Decimal(10, 2), descontoEntrega)
                .input('taxaEntrega', sql.Decimal(10, 2), taxaEntrega)
                .input('valorFinal', sql.Decimal(10, 2), valorFinal)
                .input('statusEntrega', sql.VarChar(50), statusEntrega)
                .query(querySQL);

        } catch (error) {
            console.error('Erro ao inserir entrega: ', error);
            throw error;
        }
    },

    atualizarEntrega: async (idEntrega, idPedido, valorDistancia, valorPeso, acrescimoEntrega, descontoEntrega, taxaEntrega, valorFinal, statusEntrega) => {
        try {
            const pool = await getConnection();

            const querySQL = `
                UPDATE Entregas
                SET idPedido = @idPedido,
                    valorDistancia = @valorDistancia,
                    valorPeso = @valorPeso,
                    acrescimoEntrega = @acrescimoEntrega,
                    descontoEntrega = @descontoEntrega,
                    taxaEntrega = @taxaEntrega,
                    valorFinal = @valorFinal,
                    statusEntrega = @statusEntrega
                WHERE idEntrega = @idEntrega
            `;

            await pool.request()
                .input('idEntrega', sql.UniqueIdentifier, idEntrega)
                .input('idPedido', sql.UniqueIdentifier, idPedido)
                .input('valorDistancia', sql.Decimal(10, 2), valorDistancia)
                .input('valorPeso', sql.Decimal(10, 2), valorPeso)
                .input('acrescimoEntrega', sql.Decimal(10, 2), acrescimoEntrega)
                .input('descontoEntrega', sql.Decimal(10, 2), descontoEntrega)
                .input('taxaEntrega', sql.Decimal(10, 2), taxaEntrega)
                .input('valorFinal', sql.Decimal(10, 2), valorFinal)
                .input('statusEntrega', sql.VarChar(50), statusEntrega)
                .query(querySQL);

        } catch (error) {
            console.error('Erro ao atualizar entrega: ', error);
            throw error;
        }
    },

    deletarEntrega: async (idEntrega) => {
        try {
            const pool = await getConnection();

            const querySQL = 'DELETE FROM Entregas WHERE idEntrega = @idEntrega';

            await pool.request()
                .input('idEntrega', sql.UniqueIdentifier, idEntrega)
                .query(querySQL);

        } catch (error) {
            console.error('Erro ao deletar entrega: ', error);
            throw error;
        }
    }
}

module.exports = { entregaModel }
