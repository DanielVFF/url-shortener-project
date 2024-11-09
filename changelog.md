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
