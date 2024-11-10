# Checklist de Desenvolvimento

## Estruturação das APIs
- [X] Estruturar as APIs com conexão de RabbitMQ (Gateway e serviço de encurtar URLs).
- [X] Configurar as Dockers para rodar tudo com `docker-compose up` no projeto central.
- [X] Configurar ESLint.
- [ ] Configurar Dockeres do nest para compilar durante o processo de build //Npm i dentro do build também
- [ ] Configurar Dockeres do nest para funcionar junto com RabbitMq
- [ ] Configurar Redes do Docker;

## Banco de Dados e ORM
- [X] Criar entidades no Prisma e estruturar o banco de dados Auth.
- [X] Implementar Soft-Delete
- [ ] Criar Logs de acessos e usos
- [X] Criar entidades no Prisma e estruturar o banco de dados Shorterner.

## Autenticação e Validação
- [X] Criar rotas de crud de usuário;
- [X] Validar senha segura.
- [X] Criar Dtos para as rotas de autenticação.
- [X] Criar rotas de autenticação e implementar verificação de autenticação.

## Microserviços
- [X] Criar rotas de encurtar URL dentro do microserviço.
- [ ] Remover dependencias de swagger e validation pipes

## Documentação
- [X] Documentar API com Swagger.
- [X] Mesclar documentações da api Gateway e do microserviço.
- [ ] Documentação do projeto e de sua estrutura.

## Testes e Qualidade
- [X] Validações de Casos de Erro previsiveis.
- [ ] Criar testes unitários.
- [ ] Testes de desempenho com K6.
- [ ] Construir Actions no GitHub para lint e testes automatizados.

## Infraestrutura
- [ ] Configurar reverse-proxy com Krankend.
- [ ] Configurar as Docker com Kubernetes.
- [ ] Melhorar o Docker do RabbitMQ.

## Melhoria Contínua
- [X] Padronização de Responses.
- [ ] Fazer um Broker Service em Vez de um modulo especificamente para o RabbitMQ
- [ ] Melhorar legibilidade.
- [ ] Cobrir o projeto com interfaces.
- [ ] Melhorar código e suas injeções de dependências.
- [X] Sistema Tolerante a Erros.
- [ ] Criar funcionalidade de logger de erros Runtime

## Deploy
- [ ] Deploy em ambiente cloud.

## Novas Funcionalidades
- [ ] Sistema de Recuperação de senha via sms ou email(sms dev?)

## Bugs
- [X] Ajustar erro de busca de uuid inválido
- [X] Ajustar erros de query no geral