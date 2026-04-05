# MeteoHub - Instruções para Copilot

## Comandos Essenciais

### Build, Test e Lint

```bash
# Lint do código
npm run lint

# Executar testes
npm run test                 # Rodar todos os testes uma vez
npm run test:watch          # Rodar testes em modo watch

# Build
npm run build               # Build do frontend (React + Vite)
npm run build:server        # Build do backend (TypeScript para JS)
```

### Desenvolvimento

```bash
npm run dev                 # Apenas frontend (porta 5173)
npm run dev:server          # Apenas backend (porta 3001)
npm run dev:full            # Frontend + Backend juntos (concurrently)
```

### Banco de Dados (Prisma)

```bash
npm run db:generate         # Gerar Prisma Client
npm run db:push             # Sincronizar schema com banco (dev)
npm run db:migrate          # Criar migração (produção)
npm run db:studio           # Abrir Prisma Studio
```

## Arquitetura do Projeto

### Estrutura Geral

O MeteoHub é uma aplicação **full-stack** dividida em:

- **Frontend**: React 19 + TypeScript + Vite com design glassmorphism
- **Backend**: Express + Prisma ORM + PostgreSQL (Supabase)
- **APIs Externas**: OpenWeatherMap (dados climáticos)

### Frontend (`src/`)

```
src/
├── Components/          # Componentes React reutilizáveis
├── Contexts/           # React Contexts (AuthContext)
├── Hooks/              # Custom hooks do React
├── Pages/              # Componentes de página/rota
├── Services/           # Camada de comunicação com APIs
│   ├── openWeatherApi.ts    # API do OpenWeatherMap
│   ├── backend.ts           # API backend local
│   └── supabaseApi.ts       # Cliente Supabase
├── Types/              # Definições TypeScript
├── Utils/              # Funções utilitárias
└── assets/             # Imagens, ícones, etc
```

**Pontos-chave do frontend:**

- **Cache em localStorage**: APIs do OpenWeatherMap têm cache de 1h implementado em `fetchWithCache()` no `openWeatherApi.ts`
- **Custom hooks genéricos**: `useLocalStorage` é usado por `useFavorites`, `useSearchHistory`, etc.
- **Backgrounds dinâmicos**: `useUpdateWeatherBackground` altera o fundo baseado nas condições climáticas
- **Temas**: Sistema light/dark via `useTheme`
- **Autenticação**: JWT gerenciado via `AuthContext` com refresh token automático
- **Internacionalização**: API configurada para `pt_br` por padrão

### Backend (`server/`)

```
server/
├── controllers/         # Controladores Express (auth, favorites, history)
├── middleware/          # Middlewares (auth, csrf, errorBoundary)
├── routes/             # Definição de rotas da API
├── services/           # Lógica de negócio
├── repositories/       # Camada de acesso ao banco (Prisma)
├── types/              # Tipos TypeScript do backend
└── utils/              # Prisma client, logger (pino), validação (zod)
```

**Pontos-chave do backend:**

- **Autenticação JWT**: Tokens salvos em cookies HTTP-only via `cookie-parser`
- **Rate limiting**: 100 requisições por 15min na rota `/api/`
- **Logging estruturado**: `pino` + `pino-http` para logs JSON
- **Validação com Zod**: Schemas de validação em `utils/validation.ts`
- **CORS configurado**: Permite `localhost:5173` e domínio Vercel
- **Swagger/OpenAPI**: Documentação automática disponível

### Banco de Dados (Prisma)

Modelos principais:

- **User**: Usuários com email/senha hash
- **RefreshToken**: Tokens de refresh JWT
- **FavoriteCity**: Cidades favoritas do usuário
- **SearchHistory**: Histórico de buscas
- **WeatherAlertCache**: Cache de alertas meteorológicos

**Relações importantes:**
- Um User possui muitos FavoriteCities, RefreshTokens e SearchHistory
- Cascade delete: Ao deletar User, todas as relações são deletadas

## Convenções do Código

### TypeScript

- **Tipos explícitos**: Sempre tipar parâmetros e retornos de funções
- **Interfaces para dados**: Use `interface` para estruturas de dados da API
- **Type para unions**: Use `type` para unions e aliases

### React

- **Functional components**: Apenas componentes funcionais, sem classes
- **React Compiler**: Projeto usa `babel-plugin-react-compiler` para otimizações automáticas
- **Hooks personalizados**: Prefixo `use` para todos os custom hooks
- **PascalCase**: Componentes e arquivos de componentes em PascalCase

### CSS

- **Vanilla CSS puro**: Sem Tailwind ou CSS-in-JS
- **CSS Modules**: Arquivos `.module.css` quando necessário
- **Glassmorphism**: Use `backdrop-filter: blur()` e transparências para manter a estética

### Backend

- **Async/await**: Sempre usar async/await, nunca callbacks
- **Error handling**: Use `asyncWrapper` middleware para capturar erros em controllers
- **Response padronizado**: Use funções helper em `utils/response.ts`
- **Validação Zod**: Valide entrada do usuário com Zod antes de processar

### Nomenclatura

- **Arquivos**: PascalCase para componentes React, camelCase para utils/hooks
- **Variáveis**: camelCase
- **Constantes**: UPPER_SNAKE_CASE
- **Banco de dados**: snake_case (padrão Prisma `@@map`)

## Variáveis de Ambiente

### Frontend (Vite - prefixo `VITE_`)

```env
VITE_WEATHER_API_KEY=     # OpenWeatherMap API key (obrigatório)
VITE_BACKEND_URL=         # URL do backend (default: http://localhost:3001/api)
VITE_SUPABASE_URL=        # URL do projeto Supabase (opcional)
VITE_SUPABASE_ANON_KEY=   # Chave anônima Supabase (opcional)
```

### Backend

```env
DATABASE_URL=             # URL de conexão Postgres (Supabase pooler)
DIRECT_URL=               # URL direta Postgres (para migrations)
JWT_SECRET=               # Segredo para assinar tokens JWT
JWT_EXPIRES_IN=7d         # Expiração do token (padrão: 7 dias)
PORT=3001                 # Porta do servidor
NODE_ENV=development      # Ambiente (development/production)
CORS_ORIGIN=              # Origens permitidas no CORS
```

## Fluxo de Autenticação

1. **Registro**: POST `/api/auth/register` → cria User com senha hash (bcrypt)
2. **Login**: POST `/api/auth/login` → retorna JWT em cookie HTTP-only
3. **Refresh**: Token refresh automático via interceptor em `backend.ts`
4. **Rotas protegidas**: Middleware `auth.ts` valida JWT em rotas que requerem autenticação

## Dados da API OpenWeatherMap

Todas as chamadas usam:
- **lang**: `pt_br` (português brasileiro)
- **units**: `metric` (Celsius, km/h, etc.)
- **Cache**: 1 hora via localStorage com prefixo `MeteoHubCache_`

Principais endpoints consumidos:
- `/data/2.5/weather` - Clima atual
- `/data/2.5/forecast` - Previsão 5 dias
- `/data/2.5/air_pollution` - Qualidade do ar (AQI)
- `/data/2.5/uvi` - Índice UV

## Testes

- **Framework**: Vitest com jsdom
- **Testing Library**: `@testing-library/react` e `@testing-library/jest-dom`
- **Setup**: `src/test/setup.ts` configura ambiente de testes
- **Localização**: Testes junto aos arquivos (`*.test.ts`) ou em `src/test/`
