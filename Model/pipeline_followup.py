from crewai import Agent, Task, Crew
from crewai import LLM
import os
from langchain_groq import ChatGroq
import pickle
import requests
import re
import urllib.request
import urllib.parse
from dotenv import load_dotenv
load_dotenv()

UNSPLASH_ACCESS_KEY=os.getenv("UNSPLASH_ACCESS_KEY")
GROQ_API_KEY=os.getenv("GROQ_API_KEY")
ANTHROPIC_API_KEY=os.getenv("ANTHROPIC_API_KEY")


claude_llm = LLM(
    model="claude-3-5-sonnet-20240620",
    max_tokens=8000,
    api_key=ANTHROPIC_API_KEY
)

groq_llm = ChatGroq(
    model="groq/deepseek-r1-distill-llama-70b",
    api_key=GROQ_API_KEY
)

groq_llm1 = ChatGroq(
    model="groq/llama-3.3-70b-versatile",
    api_key=GROQ_API_KEY
)


claude_llm = LLM(
    model="claude-3-5-sonnet-20240620",
    max_tokens=8000,
    api_key=os.getenv("ANTHROPIC_API_KEY")
)

groq_llm = ChatGroq(

    model="groq/deepseek-r1-distill-llama-70b",
    api_key=os.getenv("GROQ_API_KEY")
)

groq_llm1 = ChatGroq(
    model="groq/llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY")
)

