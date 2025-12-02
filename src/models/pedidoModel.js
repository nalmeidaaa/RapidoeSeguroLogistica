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

    inserirPedido: async (idCliente, valorDistancia, tipoEntrega, valorBase, valorPeso, valorFinal, dataPedido, distanciaPedido, cargaPedido, valorKM, valorKG, acrescimoEntrega, descontoEntrega, taxaEntrega, statusEntrega) => {
        const pool = await getConnection();

        const transaction = new sql.Transaction(pool);
        await transaction.begin(); // Inicia a transação

        try {
            let querySQL = `
                INSERT INTO Pedidos (idCliente, dataPedido, tipoEntrega, distanciaPedido, cargaPedido, valorKM, valorKG)
                OUTPUT INSERTED.idPedido
                VALUES (@idCliente, @dataPedido, @tipoEntrega, @distanciaPedido, @cargaPedido, @valorKM, @valorKG)
                `

            const result = await transaction.request()
                .input("idCliente", sql.UniqueIdentifier, idCliente)
                .input("dataPedido", sql.Date, dataPedido)
                .input("tipoEntrega", sql.VARCHAR(7), tipoEntrega)
                .input("distanciaPedido", sql.Int, distanciaPedido)
                .input("cargaPedido", sql.Int, cargaPedido)
                .input("valorKM", sql.DECIMAL(10, 2), valorKM)
                .input("valorKG", sql.DECIMAL(10, 2), valorKG)
                .query(querySQL);

           

            const pedido =  result.recordset[0].idPedido; 

            
            querySQL = `
                INSERT INTO Entregas(idPedido, valorDistancia, valorPeso, acrescimoEntrega, descontoEntrega, taxaEntrega, valorFinal, statusEntrega)
                VALUES(@idPedido, @valorDistancia, @valorPeso, @acrescimoEntrega, @descontoEntrega, @taxaEntrega, @valorFinal, @statusEntrega)
            `;

            await transaction.request()
                .input('idPedido', sql.UniqueIdentifier, pedido)
                .input('valorDistancia', sql.Decimal(10, 2), valorDistancia)
                .input('valorPeso', sql.Decimal(10, 2), valorPeso)
                .input('acrescimoEntrega', sql.Decimal(10, 2), acrescimoEntrega)
                .input('descontoEntrega', sql.Decimal(10, 2), descontoEntrega)
                .input('taxaEntrega', sql.Decimal(10, 2), taxaEntrega)
                .input('valorFinal', sql.Decimal(10, 2), valorFinal)
                .input('statusEntrega', sql.VarChar(15), statusEntrega)
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

            const transaction = new sql.Transaction(pool);
            await transaction.begin(); // Inicia a transação

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
            await transaction.request()
                .input('idPedido', sql.UniqueIdentifier, idPedido)
                .input('idCliente', sql.UniqueIdentifier, idCliente)
                .input("dataPedido", sql.Date, dataPedido)
                .input("tipoEntrega", sql.VARCHAR(7), tipoEntrega)
                .input("distanciaPedido", sql.Int, distanciaPedido)
                .input("cargaPedido", sql.Int, cargaPedido)
                .input("valorKM", sql.DECIMAL(10, 2), valorKM)
                .input("valorKG", sql.DECIMAL(10, 2), valorKG)
                .query(querySQL);
            await transaction.commit();

        } catch (error) {
            await transaction.rollback() // Desfaz tudo caso dê erro
            console.error('Erro ao atualizar pedido: ', error);
            throw error; // Passa o erro para o controler tratar
        }
    }
};

module.exports = { pedidoModel };