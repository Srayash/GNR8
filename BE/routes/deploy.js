const express = require("express");
const axios = require("axios");
require("dotenv").config();

const router = express.Router();

const GITHUB_USERNAME = "GNR8-Kriti";
const ACCESS_TOKEN = process.env.GITHUB_ACCESS_TOKEN;

const githubHeaders = {
    Authorization: `token ${ACCESS_TOKEN}`,
    Accept: "application/vnd.github.v3+json"
};


function generateUniqueSiteName() {
    const timestamp = Date.now().toString(36); 
    return `gnr8-site-${timestamp}`;
}


async function createRepository(repoName) {
    const response = await axios.post(
        `https://api.github.com/user/repos`,
        {
            name: repoName,
            description: "Auto-generated website",
            private: false,
            has_pages: true
        },
        { headers: githubHeaders }
    );
    return response.data.full_name; // Returns "username/repo-name"
}


async function pushFiles(repoName, files) {
    const repoPath = `https://api.github.com/repos/${GITHUB_USERNAME}/${repoName}/contents/`;

    for (const file of files) {
        const filePath = `${repoPath}${file.name}`;
        const content = Buffer.from(file.content).toString("base64");

        await axios.put(filePath, {
            message: `Added ${file.name}`,
            content,
            branch: "main"
        }, { headers: githubHeaders });
    }
}


async function enableGitHubPages(repoName) {
    await axios.post(
        `https://api.github.com/repos/${GITHUB_USERNAME}/${repoName}/pages`,
        { source: { branch: "main", path: "/" } },
        { headers: githubHeaders }
    );
}


router.post("/", async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
    }
    try {
        const { files } = req.body;
        if (!files) return res.status(400).json({ error: "Missing files" });
        if (!Array.isArray(files) || files.length === 0 || !files.some(file => file.content && file.content.trim() !== "")) {
            return res.status(400).json({ error: "No valid files provided. At least one file must contain content." });
        }

        const repoName = generateUniqueSiteName();

        const fullRepoName = await createRepository(repoName);

        await pushFiles(repoName, files);

        await enableGitHubPages(repoName);

        const siteURL = `https://${GITHUB_USERNAME}.github.io/${repoName}/`;
        res.json({ success: true, url: siteURL, siteName: repoName });
    } catch (error) {
        console.error(error.response ? error.response.data : error);
        res.status(500).json({ error: "Failed to deploy site" });
    }
});

module.exports = router;
