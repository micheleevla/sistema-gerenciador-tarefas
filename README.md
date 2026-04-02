# Sistema Gerenciador de Tarefas Online

Projeto desenvolvido como parte da disciplina Projeto Integrador III-B, com foco na criação de uma solução web para organização e acompanhamento de tarefas em uma organização real.

## Sobre o projeto

O sistema foi desenvolvido em parceria com a **Bella Maison Perfumaria**, com o objetivo de auxiliar no gerenciamento das atividades internas da empresa.

A solução foi pensada para atender uma necessidade real da organização, permitindo cadastrar usuários, controlar tarefas, visualizar o andamento em um quadro Kanban e acompanhar prazos em um calendário mensal.

## Funcionalidades

- Login de usuários
- Controle de acesso por perfil
- Gerenciamento de usuários pelo administrador
- Criação de tarefas
- Edição de tarefas
- Exclusão de tarefas
- Movimentação de tarefas entre colunas
- Definição de responsável
- Definição de prazo com data e hora
- Destaque de tarefas atrasadas
- Visualização em quadro Kanban
- Visualização em calendário
- Alteração de senha

## Tecnologias utilizadas

### Back-end
- C#
- .NET
- Entity Framework Core
- PostgreSQL
- Swagger

### Front-end
- HTML5
- CSS3
- JavaScript

## Estrutura do projeto

```text
sistema-tarefas
├── login.html
├── dashboard.html
├── kanban.html
├── calendario.html
├── usuarios.html
├── alterar-senha.html
├── style.css
├── script.js
├── calendario.js
├── banco.sql
└── backend-csharp
    └── GerenciadorTarefasAPI


Banco de dados:

A estrutura do banco está disponível no arquivo banco.sql.
Esse script contém:
criação das tabelas
relacionamentos
exemplo de usuário administrador inicial para ambiente de desenvolvimento

Configuração da conexão com banco

Antes de executar o back-end, ajuste a string de conexão no arquivo appsettings.json com os dados do seu ambiente PostgreSQL.

Exemplo: 

{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=gerenciador_tarefas;Username=postgres;Password=SUA_SENHA_AQUI"
  }
}



Observação sobre credenciais

As credenciais presentes nos exemplos do projeto são apenas para ambiente de desenvolvimento e demonstração. Para uso real, recomenda-se a alteração imediata das senhas iniciais e a adoção de práticas adicionais de segurança.


Projeto acadêmico e extensionista

O sistema foi desenvolvido no contexto de atividade extensionista, buscando atender uma necessidade concreta da empresa parceira e aplicar, na prática, conhecimentos de desenvolvimento web, banco de dados e organização de software.


Autora

Michele Barbosa Alves
