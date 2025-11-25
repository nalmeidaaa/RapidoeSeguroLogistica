const { sql, getConnection } = require("../config/db");

const pedidoModel = {
    /**
     * Busca todos os pedidos e seus respectivos itens no banco de dados.
     * 
     * @async
     * @function buscarTodos
     * @returns {Promise<Array>} Retorna uma lista com todos os pedidos em seus itens.
     * @throws Mostra no console o erro e propaga o erro caso a busca falhe.
     */
    buscarTodos: async () => {
        try {
            const pool = await getConnection();

            const querySQL = `
                SELECT idPedido, idCliente, CONVERT(VARCHAR(10), dataPedido, 120) AS dataPedido, tipoEntrega, distanciaPedido, cargaPedido, valorKM, valorKG FROM Pedidos
            `;

            const result = await pool.request()
                .query(querySQL);

            return result.recordset;
        } catch (error) {
            console.error("Erro ao buscar pedidos:", error)
            throw error
        }
    },

    buscarUm: async (idPedido) => {
        try {
            const pool = await getConnection(); // Cria conexão com o Banco de Dados

            const querySQL = 'SELECT * FROM Pedidos WHERE idPedido = @idPedido';

            const result = await pool.request()
                .input('idPedido', sql.UniqueIdentifier, idPedido)
                .query(querySQL);

            return result.recordset;

        } catch (error) {
            console.error('Erro ao buscar o pedido: ', error);
            throw error; // Passa o erro para o controler tratar
        }
    },


    inserirPedido: async (idCliente, dataPedido, tipoEntrega, distanciaPedido, cargaPedido, valorKM, valorKG) => {
        const pool = await getConnection();

        const transaction = new sql.Transaction(pool);
        await transaction.begin(); // Inicia a transação

        try {
            let querySQL = `
                INSERT INTO Pedidos (idCliente, dataPedido, tipoEntrega, distanciaPedido, cargaPedido, valorKM, valorKG)
                VALUES (@idCliente, @dataPedido, @tipoEntrega, @distanciaPedido, @cargaPedido, @valorKM, @valorKG)
            `

            await transaction.request()
                .input("idCliente", sql.UniqueIdentifier, idCliente)
                .input("dataPedido", sql.Date, dataPedido)
                .input("tipoEntrega", sql.VARCHAR(7), tipoEntrega)
                .input("distanciaPedido", sql.Int, distanciaPedido)
                .input("cargaPedido", sql.Int, cargaPedido)
                .input("valorKM", sql.DECIMAL(10, 2), valorKM)
                .input("valorKG", sql.DECIMAL(10, 2), valorKG)
                .query(querySQL);

            await transaction.commit();

        } catch (error) { //Se alguma dessas operações der erro, dará um rollback
            await transaction.rollback() // Desfaz tudo caso dê erro
            console.error("Erro ao inserir pedido:", error)
            throw error;
        }
    },

    atualizarPedido: async (idPedido, idCliente, dataPedido, tipoEntrega, distanciaPedido, cargaPedido, valorKM, valorKG) => {
        try {
            const pool = await getConnection(); // Cria conexão com o Banco de Dados

            const querySQL = `
                UPDATE Pedidos
                SET idCliente = @idCliente,
                    dataPedido = @dataPedido,
                    tipoEntrega = @tipoEntrega,
                    distanciaPedido = @distanciaPedido,
                    cargaPedido = @cargaPedido,
                    valorKM = @valorKM,
                    valorKG = @valorKG
                WHERE idPedido = @idPedido
            `
            await pool.request()
                .input('idPedido', sql.UniqueIdentifier, idPedido)
                .input('idCliente', sql.UniqueIdentifier, idCliente)
                .input("dataPedido", sql.Date, dataPedido)
                .input("tipoEntrega", sql.VARCHAR(7), tipoEntrega)
                .input("distanciaPedido", sql.Int, distanciaPedido)
                .input("cargaPedido", sql.Int, cargaPedido)
                .input("valorKM", sql.DECIMAL(10, 2), valorKM)
                .input("valorKG", sql.DECIMAL(10, 2), valorKG)
                .query(querySQL);

        } catch (error) {
            console.error('Erro ao atualizar pedido: ', error);
            throw error; // Passa o erro para o controler tratar
        }
    }
};

module.exports = { pedidoModel };