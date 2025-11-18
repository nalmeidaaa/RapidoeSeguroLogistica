## API Reference 

### Clientes

#### GET /clientes
- **Descrição**: Obtém uma lista de clientes. Se colocar um idCliente no query params, aparecerá apenas o cliente especificado
- **Response**: Array de clientes

#### POST /clientes
- **Descrição**: Cria um novo cliente

#### PUT /clientes
- **Descrição**: Atualiza um cliente

#### DELETE /clientes
- **Descrição**: Deleta um cliente já existente
- **Body**:
```
Exemplo:
{
    "nomeCliente": "Nicolas",
    "cpfCliente": "98727348370",
    "telefoneCliente": "19998627390",
    "emailCliente": "nicolas@gmail.com",
    "logradouroCliente": "Rua dos sapos",
    "numeroCliente": "341",
    "bairroCliente": "Melancias", 
    "cidadeCliente": "Mato verde",
    "estadoCliente": "Minas Gerais",
    "cepCliente": "173172"
}
```
- **Response**:
```
{
    "message": "Cliente cadastrado com sucesso!"
}
```



### Pedidos

#### GET /pedidos
- **Descrição**: Obtém uma lista de pedidos
- **Response**: Array de pedidos

#### POST /pedidos
- **Descrição**: Cria um novo pedido

#### PUT /pedidos
- **Descrição**: Atualiza um novo pedido

- **Body**:
```
Exemplo:
{
    
    "idCliente": "DE2D1E90-0091-4203-8D13-9BEB51A90A4C",
    "dataPedido": "2025/11/18",
    "tipoEntrega": "URGENTE",
    "distanciaPedido": "100",
    "cargaPedido": "10",
    "valorKM": "20",
    "valorKG": "10"

}
```
- **Response**:
```
{
    "message": "Pedido cadastrado com sucesso!"
}
```



### Entregas

#### GET /entregas 
- **Descrição**: Lista todas as entregas

#### POST /entregas
- **Descrição**: Cria uma nova entrega

#### PUT /entregas
- **Descrição**: Atualiza uma entrega

- **Body**:
```
Exemplo:
{
    
    "idPedido": "DE2D1E90-0091-4203-8D13-9BEB51A90A4C",
	"statusEntrega": "Entregue"

}
```
- **Response**:
```
{
    "message": "Entrega cadastrada com sucesso!"
}
```