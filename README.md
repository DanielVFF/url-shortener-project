# Encurtador de URLs

Um serviço simples e eficiente de encurtamento de URLs que permite aos usuários encurtar URLs e acompanhar seu uso. Os usuários podem criar, gerenciar e excluir URLs com ou sem autenticação. Quando criadas com autenticação, as URLs ficam vinculadas a um usuário, permitindo que ele liste, edite, faça soft delete e veja quantas vezes cada URL foi acessada.

## Funcionalidades

- **Encurtamento de URL**: O usuário pode fornecer uma URL personalizada ou deixar que ela seja gerada automaticamente.
- **Autenticação**: URLs criadas com autenticação ficam vinculadas a uma conta de usuário.
- **Gerenciamento de Usuário**: O usuário pode listar, editar e excluir URLs de forma suave (soft delete).
- **Acompanhamento de Uso da URL**: O usuário pode ver quantas vezes cada URL encurtada foi acessada.
- **Opção sem Autenticação**: URLs podem ser criadas sem a necessidade de autenticação.
- **Arquitetura de Microserviços**: O projeto segue uma arquitetura de microserviços, com uma API Gateway que gerencia autenticação e roteamento.
- **Documentação em Swagger**: A API é totalmente documentada utilizando Swagger, facilitando a exploração das rotas.
- **Testes Unitários**: Testes unitários baseados em Jest garantem a confiabilidade do código.
- **Verificações de Lint e Testes**: GitHub Actions configurados para rodar lint e testes em pull requests e commits na branch principal.

## Tecnologias Utilizadas

- **Node.js (v22)**: Plataforma JavaScript para construção de aplicações escaláveis.
- **NestJS**: Framework para construir aplicações backend eficientes e escaláveis.
- **Prisma**: ORM utilizado para conexão com o banco de dados PostgreSQL e facilitação das operações de CRUD.
- **JWT (JSON Web Token)**: Utilizado para autenticação de usuários de forma segura.
- **bcryptjs**: Biblioteca para hash de senhas, garantindo segurança na autenticação.
- **RabbitMQ**: Sistema de mensageria utilizado para comunicação entre microserviços.
- **PostgreSQL**: Banco de dados relacional utilizado para armazenar dados da aplicação.
- **Swagger**: Utilizado para documentar e explorar as rotas da API.
- **Jest**: Framework de testes utilizado para testes unitários.
- **GitHub Actions**: Ferramenta de CI/CD para automação de linting e execução de testes.
- **Docker & Docker Compose**: Utilizados para facilitar o desenvolvimento local e execução dos microserviços em containers.

## Configuração do Projeto

### Pré-requisitos

- Node.js (v22)
- Docker (para rodar os containers localmente)

### Instalação

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/encurtador-de-urls.git
```

2. Instale as dependências:

```bash
npm install
```

### Execução do Projeto

1. **Modo de Desenvolvimento**:

```bash
npm run start:dev
```

2. **Modo de Produção**:

```bash
npm run start:prod
```

3. **Rodar Docker Compose** (para rodar todos os microserviços localmente):

```bash
docker-compose up
```

### Execução dos Testes

1. **Testes Unitários**:

```bash
npm run test
```

2. **Testes End-to-End (E2E)**:

```bash
npm run test:e2e
```

3. **Cobertura de Testes**:

```bash
npm run test:cov
```

## Estrutura de Pastas

A estrutura de pastas segue a arquitetura de recursos REST com divisões em:

- `infrastructure`: Responsável pela configuração e integração com bancos de dados, RabbitMQ, entre outros.
- `app`: Contém a lógica de negócio e implementação das rotas.
- `interfaces`: Define os contratos, DTOs (Data Transfer Objects) e as interfaces de serviço.

## Contribuindo

Sinta-se à vontade para contribuir com melhorias ou correções. Basta fazer um fork do projeto e abrir um pull request com suas modificações.

## Licença

Este projeto é licenciado sob a licença MIT. Veja mais detalhes no [arquivo de licença](LICENSE).

---

Com esse README, você tem uma descrição clara do seu projeto, das tecnologias usadas, do processo de configuração e execução, além de uma explicação sobre a estrutura e contribuições.