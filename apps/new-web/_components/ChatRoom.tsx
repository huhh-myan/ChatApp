import { BACKEND_URL } from "../app/config"
import axios from "axios"
import { ChatRoomClient } from "./ChatRoomClient";




async function getChats(roomid: string) {
    try{
        const response = await axios.get(`${BACKEND_URL}/chat/${roomid}`, {
            headers:{
                "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmOWY3YzcwYS1kZWZkLTRmOWQtYTI4ZS1iYjZmMmU5YjM2MWYiLCJpYXQiOjE3NzQyOTA4NzN9.kEqonhJqSsHnmydTkzOgsRXv477jlqb5zaMihu6G8po"
            }
        });
        //console.log(response);
        return response.data;
    }catch(e){
        console.log(e);
    }
}

export async function ChatGetter({id}:{
    id: string
}) {
    
    // chats is of type chat that is returned from 
    const chats: {
        id: number;
        message: string;
        roomId: number;
        userId: string;
    }[] = await getChats(id) ;
    //console.log(chats);
    const messages = await chats.map(chat => ({message: chat.message})) || [{message: ""}];
    // const messages = chats.map((chat)=>{
    //     const chatMessage = chat.message;
    //     return {"message": chatMessage}
    // })
    // const messages = [{message: ""}];

    return <ChatRoomClient messages={messages} id={id}></ChatRoomClient>;
}