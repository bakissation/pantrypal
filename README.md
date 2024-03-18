# PantryPal

PantryPal is a Vue.js application that helps you manage your pantry items. It provides features such as user registration, login, and managing pantry items.

## Project Structure

Here's a brief explanation of the project structure:

- `db.js`: This file is responsible for setting up the database connection using Sequelize.
- `server.js`: This is the main server file that sets up the Express.js server.
- `src/`: This directory contains all the Vue.js source code.
  - `App.vue`: This is the main Vue.js component.
  - `assets/`: This directory contains static assets like images.
  - `components/`: This directory contains Vue.js components.
  - `router/`: This directory contains Vue Router configuration.
  - `views/`: This directory contains Vue.js view components.
- `public/`: This directory contains public files like `index.html` and `favicon.ico`.
- `docker-compose.yaml` and `Dockerfile`: These files are used for setting up Docker for the application.
- `package.json`: This file contains the list of project dependencies and scripts.

## Getting Started

### Prerequisites

- Node.js
- npm
- Docker (optional)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/username/pantrypal.git
```

2. Install the dependencies:

```bash
cd pantrypal
npm install
```

3. Fill the .env

```bash
mv .env.exemple .env
```
and fill needed information

4. Set up the database

```bash
node db.js
```

5. Launch the server

```bash
node server.js
```

### Running the Application

To start the application in development mode, run:

```bash
npm run dev
```

To build the application for production, run:

```bash
npm run build
```


## Contributing

Contributions are welcome!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.