const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const app = express();

app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URL);

async function startServer() {
    try {
        await client.connect();

        const db = client.db("syncdoc");
        const documents = db.collection("documents");

        console.log("MongoDB connected successfully!");

        app.get("/", (req, res) => {
            res.send("SyncDoc backend is running!");
        });

        app.get("/api/health", (req, res) => {
            res.json({
                status: "OK",
                message: "SyncDoc backend is connected to MongoDB"
            });
        });

        app.post("/api/documents", async (req, res) => {
            try {
                const { title, content } = req.body;

                const document = {
                    title,
                    content,
                    createdAt: new Date()
                };

                const result = await documents.insertOne(document);

                res.status(201).json({
                    message: "Document created successfully",
                    documentId: result.insertedId
                });
            } catch (error) {
                console.error("Error creating document:", error);

                res.status(500).json({
                    message: "Failed to create document"
                });
            }
        });

        app.listen(3001, () => {
            console.log("SyncDoc server running on http://localhost:3001");
        });

    } catch (error) {
        console.error("MongoDB connection failed:", error);
    }
}

startServer();