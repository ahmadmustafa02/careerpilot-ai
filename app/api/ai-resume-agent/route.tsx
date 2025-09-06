import { NextRequest, NextResponse } from "next/server";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { inngest } from "@/inngest/client";
import axios from "axios";
import { auth } from "@clerk/nextjs/server";
import { useState } from "react";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
 

  try {
    const form = await req.formData();
    const resumeFile: File | null = form.get("resumeFile") as File;
    const recordId = form.get("recordId") as string;

    if (!resumeFile) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await resumeFile.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    const loader = new WebPDFLoader(new Blob([arrayBuffer]));
    const docs = await loader.load();

    const resultIds = await inngest.send({
      name: "AiResumeAgent",
      data: {
        recordId,
        base64ResumeFile: base64,
        pdfText: docs[0].pageContent,
        aiAgentType: "resume_analyzer",
        userEmail: userId,
        createdAt: new Date().toISOString(),
      },
    });

    const runId = resultIds?.ids[0];

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

    // Poll until completed
    let runStatus;
    while (true) {
      runStatus = await getRuns(runId);
      if (runStatus.data[0]?.status === "Completed") break;
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    // ✅ Defensive unwrapping
    const run = runStatus?.data?.[0];
    if (!run) {
      return NextResponse.json({ error: "No run found" }, { status: 500 });
    }

    const result =
      run.output?.output?.[0] ??
      run.output?.data ??
      run.output ??
      null;

    if (!result) {
      return NextResponse.json(
        { error: "Run completed but no output", run },
        { status: 500 }
      );
    }
    console.log("AI Agent Result:", result.data);
    return NextResponse.json(result);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