class WebsiteCreaterAgents:
    def _init_(self):
        self.groq_llm = groq_llm
        self.claude_llm = claude_llm
        self.groq_llm1 = groq_llm1

    def prompt_guardrail_agent(self):
        """
        This agent checks if the input prompt is safe.
        It looks for offensive language, pornographic content, or other disallowed topics.
        If the content is deemed unsafe, it outputs a flagged message.
        """
        return Agent(
            role="Prompt Guardrail",
            goal="""
                You are a moderation agent for website prompt inputs. Analyze the provided prompt to determine if it contains any overtly offensive language, unsafe content, gambling, or references to pornography.  Do not be too obtrusive.

                Requirements:
                - If the prompt appears to be safe, simply output: "safe".
                - If the prompt contains unsafe content, output a brief message indicating that the content was flagged, for example: "flagged: [reason]".

                Do not modify the prompt text. Only analyze and output one of the two options ("safe" or a flagged message).
            """,
            backstory="""
                As a Prompt Guardrail Agent, your job is to ensure that input prompts conform to ethical and safe usage guidelines before they are processed by downstream agents.
            """,
            verbose=True,
            llm=self.groq_llm1,
            max_iter=1,
        )

    def prompt_enhancer_agent(self):
        return Agent(
            role="Website Prompt Enhancer",
            goal=f"""
                You are an advanced prompt improvement agent. Your task is to transform simple or ambiguous prompts into detailed, point-based instructions for generating web interface code. The output must adhere to the following structure:

                ### Structure Template

                1.Purpose & Audience*
                - Objective: State the goal of the website design.
                - User Profile: Define the target audience and their preferences.

                2.Overall Structure & Layout*
                - Page Structure: Outline key sections (e.g., Header, Hero Section, Content, Footer).
                - Navigation: Describe navigation features (e.g., menus, search bars, responsiveness).
                - Hero Section Layout: All items in the hero section should be aligned in vertical fashion

                3.Visual Design & Aesthetics*
                - Color Palette & Themes: Specify themes and ensure contrast and readability.
                - Typography & Readability: Suggest fonts, sizes, and text hierarchies.
                - Background & Imagery: Recommend imagery styles (e.g., gradients, animations).

                4.Interactive Components & Behavior*
                - Actionable Elements: Define button styles and hover effects.
                - Forms & Inputs: Describe input field styles and validation.
                - Dynamic Effects: Suggest animations or transitions.

                5.Content & Media Placement*
                - Hero Sections: Design with impactful CTAs and layered visuals.
                - Text Blocks: Propose text arrangements (e.g., split content, overlays).
                - Multimedia: Include suggestions for images, videos, and interactive elements.

                6.Responsiveness & Adaptability*
                - Device Considerations: Ensure layouts adapt to different screen sizes.
                - Performance & Accessibility: Optimize assets, layouts, and usability for accessibility standards.


                """,
            backstory="""
                As a Website Prompt Enhancer, your role is to transform vague or incomplete descriptions of a website into precise, actionable, and structured instructions
                that guide effective website development and design. You consider user goals, target audience, key features, and aesthetic preferences.
                """,
            verbose=True,
            llm=self.groq_llm1,
            max_iter=2,
        )

    def html_css_js_writer_agent(self):
        return Agent(
            role="HTML, CSS, and JS Code Writer",
            goal="""
                Code Generator Agent: Generate modular, well-commented, and production-ready HTML, CSS, and JavaScript code for web interfaces, focusing on cutting-edge design practices.

                New Instructions for Implementation:
                Main image : find a one word keyword that best describes the topic of the website (like nature, technology, sports, celebration, music, cars, etc.). Let this be called main-keyword.

                HTML:
                - Implement a semantic structure for clear accessibility.
                - Include dynamic components like carousels and dropdowns.
                - Create reusable components (e.g., cards or buttons) with classes or reusable tags.
                - try to give as many images as possible
                - For images use 'https://placehold.co/600x400?text=Insert+your+image+here' (you should change dimensions as needed and use proper css)(Note:- never give placeholders in css or js strictly only give in html and alwyas add 1, 2, at the end like performer1, etc..in case there are more than 1 performer even if there is only one keyword of that type add 1).
                - For Navbar always use id = 'draggable_component'.

                CSS:
                - Use flexbox and grid for adaptive layouts.
                - Implement smooth hover effects and transitions.
                - Integrate gradient backgrounds, animations, and responsive typography.
                - Style the images and use and all other elements.
                - Enable interactivity, including:
                - Hero section animations (e.g., text sliding in on page load).
                - Dropdown menus with smooth open/close animations.
                - Carousels with autoplay and navigation controls.
                - Functioning hamburger

                Accessibility & Performance:
                - Ensure all components meet accessibility standards (ARIA roles, screen-reader labels).
                - Optimize images and use lazy loading for improved page performance.
                - Ensure the code is modular, well-commented, and adheres to best practices for modern web development.
                - The output should be ready for direct use or easy integration into a larger project.
            """,
            backstory="""
                As an HTML, CSS, and JS Code Writer, you specialize in transforming user requirements into fully functional and visually appealing web pages. You follow modern development standards, ensuring accessibility, responsiveness, and clean code.
            """,
            verbose=True,
            llm=self.claude_llm,
            max_iter=2,
        )

    def ui_improvement_agent(self):
        return Agent(
            role="UI Improvement Specialist",
            goal="""
                Your task is to improve the overall user interface of the website by refining its usability and ensuring visual appeal and functionality.

                1. *Button Functionality*: Ensure that all buttons are functional with proper linking, hover effects, and active states.
                2. *Card Placeholders*: Ensure all cards have a placeholder image or content for display purposes.
                3. *Visual Hierarchy*: Adjust UI elements to create a clear visual hierarchy and alignment.
                4. *Mobile Responsiveness*: Ensure UI elements adapt well to mobile screens.
                5. *Other UI/UX Enhancements*: Implement improvements related to form field alignment, spacing, and any other design details that can enhance the user experience.

                The goal is to improve the UI in terms of usability, accessibility, and aesthetics, ensuring the final output is production-ready for end-users.
            """,
            backstory="""
                As a UI Improvement Specialist, your role is to polish the overall user interface design, ensuring it's visually appealing, intuitive, and user-friendly. This includes improving layout, button functionality, card styles, and any other design element necessary for a better user experience.
            """,
            verbose=True,
            llm=self.claude_llm,
            max_iter=2,
        )
    def readme_agent(self):
        return Agent(
            role="Readme Generator",
            goal="""
                You are an AI agent specialized in generating README.md files for software projects. Your task is to analyze the given code and produce a well-formatted README document.
            """,
            backstory="""
                As a Readme Generator Agent, your job is to analyze codebases, extract relevant metadata, and create comprehensive documentation for better project understanding and usability.
            """,
            verbose=True,
            llm=self.groq_llm1,
            max_iter=1,
        )

    def keyword_finder_agent(self):
        return Agent(
            role="Keyword Extraction Agent",
            goal="""
                Given a snippet of HTML or text context where an image should go,
                provide a concise list of relevant keywords or short phrases that
                best fit the placeholder's context.
            """,
            backstory="""
                This agent ensures that each placeholder image is replaced with
                a context-relevant image by producing accurate, short keyword lists.
            """,
            verbose=True,
            llm=self.groq_llm1,
            max_iter=2,
        )

