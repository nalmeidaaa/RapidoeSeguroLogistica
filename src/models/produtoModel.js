const { sql, getConnection } = require("../config/db");

const produtoModel = {
    buscarTodos: async () => {
        try {
            const pool = await getConnection();

            let sql = 'SELECT * FROM Produtos';

            const result = await pool.request().query(sql);

            return result.recordset;

        } catch (error) {
            console.error('Erro ao buscar produtos: ', error);
            throw error;
        }
    },

    buscarUm: async (idProduto) => {
        try {
            const pool = await getConnection();

            const querySQL = 'SELECT * FROM Produtos WHERE idProduto = @idProduto';

            const result = await pool.request()
                .input('idProduto', sql.UniqueIdentifier, idProduto)
                .query(querySQL);

            return result.recordset;

        } catch (error) {
            console.error('Erro ao buscar o produto: ', error);
            throw error;
        }
    },

    inserirProduto: async (nomeProduto, descricaoProduto, precoProduto, qtdEstoque) => {
        try {
            const pool = await getConnection();

            let querySQL = 'INSERT INTO Produtos(nomeProduto, descricaoProduto, precoProduto, qtdEstoque) VALUES(@nomeProduto, @descricaoProduto, @precoProduto, @qtdEstoque)';

            await pool.request()
                .input('nomeProduto', sql.VarChar(100), nomeProduto)
                .input('descricaoProduto', sql.VarChar(200), descricaoProduto)
                .input('precoProduto', sql.DECIMAL(10, 2), precoProduto)
                .input('qtdEstoque', sql.Int, qtdEstoque)
                .query(querySQL);

        } catch (error) {
            console.error('Erro ao inserir produto: ', error);
            throw error;
        }
    },

    atualizarProduto: async (idProduto, nomeProduto, descricaoProduto, precoProduto, qtdEstoque) => {
        try {
            const pool = await getConnection();

            const querySQL = `
                UPDATE Produtos
                SET nomeProduto = @nomeProduto,
                    descricaoProduto = @descricaoProduto,
                    precoProduto = @precoProduto,
                    qtdEstoque = @qtdEstoque
                WHERE idProduto = @idProduto
            `
            await pool.request()
                .input('nomeProduto', sql.VarChar(100), nomeProduto)
                .input('descricaoProduto', sql.VarChar(200), descricaoProduto)
                .input('precoProduto', sql.DECIMAL(10, 2), precoProduto)
                .input('qtdEstoque', sql.Int, qtdEstoque)
                .input('idProduto', sql.UniqueIdentifier, idProduto)
                .query(querySQL);

        } catch (error) {
            console.error('Erro ao atualizar produto: ', error);
            throw error;
        }
    },

    deletarProduto: async (idProduto) => {
        try {
            const pool = await getConnection();

            let querySQL = 'DELETE FROM Produtos WHERE idProduto = @idProduto';

            await pool.request()
                .input('idProduto', sql.UniqueIdentifier, idProduto)
                .query(querySQL);

        } catch (error) {
            console.error('Erro ao deletar produto: ', error);
            throw error;
        }
    }
};

module.exports = { produtoModel }
