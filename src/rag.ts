export class RagAI {

    splitIntoChunks(
        text: string,
        maxLength = 800,
    ): string[] {

        const cleanedText = text
            .replace(/\s+/g, " ")
            .trim();

        if (!cleanedText) {
            return [];
        }

        const sentences = cleanedText.split(/(?<=\.)\s+/);

        const chunks: string[] = [];
        let currentChunk = "";

        for (const sentence of sentences) {
            if (
                currentChunk.length +
                sentence.length <=
                maxLength
            ) {
                currentChunk += sentence + " ";
            } else {
                if (currentChunk.trim()) {
                    chunks.push(
                        currentChunk.trim(),
                    );
                }
                currentChunk = sentence + " ";
            }
        }

        if (currentChunk.trim()) {
            chunks.push(
                currentChunk.trim(),
            );
        }

        return chunks;
    }
}