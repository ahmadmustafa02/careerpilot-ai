"use client"
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import RoadmapCanvas from '../_components/RoadmapCanvas';
import RoadmapGeneratorDialog from '@/app/(routes)/dashboard/_components/RoadmapGeneratorDialog';

function RoadMapGeneratorAgent() {
  const { roadmapId } = useParams();
  const [roadmapDetails, setRoadmapDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
     const [openRoadmapDialog,setRoadmapDialog] = useState(false);
  

  useEffect(() => {
    if (roadmapId) {
      GetRoadmapDetails();
    }
  }, [roadmapId]);

  const GetRoadmapDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching record for recordId:", roadmapId);
      
      const result = await axios.get('/api/history?recordId=' + roadmapId);
      
      console.log("Full API response:", result);
      console.log("Response data:", result.data);
      console.log("Response status:", result.status);
      console.log("Content from DB:", result.data?.content);
      console.log("MetaData from DB:", result.data?.metaData);
      
      // Check if the response has the expected structure
      if (result.data && result.data.content) {
        setRoadmapDetails(result.data.content);
        console.log("Roadmap details set:", result.data.content);
        console.log("Initial nodes:", result.data.content.initialNodes);
        console.log("Initial edges:", result.data.content.initialEdges);
        console.log("Duration:", result.data.content.duration || result.data.content.Duration);
      } else {
        console.error("Unexpected response structure:", result.data);
        setError("Invalid data structure received");
      }
    } catch (err) {
      console.error("Error fetching roadmap details:", err);
      setError("Failed to fetch roadmap details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-5">Loading...</div>;
  }

  if (error) {
    return <div className="p-5 text-red-500">Error: {error}</div>;
  }

  if (!roadmapDetails) {
    return <div className="p-5">No roadmap data found</div>;
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
      <div className='border rounded-xl p-5'>
        <h2 className='font-bold text-2xl'>
          {roadmapDetails?.roadmapTitle || roadmapDetails?.title || 'Untitled Roadmap'}
        </h2>
        <p className='mt-3 text-gray-500'>
          <strong>Description:</strong><br />
          {roadmapDetails?.description || 'No description available'}
        </p>
        <h2 className='mt-5 font-medium text-blue-600'>
          Duration: {roadmapDetails?.Duration || roadmapDetails?.duration || 'Not specified'}
        </h2>
        <Button onClick={()=>setRoadmapDialog(true)} className='mt-5 w-full'>+ Create Another Roadmap</Button>
        
        {/* Debug information */}
        <div className='mt-5 text-xs text-gray-400'>
          <p>Debug Info:</p>
          <p>Nodes count: {roadmapDetails?.initialNodes?.length || 0}</p>
          <p>Edges count: {roadmapDetails?.initialEdges?.length || 0}</p>
        </div>
      </div>
      
      <div className='md:col-span-2 w-full h-[80vh]'>
        <RoadmapCanvas
          initialNodes={roadmapDetails?.initialNodes || []}
          initialEdges={roadmapDetails?.initialEdges || []}
        />
      </div>

      <RoadmapGeneratorDialog
              openDialog={openRoadmapDialog}
              setOpenDialog={()=> setRoadmapDialog(false)}
              />
    </div>
  );
}

export default RoadMapGeneratorAgent;