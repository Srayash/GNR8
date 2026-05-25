from crewai import Agent, Task, Crew
from langchain_groq import ChatGroq
from crewai import LLM
import os
from dotenv import load_dotenv
import time


load_dotenv()
# Setting an environment variable
groq_api_key = os.environ['GROQ_API_KEY']

# Initialize the ChatGroq LLM
groq_llm = ChatGroq(
    #model="groq/llama-3.3-70b-versatile",
    model="groq/llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY")
)

groq_llm1 = ChatGroq(
    model="groq/llama-3.3-70b-versatile",
    #model="groq/deepseek-r1-distill-llama-70b",
    api_key=os.getenv("GROQ_API_KEY")
)



### 1. Define the Agents ###
class IntegratedAgents:
    def __init__(self):
        self.groq_llm = groq_llm
        self.groq_llm1 = groq_llm1  

    def feedback_to_prompt_agent(self):
        return Agent(
            role="Feedback to Prompt Conversion Agent",
            goal="""
                Your task is to take raw user feedback and turn it into a **detailed, structured, and LLM-ready prompt**.

                **Instructions:**
                - Identify **key issues and improvement points** from the feedback.
                - Convert it into a **well-structured prompt** that another LLM can understand.
                - Ensure it follows a **clear and detailed** format.
            """,
            backstory="""
                You are a **specialized feedback processor** that turns user complaints or suggestions into structured, LLM-friendly prompts.
                Your output ensures that changes can be applied quickly and accurately by another AI model.
            """,
            verbose=True,
            llm=self.groq_llm,
            max_iter=2,
        )

    def refined_code_generator(self):
        return Agent(
            role="Refined Code Generator",
            goal="""
                Your task is to take structured user feedback and previously generated website code, then refine the code to match the requested improvements.

                **Instructions:**
                - Use the **structured prompt** to understand required changes.
                - Modify the **full_output (existing code)** accordingly.
                - Ensure all improvements are **precise, structured, and optimized**.
                - Maintain **accessibility, performance, and responsiveness**.
            """,
            backstory="""
                You are an expert front-end web developer who specializes in refining and improving existing website code based on user feedback.
                Your goal is to ensure all requested changes are applied while maintaining high code quality.
            """,
            verbose=True,
            llm=self.groq_llm,
            max_iter=2,
        )

### 2. Define the Tasks ###
class IntegratedTasks:
    def process_feedback(self, agent, user_feedback):
        return Task(
            description=f"""
                Convert the following **user feedback** into a **structured prompt** for an LLM.

                **User Feedback:**
                ```
                {user_feedback}
                ```

                **Task Details:**
                - Identify key issues and improvement points.
                - Format them into a **detailed, structured** LLM prompt.
                - Ensure the output is **clear and actionable** for another model.

                **Expected Output:**
                - A **formatted prompt** describing the required changes clearly.
            """,
            agent=agent,
            expected_output="Structured prompt for an LLM to implement changes.",
            async_execution=False,
        )

    def apply_changes(self, agent, structured_prompt, full_output):
        return Task(
            description=f"""
                Apply the following structured improvements to the existing website code.

                **Structured User Feedback (Prompt):**
                ```
                {structured_prompt}
                ```

                **Existing Website Code:**
                ```
                {full_output}  
                ```

                **Task Details:**
                - Implement all required changes **precisely**.
                - Maintain **code readability, optimization, and performance**.
                - Ensure the site remains **responsive and accessible**.
                - Deliver a fully refined version of the website code.

                **Expected Output:**
                - The **final single improved version** of the website code (HTML, CSS, and JS).
            """,
            agent=agent,
            expected_output="Fully refined website code.",
            async_execution=False,
        )




class FollowUpCodePipeline:
    def __init__(self):
        self.agents = None
        self.feedback_to_prompter = None
        self.code_enhancer = None
        self.tasks = None
        self._initialize_agents()

    def _initialize_agents(self):
        """Initialize agents and tasks."""
        self.agents = IntegratedAgents()
        self.feedback_to_prompter = self.agents.feedback_to_prompt_agent()
        self.code_enhancer = self.agents.refined_code_generator()
        self.tasks = IntegratedTasks()

    def __getstate__(self):
        """Exclude non-serializable components for pickling."""
        state = self.__dict__.copy()
        state['agents'] = None  # Exclude agents
        state['feedback_to_prompter'] = None
        state['code_enhancer'] = None
        state['tasks'] = None
        return state

    def __setstate__(self, state):
        """Reinitialize excluded components after unpickling."""
        self.__dict__.update(state)
        self._initialize_agents()

    def predict(self, user_input, code):
        user_feedback = user_input
        prev_code = code

        prompt_task = self.tasks.process_feedback(agent=self.feedback_to_prompter, user_feedback=user_feedback)

        crew_feedback = Crew(
            agents=[self.feedback_to_prompter],
            tasks=[prompt_task],
            max_rpm=29
        )

        refined_feedback = crew_feedback.kickoff()
        print(refined_feedback)
        print("\n")

        # Ensure refined_feedback is a single output
        if isinstance(refined_feedback, (list, tuple)):
            refined_feedback = refined_feedback[0] if refined_feedback else ""
        
        if not refined_feedback:
            raise ValueError("No refined feedback generated.")

        apply_task = self.tasks.apply_changes(agent=self.code_enhancer, structured_prompt=refined_feedback, full_output=prev_code)

        crew_apply = Crew(
            agents=[self.code_enhancer],
            tasks=[apply_task],
            max_rpm=29
        )

        results = crew_apply.kickoff()


        # Extract output
        results_dict = results.dict()
        generated_code = ""
        for key, value in results_dict.items():
            if isinstance(value, str) and ("<!DOCTYPE html>" in value or "<html" in value):
                generated_code = value
                break

        if not generated_code:
            generated_code = "Error: No code generated."
        return generated_code


    

import pickle

# Create an instance of the pipeline
pipeline = FollowUpCodePipeline()

# Save the instance to a .pkl file
with open('followup_pipeline.pkl', 'wb') as file:
    pickle.dump(pipeline, file)
