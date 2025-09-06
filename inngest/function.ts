import { HistoryTable } from "@/configs/schema";
import { inngest } from "./client";
import { createAgent, anthropic, openai, gemini } from '@inngest/agent-kit';
import ImageKit from "imagekit";
import { db } from "@/configs/db";


export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  },
);

export const AiCareerChatAgent= createAgent(
    { 
      name:'AiCareerChatAgent',
      description:'An AI Agent that answers career related questions',
      system:`
You are AiCareerChatAgent, a friendly and knowledgeable career coach. 
Your role is to guide users with career-related advice, job preparation, interview tips, 
resume improvements, and skill development strategies. 
- Be clear, concise, and supportive. 
- Provide practical and actionable insights. 
- Avoid overly generic answers; tailor responses to the user's situation. 
- If the question is unrelated to careers, politely guide the user back to career topics.
`,
     model:gemini({
        model:"gemini-2.0-flash",
        apiKey:process.env.GEMINI_API_KEY
     })

    }
)

export const AiResumeAnalyzerAgent= createAgent(
    { 
      name:'AiResumeAnalyzerAgent',
      description:'An AI Agent that answers career related questions',
      system:`You are an advanced AI Resume Analyzer Agent.
Your task is to evaluate a candidate's resume and return a detailed analysis in the following structured JSON schema format.  
The schema must match the layout and structure of a visual UI that includes overall score, section scores, summary feedback, improvement tips, strengths, and weaknesses.

🔥 INPUT: I will provide a plain text resume.  
🎯 GOAL: Output a JSON report as per the schema below. The report should reflect:

overall_score (0–100)

overall_feedback (short message e.g., "Excellent", "Needs improvement")

summary_comment (1–2 sentence evaluation summary)

Section scores for:  
Contact Info  
Experience  
Education  
Skills  

Each section should include:  
- score (as percentage)  
- Optional comment about that section  
- Tips for improvement (3–5 tips)  
- What's Good (1–3 strengths)  
- Needs Improvement (1–3 weaknesses)

🧾 Output JSON Schema:
{
  "overall_score": 85,
  "overall_feedback": "Excellent!",
  "summary_comment": "Your resume is strong, but there are areas to refine.",
  "sections": {
    "contact_info": {
      "score": 95,
      "comment": "Perfectly structured and complete."
    },
    "experience": {
      "score": 88,
      "comment": "Strong bullet points and impact."
    },
    "education": {
      "score": 70,
      "comment": "Consider adding relevant coursework."
    },
    "skills": {
      "score": 60,
      "comment": "Expand on specific skill proficiencies."
    }
  },
  "tips_for_improvement": [
    "Add more numbers and metrics to your experience section to show impact.",
    "Integrate more industry-specific keywords relevant to your target roles.",
    "Start bullet points with strong action verbs to make your achievements stand out."
  ],
  "whats_good": [
    "Clean and professional formatting.",
    "Clear and concise contact information.",
    "Relevant work experience."
  ],
  "needs_improvement": [
    "Skills section lacks detail.",
    "Some experience bullet points could be stronger.",
    "Missing a professional summary/objective."
  ]
}`,
     model:gemini({
        model:"gemini-2.0-flash",
        apiKey:process.env.GEMINI_API_KEY
     })

    }
)

export const AiRoadmapGeneratorAgent = createAgent(
    { 
      name: 'AiRoadmapGeneratorAgent',
      description: 'Generate Tree Like Flow Roadmap',
      system: `
Generate a React flow tree-structured learning roadmap for user input position/skills in the following format:
Create a vertical tree structure with well-spaced, meaningful x/y positions to form a clear flow diagram.

IMPORTANT SPACING REQUIREMENTS:
- Maintain minimum 300px horizontal spacing between nodes at the same level
- Use minimum 200px vertical spacing between different levels/rows
- Spread nodes horizontally to avoid clustering - use positions like: 0, 350, 700, 1050, 1400, etc.
- For vertical levels, use positions like: 0, 250, 500, 750, 1000, etc.
- Create a wide, spacious layout that's easy to read and navigate

STRUCTURE GUIDELINES:
- Structure should be similar to roadmap.sh layout with proper branching
- Steps should be ordered from fundamentals to advanced topics
- Include branching for different specializations and learning paths
- Create logical groupings with adequate white space between them
- Each node must have a descriptive title, concise description (2-3 lines max), and relevant learning resource link
- Use unique sequential IDs for all nodes and edges
- Ensure the layout flows naturally from top to bottom with clear progression paths

POSITIONING STRATEGY:
- Root/starting nodes: y: 0
- Fundamental concepts: y: 250-300
- Intermediate topics: y: 500-600  
- Advanced/specialization topics: y: 750-900
- Expert/final topics: y: 1000+
- Spread horizontally: x: 0, 350, 700, 1050, 1400, 1750, etc.

Response in JSON format:
{
  "roadmapTitle": "Clear, descriptive title",
  "description": "Comprehensive 3-5 line description explaining the learning path, key skills covered, and expected outcomes",
  "duration": "Realistic timeframe (e.g., 6-12 months)",
  "initialNodes": [
    {
      "id": "1",
      "type": "turbo", 
      "position": { "x": 350, "y": 0 },
      "data": {
        "title": "Descriptive Step Title",
        "description": "Concise 2-3 line explanation of what this step covers and why it's important.",
        "link": "https://relevant-learning-resource.com"
      }
    }
    // Continue with well-spaced positions...
  ],
  "initialEdges": [
    {
      "id": "e1-2",
      "source": "1", 
      "target": "2"
    }
    // Continue with logical connections...
  ]
}

Remember: CREATE SPACIOUS LAYOUTS with proper padding between all nodes to ensure readability and professional appearance.

User Input: Frontend Developer
`,
      model: gemini({
        model: "gemini-2.0-flash",
        apiKey: process.env.GEMINI_API_KEY
      })
    }
)


