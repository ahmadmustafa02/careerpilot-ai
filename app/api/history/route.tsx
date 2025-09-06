import { db } from "@/configs/db";
import { HistoryTable } from "@/configs/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: any) {
    const { content, recordId, metaData, aiAgentType } = await req.json();
    const user = await currentUser();

    try {
        console.log("History POST - Received data:");
        console.log("recordId:", recordId);
        console.log("content:", content);
        console.log("metaData:", metaData);
        console.log("aiAgentType:", aiAgentType);

        const result = await db.insert(HistoryTable).values({
            recordId: recordId,
            content: content,
            userEmail: user?.primaryEmailAddress?.emailAddress,
            metaData: metaData,
            aiAgentType: aiAgentType,
            createdAt: (new Date()).toISOString() // Use ISO string for consistency
        });

        console.log("Database insert result:", result);
        return NextResponse.json({ success: true, result });

    } catch (e) {
        console.error("History POST Error:", e);
        return NextResponse.json({ error: e }, { status: 500 });
    }
}

export async function PUT(req: any) {
    const { content, recordId, aiAgentType } = await req.json();

    try {
        const updateData: any = { content: content };
        
        if (aiAgentType !== undefined) {
            updateData.aiAgentType = aiAgentType;
        }

        const result = await db.update(HistoryTable).set(updateData)
            .where(eq(HistoryTable.recordId, recordId));

        return NextResponse.json(result);

    } catch (e) {
        console.error("History PUT Error:", e);
        return NextResponse.json({ error: e }, { status: 500 });
    }
}

export async function GET(req: any) {
    const { searchParams } = new URL(req.url);
    const recordId = searchParams.get('recordId');
    const user = await currentUser();

    try {
        if (recordId) {
            console.log("History GET - Looking for recordId:", recordId);
            
            const result = await db.select().from(HistoryTable)
                .where(eq(HistoryTable.recordId, recordId));
            
            console.log("Database query result:", result);
            
            if (result.length === 0) {
                return NextResponse.json({ error: "Record not found" }, { status: 404 });
            }

            return NextResponse.json(result[0]);
        } else {
            // ✅ FIXED: Get all history for the current user
            const userEmail = user?.primaryEmailAddress?.emailAddress;
            
            if (!userEmail) {
                return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
            }

            console.log("Fetching history for user:", userEmail);
            
            const result = await db.select().from(HistoryTable)
                .where(eq(HistoryTable.userEmail, userEmail));
            
            console.log("Found history records:", result.length);
            
            return NextResponse.json(result);
        }
    } catch (e) {
        console.error("History GET Error:", e);
        return NextResponse.json({ error: e }, { status: 500 });
    }
}