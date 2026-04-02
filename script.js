let tarefas = [];
let colunaAtual = "";
let tarefaEditandoId = null;

const API_URL = "http://localhost:5202/api";

const categoriasCores = {
    "Marketing": "#f8c8dc",
    "Cadastro": "#c8e6c9",
    "Criação": "#d1c4e9",
    "Orçamento": "#ffe0b2",
    "Estoque": "#b3e5fc",
    "Atendimento": "#fff9c4",
    "Catálogo": "#d7ccc8",
    "Compras": "#c5cae9",
    "Financeiro": "#b2dfdb",
    "Organização": "#e6ee9c"
};

async function carregarTarefas() {
    try {
        const resposta = await fetch(`${API_URL}/Tarefas`);

        if (!resposta.ok) {
            throw new Error("Erro ao buscar tarefas");
        }

        tarefas = await resposta.json();
        renderizarTarefas();
    } catch (erro) {
        console.error(erro);
        alert("Erro ao carregar tarefas do servidor.");
    }
}

function abrirModal(colunaId) {
    colunaAtual = colunaId;
    tarefaEditandoId = null;

    document.getElementById("tituloModal").textContent = "Nova tarefa";
    document.querySelector("#modalTarefa .botao").textContent = "Salvar";
    document.getElementById("modalTarefa").style.display = "flex";
}

function fecharModal() {
    document.getElementById("modalTarefa").style.display = "none";
    document.getElementById("tituloTarefa").value = "";
    document.getElementById("categoriaTarefa").value = "";
    document.getElementById("dataTarefa").value = "";
    document.getElementById("horaTarefa").value = "";
    document.getElementById("responsavelTarefa").value = "";

    tarefaEditandoId = null;
    document.getElementById("tituloModal").textContent = "Nova tarefa";
    document.querySelector("#modalTarefa .botao").textContent = "Salvar";
}

async function salvarNovaTarefa() {
    const titulo = document.getElementById("tituloTarefa").value.trim();
    const categoria = document.getElementById("categoriaTarefa").value;
    const data = document.getElementById("dataTarefa").value;
    const hora = document.getElementById("horaTarefa").value;
    const responsavel = document.getElementById("responsavelTarefa").value.trim();

    if (titulo === "" || categoria === "" || data === "" || hora === "" || responsavel === "") {
        alert("Preencha todos os campos.");
        return;
    }

    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

    if (!usuarioLogado) {
        alert("Usuário não autenticado.");
        window.location.href = "login.html";
        return;
    }

    try {
        if (tarefaEditandoId !== null) {
            const body = {
                titulo: titulo,
                descricao: "Responsável: " + responsavel,
                categoria: categoria,
                prazoData: data,
                prazoHora: hora + ":00"
            };

            const resposta = await fetch(`${API_URL}/Tarefas/${tarefaEditandoId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });

            if (!resposta.ok) {
                throw new Error("Erro ao atualizar tarefa");
            }
        } else {
            const body = {
                titulo: titulo,
                descricao: "Responsável: " + responsavel,
                categoria: categoria,
                status: colunaAtual,
                prazoData: data,
                prazoHora: hora + ":00",
                criadoPor: usuarioLogado.id,
                atribuidoPara: null
            };

            const resposta = await fetch(`${API_URL}/Tarefas`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });

            if (!resposta.ok) {
                throw new Error("Erro ao criar tarefa");
            }
        }

        fecharModal();
        await carregarTarefas();
    } catch (erro) {
        console.error(erro);
        alert("Erro ao salvar tarefa.");
    }
}

function editarTarefa(id) {
    const tarefa = tarefas.find(t => t.id === id);
    if (!tarefa) return;

    tarefaEditandoId = id;

    document.getElementById("tituloTarefa").value = tarefa.titulo || "";
    document.getElementById("categoriaTarefa").value = tarefa.categoria || "";
    document.getElementById("dataTarefa").value = tarefa.prazoData || "";
    document.getElementById("horaTarefa").value = tarefa.prazoHora ? tarefa.prazoHora.substring(0, 5) : "";
    document.getElementById("responsavelTarefa").value = tarefa.descricao?.replace("Responsável: ", "") || "";

    document.getElementById("tituloModal").textContent = "Editar tarefa";
    document.querySelector("#modalTarefa .botao").textContent = "Atualizar";
    document.getElementById("modalTarefa").style.display = "flex";
}

async function excluirTarefa(id) {
    const confirmar = confirm("Tem certeza que deseja excluir esta tarefa?");

    if (!confirmar) return;

    try {
        const resposta = await fetch(`${API_URL}/Tarefas/${id}`, {
            method: "DELETE"
        });

        if (!resposta.ok) {
            throw new Error("Erro ao excluir tarefa");
        }

        await carregarTarefas();
    } catch (erro) {
        console.error(erro);
        alert("Erro ao excluir tarefa.");
    }
}

function mostrarOpcoesMover(id) {
    const card = document.querySelector('[data-id="' + id + '"]');

    if (!card) return;

    let menuExistente = card.querySelector(".menu-mover");

    if (menuExistente) {
        menuExistente.remove();
        return;
    }

    const menu = document.createElement("div");
    menu.className = "menu-mover";

    const destinos = [
        { nome: "A fazer", valor: "afazer" },
        { nome: "Em andamento", valor: "emandamento" },
        { nome: "Concluído", valor: "concluido" }
    ];

    destinos.forEach(function (destino) {
        const botao = document.createElement("button");
        botao.textContent = destino.nome;
        botao.className = "btn-mover";
        botao.onclick = function () {
            moverTarefa(id, destino.valor);
        };
        menu.appendChild(botao);
    });

    card.appendChild(menu);
}

async function moverTarefa(id, novoStatus) {
    try {
        const resposta = await fetch(`${API_URL}/Tarefas/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                status: novoStatus
            })
        });

        if (!resposta.ok) {
            throw new Error("Erro ao mover tarefa");
        }

        await carregarTarefas();
    } catch (erro) {
        console.error(erro);
        alert("Erro ao mover tarefa.");
    }
}

