### Clientes

#### GET /clientes

  - **Descrição**: Obtém uma lista de todos os clientes.
  - **Response**: Array de clientes
  - **Possíveis Códigos de Erro (HTTP Status)**:
      - `500 Internal Server Error`: Erro ao buscar clientes no servidor.

#### GET /clientes/{idCliente}

  - **Descrição**: Obtém os detalhes de um cliente específico. O **ID** do cliente deve ser fornecido no `path params`.
  - **Path Params**: `idCliente` (UUID)
  - **Response**: Objeto cliente
  - **Possíveis Códigos de Erro (HTTP Status)**:
      - `400 Bad Request`: ID do cliente inválido (não possui 36 caracteres).
      - `404 Not Found`: Cliente não encontrado.
      - `500 Internal Server Error`: Erro ao buscar o cliente.

#### POST /clientes

  - **Descrição**: Cria um novo cliente.
  - **Body**:

<!-- end list -->

```json
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
    "cepCliente": "17317200"
}
```

  - **Response**:

<!-- end list -->

```json
{
    "message": "Cliente cadastrado com sucesso!"
}
```

  - **Possíveis Códigos de Erro (HTTP Status)**:
      - `400 Bad Request`: Campos obrigatórios não preenchidos.
      - `409 Conflict`: CPF, Telefone ou Email já cadastrados.
      - `500 Internal Server Error`: Erro no servidor ao cadastrar cliente.

#### PUT /clientes

  - **Descrição**: Atualiza um cliente já existente. O **ID** do cliente deve ser fornecido no **Body** (conforme código).
  - **Body**:

<!-- end list -->

```json
Exemplo:
{
    "idCliente": "19F2FD7B-E803-4643-8010-5F970DFD7544",
    "nomeCliente": "Nikolas",
    "cpfCliente": "28727348370",
    "telefoneCliente": "29998627390",
    "emailCliente": "nikolas@outlook.com",
    "logradouroCliente": "Rua das rãs",
    "numeroCliente": "273",
    "bairroCliente": "Macaxeiras", 
    "cidadeCliente": "Mato marrom",
    "estadoCliente": "Minas Únicas",
    "cepCliente": "42317200"
}
```

  - **Response**:

<!-- end list -->

```json
{
    "message": "Cliente atualizado com sucesso!"
}
```

  - **Possíveis Códigos de Erro (HTTP Status)**:
      - `400 Bad Request`: ID do cliente inválido.
      - `404 Not Found`: Cliente não encontrado.
      - `409 Conflict`: CPF, Telefone ou Email já cadastrados por outro cliente.
      - `500 Internal Server Error`: Erro no servidor ao atualizar cliente.

#### DELETE /clientes/{idCliente}

  - **Descrição**: Deleta um cliente já existente. O **ID** do cliente deve ser fornecido no `path params`.
  - **Path Params**: `idCliente` (UUID)
  - **Response**:

<!-- end list -->

```json
{
    "message": "Cliente deletado com sucesso!"
}
```

  - **Possíveis Códigos de Erro (HTTP Status)**:
      - `400 Bad Request`: ID do cliente inválido.
      - `404 Not Found`: Cliente não encontrado.
      - `409 Conflict`: Cliente está vinculado a um pedido ativo e não pode ser deletado.
      - `500 Internal Server Error`: Erro no servidor ao deletar cliente.

-----

### Pedidos

#### GET /pedidos

  - **Descrição**: Obtém uma lista de todos os pedidos.
  - **Response**: Array de pedidos
  - **Possíveis Códigos de Erro (HTTP Status)**:
      - `500 Internal Server Error`: Erro ao buscar pedidos.

#### GET /pedidos/{idPedido}

  - **Descrição**: Obtém os detalhes de um pedido específico. O **ID** do pedido deve ser fornecido no `path params`.
  - **Path Params**: `idPedido` (UUID)
  - **Response**: Objeto pedido
  - **Possíveis Códigos de Erro (HTTP Status)**:
      - `400 Bad Request`: ID do pedido inválido.
      - `404 Not Found`: Pedido não encontrado.
      - `500 Internal Server Error`: Erro ao buscar o pedido.

