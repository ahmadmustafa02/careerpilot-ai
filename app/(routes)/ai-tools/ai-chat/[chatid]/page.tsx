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
<div className='px-10 md:px-24 lg:px-36 xl:px-48 h-[75vh] overflow-auto'>

<div className='flex items-center justify-between gap-8'>

  <div>

    <h2 className='font-bold text-lg'>AI Career Q/A</h2>
    <p>Smarter career decision start here - Get tailored advice, real-time market insights</p>

  </div>
<Button onClick={onNewChat}>+ New Chat</Button>

</div>


<div className='flex flex-col h-[75vh]'>
{messageList?.length<=0 &&  <div className='mt-5'>
    {/* Empty State Options */}
    <EmptyState selectedQuestion={(question:string)=>setUserInput(question)}/>
  </div>
}
  <div className='flex-1'>
    {/* Message list */}
    {messageList?.map((message,index)=>(
 
 <div>
 <div key={index} className={`flex mb-2 ${message.role=='user'?'justify-end':'justify-start'}`}>
   <div className={`p-3 round-lg gap-2 ${message.role=='user'?'bg-gray-200 text-black rounded-lg':"bg-gray-50 text-black"}`}>
<Markdown>
       {message.content}
</Markdown>
       </div>
   </div>
    {loading && messageList?.length -1 ==index &&<div className='flex justify-start p-3 round-lg gap-2 bg-gray-50 text-black mb-2'>
        <LoaderCircle className='animate-spin'/>Thinking..
    
   </div>}   
 </div>

    ))}

  </div>

  <div className='flex justify-between items-center gap-6 absolute bottom-5 w-[50%]'>
    {/* input field */}
    

    <Input placeholder='Type Here' value={userInput} onChange={(event)=>setUserInput(event.target.value)}></Input>
    <Button onClick={onsend} disabled={loading}><Send/></Button>
  </div>
</div>






</div>


)
}

export default AiChat

