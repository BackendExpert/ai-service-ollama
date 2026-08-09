# AI Ollama Service - Backend Javascript/Typescript

- A lightweight JavaScript/TypeScript AI service for integrating Ollama LLMs, text embeddings, RAG (Retrieval-Augmented Generation), and in-memory vector similarity search into backend applications.

- This service is designed to work without any database or external vector database.


## Features

- Ollama LLM integration
- Chat-based AI responses
- Text generation
- Text embeddings
- RAG text chunking
- In-memory vector storage
- Cosine similarity calculation
- Semantic vector search
- RAG context retrieval
- TypeScript support
- No database required
- No external vector database required
- Easy integration with Node.js backend applications



## Architecture

```text

Application
     |
     v
AI Ollama Service
     |
     +--------------------+
     |                    |
     v                    v
   Ollama              RAG / Vector
     |                    |
     |                    +--> Text Chunking
     |                    |
     |                    +--> Embeddings
     |                    |
     |                    +--> Vector Search
     |
     +--> Generate
     |
     +--> Chat
     |
     +--> Embeddings
```

- The complete RAG process works as follows:

```text

    Document
        |
        v
    RagAI.splitIntoChunks()
        |
        v
    Text Chunks
        |
        v
    Ollama.createEmbedding()
        |
        v
    Vector Embeddings
        |
        v
    VectorAI.search()
        |
        v
    Relevant Chunks
        |
        v
    Ollama.chat()
        |
        v
    AI Answer

```



## Installation

- Install the required dependency:

```bash

npm install axios

```

- For TypeScript development:

```bash

npm install -D typescript tsx

```

## Ollama Configuration

- The service communicates with an Ollama server.

- Example configuration:

```js

const ai = new Ollama( 
    "http://localhost:11434/", // you can use any hosted ollama
    "nomic-embed-text", 
    "qwen2.5:1.5b", 
    "qwen2.5:1.5b", 
);

```

- The constructor accepts:

- - Ollama URL 
- - Embedding Model 
- - Base Model 
- - Chat Model

- Example:

```js

new Ollama( 
    ollamaUrl, 
    embeddingModel, 
    baseModel, 
    chatModel,
);

```

### Ollama Class

The `Ollama` class provides three main operations:

```js 

createEmbedding()
generate()
chat()

```

### Create Embedding

- Creates a vector embedding from text using the configured embedding model.

```js

const embedding = await ai.createEmbedding( "React is a JavaScript library.", ); 

console.log(embedding);

```

- The result is a numeric vector:

```json

[ 
    0.0123, 
    -0.0345, 
    0.0876, 
    ... 
]

```

- The embedding can then be used for semantic similarity and vector search.


### Generate

The `generate()` method sends a prompt directly to the configured base model.

```js

const response = await ai.generate( "Explain what an API is.", ); 
console.log(response);

```

- Optional generation parameters are supported:

```js

const response = await ai.generate( 
    "Explain REST APIs.",
        { 
            temperature: 0.2, 
            topP: 0.9, 
            topK: 40, 
            repeatPenalty: 1.1, 
            numCtx: 4096, 
        },
);


```

### Chat

- The `chat()` method supports system, user, and assistant messages.

```js

const response = await ai.chat([ 
        { role: "system", content: "You are a helpful AI assistant.", },
        { role: "user", content: "What is React?", }, ]); 

console.log(response);


```

- Supported roles:

```js

type OllamaMessage = { 
    role: | "system" | "user" | "assistant"; 
    content: string; 
};

```

- Chat options:

```js
const response =
    await ai.chat(
        [
            {
                role: "user",
                content:
                    "Explain microservices.",
            },
        ],
        {
            temperature: 0.2,
            topP: 0.9,
            topK: 40,
            repeatPenalty: 1.1,
            numCtx: 4096,
        },
    );

```


### RAG

- The RagAI class provides text chunking for Retrieval-Augmented Generation.

```js

const rag = new RagAI();

const chunks =
    rag.splitIntoChunks(
        documentText,
        300,
    );

Example:

const document = `
    React is a JavaScript library.
    React uses reusable components.
    Components can contain state.
    React applications can communicate
    with backend APIs.
`;

const chunks =
    rag.splitIntoChunks(
        document,
        100,
    );

console.log(chunks);

```

- The text is cleaned and divided into smaller chunks.


### Vector Search

- The VectorAI class provides in-memory vector operations.

