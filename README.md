# HemoSal

Aplicação web para cadastro de doadores de sangue e agendamento de viagens para realização de doações.

Back-end desenvolvido em **Node.js** (Express) com Banco de Dados PostgreSQL (Prisma) e Front-end desenvolvido com Vite e React.

> O projeto usa **ES Modules** nativos (`"type": "module"` no `package.json`)

---

## Sumário

- [Como executar backend](#como-executar-backend)
- [Como executar frontend](#como-executar-frontend)
- [Funcionalidades](#funcionalidades)
- [API REST](./docs/API.md)

---

## Como executar o backend

### Pré-requisitos

- [Node.js](https://nodejs.org/) versão 16 ou superior
- npm (instalado junto com o Node.js)

### Passos

```bash
# 1. Entre na pasta do projeto
cd HemoSal

# 2. Instale as dependências
npm install

# 3. Defina as variáveis de ambiente PORT, DATABASE_URL, ENCRYPTION_KEY, HASH_SECRET e SECRET_TOKEN no .env
PORT=...
DATABASE_URL=...
ENCRYPTION_KEY=...
HASH_SECRET=...
SECRET_TOKEN=...

# 4. Sincronize o schema.prisma com o BD PostgreSQL do projeto no Neon
npx prisma generate

# 5. Inicie o servidor
npm start
```

O servidor estará disponível em **http://localhost:3000**.

> A porta pode ser alterada definindo a variável de ambiente `PORT`

> A variável de ambiente `DATABASE_URL` é a string de conexão do BD PostgreSQL do projeto no Neon (que é necessário ser criado para armazenar os dados dos doadores e viagens)

> As variáveis de ambiente `ENCRYPTION_KEY` e `HASH_SECRET` são hexadecimais de 64 caracteres (utilizadas para criptografia), que podem ser gerados pelo comando: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` (é recomendável gerar duas chaves distintas)

> A variável de ambiente `SECRET_TOKEN` é uma chave JWT utilizada para autenticação de usuários administradores (se tiver Python instalado localmente é possível gerar esta chave com `python3 -c "import secrets; import base64; h = base64.b64encode(b'{\"alg\":\"HS256\",\"typ\":\"JWT\"}').decode('utf-8').rstrip('='); p = base64.b64encode(b'{\"id\":1}').decode('utf-8').rstrip('='); s = secrets.token_hex(32); print(f'{h}.{p}.{s}')"`)

Durante o desenvolvimento, é possível usar `npm run dev` (reinicia o servidor automaticamente a cada alteração, via `nodemon`).

> Em caso de mudanças no schema.prisma, use o comando `npx prisma migrate dev --name NOME_DA_ALTERAÇÂO` para atualizar o modelo físico do BD

---

## Como executar o frontend

### Pré-requisitos

- [Node.js](https://nodejs.org/) versão 16 ou superior
- npm (instalado junto com o Node.js)

### Passos

```bash
# 1. Entre na pasta do frontend
cd frontend

# 2. Instale as dependências
npm install

# 3. Defina a variável de ambiente VITE_API_URL no .env
VITE_API_URL=...

# 4. Inicie a aplicação
npm run dev
```

A aplicação estará disponível em **http://localhost:5173**.

> A variável de ambiente `VITE_API_URL` define a URL do servidor (backend) da aplicação, que em teste local é `http://localhost:3000` (ou o valor definido em `PORT`)

---

## Funcionalidades

- **Login**: para acessar qualquer serviço da aplicação é necessário que o usuário esteja autenticado.
- **Cadastro de doador**: formulário com nome completo, CPF, RG, Cartão SUS, data de nascimento, tipo sanguíneo, sexo e endereço. Antes de criar novo doador ainda existe verificação de CPF válido.
- **Impede duplicidade**: não é possível cadastrar dois doadores com o mesmo CPF, RG e/ou Cartão SUS.
- **Pesquisa**: é possível buscar doadores já cadastrados por nome, tipo sanguíneo, CPF, RG ou Cartão SUS.
- **Edição**: é possível editar doadores já cadastrados, permitindo mudar-se seus dados, de modo a também evitar duplicidade e com verificação de CPF.
- **Exclusão**: é possível excluir doadores do conjunto de doadores salvos no Banco de Dados.
- **Registro de viagens**: é possível registrar viagens marcando-se uma data e horário, limite de vagas e selecionar-se doadores aptos para a viagem (que respeitem as regras de negócio da aplicação). Também é possível editar e excluir viagens.
- **Relatório de viagens**: para cada viagem registrada é possível gerar um PDF contendo informações da viagem (data, horário e limite de vagas) bem como dados de cada doador cadastrado na viagem.