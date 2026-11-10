# Deploy Java Spring Boot + Render Free + Neon PostgreSQL Free

## Estrutura
- Frontend: React em Cloudflare Workers (ja publicado)
- Backend: Spring Boot Java 17 em Render Web Service Docker (Free)
- Banco: Neon PostgreSQL (Free)

## 1. GitHub
Coloque os arquivos desta pasta em `Library-control-master` do repositorio (mantendo os caminhos). Nao suba credenciais nem arquivos de dados reais.

## 2. Neon
1. Crie projeto PostgreSQL gratuito em https://console.neon.tech/
2. Copie host, database, usuario, senha e exigencia SSL na pagina de connection details.
3. No Render configure (exemplo, substitua valores):

SPRING_DATASOURCE_URL=jdbc:postgresql://SEU_HOST/SEU_DATABASE?sslmode=require
SPRING_DATASOURCE_USERNAME=SEU_USUARIO
SPRING_DATASOURCE_PASSWORD=SUA_SENHA
SPRING_JPA_DATABASE_PLATFORM=org.hibernate.dialect.PostgreSQLDialect
APP_CORS_ALLOWED_ORIGINS=https://library-control.oliveirajhony493.workers.dev

Observacao: Nao cole a URL com `postgresql://usuario:senha@host/...` em SPRING_DATASOURCE_URL; use `jdbc:postgresql://...`, com usuario/senha separados. Mantenha credenciais apenas nas variaveis secretas do Render.

## 3. Render
- New > Web Service > GitHub `JHONYkd/library-control`
- Branch: main
- Root Directory: Library-control-master
- Language/Runtime: Docker
- Dockerfile Path: ./Dockerfile (relativo ao root directory)
- Instance: Free
- Configure as variaveis acima no painel Environment e deploy.
- URL disponibilizada sera `https://NOME.onrender.com`.
- Teste `https://NOME.onrender.com/livros`; deve retornar JSON ou explicar erro.

## 4. Cloudflare (frontend)
- Build variável REACT_APP_API_URL=https://NOME.onrender.com
- Rebuild/deploy frontend; mudar variavel sem rebuild nao atualiza Create React App.
- Teste CRUD em navegador e inspecione Network se necessario.

## Observacoes
- Render Free suspende por inatividade e pode demorar para acordar; nao use para producao critica.
- Neon Free tem limites de computacao e armazenamento.
- `spring.jpa.hibernate.ddl-auto=update` serve ao prototipo; em producao use migracoes Flyway/Liquibase.
- Dados H2 antigos NAO migrados: banco PostgreSQL inicia vazio.
- A API originalmente nao implementa autenticacao/autorizacao; nao exponha dados pessoais reais sem implementa-las. CORS nao e seguranca de API.
- O ZIP nao foi submetido a um deploy remoto nem build Maven neste ambiente.
