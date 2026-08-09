import axios from "axios";

export interface OllamaMessage {
    role: "system" | "user" | "assistant",
    content: string
}

export interface OllamaOptions {
    temperature?: number;
    topP?: number;
    topK?: number;
    repeatPenalty?: number;
    numCtx?: number;
}

export class Ollama {
    private readonly ollamaUrl: string;
    private readonly embeddingModel: string;
    private readonly baseModel: string;
    private readonly chatModel: string;

    constructor(
        ollamaUrl: string,
        embeddingModel: string,
        baseModel: string,
        chatModel: string
    ) {
        this.ollamaUrl = ollamaUrl;
        this.embeddingModel = embeddingModel;
        this.baseModel = baseModel;
        this.chatModel = chatModel;
    }

    async createEmbedding(
        text: string,
    ): Promise<number[]> {
        const response = await axios.post(
            `${this.ollamaUrl}/api/embed`,
            {
                model: this.embeddingModel,
                input: text,
            },
        );

        return response.data.embeddings[0];
    }

    async generate(
        prompt: string,
        options?: OllamaOptions,
    ): Promise<string> {

        const response = await axios.post(
            `${this.ollamaUrl}/api/generate`,
            {
                model: this.baseModel,
                prompt,
                stream: false,
                options: {
                    temperature: options?.temperature ?? 0,
                    top_p: options?.topP ?? 0.1,
                    top_k: options?.topK ?? 20,
                    repeat_penalty:
                        options?.repeatPenalty ?? 1.1,
                    num_ctx:
                        options?.numCtx ?? 8192,
                },
            },
        );

        return response.data.response?.trim() || "";
    }

    async chat(
        messages: OllamaMessage[],
        options?: OllamaOptions,
    ): Promise<string> {

        const response = await axios.post(
            `${this.ollamaUrl}/api/chat`,
            {
                model: this.chatModel,
                messages,
                stream: false,
                options: {
                    temperature: options?.temperature ?? 0,
                    top_p: options?.topP ?? 0.1,
                    top_k: options?.topK ?? 20,
                    repeat_penalty: options?.repeatPenalty ?? 1.1,
                    num_ctx: options?.numCtx ?? 8192,
                },
            },
        );

        return response.data.message?.content?.trim() || "";
    }
}