class PromptEnhancingAndWebpageTask:
    def guardrail_task (self, agent, input_data):
        return Task(
            description=f"""
                Evaluate if the following website prompt is safe for further processing:

                Description:
                
                {input_data}
                
                Guidelines:
                - Output "safe" if the prompt does not contain overtly offensive or unsafe content.
                - Otherwise, output a flagged message (e.g., "flagged: [reason]").
            """,
            agent=agent,
            expected_output="safe",
            async_execution=False,
        )

    def enhance_prompt(self, agent, input_data):
        description = input_data.get("description", "")
        target_audience = input_data.get("target_audience", "")

        return Task(
            description=f"""
                Refine the user-provided prompt about website design and functionality.

                Input description:

                {description}


                Target audience: {target_audience}

                Task Details:
                - Analyze and refine the input for clarity.
                - Highlight essential details such as purpose, features, and design preferences.
                - Structure the output into a detailed and actionable prompt.

                Deliverable:
                - A refined prompt ready for use by developers or designers.
            """,
            agent=agent,
            expected_output="Refined website design prompt.",
            async_execution=False,
        )

    def generate_code(self, agent, refined_prompt):
        return Task(
            description=f"""
                Generate HTML, CSS, and JavaScript code for the following refined website prompt:

                Refined Prompt:
                
                {refined_prompt}
                

                Task Details:
                - Create *index.html*: Structure and layout for the described website.
                - Create *styles.css*: Styling for layout, typography, and colors.
                - Create *script.js*: Add interactivity as needed, such as animations or form validation.
                (Note:- Always give images in html code only. Do not give images in css or javascript code)

                Deliverable:
                - A modular and well-documented code snippet, seperate HTML, CSS and JS (HTML, CSS, and JS).
            """,
            agent=agent,
            expected_output="Generated HTML, CSS, and JS code.",
            async_execution=False,
        )

    def ui_task(self, agent, generated_code):
        return Task(
            description=f"""
                Refine the following website code for UI improvements:

                Generated Code:
                {generated_code}

                Task Details:
                - do not remove any images in the original code provided to you.
                - try not to give plane background use colours
                - dont give any discription like "this is your generated website" at start
                - Review all buttons to ensure they are functional, including hover and active states.
                - Ensure cards have placeholder boxes or content for images.
                - Improve visual hierarchy, ensuring alignment and balance of UI elements.
                - Ensure responsiveness across mobile and desktop devices.
                - Make any other adjustments that will enhance the usability and aesthetic appeal of the website.
            """,
            agent=agent,
            expected_output="Improved website code with refined UI/UX components.",
            async_execution=False,
        )

    def generate_readme_task(self, agent, code):
        return Task(
            description=f"""
                Generate a structured and informative README.md file for the provided code.

                Code:
                {code}

                Task Details:
                - Extract project title from the code.
                - Provide a clear description of the project.
                - Include installation steps, usage instructions, and dependencies. IMPORTANT:  keep in mind that the codebase only consists of html, css and js file
                - List author details if available in the code.
                - Ensure a professional and well-formatted README structure.
                - Try to list out features of the code that makes it stand out and the problem it is solving
            """,
            agent=agent,
            expected_output="A well-structured README.md file detailing the project.",
            async_execution=False,
        )

    def keyword_finder_task(self, agent, str):
        return Task(
            description=f"""
                You receive the following snippet of HTML or text context where an image should go:
                ---
                {str}
                ---
                Please provide 1 concise keyword
                Please provide 1 concise keyword
                that would best describe an appropriate image for this context.
                if found multiple keywords dont concatinate them give the most relevent key word
                If a keyword contains digits at the end, such as "performer 1," or "performer+1" or "performer+2024+1" it should be formatted as "performer1" while ensuring that the digit remains intact.
                eg:- collage+fest+logo so you should give only one of them either collage or fest or logo
                """,
            agent=agent,
            expected_output="A keyword extracted from the provided string.",
            async_execution=False,
        )
        



