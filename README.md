# 🧩 Whiteboard App – Development Setup Guide

This project is composed of:

* 🔐 **Keycloak** for authentication
* 🗄️ **PostgreSQL** for database
* 🧠 **Backend**: Node.js (e.g., Express/Fastify/Nest)
* 🎨 **Frontend**: React (e.g., Vite or Create React App)

> The stack runs locally using Docker and supports full integration between authentication, database, and app layers.

---

## 📦 Prerequisites

* [Docker](https://www.docker.com/products/docker-desktop)
* [Node.js](https://nodejs.org/) (v18+ recommended)
* [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/)

---

## 🐳 Step 1: Start Infrastructure (PostgreSQL, Keycloak, PgAdmin)

Make sure your `docker-compose.yml` is located in the project root:

```yaml
version: '3.8'

services:
  keycloak:
    image: quay.io/keycloak/keycloak:26.2.4
    container_name: keycloak
    command: start-dev
    environment:
      - KEYCLOAK_ADMIN=admin
      - KEYCLOAK_ADMIN_PASSWORD=admin
      - KC_DB=postgres
      - KC_DB_URL_HOST=postgres
      - KC_DB_URL_DATABASE=whiteboard_db
      - KC_DB_USERNAME=whiteboard_user
      - KC_DB_PASSWORD=secret123
    ports:
      - "8080:8080"
    depends_on:
      - postgres
    restart: unless-stopped

  postgres:
    image: postgres:15
    container_name: postgres_whiteboard
    environment:
      - POSTGRES_USER=whiteboard_user
      - POSTGRES_PASSWORD=secret123
      - POSTGRES_DB=whiteboard_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: [ "CMD-SHELL", "pg_isready -U whiteboard_user" ]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  pgadmin:
    image: dpage/pgadmin4
    container_name: pgadmin
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@admin.com
      PGADMIN_DEFAULT_PASSWORD: admin123
    ports:
      - "5050:80"
    depends_on:
      - postgres

volumes:
  postgres_data:
```

### ▶️ Run Docker services

```bash
docker-compose up -d
```

> This will start PostgreSQL, Keycloak on `http://localhost:8080`, and PgAdmin on `http://localhost:5050`.

---

## 🔐 Step 2: Configure Keycloak (Manual Setup)

1. Open Keycloak: [http://localhost:8080](http://localhost:8080)
2. Login with:

   * Username: `admin`
   * Password: `admin`
3. Create a new Realm: `whiteboard-app`
4. Create a new Client (e.g., `frontend-client`) with access type `public`
5. Create roles and users as needed

> You can export the public key from Realm Settings → Keys → RS256 → Copy Public Key.

---

## ⚙️ Step 3: Backend Setup (Node.js)

Go to the `backend/` directory and create a `.env` file:

```env
DATABASE_URL=postgresql://whiteboard_user:secret123@localhost:5432/whiteboard_db
KEYCLOAK_REALM=whiteboard-app
KEYCLOAK_URL=http://localhost:8080
KEYCLOAK_PUBLIC_KEY=-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkq...IDAQAB\n-----END PUBLIC KEY-----
```

Then install dependencies:

```bash
cd backend
yarn install # or npm install
```

Run the backend server:

```bash
yarn dev # or npm run dev
```

---

## 🎨 Step 4: Frontend Setup (React)

Go to the `frontend/` directory:

```bash
cd frontend
```

Create a `.env` file if needed (e.g., for Keycloak client info or API endpoint):

```env
VITE_API_URL=http://localhost:3000
VITE_KEYCLOAK_URL=http://localhost:8080
VITE_KEYCLOAK_REALM=whiteboard-app
VITE_KEYCLOAK_CLIENT=frontend-client
```

Install dependencies and start the development server:

```bash
yarn install # or npm install
yarn dev     # or npm run dev
```

Access the frontend via [http://localhost:5173](http://localhost:5173) (or depending on your Vite config).

---

## ✅ Verification Checklist

| Component    | URL                                            | Status           |
| ------------ | ---------------------------------------------- | ---------------- |
| Keycloak     | [http://localhost:8080](http://localhost:8080) | Login page opens |
| PgAdmin      | [http://localhost:5050](http://localhost:5050) | Login as admin   |
| Backend API  | [http://localhost:3000](http://localhost:3000) | API running      |
| Frontend App | [http://localhost:5173](http://localhost:5173) | App loads        |

---

## 🧪 Development Tips

* Ensure `backend` is CORS-enabled to accept requests from frontend.
* For real-time WebSocket, use dynamic `boardId` or `userId` via token.
* Use `pgadmin` for inspecting live DB and debugging stroke data.

---