function formatarData(dataIso) {
    if (!dataIso || dataIso.indexOf("-") === -1) return dataIso;

    const partes = dataIso.split("-");
    return partes[2] + "/" + partes[1] + "/" + partes[0];
}

function tarefaEstaAtrasada(tarefa) {
    if (tarefa.status === "concluido") return false;
    if (!tarefa.prazoData || !tarefa.prazoHora) return false;

    const agora = new Date();
    const dataHoraPrazo = new Date(`${tarefa.prazoData}T${tarefa.prazoHora}`);

    return dataHoraPrazo < agora;
}

function renderizarTarefas() {
    const colunaAfazer = document.getElementById("afazer");
    const colunaEmAndamento = document.getElementById("emandamento");
    const colunaConcluido = document.getElementById("concluido");

    if (!colunaAfazer || !colunaEmAndamento || !colunaConcluido) return;

    colunaAfazer.innerHTML = "";
    colunaEmAndamento.innerHTML = "";
    colunaConcluido.innerHTML = "";

    tarefas.forEach(function (tarefa) {
        const card = document.createElement("div");
        card.className = "card";
        card.setAttribute("data-id", tarefa.id);

        if (tarefaEstaAtrasada(tarefa)) {
            card.classList.add("atrasada");
        }

        const etiqueta = document.createElement("div");
        etiqueta.className = "etiqueta";
        etiqueta.textContent = tarefa.categoria || "Sem categoria";
        etiqueta.style.backgroundColor = categoriasCores[tarefa.categoria] || "#e0e0e0";

        const textoTarefa = document.createElement("div");
        textoTarefa.className = "texto-tarefa";
        textoTarefa.textContent = tarefa.titulo;

        const responsavel = document.createElement("div");
        responsavel.className = "responsavel";
        responsavel.textContent = tarefa.descricao || "Responsável: Não definido";

        const prazo = document.createElement("div");
        prazo.className = "prazo";
        prazo.textContent = "Prazo: " + formatarData(tarefa.prazoData) + " às " + (tarefa.prazoHora ? tarefa.prazoHora.substring(0, 5) : "");

        if (tarefaEstaAtrasada(tarefa)) {
            prazo.classList.add("atrasado-texto");
            prazo.textContent += " • Atrasada";
        }

        const botoes = document.createElement("div");
        botoes.className = "botoes-card";

        const btnEditar = document.createElement("button");
        btnEditar.textContent = "✏️";
        btnEditar.className = "btn-card";
        btnEditar.onclick = function () {
            editarTarefa(tarefa.id);
        };

        const btnMover = document.createElement("button");
        btnMover.textContent = "➡️";
        btnMover.className = "btn-card";
        btnMover.onclick = function () {
            mostrarOpcoesMover(tarefa.id);
        };

        const btnExcluir = document.createElement("button");
        btnExcluir.textContent = "❌";
        btnExcluir.className = "btn-card";
        btnExcluir.onclick = function () {
            excluirTarefa(tarefa.id);
        };

        botoes.appendChild(btnEditar);
        botoes.appendChild(btnMover);
        botoes.appendChild(btnExcluir);

        card.appendChild(etiqueta);
        card.appendChild(textoTarefa);
        card.appendChild(responsavel);
        card.appendChild(prazo);
        card.appendChild(botoes);

        if (tarefa.status === "afazer") {
            colunaAfazer.appendChild(card);
        } else if (tarefa.status === "emandamento") {
            colunaEmAndamento.appendChild(card);
        } else if (tarefa.status === "concluido") {
            colunaConcluido.appendChild(card);
        }
    });
}

window.addEventListener("load", function () {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

    if (!usuario) {
        window.location.href = "login.html";
        return;
    }

    carregarTarefas();
});