# Backend MeteoHub

Backend do MeteoHub usando Express + Prisma ORM + Supabase (PostgreSQL).

## Estrutura

```
server/
├── controllers/     # Lógica de controle das requisições
├── middleware/      # Middlewares Express (auth, etc)
├── routes/          # Definição das rotas da API
├── services/        # Lógica de negócio
├── types/           # Tipos TypeScript
└── utils/           # Utilitários (prisma, response, validation)
```

## Configuração

### 1. Variáveis de Ambiente

Copie `.env.example` para `.env` e configure:

```bash
cp .env.example .env
```

Edite o `.env` com suas credenciais do Supabase:

```env
# Supabase Database
DATABASE_URL="postgresql://postgres:[SUA-SENHA]@db.[SEU-PROJECT-REF].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[SUA-SENHA]@db.[SEU-PROJECT-REF].supabase.co:5432/postgres"

# JWT
JWT_SECRET=sua-chave-secreta-muito-segura
JWT_EXPIRES_IN=7d

# Server
PORT=3001
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:5173
```

### 2. Obter Credenciais do Supabase

1. Acesse [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá em **Settings** > **Database**
4. Copie a **Connection string** (URI)
5. Substitua `[YOUR-PASSWORD]` pela senha do banco

### 3. Executar Migrações

```bash
# Gerar Prisma Client
npm run db:generate

# Sincronizar schema com banco (desenvolvimento)
npm run db:push

# OU criar migração (produção)
npm run db:migrate
```

## Executar

```bash
# Desenvolvimento - apenas frontend
npm run dev

# Desenvolvimento - apenas backend
npm run dev:server

# Desenvolvimento - frontend + backend
npm run dev:full
```

## API Endpoints

### Auth

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/api/auth/register` | Registrar usuário | ❌ |
| POST | `/api/auth/login` | Login | ❌ |
| GET | `/api/auth/profile` | Perfil do usuário | ✅ |

### Favoritos

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/favorites` | Listar favoritos | ✅ |
| POST | `/api/favorites` | Adicionar favorito | ✅ |
| DELETE | `/api/favorites/:cityId` | Remover favorito | ✅ |

### Histórico

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/history` | Listar histórico | ✅ |
| POST | `/api/history` | Adicionar ao histórico | ✅ |
| DELETE | `/api/history` | Limpar histórico | ✅ |

## Exemplos de Uso

### Registrar

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@email.com","password":"123456","name":"Usuário"}'
```

### Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@email.com","password":"123456"}'
```

### Adicionar Favorito (com token)

```bash
curl -X POST http://localhost:3001/api/favorites \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{"cityId":"3470127","cityName":"Brasília","country":"BR","lat":-15.78,"lon":-47.93}'
```

## Tecnologias

- **Express** - Framework web
- **Prisma ORM** - ORM para PostgreSQL
- **Supabase** - Banco PostgreSQL gerenciado
- **JWT** - Autenticação via token
- **bcryptjs** - Hash de senhas
- **Zod** - Validação de dados