#### POST /pedidos

  - **Descrição**: Cria um novo pedido, gerando automaticamente a entrega com status **"Calculado"**.
  - **Body**:

<!-- end list -->

```json
Exemplo:
{
    "idCliente": "DE2D1E90-0091-4203-8D13-9BEB51A90A4C",
    "dataPedido": "2025/11/18",
    "tipoEntrega": "URGENTE",
    "distanciaPedido": 100,
    "cargaPedido": 10,
    "valorKM": 20,
    "valorKG": 10
}
```

  - **Response**:

<!-- end list -->

```json
{
    "message": "Pedido cadastrado com sucesso"
}
```

  - **Possíveis Códigos de Erro (HTTP Status)**:
      - `400 Bad Request`: Campos obrigatórios não preenchidos, ID do cliente inválido ou campos numéricos com caracteres inválidos.
      - `404 Not Found`: Cliente não encontrado.
      - `500 Internal Server Error`: Erro interno ao cadastrar pedido.

#### PUT /pedidos

  - **Descrição**: Atualiza os dados de um pedido existente, recalculando os valores. O **ID** do pedido deve ser fornecido no **Body** (conforme código).
  - **Body**:

<!-- end list -->

```json
Exemplo:
{
    "idPedido": "A1B2C3D4-1234-5678-ABCD-EFGHIJKLMN12",
    "idCliente": "DE2D1E90-0091-4203-8D13-9BEB51A90A4C", // Opcional
    "dataPedido": "2025/12/18",
    "tipoEntrega": "NORMAL",
    "distanciaPedido": 200,
    "cargaPedido": 5,
    "valorKM": 25,
    "valorKG": 12
}
```

  - **Response**:

<!-- end list -->

```json
{
    "message": "Pedido atualizado com sucesso!"
}
```

  - **Possíveis Códigos de Erro (HTTP Status)**:
      - `400 Bad Request`: ID do pedido/cliente inválido.
      - `404 Not Found`: Pedido não encontrado ou Cliente (se `idCliente` for enviado) não encontrado.
      - `500 Internal Server Error`: Erro no servidor ao atualizar pedido.

-----

### Entregas

#### GET /entregas

  - **Descrição**: Obtém uma lista de todas as entregas.
  - **Response**: Array de entregas
  - **Possíveis Códigos de Erro (HTTP Status)**:
      - `500 Internal Server Error`: Erro interno no servidor ao buscar entregas.

#### GET /entregas/{idEntrega}

  - **Descrição**: Obtém os detalhes de uma entrega específica. O **ID** da entrega deve ser fornecido no `path params`.
  - **Path Params**: `idEntrega` (UUID)
  - **Response**: Objeto entrega
  - **Possíveis Códigos de Erro (HTTP Status)**:
      - `400 Bad Request`: ID da entrega inválido.
      - `404 Not Found`: Entrega não encontrada.

#### PUT /entregas

  - **Descrição**: Atualiza o status de uma entrega já existente. O `idEntrega` deve ser fornecido no **Body** (conforme código).
  - **Body**:

<!-- end list -->

```json
Exemplo:
{
    "idEntrega": "DE2D1E90-0091-4203-8D13-9BEB51A90A4C",
    "statusEntrega": "Em transito" // Valores permitidos: "Calculado", "Em transito", "Entregue", "Cancelado"
}
```

  - **Response**:

<!-- end list -->

```json
{
    "message": "Entrega atualizada com sucesso!"
}
```

  - **Possíveis Códigos de Erro (HTTP Status)**:
      - `400 Bad Request`: ID da entrega ou `statusEntrega` inválido.
      - `500 Internal Server Error`: Erro no servidor ao atualizar entrega.

#### DELETE /entregas/{idEntrega}

  - **Descrição**: Deleta uma entrega já existente. O **ID** da entrega deve ser fornecido no `path params`.
  - **Path Params**: `idEntrega` (UUID)
  - **Response**:

<!-- end list -->

```json
{
    "message": "Entrega deletada com sucesso!"
}
```

  - **Possíveis Códigos de Erro (HTTP Status)**:
      - `400 Bad Request`: ID da entrega inválido.
      - `404 Not Found`: Entrega não encontrada.
      - `500 Internal Server Error`: Erro no servidor ao deletar entrega.

-----