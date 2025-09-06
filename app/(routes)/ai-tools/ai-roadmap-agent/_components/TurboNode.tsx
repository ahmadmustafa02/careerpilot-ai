import { Handle, Position } from '@xyflow/react'
import Link from 'next/link'
import React from 'react'

interface TurboNodeProps {
  data: {
    title: string;
    description: string;
    link: string;
  };
}

function TurboNode({ data }: TurboNodeProps) {
  return (
    <div className='rounded-lg border border-gray-300 bg-yellow-100 shadow-md w-64 p-5'>
      <div className='font-bold text-lg text-gray-800 mb-2'>
        {data.title}
      </div>
      <p className='text-sm text-gray-600 mt-1 mb-2 line-clamp-2'>
        {data.description}
      </p>
      <Link 
        href={data.link} 
        target='_blank' 
        className='text-blue-600 underline text-sm mt-2 inline-block hover:text-blue-800'
      >
        Learn More
      </Link>   
      <Handle type='target' position={Position.Top} />
      <Handle type='source' position={Position.Bottom} />
    </div>
  )
}

export default TurboNode