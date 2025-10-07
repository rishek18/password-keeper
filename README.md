# Secure Vault 🛡️

A full-stack, secure password manager application built with a Node.js/Express backend and a React frontend. This project's key security feature is **end-to-end client-side encryption**, ensuring that unencrypted passwords are never sent over the network or stored in the database.

This project was successfully migrated from a Python/FastAPI backend to a modern Node.js/Express stack.

## Key Features

-   🔐 **Client-Side Encryption**: All sensitive data (passwords, usernames, notes) is encrypted in the browser using the user's master password before being sent to the server. The server only ever stores encrypted data.
-   🔑 **JWT Authentication**: Secure user authentication using JSON Web Tokens.
-   ⚙️ **Full CRUD Functionality**: Create, Read, Update, and Delete vault items.
-   🔍 **Live Search**: Instantly filter and search through your vault items.
-   📋 **Copy to Clipboard**: Easily copy usernames and passwords.
-   📱 **Responsive UI**: A modern and clean user interface built with Tailwind CSS and shadcn/ui components.

---

## Tech Stack

| Backend (Server)                               | Frontend (Client)                                          |
| ---------------------------------------------- | ---------------------------------------------------------- |
| **[Node.js](https://nodejs.org/)**             | **[React 18](https://reactjs.org/)**                       |
| **[Express.js](https://expressjs.com/)**       | **[Craco](https://craco.js.org/)** for configuration       |
| **[MongoDB](https://www.mongodb.com/)**        | **[Tailwind CSS](https://tailwindcss.com/)** for styling   |
| **[Mongoose](https://mongoosejs.com/)**        | **[React Router](https://reactrouter.com/)** for routing   |
| **[JWT](https://jwt.io/)** for Authentication  | **[Axios](https://axios-http.com/)** for API requests      |
| **[Bcrypt.js](https://www.npmjs.com/package/bcrypt)** for Hashing | **[Crypto.js](https://cryptojs.gitbook.io/)** for encryption |
| Managed with **npm**                           | Managed with **yarn**                                      |

---

## Project Structure

The project uses a monorepo-like structure with a clear separation between the backend and frontend.
/secure-vault
├── client/
│ └── frontend/ <-- The React (Craco) project root
│ ├── public/
│ ├── src/
│ ├── package.json (Managed by Yarn)
│ └── ...
│
├── server/ <-- The Node.js (Express) project root
│ ├── config/
│ ├── models/
│ ├── routes/
│ ├── package.json (Managed by NPM)
│ └── server.js
│
└── README.md
code
Code
---

## Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

Make sure you have the following installed on your system:
-   [Node.js](https://nodejs.org/) (v16 or later)
-   [Yarn](https://classic.yarnpkg.com/en/docs/install) (v1.x)
-   [MongoDB](https://www.mongodb.com/try/download/community) (must be installed and running as a service)

### Installation & Setup

**1. Clone the repository:**
```bash
git clone <your-repository-url>
cd secure-vault
2. Set up the Backend:
code
Bash
# Navigate to the server directory
cd server

# Install dependencies
npm install

# Create a .env file. You can copy .env.example if one exists, or create a new one.
Now, open the newly created .env file and add the following, filling in your own values:
code
Env
# server/.env
PORT=5000
MONGO_URL=mongodb://127.0.0.1:27017
DB_NAME=secure-vault-app
JWT_SECRET= # Generate a long, random string for this
JWT_EXPIRATION_HOURS=24
Tip: You can generate a strong JWT_SECRET by running require('crypto').randomBytes(64).toString('hex') in a Node.js terminal.
3. Set up the Frontend:
code
Bash
# Navigate to the correct frontend directory from the root
cd client/frontend

# Install dependencies
yarn install
Ensure your client/frontend/package.json contains the proxy setting for easy local development:
code
JSON
"proxy": "http://localhost:5000",
Running the Application
You will need two separate terminals to run both the backend and frontend servers.
Terminal 1: Start the Backend Server
code
Bash
# Navigate to the server directory
cd server

# Run the development server
npm run dev
You should see Server running on port 5000 and MongoDB Connected: 127.0.0.1. Leave this terminal running.
Terminal 2: Start the Frontend Client
code
Bash
# Navigate to the frontend directory
cd client/frontend

# Run the development server
yarn start
Your browser should automatically open to http://localhost:3000 where you can see the application.
Available Scripts
Backend (/server)
npm run dev: Starts the server with nodemon for automatic restarts on file changes.
npm start: Starts the server in production mode.
Frontend (/client/frontend)
yarn start: Starts the development server using Craco.
yarn build: Creates a production-ready build of the application.
yarn test: Runs the test suite.