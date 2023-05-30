![savant-logo](./frontend/public/assets/logo512.png)

# Savant: Ask me a question, I'll tell you no lies.

An AI document ingestion, analysis and query tool

**_ in development _**

## How it works

### Clone

```bash
git clone https://github.com/foolishsailor/savant.git
```

### Install Dependencies

#### Frontend

```bash
cd frontend
npm i
```

#### Server

```bash
cd server
npm i
```

-- or --

#### Python Server

##### Install poetry

[Poetry Install Guide](https://python-poetry.org/docs/)

**Linux, macOS, Windows (WSL)**

```
curl -sSL https://install.python-poetry.org | python3 -
```

**Windows (Powershell)**

```
curl -sSL https://install.python-poetry.org | python3 -
```

```bash
(Invoke-WebRequest -Uri https://install.python-poetry.org -UseBasicParsing).Content | py -
npm i
```

##### Configure Poetry

**config poetry to creaty viertual env in locl directory**

```
poetry config virtualenvs.in-project true
```

**create poetry virtual env**

```
poetry shell
```

**install application in virtual env**

```
poetry install
```

**select the python.exe in the virtual environment as your interpreter**

This will create a .venv in the pyServer directory.

[How to select a python intrepreter](https://code.visualstudio.com/docs/python/environments)

Following the above guide select the python.exe found in: pyServer/.venv/Scripts/python.exe

### Configure Settings

Create a local .env file in the root of the repo using the .env.template as a guide for both Frontend and Backend

### Install External Applications

[Chroma](https://www.trychroma.com/) local instance for a vector database

[Docker](https://www.docker.com/) to run Chroma in a local docker container.

#### 1. Download docker here: [Docker](https://www.docker.com/) and install

```bash
git clone https://github.com/chroma-core/chroma.git
```

### Run Chroma

```bash
cd chroma
docker-compose up -d --build
```

### Run Savant BE

```bash
cd server
npm start
```

-- or --

### Run Savant Python BE

```bash
cd pyServer
poetry run python main.py
```

### Run Savant FE

```bash
cd frontend
npm start
```

## Contact

If you have any questions, find me on [Twitter](https://twitter.com/foolishsailor).
