const sql = require("mssql");

// Criar constante de configurações
const config = { // Database hospedado em somee.com
    user: process.env.USER_DB,
    password: process.env.PASSWORD_DB,
    server: process.env.SERVER_DB,
    database: 'Protagonistas',
    // Opções de conexões abaixo que devem ser dentro de chaves
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
}

async function getConnection() {// Função assíncrona - Que acontece simultâneamente
    try {

        const pool = await sql.connect(config);
        return pool;

    } catch (error) {
        console.error('Erro na conexão do SQL Server:', error);
    }
}

module.exports = {sql, getConnection};