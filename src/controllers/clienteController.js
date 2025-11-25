const { clienteModel } = require("../models/clienteModel");
const { sql, getConnection } = require("../config/db");
const { rows } = require("mssql");

const clienteController = {
    // ---------------------
    // LISTAR TODOS OS CLIENTES
    // GET /clientes
    // ---------------------

    listarClientes: async (req, res) => {
        try {
            const { idCliente } = req.params; // Esse params pede o idCliente

            if (idCliente) { //
                if (idCliente.length != 36) { // Verifica se o idCliente tem 36 caracteres 
                    return res.status(400).json({ erro: 'id do cliente inválido' });
                }

                const cliente = await clienteModel.buscarUm(idCliente);
                return res.status(200).json(cliente);

            }

            const clientes = await clienteModel.buscarTodos();
            res.status(200).json(clientes);
            // const Clientes = await clienteModel.buscarTodos();

            // res.status(200).json(Clientes);
        } catch (error) {
            console.error('Erro ao listar clientes:', error);
            res.status(500).json({ message: 'Erro ao buscar clientes.' });
        }
    },

    // ---------------------
    // CRIAR UM NOVO CLIENTE
    // POST /clientes
    /*
        {
            "nomeCliente": "valor",
            "cpfCliente": "12345678910"
            "telefoneCliente":
            "emailCliente": 
            "logradouroCliente":
            "numeroCliente":
            "bairroCliente":
            "cidadeCliente":
            "estadoCliente":
            "cepCliente"
        }
    */
    // ---------------------  
    criarCliente: async (req, res) => {
        try {
            //verificar se o CPF informado já está inserido e retornar uma mensagem de status 409 caso já exista)

            // Coleta de todas as informações do cliente
            const { nomeCliente, cpfCliente, telefoneCliente, emailCliente, logradouroCliente, numeroCliente, bairroCliente, cidadeCliente, estadoCliente, cepCliente } = req.body;

            // Esse if verifica se todos os campos estão preenchidos
            if (nomeCliente == undefined || cpfCliente == undefined || telefoneCliente == undefined || emailCliente == undefined || logradouroCliente == undefined || numeroCliente == undefined || bairroCliente == undefined || cidadeCliente == undefined || estadoCliente == undefined || cepCliente == undefined) {
                return res.status(400).json({ erro: 'Campos obrigatórios não preenchidos!' });
            }

            // Aqui será verificado se o CPF foi repetido
            const result = await clienteModel.buscarCPF(cpfCliente);
            if (result.length > 0) {
                return res.status(409).json({ message: 'CPF já cadastrado.' });
            }

            await clienteModel.inserirCliente(nomeCliente, cpfCliente, telefoneCliente, emailCliente, logradouroCliente, numeroCliente, bairroCliente, cidadeCliente, estadoCliente, cepCliente);

            res.status(201).json({ message: 'Cliente cadastrado com sucesso!' });

        } catch (error) {
            console.error('Erro ao cadastrar cliente:', error);
            res.status(500).json({ message: 'Erro no servidor ao cadastrar cliente.' });
        }
    },
    atualizarCliente: async (req, res) => {
        try {
            const { idCliente } = req.params;
            const { nomeCliente, cpfCliente, telefoneCliente, emailCliente, logradouroCliente, numeroCliente, bairroCliente, cidadeCliente, estadoCliente, cepCliente } = req.body;

            if (idCliente.length != 36) {
                return res.status(400).json({ erro: 'id do cliente inválido' });
            }
            const cliente = await clienteModel.buscarUm(idCliente);
            if (!cliente || cliente.length !== 1) { //Se cliente não for válido, ou se tiver mais de um,
                return res.status(404).json({ erro: 'Cliente não encontrado!' })
            }

            const clienteAtual = cliente[0]

            const nomeClienteAtualizado = nomeCliente ?? clienteAtual.nomeCliente; // Se o idCliente for desconhecido, nome Atualizado será o nome do cliente atual
            const cpfClienteAtualizado = cpfCliente ?? clienteAtual.cpfCliente;
            const telefoneClienteAtualizado = telefoneCliente ?? clienteAtual.telefoneCliente;
            const emailClienteAtualizado = emailCliente ?? clienteAtual.emailCliente;
            const logradouroClienteAtualizado = logradouroCliente ?? clienteAtual.logradouroCliente;
            const numeroClienteAtualizado = numeroCliente ?? clienteAtual.numeroCliente;
            const bairroClienteAtualizado = bairroCliente ?? clienteAtual.bairroCliente;
            const cidadeClienteAtualizado = cidadeCliente ?? clienteAtual.cidadeCliente;
            const estadoClienteAtualizado = estadoCliente ?? clienteAtual.estadoCliente;
            const cepClienteAtualizado = cepCliente ?? clienteAtual.cepCliente;

            await clienteModel.atualizarCliente(idCliente, nomeClienteAtualizado, cpfClienteAtualizado, telefoneClienteAtualizado, emailClienteAtualizado, logradouroClienteAtualizado, numeroClienteAtualizado, bairroClienteAtualizado, cidadeClienteAtualizado, estadoClienteAtualizado, cepClienteAtualizado);

            res.status(200).json({ message: 'Cliente atualizado com sucesso!' });

        } catch (error) {
            console.error('Erro ao atualizar cliente', error);
            res.status(500).json({ erro: 'Erro no servidor ao atualizar cliente' });
        }
    },
    deletarCliente: async (req, res) => {
        try {
            const { idCliente } = req.params;

            if (idCliente.length != 36) { // Verifica se o idCliente tem 36 caracteres 
                return res.status(400).json({ erro: 'id do cliente inválido' });
            }

            const cliente = await clienteModel.buscarUm(idCliente);

            if (!cliente || cliente.length !== 1) { //Se cliente não for válido, ou se tiver mais de um,
                return res.status(404).json({ erro: 'cliente não encontrado!' });
            }

            await clienteModel.deletarCliente(idCliente);

            res.status(200).json({ message: 'Cliente deletado com sucesso!' });

        } catch (error) {
            console.error('Erro ao deletar cliente', error);
            res.status(500).json({ erro: 'Erro no servidor ao deletar cliente' });
        }
    }
}

module.exports = { clienteController };