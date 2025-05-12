<h1 align="center">
  GNR8 Text-to-Website Generator
</h1>

<p align="center">
  <strong>Generate stunning websites from a simple prompt with AI </strong>
</p>

<p align="left">
  <a href="https://generate-5cp7.onrender.com">GNR8</a> is an open-source AI-powered website generator that converts your ideas into production-ready websites using a multi-agent system. It handles everything—from content safety to prompt enhancement, UI design, media integration, and deployment—all with one input.
</p>

<div align="center">

[![GitHub stars](https://img.shields.io/github/stars/Srayash/GNR8?style=social)](https://github.com/Srayash/GNR8/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Srayash/GNR8?style=social)](https://github.com/Srayash/GNR8/network/members)

<a href="https://generate-5cp7.onrender.com/">☁️ Live Demo</a> 

</div>

<div align="center">
<img src="https://github.com/Srayash/assets_Public/blob/main/GNR8_Demo-min.gif" alt="GNR8 Demo GIF" width="800" height="450" />
</div>

---

## 🧩 Key Features

- **🚫 Responsible AI** – Filters unsafe content before processing.
- **⚡ One-Click Publish** – Deploys to GitHub with auto-generated README.
- **🖌️ Seamless UI Editing** – Modify your layout and content live, no coding required.
- **📸 Smart Media Insertion** – Automatically fetches and inserts contextual Unsplash images.
- **🧠 Multi-Agent Pipeline** – Each agent handles a specific task to improve quality and speed.
- **🔁 Feedback Loop** – Incorporates user feedback to iteratively improve code.
- **🌐 Live Preview** – View your deployed website instantly in the browser.

---

## 🧠 How It Works

1. **User Prompt** → You describe the site.
2. **Guardrails** → Prompt checked for safety.
3. **Enhancement** → Prompt is refined for clarity.
4. **Code Generation** → HTML, CSS, JS created.
5. **UI Agent** → Designs and styles the interface.
6. **Media Agent** → Adds contextual images via Unsplash.
7. **Feedback Agent** → Refines based on feedback.
8. **Deployment** → Website goes live with GitHub Pages.

---

## 🚀 Quickstart

> ⚠️ Prerequisites: Python 3.x, Node.js, `pip`

```bash
# Clone the repo
cd GNR8

# Frontend
cd FE
npm install
npm run dev

# Backend
cd ../BE
npm install
node index.js

# Model
cd ../Model
pip install -r requirements.txt
uvicorn main:app --reload
```
