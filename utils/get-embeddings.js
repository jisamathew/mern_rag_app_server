 // Manually download and load the model locally (offline workaround)
// git lfs install
// git clone https://huggingface.co/Xenova/all-MiniLM-L6-v2

// // Open Source - ChatGPT Suggestion-not resolved fetch failed issue,resolved by changing ingest-db code
// import { pipeline } from '@xenova/transformers';

// export async function getEmbedding(data) {
//     const embedder = await pipeline(
//         'feature-extraction',
//         'Xenova/all-MiniLM-L6-v2'  // Change here
//     );
//     const results = await embedder(data, { pooling: 'mean', normalize: true });
//     return Array.from(results.data);
// }

// Open Source-deprecated
import { pipeline } from '@xenova/transformers';

// Function to generate embeddings for a given data source
export async function getEmbedding(data) {
    const embedder = await pipeline(
        'feature-extraction', 
        'Xenova/nomic-embed-text-v1');
    const results = await embedder(data, { pooling: 'mean', normalize: true });
    return Array.from(results.data);
}



// Voyage AI
// import { VoyageAIClient } from 'voyageai';

// // Set up Voyage AI configuration
// const client = new VoyageAIClient({apiKey: process.env.VOYAGE_API_KEY});

// // Function to generate embeddings using the Voyage AI API
// export async function getEmbedding(text) {
//     const results = await client.embed({
//         input: text,
//         model: "voyage-3-large"
//     });
//     return results.data[0].embedding;
// }
