import { inngest } from "@/inngest/client"; 
import { currentUser } from "@clerk/nextjs/server";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Read userInput from the JSON body
    const { userInput, roadmapId } = await req.json();
    const user = await currentUser();

    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    // Trigger an Inngest event named "AiRoadmapAgent" 
    const resultIds = await inngest.send({
      name: "AiRoadmapAgent", 
      data: {
        userInput: userInput,
        roadmapId: roadmapId, 
        userEmail: user.primaryEmailAddress.emailAddress
      }
    });

    const runId = resultIds?.ids[0];
    
    if (!runId) {
      return NextResponse.json(
        { error: "Failed to trigger Inngest event" },
        { status: 500 }
      );
    }

    // Poll Inngest's REST API for that run's status until it says Completed
    async function getRuns(runId: string) {
      try {
        const result = await axios.get(
          `${process.env.INNGEST_SERVER_HOST}/v1/events/${runId}/runs`,
          {
            headers: {
              Authorization: `Bearer ${process.env.INNGEST_SIGNING_KEY}`,
            },
            timeout: 10000, // 10 second timeout for individual requests
          }
        );
        return result.data;
      } catch (error) {
        console.error('Error fetching run status:', error);
        throw error;
      }
    }

    const maxAttempts = 120; // 60 seconds total (120 * 500ms)
    let attempts = 0;
    let runStatus;

    while (attempts < maxAttempts) {
      try {
        runStatus = await getRuns(runId);
        
        // Check if we have data
        if (!runStatus?.data || runStatus.data.length === 0) {
          attempts++;
          await new Promise(resolve => setTimeout(resolve, 500));
          continue;
        }

        const currentRun = runStatus.data[0];
        const status = currentRun?.status;

        console.log(`Run ${runId} status: ${status} (attempt ${attempts + 1})`);

        if (status === 'Completed') {
          break;
        }
        
        if (status === 'Failed' || status === 'Cancelled') {
          return NextResponse.json(
            { 
              error: `Run failed with status: ${status}`, 
              details: currentRun 
            },
            { status: 500 }
          );
        }

        attempts++;
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.error(`Polling attempt ${attempts + 1} failed:`, error);
        attempts++;
        
        if (attempts >= maxAttempts) {
          throw error;
        }
        
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    // Check if we timed out
    if (attempts >= maxAttempts) {
      return NextResponse.json(
        { 
          error: "Timeout waiting for run completion", 
          runId,
          lastStatus: runStatus?.data?.[0]?.status 
        },
        { status: 408 }
      );
    }

    const runData = runStatus?.data?.[0];
    console.log('Final run data:', JSON.stringify(runData, null, 2));
    
    const output = runData?.output;
    console.log('Raw output:', JSON.stringify(output, null, 2));
    
    // Handle different possible output structures
    let finalOutput;
    
    if (output?.output) {
      // Double nested output
      finalOutput = output.output;
    } else if (output) {
      // Single level output
      finalOutput = output;
    } else {
      console.error('No output found in run data');
      return NextResponse.json(
        { 
          error: "No output returned", 
          runId,
          runData: runData,
          debug: {
            hasOutput: !!output,
            outputKeys: output ? Object.keys(output) : [],
            runDataKeys: runData ? Object.keys(runData) : []
          }
        },
        { status: 500 }
      );
    }

    console.log('Final output to return:', JSON.stringify(finalOutput, null, 2));

    // Return the output
    return NextResponse.json(finalOutput);

  } catch (error) {
    console.error('API Error:', error);
    
    // Handle different types of errors
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { 
          error: "Network error", 
          message: error.message,
          status: error.response?.status 
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { 
        error: "Internal server error", 
        message: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}