class WebsiteCreaterPipeline:
    def _init_(self):
        self.agents = None  
        self.prompt_enhancer = None
        self.code_generator = None
        self.ui_improvement = None
        self.guardrail = None
        self.readme_generator = None
        self.keyword_finder = None
        self.tasks_obj = None
        self._initialize_agents()

    def _initialize_agents(self):
        """Initialize agents and tasks."""
        self.agents = WebsiteCreaterAgents()
        self.prompt_enhancer = self.agents.prompt_enhancer_agent()
        self.code_generator = self.agents.html_css_js_writer_agent()
        self.ui_improvement = self.agents.ui_improvement_agent()
        self.guardrail = self.agents.prompt_guardrail_agent()
        self.readme_generator = self.agents.readme_agent()
        self.keyword_finder = self.agents.keyword_finder_agent()
        self.tasks_obj = PromptEnhancingAndWebpageTask()

    def _getstate_(self):
        """Exclude non-serializable components for pickling."""
        state = self._dict_.copy()
        state['agents'] = None  # Exclude agents
        state['prompt_enhancer'] = None
        state['code_generator'] = None
        state['ui_improvement'] = None
        state['guardrail'] = None
        state['readme_generator'] = None
        state['keyword_finder'] = None
        state['tasks_obj'] = None
        return state

    def _setstate_(self, state):
        """Reinitialize excluded components after unpickling."""
        self._dict_.update(state)
        self._initialize_agents()


    def extract_text_and_number(self, input_string):

        match = re.match(r"([a-zA-Z\s\+\-]+?)(\d+)?$", input_string)

        if match:
            text_part = match.group(1).strip() 
            number_part = int(match.group(2)) if match.group(2) else None  

            text_part = re.sub(r"[\+\-]+$", "", text_part).strip()

            return text_part, number_part

        return input_string, None  


    def find_images(self, keywords):
        """
        Searches Unsplash for images matching the given keywords.
        Returns a list of image URLs.
        """

        if isinstance(keywords, list):
            search_query = "+".join(keywords)
        else:
            search_query = urllib.parse.quote(str(keywords))  

        search_query, x = self.extract_text_and_number(keywords);
        if x is not None:
            per_page = x;
        else :
            x = 1;
            per_page = 1;


        url = f"https://api.unsplash.com/search/photos?query={search_query}&client_id={UNSPLASH_ACCESS_KEY}&per_page={per_page}"

        try:
            response = requests.get(url)
            response.raise_for_status() 

            data = response.json()
            image_urls = [result['urls']['regular'] for result in data.get('results', [])]

            return image_urls[x-1]

        except requests.exceptions.RequestException as e:
            print(f"API Request Failed: {e}")
            return []  


    def image_swap(self, code):
        """
        This function replaces all image URLs (from placeholders) in the CSS code
        with the real image URLs fetched from Unsplash based on keyword matching.
        """
       
        placeholder_pattern = r'src="(https:\/\/placehold\.co\/[^"]+)"'

       
        placeholders = re.findall(placeholder_pattern, code)
        if not placeholders:
            return code  

        updated_code = code[:]

        for placeholder in placeholders:
            url = placeholder

            parsed_url = urllib.parse.urlparse(url)
            query_params = urllib.parse.parse_qs(parsed_url.query)
            keyword = query_params.get("text", [""])[0]  

            if not keyword:
                print(f"No 'text' parameter found in URL: {url}")
                continue

            keyword = keyword.replace("+", " ").strip()
            image_urls = self.find_images(keywords=keyword)

            if image_urls:
                real_image_url = image_urls 
            else:
                real_image_url = "https://images.unsplash.com/photo-1614851099511-773084f6911d?q=80&w=2070&auto=format&fit=crop"

            updated_code = updated_code.replace(placeholder, real_image_url)

        return updated_code

    def image_swap1(self, code):
        placeholder_pattern = r"url\([\"'](https:\/\/placehold\.co\/[^\"']+?)[\"']\)"

        placeholders = re.findall(placeholder_pattern, code)
        if not placeholders:
            return code

        updated_code = code[:]

        for placeholder in placeholders:
            url = placeholder 

         
            parsed_url = urllib.parse.urlparse(url)
            query_params = urllib.parse.parse_qs(parsed_url.query)
            keyword = query_params.get("text", [""])[0]  

            keyword = keyword.replace("+", " ").strip()

            image_urls = self.find_images(keywords=keyword)

            if image_urls:
                real_image_url = image_urls
            else:
                real_image_url = "https://images.unsplash.com/photo-1614851099511-773084f6911d?q=80&w=2070&auto=format&fit=crop"

        
            updated_code = updated_code.replace(url, real_image_url, 1) 

        return updated_code


    def predict(self, user_input):

        input_data = {
            "description": user_input,
            "target_audience": "Users seeking a high-quality, production-ready website"
        }

        guard = self.tasks_obj.guardrail_task(agent=self.guardrail, input_data=user_input)

        crew_guardrail = Crew(
            agents=[self.guardrail],
            tasks=[guard],
            max_rpm=29
        )
        results_guardrail = str(crew_guardrail.kickoff())


        if results_guardrail.lower().startswith("flagged"):
            print(f"Input prompt terminated by guardrail: {results_guardrail}")
            return "Gardrail"

        print(results_guardrail)


        prompt_task = self.tasks_obj.enhance_prompt(agent=self.prompt_enhancer, input_data=input_data)

        crew_prompt = Crew(
            agents=[self.prompt_enhancer],
            tasks=[prompt_task],
            max_rpm=29
        )

        refined_prompt = str(crew_prompt.kickoff())

        code_task = self.tasks_obj.generate_code(agent=self.code_generator, refined_prompt=refined_prompt)

        crew_generated = Crew(
            agents=[ self.code_generator],
            tasks=[ code_task],
            max_rpm=29
        )
        code_generated = str(crew_generated.kickoff())


        ui_improvement_tasks = self.tasks_obj.ui_task(agent=self.ui_improvement, generated_code=code_generated)

        crew_ui = Crew(
            agents=[ self.ui_improvement],
            tasks=[ui_improvement_tasks],
            max_rpm=29
        )

        results = str(crew_ui.kickoff())

        result1 = self.image_swap(results)
        result2 = self.image_swap1(result1)

        if not result2:
            result2 = "Error: No code generated."
        return result2


    def readme(self, code):

        readme_task = self.tasks_obj.generate_readme_task(agent=self.readme_generator, code = code)

        crew_readme = Crew(
            agents=[self.readme_generator],
            tasks=[readme_task],
            max_rpm=29
        )

        results = (crew_readme.kickoff())

        generated_code = results


        
        if not generated_code:
            generated_code = "Error: No code generated."

      
        return generated_code



import pickle

pipeline = WebsiteCreaterPipeline()

with open('website_creator_pipeline.pkl', 'wb') as file:
    pickle.dump(pipeline, file)

pipeline = WebsiteCreaterPipeline()

with open('website_creator_pipeline.pkl', 'wb') as file:
    pickle.dump(pipeline, file)

print("Pipeline generated and saved successfully!")
with open('website_creator_pipeline.pkl', 'rb') as file:
    loaded_pipeline = pickle.load(file)
