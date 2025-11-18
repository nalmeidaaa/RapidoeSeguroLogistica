const { sql, getConnection } = require("../config/db");

const clienteModel = {
    buscarTodos: async () => {
        try {

            const pool = await getConnection(); // Cria conexão com o Banco de Dados

            let sql = 'SELECT * FROM Clientes';

            const result = await pool.request().query(sql);

            return result.recordset;

        } catch (error) {
            console.error('Erro ao buscar clientes: ', error);
            throw error; // Passa o erro para o controler tratar
        }
    },

    buscarUm: async (idCliente) => {
        try {
            const pool = await getConnection(); // Cria conexão com o Banco de Dados

            const querySQL = 'SELECT * FROM Clientes WHERE idCliente = @idCliente';

            const result = await pool.request()
                .input('idCliente', sql.UniqueIdentifier, idCliente)
                .query(querySQL);

            return result.recordset;

        } catch (error) {
            console.error('Erro ao buscar o cliente: ', error);
            throw error; // Passa o erro para o controler tratar
        }
    },

    buscarCPF: async (cpfCliente) => {
        try {

            const pool = await getConnection(); // Cria conexão com o Banco de Dados

            const querySQL = 'SELECT * FROM Clientes WHERE cpfCliente = @cpfCliente;';

            const result = await pool.request()
                .input('cpfCliente', sql.Char(14), cpfCliente)
                .query(querySQL);

            return result.recordset;

        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            throw error; // Passa o erro para o controler tratar
        }
    },

    inserirCliente: async (nomeCliente, cpfCliente, telefoneCliente, emailCliente, logradouroCliente, numeroCliente, bairroCliente, cidadeCliente, estadoCliente, cepCliente) => {
        try {

            const pool = await getConnection(); // Cria conexão com o Banco de Dados

            let querySQL = 'INSERT INTO Clientes(nomeCliente, cpfCliente, telefoneCliente, emailCliente, logradouroCliente, numeroCliente, bairroCliente, cidadeCliente, estadoCliente, cepCliente) VALUES(@nomeCliente, @cpfCliente, @telefoneCliente, @emailCliente, @logradouroCliente, @numeroCliente, @bairroCliente, @cidadeCliente, @estadoCliente, @cepCliente)';

            await pool.request()
                .input('nomeCliente', sql.VarChar(100), nomeCliente) //Criar o nome do input, o tipo dela e o nomeCliente que foi recebido como parâmetro da função
                .input('cpfCliente', sql.Char(11), cpfCliente)
                .input('telefoneCliente', sql.VarChar(11), telefoneCliente)
                .input('emailCliente', sql.VarChar(100), emailCliente)
                .input('logradouroCliente', sql.VarChar(100), logradouroCliente)
                .input('numeroCliente', sql.VarChar(5), numeroCliente)
                .input('bairroCliente', sql.VarChar(100), bairroCliente)
                .input('cidadeCliente', sql.VarChar(100), cidadeCliente)
                .input('estadoCliente', sql.VarChar(100), estadoCliente)
                .input('cepCliente', sql.Char(9), cepCliente)
                .query(querySQL);

        } catch (error) {
            console.error('Erro ao inserir cliente: ', error);
            throw error; // Passa o erro para o controler tratar
        }
    },
    atualizarCliente: async (idCliente, nomeCliente, cpfCliente, telefoneCliente, emailCliente, logradouroCliente, numeroCliente, bairroCliente, cidadeCliente, estadoCliente, cepCliente) => {
        try {
            const pool = await getConnection(); // Cria conexão com o Banco de Dados

            const querySQL = `
                UPDATE Clientes
                SET nomeCliente = @nomeCliente,
                    cpfCliente = @cpfCliente,
                    telefoneCliente = @telefoneCliente,
                    emailCliente = @emailCliente,
                    logradouroCliente = @logradouroCliente,
                    numeroCliente = @numeroCliente,
                    bairroCliente = @bairroCliente,
                    cidadeCliente = @cidadeCliente,
                    estadoCliente = @estadoCliente,
                    cepCliente = @cepCliente
                WHERE idCliente = @idCliente
            `;

            await pool.request()
                .input('idCliente', sql.UniqueIdentifier, idCliente)
                .input('nomeCliente', sql.VarChar(100), nomeCliente)
                .input('cpfCliente', sql.Char(11), cpfCliente)
                .input('telefoneCliente', sql.VarChar(11), telefoneCliente)
                .input('emailCliente', sql.VarChar(100), emailCliente)
                .input('logradouroCliente', sql.VarChar(100), logradouroCliente)
                .input('numeroCliente', sql.VarChar(5), numeroCliente)
                .input('bairroCliente', sql.VarChar(100), bairroCliente)
                .input('cidadeCliente', sql.VarChar(100), cidadeCliente)
                .input('estadoCliente', sql.VarChar(100), estadoCliente)
                .input('cepCliente', sql.Char(9), cepCliente)
                .query(querySQL);

        } catch (error) {
            console.error('Erro ao atualizar cliente: ', error);
            throw error; // Passa o erro para o controler tratar
        }
    },
        deletarCliente: async (idCliente) => {
        try {
            const pool = await getConnection(); // Cria conexão com o Banco de Dados

            const querySQL = 'DELETE FROM Clientes WHERE idCliente=@idCliente'

            await pool.request()
                .input('idCliente', sql.UniqueIdentifier, idCliente)
                .query(querySQL);

        } catch (error) {
            console.error('Erro ao deletar cliente: ', error);
            throw error; // Passa o erro para o controler tratar
        }
    }
}

module.exports = { clienteModel }