- It supports:


```js
cosineSimilarity()
search()

```

### Cosine Similarity

- Cosine similarity compares two embedding vectors.

```js
const score =
    vector.cosineSimilarity(
        questionEmbedding,
        documentEmbedding,
    );

console.log(score);

```

- The vectors must have the same dimensions.

### Vector Documents

- A vector document contains the original text and its embedding.

```js

const document = {
    id: "chunk-1",
    fileId: "file-1",
    chunkIndex: 0,
    text: "React is a JavaScript library.",
    embedding: embedding,
};

```

- The TypeScript interface is:

```js

interface VectorDocument {
    id?: string;
    fileId?: string;
    chunkIndex?: number;
    text: string;
    embedding: number[];
    metadata?: Record<string, any>;
}

```

### Vector Search

- Vector search compares a question embedding against document embeddings.

```js
const results =
    vector.search(
        questionEmbedding,
        documents,
        5,
    );

```

- The result contains:


```js

interface VectorSearchResult
    extends VectorDocument {
    score: number;
}
```

- Results are sorted from the highest similarity score to the lowest.


### Complete RAG Example

- A complete RAG workflow can be implemented without a database.

```js

const rag = new RagAI();
const vector = new VectorAI();

const chunks =
    rag.splitIntoChunks(
        document,
        300,
    );

const documents = [];

for (
    let i = 0;
    i < chunks.length;
    i++
) {
    const embedding =
        await ai.createEmbedding(
            chunks[i],
        );

    documents.push({
        id: `chunk-${i}`,
        chunkIndex: i,
        text: chunks[i],
        embedding,
    });
}

const question =
    "What is React used for?";

const questionEmbedding =
    await ai.createEmbedding(
        question,
    );

const results =
    vector.search(
        questionEmbedding,
        documents,
        5,
    );

const context =
    results
        .map(
            (result) =>
                result.text,
        )
        .join("\n\n");

const answer =
    await ai.chat([
        {
            role: "system",
            content:
                "Answer using only the provided context.",
        },
        {
            role: "user",
            content: `
Context:

${context}

Question:

${question}
            `,
        },
    ]);

console.log(answer);

```

## Database & Storage Integration

- This service is database-agnostic.

- The core service does not require or depend on any specific database. Developers can choose the storage technology that best fits their application.

- The service can be integrated with:

- - MongoDB
- - PostgreSQL
- - MySQL
- - SQL Server
- - Redis
- - SQLite
- - Firebase
- - Supabase
- - Pinecone
- - Qdrant
- - Weaviate
- - Chroma
- - Milvus
- - Elasticsearch
- - Any custom database or vector storage system

### How It Works

- The service provides the AI and vector-processing functionality, while the application developer is responsible for storing and retrieving data.

## Database & Storage Architecture

```text

Your Application
        |
        v
AI Ollama Service
        |
        +-------------+-------------+
        |             |             |
        v             v             v
      Chat        Generate     Embeddings
                                    |
                                    v
                              Your Storage
                                    |
              +---------------------+---------------------+
              |                     |                     |
              v                     v                     v
           MongoDB             PostgreSQL             Vector DB

```

## Testing

- The project includes a test file that can test:

```js

createEmbedding()
generate()
chat()
splitIntoChunks()
cosineSimilarity()
search()

```

### Full RAG pipeline

- Run the test with:

```bash
npx tsx test.ts

```

- The test does not require a database.

### API Summary

| Class | Method | Purpose |
|---|---|---|
| `Ollama` | `createEmbedding()` | Generate text embeddings |
| `Ollama` | `generate()` | Generate text from a prompt |
| `Ollama` | `chat()` | Generate conversational responses |
| `RagAI` | `splitIntoChunks()` | Split documents into chunks |
| `VectorAI` | `cosineSimilarity()` | Calculate vector similarity |
| `VectorAI` | `search()` | Find the most relevant chunks |


## Technologies

- JavaScript
- TypeScript
- Node.js
- Axios
- Ollama
- Qwen
- Nomic Embeddings
- Retrieval-Augmented Generation (RAG)
- Vector Similarity Search

# License

This project is licensed under the MIT License.

You are free to use, copy, modify, merge, publish, distribute, sublicense, and sell copies of this software, subject to the terms and conditions of the MIT License.

See the [MIT License](https://github.com/BackendExpert/ai-service-ollama/blob/master/LICENSE) file for the complete license terms.