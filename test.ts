import {
    Ollama,
    RagAI,
    VectorAI,
} from "./index";

async function test() {
    const ai = new Ollama(
        "http://localhost:11434/",
        "nomic-embed-text",
        "qwen2.5:1.5b",
        "qwen2.5:1.5b",
    );

    const rag = new RagAI();
    const vector = new VectorAI();

    // ============================================
    // 1. TEST createEmbedding()
    // ============================================

    console.log("\n================================");
    console.log("1. createEmbedding()");
    console.log("================================");

    const embeddingText =
        "React is a JavaScript library used to build interactive and reusable user interfaces for modern web applications.";

    const embedding =
        await ai.createEmbedding(
            embeddingText,
        );

    console.log("\nInput:");
    console.log(embeddingText);

    console.log("\nEmbedding length:");
    console.log(embedding.length);

    console.log("\nFirst 10 embedding values:");
    console.log(
        embedding.slice(0, 10),
    );


    // ============================================
    // 2. TEST generate()
    // ============================================

    console.log("\n================================");
    console.log("2. generate()");
    console.log("================================");

    const generateResult =
        await ai.generate(
            "Explain the difference between frontend development and backend development with simple examples.",
        );

    console.log("\nResponse:");
    console.log(generateResult);


    // ============================================
    // 3. TEST chat()
    // ============================================

    console.log("\n================================");
    console.log("3. chat()");
    console.log("================================");

    const chatResult =
        await ai.chat([
            {
                role: "system",
                content:
                    "You are a helpful software engineering tutor. Give clear and accurate answers.",
            },
            {
                role: "user",
                content:
                    "Explain what a REST API is and give a simple example.",
            },
        ]);

    console.log("\nResponse:");
    console.log(chatResult);


    // ============================================
    // 4. LARGE DOCUMENT
    // ============================================

    console.log("\n================================");
    console.log("4. LARGE DOCUMENT");
    console.log("================================");

    const document = `
        React is a JavaScript library for building user interfaces.
        React was created to make it easier to develop interactive web applications.
        React applications are normally divided into reusable components.
        Components allow developers to split a large interface into smaller and manageable pieces.
        A React component can contain properties, state, and event handlers.
        Properties are commonly called props and are used to pass data from one component to another.
        State represents data that can change during the lifetime of a component.
        React provides hooks that allow functional components to use state and other React features.
        The useState hook is commonly used to manage component state.
        The useEffect hook is commonly used when a component needs to perform side effects.
        React uses a virtual DOM to efficiently update the user interface.
        When component data changes, React determines which parts of the interface need to be updated.
        React applications can communicate with backend services using HTTP requests.
        Axios and the Fetch API are commonly used to send HTTP requests from React applications.
        REST APIs allow frontend applications to communicate with backend services.
        A REST API commonly uses HTTP methods such as GET, POST, PUT, PATCH, and DELETE.
        GET requests are normally used to retrieve data from a server.
        POST requests are normally used to create new data.
        PUT and PATCH requests are used to update existing data.
        DELETE requests are used to remove data.
        JSON is commonly used as the data format between frontend and backend applications.
        Node.js is a JavaScript runtime that allows JavaScript code to run outside the browser.
        Node.js is commonly used to build backend applications and REST APIs.
        Express is a popular Node.js framework for building web servers and APIs.
        NestJS is another framework for building scalable server-side applications with Node.js.
        NestJS provides modules, controllers, services, dependency injection, and other architectural features.
        A controller is responsible for receiving HTTP requests and returning responses.
        A service usually contains business logic used by the application.
        MongoDB is a NoSQL database that stores information using documents and collections.
        PostgreSQL is a relational database that stores information using tables and relationships.
        Authentication is the process of verifying the identity of a user.
        Authorization determines what an authenticated user is allowed to access.
        JSON Web Tokens are commonly used to implement authentication in web applications.
        Passwords should never be stored as plain text.
        Password hashing algorithms such as bcrypt can be used to securely store passwords.
        Middleware can process requests before they reach the final controller or route handler.
        Software applications should validate user input before processing it.
        Validation helps prevent invalid data from entering the application.
        Error handling is important because backend applications must handle unexpected situations safely.
        Logging helps developers identify problems and understand application behaviour.
        Unit testing is used to test individual functions or components.
        Integration testing checks whether multiple parts of an application work correctly together.
        End-to-end testing verifies complete application workflows.
        Microservices architecture divides a large application into smaller independent services.
        Each microservice can be responsible for a specific business capability.
        Microservices can communicate using HTTP APIs, message queues, or other communication protocols.
        Docker can be used to package applications and their dependencies into containers.
        Containers make it easier to deploy applications consistently across different environments.
        Cloud platforms can provide infrastructure for deploying frontend, backend, databases, and other services.
        Good software architecture improves maintainability, scalability, reliability, and testability.
    `;


    // ============================================
    // 5. TEST splitIntoChunks()
    // ============================================

    console.log("\n================================");
    console.log("5. splitIntoChunks()");
    console.log("================================");

    const chunks =
        rag.splitIntoChunks(
            document,
            300,
        );

    console.log(
        "\nTotal chunks:",
        chunks.length,
    );

    chunks.forEach(
        (chunk, index) => {
            console.log(
                `\n---------- CHUNK ${index} ----------`,
            );

            console.log(
                chunk,
            );

            console.log(
                `Length: ${chunk.length}`,
            );
        },
    );


    // ============================================
    // 6. CREATE EMBEDDINGS FOR ALL CHUNKS
    // ============================================

    console.log("\n================================");
    console.log("6. CREATE CHUNK EMBEDDINGS");
    console.log("================================");

    const vectorDocuments = [];

    for (
        let i = 0;
        i < chunks.length;
        i++
    ) {
        console.log(
            `Creating embedding ${i + 1}/${chunks.length}...`,
        );

        const chunkEmbedding =
            await ai.createEmbedding(
                chunks[i],
            );

        vectorDocuments.push({
            id: `chunk-${i}`,
            fileId: "software-engineering-document",
            chunkIndex: i,
            text: chunks[i],
            embedding: chunkEmbedding,
            metadata: {
                source: "test-document",
                category: "software-engineering",
            },
        });
    }

    console.log(
        "\nTotal vector documents:",
        vectorDocuments.length,
    );


    // ============================================
    // 7. TEST cosineSimilarity()
    // ============================================

    console.log("\n================================");
    console.log("7. cosineSimilarity()");
    console.log("================================");

    const similarityQuestion =
        "What is React used for?";

    const similarityQuestionEmbedding =
        await ai.createEmbedding(
            similarityQuestion,
        );

    const similarity =
        vector.cosineSimilarity(
            similarityQuestionEmbedding,
            vectorDocuments[0].embedding,
        );

    console.log(
        "\nQuestion:",
        similarityQuestion,
    );

    console.log(
        "\nSimilarity with first chunk:",
        similarity,
    );


    // ============================================
    // 8. TEST VECTOR SEARCH
    // ============================================

    console.log("\n================================");
    console.log("8. Vector Search");
    console.log("================================");

    const question =
        "How does React manage component state?";

    const questionEmbedding =
        await ai.createEmbedding(
            question,
        );

    const searchResults =
        vector.search(
            questionEmbedding,
            vectorDocuments,
            5,
        );

    console.log(
        "\nQuestion:",
        question,
    );

    console.log(
        "\nTop 5 results:",
    );

    searchResults.forEach(
        (result, index) => {
            console.log(
                `\n========== RESULT ${index + 1} ==========`,
            );

            console.log(
                "Score:",
                result.score,
            );

            console.log(
                "Chunk index:",
                result.chunkIndex,
            );

            console.log(
                "Text:",
                result.text,
            );
        },
    );


    // ============================================
    // 9. TEST ANOTHER SEARCH
    // ============================================

    console.log("\n================================");
    console.log("9. SECOND VECTOR SEARCH");
    console.log("================================");

    const question2 =
        "What is the difference between authentication and authorization?";

    const questionEmbedding2 =
        await ai.createEmbedding(
            question2,
        );

    const searchResults2 =
        vector.search(
            questionEmbedding2,
            vectorDocuments,
            5,
        );

    console.log(
        "\nQuestion:",
        question2,
    );

    searchResults2.forEach(
        (result, index) => {
            console.log(
                `\n========== RESULT ${index + 1} ==========`,
            );

            console.log(
                "Score:",
                result.score,
            );

            console.log(
                "Chunk index:",
                result.chunkIndex,
            );

            console.log(
                "Text:",
                result.text,
            );
        },
    );


    // ============================================
    // 10. FULL RAG TEST
    // ============================================

    console.log("\n================================");
    console.log("10. FULL RAG TEST");
    console.log("================================");

    const ragQuestion =
        "What is React and how does it manage state?";

    const ragQuestionEmbedding =
        await ai.createEmbedding(
            ragQuestion,
        );

    const ragResults =
        vector.search(
            ragQuestionEmbedding,
            vectorDocuments,
            5,
        );

    const context =
        ragResults
            .map(
                (result) =>
                    result.text,
            )
            .join("\n\n");

    console.log(
        "\nQuestion:",
        ragQuestion,
    );

    console.log(
        "\nRetrieved Context:",
    );

    console.log(context);


    // ============================================
    // 11. SEND RAG CONTEXT TO CHAT()
    // ============================================

    console.log("\n================================");
    console.log("11. RAG + CHAT");
    console.log("================================");

    const ragAnswer =
        await ai.chat([
            {
                role: "system",
                content:
                    "You are a software engineering tutor. Answer the question using only the provided context. Do not invent information that is not present in the context.",
            },
            {
                role: "user",
                content: `
Context:

${context}

Question:

${ragQuestion}

Answer clearly and concisely.
                `,
            },
        ]);

    console.log(
        "\nAI Answer:",
    );

    console.log(
        ragAnswer,
    );


    // ============================================
    // 12. ANOTHER FULL RAG QUESTION
    // ============================================

    console.log("\n================================");
    console.log("12. SECOND RAG QUESTION");
    console.log("================================");

    const ragQuestion2 =
        "How does a frontend React application communicate with a backend API?";

    const ragQuestionEmbedding2 =
        await ai.createEmbedding(
            ragQuestion2,
        );

    const ragResults2 =
        vector.search(
            ragQuestionEmbedding2,
            vectorDocuments,
            5,
        );

    const context2 =
        ragResults2
            .map(
                (result) =>
                    result.text,
            )
            .join("\n\n");

    const ragAnswer2 =
        await ai.chat([
            {
                role: "system",
                content:
                    "Answer only using the provided context.",
            },
            {
                role: "user",
                content: `
Context:

${context2}

Question:

${ragQuestion2}
                `,
            },
        ]);

    console.log(
        "\nQuestion:",
        ragQuestion2,
    );

    console.log(
        "\nRetrieved Context:",
    );

    console.log(context2);

    console.log(
        "\nAI Answer:",
    );

    console.log(ragAnswer2);


    // ============================================
    // DONE
    // ============================================

    console.log("\n================================");
    console.log("ALL TESTS COMPLETED");
    console.log("================================");
}

test().catch((error) => {
    console.error("\n================================");
    console.error("TEST FAILED");
    console.error("================================");

    if (error.response?.data) {
        console.error(
            error.response.data,
        );
    } else {
        console.error(
            error.message,
        );
    }
});