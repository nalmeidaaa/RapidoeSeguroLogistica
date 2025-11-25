# TODO: Enhance pedido atualizarPedido functionality

## 1. Edit src/controllers/pedidoController.js
- Add detailed error logging with stack traces in atualizarPedido method.
- Add validation for each updatable field:
  - idCliente: must be 36-char string or undefined
  - dataPedido: if provided, must be valid date string
  - tipoEntrega: optional string validation (length/type)
  - distanciaPedido, cargaPedido: if provided, must be positive integers
  - valorKM, valorKG: if provided, must be positive decimal numbers
- Return descriptive JSON error responses if validation fails.
- After update query, confirm success and return updated pedido data or success message.
- Add example of valid HTTP PUT request payload in code comments.

## 2. Followup
- After implementing, test updating pedidos with various payloads.
- Check backend logs for improved error details.
- Verify API responses match expectations.

## Summary
Improve robustness of pedido update by strengthening validation, error handling, and client feedback to fix "not working" issues.
