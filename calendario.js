const API_URL = "http://localhost:5202/api";

let tarefas = [];

const nomesMeses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

async function carregarTarefas() {
    try {
        const resposta = await fetch(`${API_URL}/Tarefas`);

        if (!resposta.ok) {
            throw new Error("Erro ao buscar tarefas");
        }

        tarefas = await resposta.json();
        preencherSeletores();
        gerarCalendario();
    } catch (erro) {
        console.error(erro);
        alert("Erro ao carregar tarefas do calendário.");
    }
}

function preencherSeletores() {
    const mesSelect = document.getElementById("mesSelect");
    const anoSelect = document.getElementById("anoSelect");

    if (!mesSelect || !anoSelect) return;

    mesSelect.innerHTML = "";
    anoSelect.innerHTML = "";

    nomesMeses.forEach((mes, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = mes;
        mesSelect.appendChild(option);
    });

    const anoAtual = new Date().getFullYear();

    for (let ano = anoAtual - 3; ano <= anoAtual + 3; ano++) {
        const option = document.createElement("option");
        option.value = ano;
        option.textContent = ano;
        anoSelect.appendChild(option);
    }

    mesSelect.value = new Date().getMonth();
    anoSelect.value = anoAtual;
}

function formatarDataISO(ano, mes, dia) {
    return `${ano}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
}

function tarefaEstaAtrasada(tarefa) {
    if (tarefa.status === "concluido") return false;
    if (!tarefa.prazoData || !tarefa.prazoHora) return false;

    const agora = new Date();
    const dataHoraPrazo = new Date(`${tarefa.prazoData}T${tarefa.prazoHora}`);

    return dataHoraPrazo < agora;
}

function gerarCalendario() {
    const mes = parseInt(document.getElementById("mesSelect").value);
    const ano = parseInt(document.getElementById("anoSelect").value);

    const primeiroDia = new Date(ano, mes, 1).getDay();
    const diasNoMes = new Date(ano, mes + 1, 0).getDate();

    const calendario = document.getElementById("calendario");

    let html = `<div class="grid-calendario">`;

    const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
    diasSemana.forEach(dia => {
        html += `<div class="dia-header">${dia}</div>`;
    });

    for (let i = 0; i < primeiroDia; i++) {
        html += `<div class="dia-vazio"></div>`;
    }

    for (let dia = 1; dia <= diasNoMes; dia++) {
        const dataFormatada = formatarDataISO(ano, mes, dia);

        const tarefasDoDia = tarefas.filter(t => t.prazoData === dataFormatada);

        html += `<div class="dia-calendario">`;
        html += `<div class="numero-dia">${dia}</div>`;

        tarefasDoDia.forEach(tarefa => {
            const classeAtraso = tarefaEstaAtrasada(tarefa) ? "tarefa-dia atrasada-calendario" : "tarefa-dia";
            html += `<div class="${classeAtraso}" title="${tarefa.titulo}">
                        ${tarefa.titulo}
                     </div>`;
        });

        html += `</div>`;
    }

    html += `</div>`;

    calendario.innerHTML = html;
}

window.addEventListener("load", function () {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

    if (!usuario) {
        window.location.href = "login.html";
        return;
    }

    carregarTarefas();
});