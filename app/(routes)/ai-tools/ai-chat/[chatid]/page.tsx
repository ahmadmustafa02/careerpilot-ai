"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoaderCircle, Send } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import EmptyState from '../_components/EmptyState'
import axios from 'axios'
import Markdown from 'react-markdown'
import { useParams } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from "next/navigation";


type messages={
  content:string,
  role:string,
  type:string
}

function AiChat() {

const[userInput,setUserInput] = useState<string>('');
const [ loading, setLoading] = useState(false);
const [messageList, setMessageList] =useState<messages[]>([]);
const router = useRouter();


const {chatid}=useParams();
console.log(chatid)


useEffect(()=>{
chatid && GetMessageList();
},[chatid])

const GetMessageList=async ()=>{

  const result = await axios.get('/api/history?recordId='+chatid)
  console.log(result)
  setMessageList(result?.data?.content)
}


const onsend = async () => {
  setLoading(true);

  // Add user message to state
  setMessageList(prev => [
    ...prev,
    {
      content: userInput,
      role: "user",
      type: "text",
    },
  ]);

  const input = userInput;
  setUserInput("");

  const result = await axios.post("/api/ai-career-chat-agent", {
    userInput: input,
    recordId: chatid, // pass recordId so backend links it
  });

  console.log("AI response:", result.data);

  // Normalize AI response
  const aiMessage: messages = {
    content:
      result.data?.content || // if your API returns content
      result.data?.answer || // if your API returns answer
      "No response",
    role: "assistant",
    type: "text",
  };

  setMessageList(prev => [...prev, aiMessage]);
  setLoading(false);
};


console.log(messageList);


useEffect(()=>{
  messageList.length>0 && updateMessageList();



},[messageList])

const onNewChat = async ()=>{
  //create new record to history table
  const id=uuidv4();

  const result = await axios.post('/api/history',{
    recordId:id,
    content:[]
  });
  console.log(result);

  router.replace("/ai-tools/ai-chat/"+id)

}


const updateMessageList = async () => {
  await axios.put("/api/history", {
    content: messageList,
    recordId: chatid,
  });
};






  return (
    <div className='px-4 sm:px-6 md:px-10 lg:px-24 xl:px-36 2xl:px-48 h-screen flex flex-col'>
        
        {/* Header */}
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-8 py-4 border-b border-gray-200 dark:border-gray-700'>
            <div>
                <h2 className='font-bold text-lg sm:text-xl'>AI Career Q/A</h2>
                <p className='text-sm sm:text-base text-gray-600 dark:text-gray-400'>Smarter career decision start here - Get tailored advice, real-time market insights</p>
            </div>
            <Button 
                onClick={onNewChat}
                className="w-full sm:w-auto text-sm px-4 py-2"
            >
                + New Chat
            </Button>
        </div>

        {/* Chat Container */}
        <div className='flex-1 flex flex-col relative overflow-hidden'>
            
            {/* Empty State */}
            {messageList?.length <= 0 && 
                <div className='flex-1 overflow-auto'>
                    <EmptyState selectedQuestion={(question: string) => setUserInput(question)} />
                </div>
            }
            
            {/* Messages */}
            {messageList?.length > 0 && (
                <div className='flex-1 overflow-auto py-4 space-y-4'>
                    {messageList?.map((message, index) => (
                        <div key={index}>
                            <div className={`flex mb-3 ${message.role == 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] sm:max-w-[70%] p-3 rounded-lg ${
                                    message.role == 'user' 
                                        ? 'bg-blue-500 text-white ml-4' 
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white mr-4'
                                }`}>
<div className="prose prose-sm dark:prose-invert max-w-none">
    <Markdown>
        {message.content}
    </Markdown>
</div>
                                </div>
                            </div>
                            
                            {/* Loading indicator */}
                            {loading && messageList?.length - 1 == index && (
                                <div className='flex justify-start mb-3'>
                                    <div className='bg-gray-100 dark:bg-gray-800 p-3 rounded-lg mr-4 flex items-center gap-2'>
                                        <LoaderCircle className='animate-spin w-4 h-4' />
                                        <span className="text-sm">Thinking...</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Input Area */}
            <div className='border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900'>
                <div className='flex items-center gap-2 sm:gap-4 max-w-4xl mx-auto'>
                    <Input 
                        placeholder='Type your question here...' 
                        value={userInput} 
                        onChange={(event) => setUserInput(event.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !loading && userInput.trim()) {
                                onsend();
                            }
                        }}
                        className="flex-1 text-sm sm:text-base"
                        disabled={loading}
                    />
                    <Button 
                        onClick={onsend} 
                        disabled={loading || !userInput.trim()}
                        size="sm"
                        className="px-3 py-2"
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    </div>
)
}

export default AiChat

