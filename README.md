WhatsApp Daily Digest

Keeping up with busy WhatsApp group chats is exhausting. Important updates, decisions, and deadlines get buried under hundreds of messages, memes, and side conversations.

WhatsApp Daily Digest solves this by turning noisy WhatsApp chats into clear, structured summaries. Instead of scrolling endlessly, users get concise daily breakdowns of what actually matters.

This project connects to WhatsApp via a temporary session, ingests chat data, and automatically generates summaries that highlight key messages, important announcements, action items, deadlines, and conversation themes. Once the data is ingested, all analysis and summaries run on the stored data — no constant live connection is required.

The system is designed as a lightweight demo-friendly backend that hosts an existing WhatsApp MCP server, exposing safe, web-friendly endpoints for:

Connecting a WhatsApp account via QR code

Fetching chats and messages

Generating AI-powered daily digests and highlights

Message data is stored locally in SQLite (as provided by the WhatsApp MCP), making the MCP connection temporary and reducing ongoing dependencies on WhatsApp. This architecture allows fast iteration, simple deployment, and a clear separation between data ingestion and summarization.

Key Features

📬 Daily WhatsApp summaries — clear overviews of busy chats

⭐ Highlights & key moments — surface important messages

⏰ Action items & deadlines — extracted automatically

🔍 Chat-level insights — understand what changed and why

🔐 Session-based connection — WhatsApp connection is temporary

⚙️ Simple demo architecture — hosted backend with MCP integration

Intended Use

This project is intended for demos, prototypes, and internal tools, not production-scale consumer deployment. It demonstrates how WhatsApp message data can be safely ingested, stored, and analyzed using an MCP-based workflow.
