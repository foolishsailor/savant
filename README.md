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

### Configure Settings

Create a local .env file in the root of the repo with the following:

```bash
CHAIN_END_TRIGGER_MESSAGE=c0fb7f7030574dd7801ae6f2d53dfd51 # <== this is a bit of a hack but needs to be copied
OPENAI_API_KEY=YOUR_KEY_HERE # required
DEFAULT_MODEL=gpt-3.5-turbo # or gpt-4
```

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
cs server
npm start
```

### Run Savant FE

```bash
cs frontend
npm start
```

## Contact

If you have any questions, fin me on [Twitter](https://twitter.com/foolishsailor).
