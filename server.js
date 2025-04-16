const express = require("express");
const contentful = require("contentful");
const cors = require("cors");
require("dotenv").config();

// Express server setup

const PORT = process.env.PORT || 3000;
const app = express();

app.use(
    cors({
        origin: "https://dgwebdes.github.io",
    }),
);

app.use(express.json());

// Contentful API connection
const client = contentful.createClient({
    space: process.env.SPACE,
    accessToken: process.env.ACCESS_TOKEN,
});

app.get("/api/posts", async (req, res) => {
    try {
        const response = await client.getEntries();

        res.json(response.items);
    } catch (err) {
        res.status(500).json({ message: err });
        console.log(`Error in get request: ${err}`);
    }
});

app.get("/api/posts/:postId", async (req, res) => {
    const { postId } = req.params;
    console.log("Fetching posts with ID: ", postId);
    try {
        const response = await client.getEntry(postId);
        if (response.fields) {
            const post = {
                title: response.fields.title,
                postImage: response.fields.postImage.fields.file.url,
                content: response.fields.content,
                author: response.fields.author,
                publishDate: new Date(
                    response.fields.publishDate,
                ).toLocaleDateString(),
            };
            res.json(post);
        } else {
            // Return a 404 error if the postId does not match any entry
            res.status(404).json({ message: "Post not found" });
        }
    } catch (err) {
        res.status(500).json({ message: err });
        console.log(`Could not Fetch Post ${err}`);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
