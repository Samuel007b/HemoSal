# API do HemoSal — Documentação de Endpoints

    Base URL (produção): `https://hemo-sal.vercel.app/`

    ## Convenções

    - Todas as respostas são em JSON
    - Rotas protegidas exigem header `Authorization: Bearer <token>`
    - O campo `senhaHash` nunca é retornado em nenhuma resposta
    - Erros seguem o formato `{ "erro": "mensagem descritiva" }`

## Usuários Administrativos

  ### GET /user

    Lista todos os usuários administrativos.

    - **Autenticação:** Bearer token (admin)
    - **Body:** Nenhum

    - **Resposta de sucesso:** `200 OK`

    ```json
    [
      {
        "id": 1,
        "login": "maria12345",
      },
      {
        "id": 2,
        "login": "joao67890",
      },
      {
        "id": 3,
        "login": "pedro02468",
      }
    ]
    ```

    - **Erros:**
      - `204` — Lista de usuários vazia (não há usuários cadastrados)
      - `401` — Credenciais inválidas (usuário não autenticado)


  ### GET /user/:id

    Busca um usuário administrativo pelo ID.

    - **Autenticação:** Bearer token (admin)
    - **Body:** Nenhum

    - **Resposta de sucesso:** `200 OK`

    ```json
    {
      "id": 1,
      "login": "maria12345",
    }
    ```

    - **Erros:**
      - `400` — ID inválido
      - `401` — Credenciais inválidas (usuário não autenticado)
      - `404` — Usuário não encontrado (usuário com ID não existe)


  ### POST /user

    Cria um novo usuário administrativo.

    - **Autenticação:** Bearer token (admin)
    - **Body:**

    ```json
    {
      "login": "maria12345",
      "senha": "minhasenha123",
    }
    ```

    - **Resposta de sucesso:** `201 Created`

    ```json
    {
      "id": 1,
      "login": "maria12345",
    }
    ```

    - **Erros:**
      - `400` — Campos obrigatórios ausentes
      - `401` — Credenciais inválidas (usuário não autenticado)
      - `409` — Login já cadastrado


  ### PUT /user/:id

    Atualiza um usuário administrativo pelo ID.

    - **Autenticação:** Bearer token (admin)
    - **Body:**

    ```json
    {
      "login": "maria13579",
      "senha": "minhasenha123",
    }
    ```

    - **Resposta de sucesso:** `200 OK`

    ```json
    {
      "id": 1,
      "login": "maria13579",
    }
    ```

    - **Erros:**
      - `400` — Campos obrigatórios ausentes ou ID inválido
      - `401` — Credenciais inválidas (usuário não autenticado)
      - `404` — Usuário não encontrado (usuário com ID não existe)
      - `409` — Login já cadastrado


  ### DELETE /user/:id

    Deleta um usuário administrativo pelo ID.

    - **Autenticação:** Bearer token (admin)
    - **Body:** Nenhum

    - **Resposta de sucesso:** `204 Deleted`

    - **Erros:**
      - `400` — ID inválido
      - `401` — Credenciais inválidas (usuário não autenticado)
      - `404` — Usuário não encontrado (usuário com ID não existe)


  ### POST /user/login

    Autentica um usuário administrativo e retorna um token JWT.

    - **Autenticação:** Não
    - **Body:**

    ```json
    {
      "login": "maria13579",
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
      - `400` — Campos obrigatórios ausentes
      - `401` — Credenciais inválidas (login não existe ou senha incorreta)


## Doadores
  
  ### GET /doadores

    Lista todos os doadores.

    - **Autenticação:** Bearer token (admin)
    - **Body:** Nenhum

    - **Resposta de sucesso:** `200 OK`

    ```json
    [
      {
        "id": 1,
        "nome": "Maria de Lourdes",
        "cpf": "12345678900",
        "rg": "12345678900",
        "cartaoSus": "12345678900",
        "dataNasc": "2001-11-09T00:00:00.000Z",
        "sexo": "F",
        "tipoSang": "O-",
        "endereco": "Rubelita",
        "viagens": [
          {
            "id": 1,
            "dataSaida": "2026-07-13T20:30:00.000Z"
          }
        ],
        "criadoEm": "2026-07-11T20:04:14.382Z",
        "disponivel": true
      },
      {
        "id": 2,
        "nome": "João da Penha",
        "cpf": "98765432100",
        "rg": "98765432100",
        "cartaoSus": "98765432100",
        "dataNasc": "1994-07-20T00:00:00.000Z",
        "sexo": "M",
        "tipoSang": "AB+",
        "endereco": "Novorizonte",
        "viagens": [
          {
            "id": 1,
            "dataSaida": "2026-07-13T20:30:00.000Z"
          }
        ],
        "criadoEm": "2026-07-11T20:42:44.562Z",
        "disponivel": false
      }
    ]
    ```

    - **Erros:**
      - `204` — Lista de doadores vazia (não há doadores cadastrados)
      - `401` — Credenciais inválidas (usuário não autenticado)


  ### GET /doadores/:id

    Busca um doador pelo ID.

    - **Autenticação:** Bearer token (admin)
    - **Body:** Nenhum

    - **Resposta de sucesso:** `200 OK`

    ```json
    {
      "id": 1,
      "nome": "Maria de Lourdes",
      "cpf": "12345678900",
      "rg": "12345678900",
      "cartaoSus": "12345678900",
      "dataNasc": "2001-11-09T00:00:00.000Z",
      "sexo": "F",
      "tipoSang": "O-",
      "endereco": "Rubelita",
      "viagens": [
        {
          "id": 1,
          "dataSaida": "2026-07-13T20:30:00.000Z"
        }
      ],
      "criadoEm": "2026-07-11T20:04:14.382Z",
      "disponivel": true
    }
    ```

    - **Erros:**
      - `400` — ID inválido
      - `401` — Credenciais inválidas (usuário não autenticado)
      - `404` — Doador não encontrado (doador com ID não existe)


  ### GET /doadores/nome
  
    Busca doador(es) pelo nome.

    - **Autenticação:** Bearer token (admin)
    - **Body:**

    ```json
    {
      "nome": "Lourdes"
    }
    ```

    - **Resposta de sucesso:** `200 OK`

    ```json
    [
      {
        "id": 1,
        "nome": "Maria de Lourdes",
        "cpf": "12345678900",
        "rg": "12345678900",
        "cartaoSus": "12345678900",
        "dataNasc": "2001-11-09T00:00:00.000Z",
        "sexo": "F",
        "tipoSang": "O-",
        "endereco": "Rubelita",
        "viagens": [
          {
            "id": 1,
            "dataSaida": "2026-07-13T20:30:00.000Z"
          }
        ],
        "criadoEm": "2026-07-11T20:04:14.382Z",
        "disponivel": true
      }
    ]
    ```

    - **Erros:**
      - `204` — Lista de doadores vazia (não há doadores com nome semelhante)
      - `400` — Campo obrigatório ausente
      - `401` — Credenciais inválidas (usuário não autenticado)


  ### GET /doadores/cpf
  
    Busca doador pelo CPF.

    - **Autenticação:** Bearer token (admin)
    - **Body:**

    ```json
    {
      "cpf": "123.456.789-00"
    }
    ```

    - **Resposta de sucesso:** `200 OK`

    ```json
    {
      "id": 1,
      "nome": "Maria de Lourdes",
      "cpf": "12345678900",
      "rg": "12345678900",
      "cartaoSus": "12345678900",
      "dataNasc": "2001-11-09T00:00:00.000Z",
      "sexo": "F",
      "tipoSang": "O-",
      "endereco": "Rubelita",
      "viagens": [
        {
          "id": 1,
          "dataSaida": "2026-07-13T20:30:00.000Z"
        }
      ],
      "criadoEm": "2026-07-11T20:04:14.382Z",
      "disponivel": true
    }
    ```

    - **Erros:**
      - `400` — Campo obrigatório ausente
      - `401` — Credenciais inválidas (usuário não autenticado)
      - `404` — Doador não encontrado (doador com CPF não existe)


  ### GET /doadores/rg
  
    Busca doador pelo RG.

    - **Autenticação:** Bearer token (admin)
    - **Body:**

    ```json
    {
      "rg": "12345678900"
    }
    ```

    - **Resposta de sucesso:** `200 OK`

    ```json
    {
      "id": 1,
      "nome": "Maria de Lourdes",
      "cpf": "12345678900",
      "rg": "12345678900",
      "cartaoSus": "12345678900",
      "dataNasc": "2001-11-09T00:00:00.000Z",
      "sexo": "F",
      "tipoSang": "O-",
      "endereco": "Rubelita",
      "viagens": [
        {
          "id": 1,
          "dataSaida": "2026-07-13T20:30:00.000Z"
        }
      ],
      "criadoEm": "2026-07-11T20:04:14.382Z",
      "disponivel": true
    }
    ```

    - **Erros:**
      - `400` — Campo obrigatório ausente
      - `401` — Credenciais inválidas (usuário não autenticado)
      - `404` — Doador não encontrado (doador com RG não existe)


  ### GET /doadores/sus
  
    Busca doador pelo Cartão SUS.

    - **Autenticação:** Bearer token (admin)
    - **Body:**

    ```json
    {
      "cartaoSus": "12345678900"
    }
    ```

    - **Resposta de sucesso:** `200 OK`

    ```json
    {
      "id": 1,
      "nome": "Maria de Lourdes",
      "cpf": "12345678900",
      "rg": "12345678900",
      "cartaoSus": "12345678900",
      "dataNasc": "2001-11-09T00:00:00.000Z",
      "sexo": "F",
      "tipoSang": "O-",
      "endereco": "Rubelita",
      "viagens": [
        {
          "id": 1,
          "dataSaida": "2026-07-13T20:30:00.000Z"
        }
      ],
      "criadoEm": "2026-07-11T20:04:14.382Z",
      "disponivel": true
    }
    ```

    - **Erros:**
      - `400` — Campo obrigatório ausente
      - `401` — Credenciais inválidas (usuário não autenticado)
      - `404` — Doador não encontrado (doador com Cartão SUS não existe)


  ### GET /doadores/tipo

    Busca doador(es) pelo tipo sanguíneo.

    - **Autenticação:** Bearer token (admin)
    - **Body:**

    ```json
    {
      "tipoSang": "O-"
    }
    ```

    - **Resposta de sucesso:** `200 OK`

    ```json
    [
      {
        "id": 1,
        "nome": "Maria de Lourdes",
        "cpf": "12345678900",
        "rg": "12345678900",
        "cartaoSus": "12345678900",
        "dataNasc": "2001-11-09T00:00:00.000Z",
        "sexo": "F",
        "tipoSang": "O-",
        "endereco": "Rubelita",
        "viagens": [
          {
            "id": 1,
            "dataSaida": "2026-07-13T20:30:00.000Z"
          }
        ],
        "criadoEm": "2026-07-11T20:04:14.382Z",
        "disponivel": true
      }
    ]
    ```

    - **Erros:**
      - `204` — Lista de doadores vazia (não há doadores com tipo sanguíneo)
      - `400` — Campo obrigatório ausente
      - `401` — Credenciais inválidas (usuário não autenticado)


  ### POST /doadores

    Cria um novo doador.

    - **Autenticação:** Bearer token (admin)
    - **Body:**

    ```json
    {
      "cpf": "987.654.321-00",
      "rg": "987.654.321-00",
      "cartaoSus": "987.654.321-00",
      "nome": "João da Penha",
      "dataNasc": "1994-07-20",
      "sexo": "M",
      "tipoSang": "AB+",
      "endereco": "Novorizonte"
    }
    ```

    - **Resposta de sucesso:** `201 Created`
    
    ```json
    {
      "id": 2,
      "nome": "João da Penha",
      "cpf": "98765432100",
      "rg": "98765432100",
      "cartaoSus": "98765432100",
      "dataNasc": "1994-07-20T00:00:00.000Z",
      "sexo": "M",
      "tipoSang": "AB+",
      "endereco": "Novorizonte",
      "viagens": [],
      "criadoEm": "2026-07-11T20:42:44.562Z",
      "disponivel": true
    }
    ```

    - **Erros:**
      - `400` — Campos obrigatórios ausentes e/ou inválidos
      - `401` — Credenciais inválidas (usuário não autenticado)
      - `409` — CPF, RG e/ou Cartão SUS já cadastrado(s)


  ### PUT /doadores/:id

    Atualiza um doador pelo ID.

    - **Autenticação:** Bearer token (admin)
    - **Body:**

    ```json
    {
      "cpf": "987.654.321-00",
      "rg": "987.654.321-00",
      "cartaoSus": "987.654.321-00",
      "nome": "João Pedro",
      "dataNasc": "1994-07-20",
      "sexo": "M",
      "tipoSang": "AB+",
      "endereco": "Fruta de Leite"
    }
    ```

    - **Resposta de sucesso:** `200 OK`
    
    ```json
    {
      "id": 2,
      "nome": "João Pedro",
      "cpf": "98765432100",
      "rg": "98765432100",
      "cartaoSus": "98765432100",
      "dataNasc": "1994-07-20T00:00:00.000Z",
      "sexo": "M",
      "tipoSang": "AB+",
      "endereco": "Fruta de Leite",
      "viagens": [],
      "criadoEm": "2026-07-11T20:42:44.562Z",
      "disponivel": true
    }
    ```

    - **Erros:**
      - `400` — Campos obrigatórios ausentes e/ou inválidos
      - `401` — Credenciais inválidas (usuário não autenticado)
      - `404` — Doador não encontrado (doador com ID não existe)
      - `409` — CPF, RG e/ou Cartão SUS já cadastrado(s)


  ### DELETE /doadores/:id

    Deleta um doador pelo ID.

    - **Autenticação:** Bearer token (admin)
    - **Body:** Nenhum

    - **Resposta de sucesso:** `204 Deleted`

    - **Erros:**
      - `400` — ID inválido
      - `401` — Credenciais inválidas (usuário não autenticado)
      - `404` — Doador não encontrado (doador com ID não existe)
      - `409` — Doador com viagens cadastradas
  

## Viagens

  ### GET /viagens
  
    Lista todas as viagens.

    - **Autenticação:** Bearer token (admin)
    - **Body:** Nenhum

    - **Resposta de sucesso:** `200 OK`

    ```json
    [
      {
        "id": 1,
        "dataSaida": "2026-07-13T20:30:00.000Z",
        "limiteVagas": 10,
        "doadores": [
          {
            "id": 1,
            "nome": "Maria de Lourdes",
            "cpf": "12345678900",
            "rg": "12345678900",
            "cartaoSus": "12345678900",
            "dataNasc": "2001-11-09T00:00:00.000Z",
            "sexo": "F",
            "tipoSang": "O-",
            "endereco": "Rubelita"
          },
          {
            "id": 2,
            "nome": "João Pedro",
            "cpf": "98765432100",
            "rg": "98765432100",
            "cartaoSus": "98765432100",
            "dataNasc": "1994-07-20T00:00:00.000Z",
            "sexo": "M",
            "tipoSang": "AB+",
            "endereco": "Fruta de Leite"
          }
        ]
      }
    ]
    ```

    - **Erros:**
      - `204` — Lista de viagens vazia (não há viagens cadastrados)
      - `401` — Credenciais inválidas (usuário não autenticado)


  ### GET /viagens/:id
  
    Busca uma viagem pelo ID.

    - **Autenticação:** Bearer token (admin)
    - **Body:** Nenhum

    - **Resposta de sucesso:** `200 OK`

    ```json
    {
      "id": 1,
      "dataSaida": "2026-07-13T20:30:00.000Z",
      "limiteVagas": 10,
      "doadores": [
        {
          "id": 1,
          "nome": "Maria de Lourdes",
          "cpf": "12345678900",
          "rg": "12345678900",
          "cartaoSus": "12345678900",
          "dataNasc": "2001-11-09T00:00:00.000Z",
          "sexo": "F",
          "tipoSang": "O-",
          "endereco": "Rubelita"
        },
        {
          "id": 2,
          "nome": "João Pedro",
          "cpf": "98765432100",
          "rg": "98765432100",
          "cartaoSus": "98765432100",
          "dataNasc": "1994-07-20T00:00:00.000Z",
          "sexo": "M",
          "tipoSang": "AB+",
          "endereco": "Fruta de Leite"
        }
      ]
    }
    ```

    - **Erros:**
      - `400` — ID inválido
      - `401` — Credenciais inválidas (usuário não autenticado)
      - `404` — Viagem não encontrada (viagem com ID não existe)


  ### POST /viagens
  
    Cria uma nova viagem.

    - **Autenticação:** Bearer token (admin)
    - **Body:**

    ```json
    {
      "dataSaida": "2026-07-13T20:30:00.000Z",
      "limiteVagas": 10,
      "doadores": [1, 2]
    }
    ```

    - **Resposta de sucesso:** `200 OK`

    ```json
    {
      "id": 1,
      "dataSaida": "2026-07-13T20:30:00.000Z",
      "limiteVagas": 10,
      "doadores": [
        {
          "id": 1,
          "nome": "Maria de Lourdes",
          "cpf": "12345678900",
          "rg": "12345678900",
          "cartaoSus": "12345678900",
          "dataNasc": "2001-11-09T00:00:00.000Z",
          "sexo": "F",
          "tipoSang": "O-",
          "endereco": "Rubelita"
        },
        {
          "id": 2,
          "nome": "João Pedro",
          "cpf": "98765432100",
          "rg": "98765432100",
          "cartaoSus": "98765432100",
          "dataNasc": "1994-07-20T00:00:00.000Z",
          "sexo": "M",
          "tipoSang": "AB+",
          "endereco": "Fruta de Leite"
        }
      ]
    }
    ```

    - **Erros:**
      - `400` — Campos obrigatórios ausentes/inválidos
      - `401` — Credenciais inválidas (usuário não autenticado)


  ### PUT /viagens/:id
  
    Atualiza uma viagem pelo ID.

    - **Autenticação:** Bearer token (admin)
    - **Body:**

    ```json
    {
      "dataSaida": "2026-07-20T12:00:00.000Z",
      "limiteVagas": 20,
      "doadores": [1, 2]
    }
    ```

    - **Resposta de sucesso:** `200 OK`

    ```json
    {
      "id": 1,
      "dataSaida": "2026-07-20T12:00:00.000Z",
      "limiteVagas": 20,
      "doadores": [
        {
          "id": 1,
          "nome": "Maria de Lourdes",
          "cpf": "12345678900",
          "rg": "12345678900",
          "cartaoSus": "12345678900",
          "dataNasc": "2001-11-09T00:00:00.000Z",
          "sexo": "F",
          "tipoSang": "O-",
          "endereco": "Rubelita"
        },
        {
          "id": 2,
          "nome": "João Pedro",
          "cpf": "98765432100",
          "rg": "98765432100",
          "cartaoSus": "98765432100",
          "dataNasc": "1994-07-20T00:00:00.000Z",
          "sexo": "M",
          "tipoSang": "AB+",
          "endereco": "Fruta de Leite"
        }
      ]
    }
    ```

    - **Erros:**
      - `400` — Campos obrigatórios ausentes/inválidos
      - `401` — Credenciais inválidas (usuário não autenticado)
      - `404` — Viagem não encontrada (viagem com ID não existe)


  ### DELETE /viagens/:id
  
    Deleta uma viagem pelo ID.

    - **Autenticação:** Bearer token (admin)
    - **Body:** Nenhum

    - **Resposta de sucesso:** `204 Deleted`

    - **Erros:**
      - `400` — ID inválido
      - `401` — Credenciais inválidas (usuário não autenticado)
      - `404` — Viagem não encontrada (viagem com ID não existe)


## CORS

Esta API tem CORS habilitado para qualquer origem. Você pode consumi-la de qualquer domínio (localhost, Vercel, etc.) sem configuração adicional no cliente.