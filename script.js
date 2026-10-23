
const formulario = document.getElementById("formulario-consumo");
const listaConsumo = document.getElementById("lista-consumo");

// Recupera os registros salvos no navegador
let consumos = JSON.parse(localStorage.getItem("consumos")) || [];

// Mostra os registros na página
function mostrarConsumos() {
    if (consumos.length === 0) {
        listaConsumo.innerHTML = "<p>Nenhum consumo registrado ainda.</p>";
        return;
    }

    listaConsumo.innerHTML = "";

    consumos.forEach(function (item) {
        const registro = document.createElement("div");

        registro.innerHTML = `
            <p><strong>Mês:</strong> ${item.mes}</p>
            <p><strong>Consumo:</strong> ${item.consumo} kWh</p>
            <p><strong>Valor:</strong> R$ ${item.valor.toFixed(2).replace(".", ",")}</p>
            <hr>
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

    // Cria o registro
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

    mostrarConsumos();
    compararConsumo();
    formulario.reset();
});

// Exibe os registros ao abrir a página


function compararConsumo() {
    const resultado = document.getElementById("resultado-comparacao");

    if (consumos.length < 2) {
        resultado.textContent =
            "Registre pelo menos dois meses para comparar seu consumo.";
        return;
    }

    const anterior = consumos[consumos.length - 2];
    const atual = consumos[consumos.length - 1];

    const diferenca = atual.consumo - anterior.consumo;
    const percentual = (diferenca / anterior.consumo) * 100;

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

    const periodoAnterior = formatarMes(anterior.mes);
    const periodoAtual = formatarMes(atual.mes);

    if (diferenca > 0) {
        resultado.textContent =
            "O consumo aumentou " + diferenca.toFixed(2).replace(".", ",") +
            " kWh (" + percentual.toFixed(2).replace(".", ",") +
            "%) entre " + periodoAnterior + " e " + periodoAtual + ".";
    } else if (diferenca < 0) {
        resultado.textContent =
            "O consumo diminuiu " + Math.abs(diferenca).toFixed(2).replace(".", ",") +
            " kWh (" + Math.abs(percentual).toFixed(2).replace(".", ",") +
            "%) entre " + periodoAnterior + " e " + periodoAtual + ".";
    } else {
        resultado.textContent =
            "O consumo permaneceu igual entre " +
            periodoAnterior + " e " + periodoAtual + ".";
    }
}

mostrarConsumos();
compararConsumo();

// Botão para limpar o histórico

const botaoLimpar = document.getElementById("limpar-historico");

botaoLimpar.addEventListener("click", function () {
    const confirmar = confirm(
        "Tem certeza de que deseja apagar todo o histórico de consumo?"
    );

    if (!confirmar) {
        return;
    }

    consumos = [];

    localStorage.removeItem("consumos");

    mostrarConsumos();
    compararConsumo();
});

