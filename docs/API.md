# API do HemoSal — Documentação de Endpoints

    Base URL (produção): `...`

    ## Convenções

    - Todas as respostas são em JSON
    - Rotas protegidas exigem header `Authorization: Bearer <token>`
    - O campo `senhaHash` nunca é retornado em nenhuma resposta
    - Erros seguem o formato `{ "erro": "mensagem descritiva" }`

## Auth

    ### POST /auth/register

    Cria uma nova conta de aluno.

    - **Autenticação:** Não
    - **Body:**

    ```json
    {
      "login": "Maria Silva",
      "senhaHash": "minhasenha123",
    }
    ```

    - **Resposta de sucesso:** `201 Created`

    ```json
    {
      "id": 1,
      "nome": "Maria Silva",
    }
    ```

    - **Erros:**
      - `400` — Campos obrigatórios ausentes
      - `409` — Email já cadastrado
    

    ### POST /auth/login

    Autentica um aluno e retorna um token JWT.

    - **Autenticação:** Não
    - **Body:**

    ```json
    {
      "login": "maria@email.com",
      "senhaHash": "minhasenha123"
    }
    ```

    - **Resposta de sucesso:** `200 OK`

    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```

    - **Erros:**
      - `401` — Credenciais inválidas (email não existe ou senha incorreta)

## Doadores
  
    ### GET /doadores
    ### GET /doadores/nome
    ### GET /doadores/cpf
    ### GET /doadores/rg
    ### GET /doadores/sus
    ### GET /doadores/tipo
    ### GET /doadores/:id
    ### POST /doadores
    ### PUT /doadores/:id
    ### DELETE /doadores/:id

## Viagens

    ### GET /viagens
    ### GET /viagens/:id
    ### PUT /viagens/:id
    ### POST /viagens
    ### DELETE /viagens/:id

## CORS

Esta API tem CORS habilitado para qualquer origem. Você pode consumi-la de qualquer domínio (localhost, Vercel, etc.) sem configuração adicional no cliente.