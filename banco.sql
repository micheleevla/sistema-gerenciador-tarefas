-- ============================================
-- Sistema Gerenciador de Tarefas Online
-- Script de criação do banco de dados
-- Organização parceira: Bella Maison Perfumaria
-- ============================================

-- Tabela de usuários
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE,
    senha VARCHAR(255) NOT NULL,
    tipo VARCHAR(20) NOT NULL DEFAULT 'usuario',
    ativo BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de tarefas
CREATE TABLE tarefas (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT,
    categoria VARCHAR(50),
    status VARCHAR(30) NOT NULL DEFAULT 'afazer',
    prazo_data DATE,
    prazo_hora TIME,
    criado_por INTEGER NOT NULL,
    atribuido_para INTEGER,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (criado_por) REFERENCES usuarios(id),
    FOREIGN KEY (atribuido_para) REFERENCES usuarios(id)
);

-- Usuário administrador inicial para ambiente de desenvolvimento
-- IMPORTANTE: alterar a senha inicial antes do uso real
INSERT INTO usuarios (nome, username, email, senha, tipo, ativo, data_criacao)
VALUES ('Administrador', 'admin', 'admin@exemplo.com', 'ALTERAR_SENHA_INICIAL', 'admin', true, NOW());