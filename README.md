# GNR8 - Text to Website Generator

## Overview
*GNR8* is an AI-powered framework designed to generate production-ready websites from user input prompts. The system leverages multiple agents to handle tasks such as prompt enhancement, code generation, user interface improvement, and documentation generation. This pipeline automates website creation, ensuring high-quality output while simplifying the process for users.

## Features
- *Responsible AI:* Implements strict content filtering to ensure that no explicit or inappropriate content is generated, promoting ethical AI usage.
- *One-Click Publish:* Simplifies deployment with a single click, automatically publishing your website to GitHub along with a comprehensive README.md file.
- *Intuitive UI:* Offers an easy-to-use interface that allows users to make design changes seamlessly, without needing extensive coding knowledge.
- *Contextual Dynamic Media:* Enhances user engagement by replacing static placeholders with dynamic media content that adapts based on the website’s context.


## How It Works

1. *User Input:* The user provides a description of the website they want to create.
2. *Prompt Guardrail Agent:* Ensures the prompt is safe and free from inappropriate content.
3. *Prompt Enhancement Agent:* Refines and elaborates the user's prompt for better code generation.

4. *Code Generation Agent:* Converts the enhanced prompt into HTML, CSS, and JavaScript code.

5. *UI Improvement Agent:* Enhances the UI for responsiveness, design aesthetics, and functionality.

6. *Image Integration Agent:* Replaces placeholder images with relevant visuals from Unsplash.

7. *Feedback Loop:* Collects feedback to improve the prompt, leading to refined code generation.

8. *Refined Code Generation:* Uses feedback to generate an updated, improved codebase.

9. *Deployment Agent:* Deploys the website to GitHub and sets up a live preview.

10. *README Generation Agent:* Automatically creates a README.md file documenting the project.

## Getting Started

### Prerequisites
- Python 3.x
- pip for package management
### Installation
bash
# Clone the repository
git clone https://github.com/your-username/auto-website-generator.git<br>
cd FE<br>
npm i<br>
npm run dev<br>
Run The Model Prior to starting the BE service<br>
cd BE<br>
npm i<br>
node index.js<br>
Model<br>
cd Model<br>
uvicorn main:app --reload<br>
# Install dependencies<br>
pip install -r requirements.txt<br>


### Usage
bash
python main.py

- Provide a website description when prompted.
- The system will process, generate, and deploy the website automatically.

## Project Structure
<img src="https://github.com/user-attachments/assets/76793670-f890-48f0-b739-ac11c806f35b" alt="flow chart">

<br>

BE<br>
├── middleware<br>
&nbsp;&nbsp;&nbsp;&nbsp;├──authMiddleware.js<br>
├── models<br>
&nbsp;&nbsp;&nbsp;&nbsp;├──userModel.js<br>
├── routes<br>
&nbsp;&nbsp;&nbsp;&nbsp;├──deploy.js<br>
&nbsp;&nbsp;&nbsp;&nbsp;├──index.js<br>
&nbsp;&nbsp;&nbsp;&nbsp;├──predict.js<br>
&nbsp;&nbsp;&nbsp;&nbsp;├──user.js<br>
├── .env.example<br>
├──.gitignore<br>
├──index.js<br>
├──package-lock.json<br>
└──package.json<br>
<br>
FE<br>
├── public<br>
&nbsp;&nbsp;&nbsp;&nbsp;├──vite.svg<br>
├──src<br>
&nbsp;&nbsp;&nbsp;&nbsp;├── assets<br>
&nbsp;&nbsp;&nbsp;&nbsp;├── components<br>
&nbsp;&nbsp;&nbsp;&nbsp;├── pages<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├──LandingPage.jsx<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├──ResultPage.jsx<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├──SignIn.jsx<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├──SignUp.jsx<br>
&nbsp;&nbsp;&nbsp;&nbsp;├── store/atoms<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├──conversationState.js<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├──errorState.js<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├──predictionLoadingState.js<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├──predictionState.js<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├──previewState.js<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├──publishModalState.js<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├──userState.js<br>
&nbsp;&nbsp;&nbsp;&nbsp;├── store/utils<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├──App.jsx        <br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├──index.css      <br> 
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├──main.jsx<br>
&nbsp;&nbsp;&nbsp;&nbsp;├──.gitignore        <br>
&nbsp;&nbsp;&nbsp;&nbsp;├──README.md<br>
&nbsp;&nbsp;&nbsp;&nbsp;├──eslint.config.js<br>
&nbsp;&nbsp;&nbsp;&nbsp;├──index.html<br>
&nbsp;&nbsp;&nbsp;&nbsp;├──package-lock.json<br>
&nbsp;&nbsp;&nbsp;&nbsp;├──package.json<br>
&nbsp;&nbsp;&nbsp;&nbsp;├──postcss.confix.js<br>
&nbsp;&nbsp;&nbsp;&nbsp;├──tailwind.config.js<br>
&nbsp;&nbsp;&nbsp;&nbsp;├──vite.config.js<br>
├──Model<br>
&nbsp;&nbsp;&nbsp;&nbsp;├──__pycache__<br>
&nbsp;&nbsp;&nbsp;&nbsp;├──venv<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├──followup_pipeline.pkl<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├──main.py<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├──pipeline.py<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├──pipeline_followup.py<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├──requirements.txt<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├──website_creater_pipeline.pkl<br>
&nbsp;&nbsp;&nbsp;&nbsp;├──README.md<br>
&nbsp;&nbsp;&nbsp;&nbsp;├──package-lock.json<br>
&nbsp;&nbsp;&nbsp;&nbsp;├──website_creator_pipeline.pkl<br>
        
## Acknowledgements
- *LangChain Groq:* Used for language model-based processing and task orchestration.
- *CrewAI:* Provides the framework for task distribution and agent management.
- *Unsplash API:* Supplies high-quality images for use in the generated websites.
