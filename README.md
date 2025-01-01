# AI RAG CHATBOT

In this project, we will build a chatbot that will only respond with information that it has within its knowledge base. The chatbot will be able to both store and retrieve information. This project has many interesting use cases from customer support through to building your own second brain!

# What is RAG?

RAG stands for retrieval augmented generation. In simple terms, RAG is the process of providing a Large Language Model (LLM) with specific information relevant to the prompt.

# Why is RAG important?

While LLMs are powerful, the information they can reason on is restricted to the data they were trained on. This problem becomes apparent when asking an LLM for information outside of their training data. RAG solves this problem by fetching information relevant to the prompt and then passing that to the model as context.

- To illustrate with a basic example, imagine asking the model for your favorite food:

**input**
What is my favorite food?

**generation**
I don't have access to personal information about individuals, including their
favorite foods.

Not surprisingly, the model doesn’t know. But imagine, alongside your prompt, the model received some extra context:

**input**
Respond to the user's prompt using only the provided context.
user prompt: 'What is my favorite food?'
context: user loves chicken nuggets

**generation**
Your favorite food is chicken nuggets!

Just like that, you have augmented the model’s generation by providing relevant information to the query. Assuming the model has the appropriate information, it is now highly likely to return an accurate response to the users query. But how does it retrieve the relevant information? The answer relies on a concept called `‘embedding’`.

# Embedding

Embeddings are a way to represent words, phrases, or images as vectors in a high-dimensional space. In this space, similar words are close to each other, and the distance between words can be used to measure their similarity.

In practice, this means that if you embedded the words cat and dog, you would expect them to be plotted close to each other in vector space. The process of calculating the similarity between two vectors is called `‘cosine similarity’` where a value of 1 would indicate high similarity and a value of -1 would indicate high opposition.

As mentioned above, embeddings are a way to represent the semantic meaning of words and phrases. The implication here is that the larger the input to our embedding, the lower quality the embedding will be. So how would we approach embedding content longer than a simple phrase?

# Chunking

Chunking refers to the process of breaking down a particular source material into smaller pieces. There are many different approaches to chunking and it’s worth experimenting as the most effective approach can differ by use case. A simple and common approach to chunking is separating written content by sentences.

Once our source material is appropriately chunked, we can embed each one and then store the embedding and the chunk together in a database. Embeddings can be stored in any database that supports vectors. Here, we will be using `Postgres` alongside the `pgvector` plugin in vercel database.

![Storing chunks and embeddings](./public/storing_chunks_embeddings.png)

# All Together Now

Combining all of this together, RAG is the process of enabling the model to respond with information outside of it’s training data by embedding a users query, retrieving the relevant source material (chunks) with the highest semantic similarity, and then passing them alongside the initial query as context. Going back to the example where you ask the model for your favorite food, the prompt preparation process would look like this.

![Prompt preparation](./public/all_together_process.png)

By passing the appropriate context and refining the model’s objective, we are able to fully leverage its strengths as a reasoning machine.


This project will use the following stack:

- [Next.js](https://nextjs.org)
- [Vercel AI SDK DOCS](https://sdk.vercel.ai/docs)
- [OpenAI](https://openai.com)
- [Drizzle ORM](https://orm.drizzle.team)
- [Postgres](https://www.postgresql.org/)
- [pgvector](https://github.com/pgvector/pgvector)
- [shadcn-ui](https://ui.shadcn.com)
- [TailwindCSS](https://tailwindcss.com)
