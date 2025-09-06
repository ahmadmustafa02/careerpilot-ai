import { NextResponse } from "next/server";
import { inngest } from "../../../inngest/client";
import axios from "axios";
import { currentUser } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: any) {
    // Read userInput and optional recordId from the JSON body
    const { userInput, recordId: incomingRecordId } = await req.json();
    
    // Get current user
    const user = await currentUser();
    
    if (!user?.primaryEmailAddress?.emailAddress) {
        return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }
    
    // Use recordId from frontend if provided, otherwise generate new one
    const recordId = incomingRecordId || uuidv4();

    // Trigger an Inngest event named "AiCareerAgent" with all required fields
    const resultIds = await inngest.send({
        name: "AiCareerAgent",
        data: {
            userInput: userInput,
            userEmail: user.primaryEmailAddress.emailAddress, // ✅ Add user email
            recordId: recordId // ✅ Add record ID
        }
    });

    const runId = resultIds?.ids[0];
    
    // Poll Inngest's REST API for that run's status until it says Completed
    async function getRuns(runId: string) {
        const result = await axios.get(
            `${process.env.INNGEST_SERVER_HOST}/v1/events/${runId}/runs`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.INNGEST_SIGNING_KEY}`,
                },
            }
        );
        return result.data;
    }

    let runStatus;
    while (true) {
        runStatus = await getRuns(runId);
        if (runStatus.data[0]?.status == 'Completed')
            break;
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    return NextResponse.json({
        ...runStatus.data?.[0].output,
        recordId: recordId // Also return the recordId for reference
    });
}