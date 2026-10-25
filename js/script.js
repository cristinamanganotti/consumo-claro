const formulario = document.getElementById("formulario-consumo");
const listaConsumo = document.getElementById("lista-consumo");
const resultadoComparacao = document.getElementById("resultado-comparacao");
const botaoLimpar = document.getElementById("limpar-historico");

// Recupera os registros salvos no navegador
let consumos = JSON.parse(localStorage.getItem("consumos")) || [];

// Formata o mês para exibição
function formatarMes(mes) {
    const partes = mes.split("-");
    const ano = partes[0];
    const numeroMes = Number(partes[1]);

    const nomesMeses = [
        "janeiro", "fevereiro", "março", "abril",
        "maio", "junho", "julho", "agosto",
        "setembro", "outubro", "novembro", "dezembro"
    ];

    return nomesMeses[numeroMes - 1] + " de " + ano;
}

// Mostra os registros na página
function mostrarConsumos() {
    if (consumos.length === 0) {
        listaConsumo.innerHTML = "<p>Nenhum consumo registrado ainda.</p>";
        return;
    }

    listaConsumo.innerHTML = "";

    consumos.forEach(function (item) {
        const registro = document.createElement("div");

        registro.classList.add("registro-consumo");

        registro.innerHTML = `
            <p><strong>Mês:</strong> ${formatarMes(item.mes)}</p>
            <p><strong>Consumo:</strong> ${item.consumo} kWh</p>
            <p><strong>Valor:</strong> R$ ${item.valor.toFixed(2).replace(".", ",")}</p>
        `;

        listaConsumo.appendChild(registro);
    });
}

// Registra um novo consumo
formulario.addEventListener("submit", function (event) {
    event.preventDefault();

    const mes = document.getElementById("mes").value;
    const consumo = Number(document.getElementById("consumo").value);
    const valor = Number(document.getElementById("valor").value);

    // Verifica se os dados são válidos
    if (mes === "" || consumo <= 0 || valor < 0) {
        alert("Confira os dados informados.");
        return;
    }

    // Verifica se o mês já foi registrado
    const mesExistente = consumos.some(function (item) {
        return item.mes === mes;
    });

    if (mesExistente) {
        alert("Esse mês já foi registrado. Escolha outro mês.");
        return;
    }

    // Cria o novo registro
    const novoConsumo = {
        mes: mes,
        consumo: consumo,
        valor: valor
    };

    // Adiciona o registro e organiza os meses
    consumos.push(novoConsumo);

    consumos.sort(function (a, b) {
        return a.mes.localeCompare(b.mes);
    });

    // Salva os registros no navegador
    localStorage.setItem("consumos", JSON.stringify(consumos));

    // Atualiza o histórico e a comparação
    mostrarConsumos();
    compararConsumo();

    // Limpa os campos do formulário
    formulario.reset();
});

// Compara os dois últimos registros
function compararConsumo() {
    resultadoComparacao.classList.remove("aumento", "reducao", "estavel");

    if (consumos.length < 2) {
        resultadoComparacao.textContent =
            "Registre pelo menos dois meses para comparar seu consumo.";
        return;
    }

    const anterior = consumos[consumos.length - 2];
    const atual = consumos[consumos.length - 1];

    const diferenca = atual.consumo - anterior.consumo;
    const percentual = (diferenca / anterior.consumo) * 100;

    const periodoAnterior = formatarMes(anterior.mes);
    const periodoAtual = formatarMes(atual.mes);

    if (diferenca > 0) {
        resultadoComparacao.classList.add("aumento");

        resultadoComparacao.textContent =
            "Atenção: o consumo aumentou " +
            diferenca.toFixed(2).replace(".", ",") +
            " kWh (" + percentual.toFixed(2).replace(".", ",") +
            "%) entre " + periodoAnterior + " e " + periodoAtual + ".";

    } else if (diferenca < 0) {
        resultadoComparacao.classList.add("reducao");

        resultadoComparacao.textContent =
            "Boa notícia! O consumo diminuiu " +
            Math.abs(diferenca).toFixed(2).replace(".", ",") +
            " kWh (" + Math.abs(percentual).toFixed(2).replace(".", ",") +
            "%) entre " + periodoAnterior + " e " + periodoAtual + ".";

    } else {
        resultadoComparacao.classList.add("estavel");

        resultadoComparacao.textContent =
            "O consumo permaneceu igual entre " +
            periodoAnterior + " e " + periodoAtual + ".";
    }
}

// Limpa o histórico de consumo
botaoLimpar.addEventListener("click", function () {
    if (consumos.length === 0) {
        alert("O histórico já está vazio.");
        return;
    }

    const confirmar = confirm(
        "Tem certeza de que deseja apagar todo o histórico de consumo?"
    );

    if (!confirmar) {
        return;
    }

    consumos = [];

    localStorage.setItem("consumos", JSON.stringify(consumos));

    mostrarConsumos();
    compararConsumo();
});

// Exibe os registros ao abrir a página
mostrarConsumos();
compararConsumo();
