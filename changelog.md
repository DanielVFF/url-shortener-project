Aqui está o changelog com as alterações solicitadas:

---

**0.1.0** - Estrutura Inicial do Projeto Usando RabbitMQ como Broker  
- Configuração inicial do projeto com RabbitMQ como broker para comunicação entre microserviços.

**0.1.1** - Mudanças na Estrutura e Criação de ORM:  
- Criação de Arquivo de Backlog.  
- Definição de módulo para funções auxiliares.  
- Migrando o módulo principal para a pasta `app`.  
- Configuração de documentação com Swagger.  
- Definição de módulo para ORM e UserRepo.  
- Definição de módulo de usuários.  
- Criação de DTO para update de usuário.  
- Criação de DTO para criação de usuário.  

**0.1.2** - Ajustes e Funcionalidades de Microserviço e Autenticação:  
- Ajustando nome da fila para corresponder ao gateway.  
- Alterando filepath.  
- Colocando para buscar variável de ambiente.  
- Definindo para buscar variáveis de ambiente ao configurar microserviço.  
- Lint e nova função de `getUserByEmail`.  
- Importando módulo de microserviço e retirando conexão do módulo `app`.  
- Criando um módulo para buscar as variáveis de ambiente.  
- Separando conexão com RabbitMQ em um módulo.  
- Criando hash de senha.  
- Estrutura do módulo de autenticação definida.  
- Criado helper para JWT.  
- Criados DTOs para login.


**0.1.3** - Implementação de Guards e Ajustes de Configuração:  
- Criação e implementação de guards de autenticação.  
- Mudança no caminho do Prisma.  
- Remoção de comentário desnecessário.


**0.1.4** - Implementação de Módulo URL e Conexão com Banco de Dados:  
- Criação do módulo `url`.  
- Arquivos de configuração do banco de dados com variáveis do `.env`.  
- Criação do módulo de conexão com o banco e repositório de URLs.  
- Criação de interfaces para manter classes no padrão.  
- Movimentação do módulo `app` para dentro da pasta `app`.  
- Criação de segunda instância PostgreSQL dentro do `dc.yml`.

**0.2.0** - Melhorias e Ajustes no Módulo URL e Autenticação:  
- Refatoração de métodos do repositório.  
- Definição de valor default e coluna de contador de cliques.  
- Criação de helpers e função para criação de URL encurtada.  
- Padrões de respostas para exceções RPC.  
- Refatoração do módulo de URL.  
- Criação de DTOs para URL.  
- Remoção de função de teste.  
- Adição de pipes e comentários sobre mudanças.  
- Modificação da conexão com RabbitMQ.  
- Padronização de respostas e exceções HTTP com pipes e filters.  
- Decodificação do JWT para extração de `idUsuario`.


**0.2.0** - Novas Funcionalidades e Melhorias na Arquitetura:  
- Colocação de verificação de cast de lint para aviso.  
- Novas dependências e ajuste na configuração do Jest para buscar o caminho certo.  
- Criação de testes.  
- Melhoria na documentação para buscar autenticação primeiro e solicitar auth.  
- Criação de interface para modelo `url`.  
- Criação de Testes.  
- Adição do módulo `urlModule`.  
- Mudança do padrão de retorno da rota para 200.  
- Melhoria na validação de token para decodificação.  
- Criação do módulo de URL e definição das rotas.  
- Adição de importação necessária para guards.  
- Mudança no módulo RabbitMQ para servir somente para conexão e não para instanciar rotas.  
- Remoção de serviço inútil.  
- Ajuste na tipagem para deletar pela URL encurtada.  
- Adição de filtros de exceção de mensagens.  
- Ajuste no microserviço para integração de interfaces.  
- Migração de DTOs para Gateway.
