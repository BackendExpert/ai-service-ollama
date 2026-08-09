export interface VectorDocument {
    id?: string;
    fileId?: string;
    chunkIndex?: number;
    text: string;
    embedding: number[];
    metadata?: Record<string, any>;
}

export interface VectorSearchResult
    extends VectorDocument {
    score: number;
}

export class VectorAI {
    cosineSimilarity(
        a: number[],
        b: number[],
    ): number {

        if (a.length !== b.length) {
            throw new Error(
                "Vectors must have the same dimensions",
            );
        }

        let dot = 0;
        let magA = 0;
        let magB = 0;

        for (let i = 0; i < a.length; i++) {
            dot += a[i] * b[i];
            magA += a[i] * a[i];
            magB += b[i] * b[i];
        }

        if (magA === 0 || magB === 0) {
            return 0;
        }

        return (
            dot /
            (
                Math.sqrt(magA) *
                Math.sqrt(magB)
            )
        );
    }

    search(
        questionEmbedding: number[],
        chunks: VectorDocument[],
        limit = 5,
    ): VectorSearchResult[] {

        return chunks
            .map((chunk) => {

                const score =
                    this.cosineSimilarity(
                        questionEmbedding,
                        chunk.embedding,
                    );

                return {
                    ...chunk,
                    score,
                };
            })
            .sort(
                (a, b) =>
                    b.score - a.score,
            )
            .slice(0, limit);
    }
}