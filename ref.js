const fs = require("fs");
// const { console } = require("inspector");
const promptSync = require("prompt-sync")();
const path = require("path");
const { stringify } = require("querystring");

// //nome do cliente e endereço

let nomeCliente = 0;
let enderecoCliente = 0;
let distanciaEntrega = 0;
let valorKm = 0;
let valorTotal = 0;
let tipoEntrega = 0;

let totalEntregas = 0;
let totalMediaEntregas = 0;

let continuar = "S"
let i = 1

let dados = []

while (continuar == "S") { // A condição se torna verdadeira até que a resposta dada no final de toda essa repetição seja "S".

    //Todos os "whiles" aqui dentro adicionam as informações que o usuário inserir, em suas seguintes variáveis. 
    // Nome do Cliente
    while (!isNaN(nomeCliente)) {
        nomeCliente = promptSync(`😊 Digite seu nome: `);
        if (!isNaN(nomeCliente)) {
            console.log("Erro: Nome inválido.");
        } else {
            console.log("Seu nome é " + nomeCliente);
        }
    }

    // Endereço do Cliente
    while (!isNaN(enderecoCliente)) {
        enderecoCliente = promptSync(`📍 Digite seu endereço: `);
        if (!isNaN(enderecoCliente)) {
            console.log("Erro: endereço inválido.");
        } else {
            console.log("Endereço definido como: " + enderecoCliente);
        }
    }

    // Distancia

    while (!isNaN(distanciaEntrega) && distanciaEntrega <= 0) {
        distanciaEntrega = parseFloat(promptSync("🚗 Digite a distância da entrega (em KM): "));

        if (isNaN(distanciaEntrega) || distanciaEntrega <= 0) {
            console.log("Erro: Distância inválida!");
            distanciaEntrega = 0
        } else {
            console.log("Distância definida como: " + distanciaEntrega);
        }
    }

    // Valor por KM

    while (!isNaN(valorKm) && valorKm <= 0) {
        valorKm = parseFloat(promptSync("💸Digite a Valor por KM (em reais): "));

        if (isNaN(valorKm) || valorKm <= 0) {
            console.log("Erro: Valor inválido!");
            valorKm = 0
        } else {
            console.log("Valor definido como: " + valorKm + " reais por KM.");
            totalEntregas = totalEntregas + valorKm
        }
    }

    // // Tipo Entrega

    while (tipoEntrega == 0) {
        tipoEntrega = promptSync("🎁Digite o tipo de entrega (Normal ou Urgente): ");

        if (tipoEntrega == "Normal") {
            console.log("Você definiu o tipo da entrega como Normal");
        } else {
            if (tipoEntrega == "Urgente") {
                console.log("Você definiu o tipo da entrega como Urgente")
            } else {
                tipoEntrega = 0
                console.log("Erro: Tipo de entrega inválida.")
            }
        }
    }

    // Processamento de Dados

    valorTotal = (distanciaEntrega * valorKm);

    if (tipoEntrega == "Urgente") {
        valorTotal = valorTotal * 1.2;
    }


    dados[i] = (`Seu nome é ${nomeCliente}, seu endereço é ${enderecoCliente}, a distância de entrega é ${distanciaEntrega}, o valor por KM é ${valorKm}, o tipo de entrega é ${tipoEntrega}, e o valor total é ${(valorTotal)}`);

    continuar = promptSync("Você deseja continuar? (S/N): ");
    i++

    // No final, tornamos todas as variáveis como 0, para o programa reiniciar e não dar nenhuma interferência de informações
    nomeCliente = 0;
    enderecoCliente = 0;
    distanciaEntrega = 0;
    valorKm = 0;
    valorTotal = 0;
    tipoEntrega = 0;

}

i = i - 1
totalMediaEntregas = totalEntregas / i // Essa linha tira a média de todas as entregas

console.log(`Dados salvos no arquivo "Dados Processados.txt"`)

let nomeArquivo = "Dados Processados";
let conteudo = "Aqui estão todas as informações que foram armazenadas:"
let j = 1

do { // Essa repetição adiciona todo o vetor dos dados numa única variável (conteudo)
    conteudo = `${conteudo}\n${j} - ${dados[j]};`
    j++
} while (j != i);

conteudo = `${conteudo}\n Foram ${i} entregas, e a média do custo de todas as entregas é de ${totalMediaEntregas};`

fs.writeFileSync("" + nomeArquivo + ".txt", conteudo, "utf8")