export const AiRoadmapAgent = inngest.createFunction(

  { id: 'AiRoadmapAgent' },
  { event: 'AiRoadmapAgent' },
  async ({ event, step }) => {
   
    const{roadmapId,userInput,userEmail}=await event?.data;
    const roadmapResult = await AiRoadmapGeneratorAgent.run("UserInput:"+userInput);

        // @ts-ignore
    const rawContent= roadmapResult.output[0].content;
    const rawContentJson = rawContent.replace(/```json|```/g, ''); // Fix regex to remove both
    const parseJson = JSON.parse(rawContentJson);


    //save to db
    const saveToDb = await step.run('SaveToDb', async ()=>{
      const result= await db.insert(HistoryTable).values({
        recordId: roadmapId,
        content: parseJson,
        userEmail: userEmail, // ✅ ADD THIS LINE
        aiAgentType: '/ai-tools/ai-roadmap-agent',
        createdAt: new Date().toISOString(),
        metaData: userInput
      });
      console.log(result);
      return parseJson;


    });
     return saveToDb; // Return the result so it can be accessed in the API route
  
  }
)


export const AiCareerAgent = inngest.createFunction(
  { id: 'AiCareerAgent' },
  { event: 'AiCareerAgent' },
  async ({ event, step }) => {
   
    const { userInput, userEmail, recordId } = await event?.data;
    const result = await AiCareerChatAgent.run(userInput);

    // @ts-ignore
    const rawContent = result.output[0].content;

    //save to db
    const saveToDb = await step.run('SaveToDb', async () => {
      const dbResult = await db.insert(HistoryTable).values({
        recordId: recordId,
        content: {
          question: userInput,
          answer: rawContent
        },
        userEmail: userEmail,
        aiAgentType: '/ai-tools/ai-chat',
        createdAt: new Date().toISOString(),
        metaData: userInput
      });
      console.log(dbResult);
      return {
        question: userInput,
        answer: rawContent
      };
    });

    return saveToDb;
  }
)



export const AiResumeAgent = inngest.createFunction(

  { id: 'AiResumeAgent' },
  { event: 'AiResumeAgent' },
  async ({ event, step }) => {
   
    const {recordId,base64ResumeFile,pdfText,aiAgentType,userEmail, createdAt} = await event.data;
    
    //upload file to cloud 
    const uploadFileUrl= await step.run("uploadImage", async()=>{
      // Initialize ImageKit inside the step to ensure environment variables are available
      const imagekit = new ImageKit({
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
        urlEndpoint: process.env.IMAGEKIT_ENDPOINT_URL!
      });

      const imageKitFile = await imagekit.upload({
        file: base64ResumeFile,
        fileName:`${Date.now()}.pdf`,
        folder: '/resumes', // Optional: organize files in folders
      });

      return imageKitFile.url;
    });

    const aiResumeReport = await AiResumeAnalyzerAgent.run(pdfText);

    // @ts-ignore
    const rawContent= aiResumeReport.output[0].content;
    const rawContentJson = rawContent.replace(/```json|```/g, ''); // Fix regex to remove both
    const parseJson = JSON.parse(rawContentJson);

    //save to db
    const saveToDb = await step.run('SaveToDb', async ()=>{
      const result= await db.insert(HistoryTable).values({
        recordId: recordId,
        content: parseJson,
        aiAgentType: aiAgentType,
        createdAt: createdAt || new Date().toISOString(),
        metaData: uploadFileUrl
      });
      console.log(result);
      return parseJson;
    });

    return saveToDb; // Return the result so it can be accessed in the API route
  }
)

