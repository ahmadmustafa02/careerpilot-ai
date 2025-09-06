"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { File, Loader2Icon, SparklesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";

function ResumeUploadDialog({ openResumeUpload, setOpenResumeDialog, recordId }: any) {
  const [file, setFile] = useState<any>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFileChange = (event: any) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log(file.name);
      setFile(file);
    }
  };

  const onUploadAndAnalyze = async () => {
    if (!file) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("recordId", recordId);
      formData.append("resumeFile", file);

      console.log("Uploading with recordId:", recordId);

      // Call the AI agent
      const result = await axios.post("/api/ai-resume-agent", formData);
      console.log("AI Agent Result:", result.data);

      // The AI agent should have already saved to database in the Inngest function
      // So we don't need to save to history here anymore - it's already done!
      // But let's log to make sure
      console.log("AI processing completed, data should be in database already");

      // Wait a moment before redirecting to ensure data is saved
      await new Promise(resolve => setTimeout(resolve, 1000));

      router.push(`/ai-tools/ai-resume-analyzer/${recordId}`);
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setLoading(false);
      setOpenResumeDialog(false);
    }
  };

  return (
    <Dialog open={openResumeUpload} onOpenChange={setOpenResumeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Resume PDF File</DialogTitle>
          <DialogDescription>
            <div>
              <label
                htmlFor="resumeUpload"
                className="flex items-center flex-col justify-center p-8 border-dashed rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <File className="h-10 w-10" />

                {file ? (
                  <h2 className="mt-3 text-blue-600">{file?.name}</h2>
                ) : (
                  <h2 className="mt-5">Click here to Upload PDF File</h2>
                )}
              </label>
              <input
                type="file"
                id="resumeUpload"
                accept="application/pdf"
                className="hidden"
                onChange={onFileChange}
              />
            </div>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpenResumeDialog(false)}>
            Cancel
          </Button>
          <Button disabled={!file || loading} onClick={onUploadAndAnalyze}>
            {loading ? <Loader2Icon className="animate-spin" /> : <SparklesIcon />}
            Upload & Analyze
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ResumeUploadDialog;