import { useState, useCallback, useEffect } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Controls, MiniMap, Background, Node, Edge, NodeChange, EdgeChange, Connection } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import TurboNode from './TurboNode';

interface RoadmapCanvasProps {
  initialNodes: Node[];
  initialEdges: Edge[];
}

function RoadmapCanvas({ initialNodes, initialEdges }: RoadmapCanvasProps) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const nodeTypes = {
    turbo: TurboNode,
    default: TurboNode,
    input: TurboNode,
    output: TurboNode
  };

  // Update nodes and edges when props change
  useEffect(() => {
    if (initialNodes && initialNodes.length > 0) {
      // Ensure all nodes have the correct type for our custom component
      const processedNodes = initialNodes.map(node => ({
        ...node,
        type: 'turbo' // Force all nodes to use our custom TurboNode component
      }));
      setNodes(processedNodes);
      console.log('Setting processed nodes:', processedNodes);
    }
  }, [initialNodes]);

  useEffect(() => {
    if (initialEdges && initialEdges.length > 0) {
      setEdges(initialEdges);
      console.log('Setting edges:', initialEdges);
    }
  }, [initialEdges]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  // Debug logging
  console.log('RoadmapCanvas - initialNodes:', initialNodes);
  console.log('RoadmapCanvas - initialEdges:', initialEdges);
  console.log('RoadmapCanvas - current nodes:', nodes);
  console.log('RoadmapCanvas - current edges:', edges);

  if (!nodes.length && initialNodes?.length > 0) {
    return <div className="flex items-center justify-center h-full">Loading roadmap...</div>;
  }

  if (!initialNodes?.length) {
    return <div className="flex items-center justify-center h-full">No roadmap data available</div>;
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.1}
        maxZoom={2}
      >
        <Controls />
        <MiniMap />
        {/* @ts-ignore */}
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}

export default RoadmapCanvas;