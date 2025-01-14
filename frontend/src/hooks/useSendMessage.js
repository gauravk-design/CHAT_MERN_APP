import { useState } from 'react';
import useConversation from '../zustand/useConversation';
import toast from 'react-hot-toast';

const useSendMessage = () => {
    const [loading, setLoading] = useState(false);
    const {messages,setMessages, selectedConversation} = useConversation();

    const sendMessge = async (message) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/messages/send/${selectedConversation._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({message}),
            });
            const data = await res.json();
            if(data.error) toast.error(data.error);
            setMessages([...messages,data]);
            
        } catch (error) {
            toast.error(error.message);
            
        } finally {
            setLoading(false);
        }
    }

    return {sendMessge, loading};
  
}

export default useSendMessage