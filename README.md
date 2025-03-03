# Backend for chatting with Characters

Application built using [Hono](https://hono.dev/) and deployed on Cloudflare Workers.

The project uses:

- **Cloudflare Durable Objects** to manage WebSocket sessions
- **Cloudflare KV** to store chat history and sessions state, logs, meta information, etc

---

## 📦 Requirements

- Node.js 18+
- pnpm, yarn or npm
- Cloudflare account (paid version)
- Cloudflare CLI (`wrangler`)
- (optional) [wscat](https://github.com/websockets/wscat) for testing WebSocket locally

---

## 1. 🚀 Running locally

### 1.1 Install dependencies

```bash
nvm use # if you use NVM or select node v22 manually
npm install
cp .dev.vars.example .dev.vars
# TODO: npm test (WIP)
```

### 1.2 Start development server

```bash
wrangler dev
```

### 1.3 Testing WS via wscat

###

```bash
npm install -g wscat
```

#### Start WS session
```bash
wscat -H "Authorization: Bearer honoiscool" -c ws://localhost:8787/ws/hello_session
```

#### WS Payload example
```json
{ "action": "start", "character": "Santa" }
```

```json
{ "action": "start" } // Joi will be by default
```

#### GET current sessions for current user
```bash
curl -H "Authorization: Bearer honoiscool" "http://localhost:8787/sessions?pretty"
```

#### GET session by ID for current user
```bash
curl -H "Authorization: Bearer honoiscool" "http://localhost:8787/sessions/:sessionIdFromResponseAbove?pretty"
```

#### GET active characters for session (by ID) of current user
```bash
curl -H "Authorization: Bearer honoiscool" "http://localhost:8787/sessions/:sessionIdFromResponseAbove/characters/active?pretty"
```

#### GET logs
```bash
curl -H "Authorization: Bearer honoiscool" "http://localhost:8787/logs?pretty"
```

## 2. Set up Cloudflare environment

#### 2.1 Create KV namespaces

Create the required Cloudflare KV namespaces:

```bash
wrangler kv:namespace create "COMMAND_INC_LOGS"
wrangler kv:namespace create "COMMAND_INC_HISTORY"
```

Set your IDs for KVs to `wrangler.jsonc`

```json
"kv_namespaces": [
  { "binding": "COMMAND_INC_LOGS", "id": "COMMAND_INC_LOGS_ID" },
  { "binding": "COMMAND_INC_HISTORY", "id": "COMMAND_INC_HISTORY_ID" },
],
```

#### 2.2 Set up Durable Objects

Cloudflare Durable Object `COMMAND_INC_DO` will be automatically created after the first deploy of your application.
You can change the name for DO in wrangler.jsonc

#### 2.3 Set environment secrets

Set your `JWT_TOKEN` for token signing:

```bash
wrangler secret put JWT_TOKEN
```

---

This will run your Hono app locally in Cloudflare's development environment.

### Deploy to Cloudflare

```bash
wrangler deploy
```

### Testing Cloudflare App via wscat

###

```bash
npm install -g wscat
```

#### Start WS session
```bash
wscat -H "Authorization: Bearer secret_token_from_2.3" -c wss://worker_cloudflare_host/ws/hello_cloud_session
```

#### WS Payload example
```json
{ "action": "start", "character": "Santa" }
```

#### Get sessions for current user 
```bash
curl -H "Authorization: Bearer secret_token_from_2.3" "https://worker_cloudflare_host/sessions?pretty"
```

#### Get session by ID for current user
```bash
curl -H "Authorization: Bearer honoiscool" "https://worker_cloudflare_host/sessions/:sessionIdFromResponseAbove?pretty"
```

#### Get active chracters by session for current user
```bash
curl -H "Authorization: Bearer honoiscool" "https://worker_cloudflare_host/sessions/:sessionIdFromResponseAbove/characters/active?pretty"
```

#### Get logs
```bash
curl -H "Authorization: Bearer honoiscool" "https://worker_cloudflare_host/logs?pretty"
```

## 🔒 Security Notes

- All endpoints requiring authentication use **JWT** passed via `Authorization: Bearer <token>` header.

* (Solution for demo) Store secrets like `JWT_TOKEN` using:

```bash
wrangler secret put JWT_TOKEN
```

---
