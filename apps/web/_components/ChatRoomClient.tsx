"use client"
//THINGS TO DO HERE
// // Change message type to : {
//         id: number,
//         slug: string,
//         createdAt: Date,
//         admindId: string,
//     }[] so that giving key to each message is easy by directly giving it id
// but the above solution lies a problem? what about the message you just send, 
// its not yet registered in db then how do you show its in db so no id no key and type wont match,
// CHECK BETTER ARCHITECTURE IG
// for now using the message itself as key


import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket"

export function ChatRoomClient({
    messages,
    id
}:{
    messages: { message: string }[],
    id: string
}){

    const [chats, setChats] = useState(messages);
    const [token, setToken] = useState<string | null>(null);
    const {socket, loading} = useSocket(token);
    const [currentMessage, setCurrentMessage] = useState<string>("");

    useEffect(() => {
        setToken(localStorage.getItem("token"));
    }, []);

    useEffect(()=>{
        if(socket && !loading){

            //to join room
            socket.send(JSON.stringify({
                type: "JOIN_ROOM",
                roomId: `${id}`
            }));

            socket.onmessage = (event)=>{
                // console.log(event);
                const eventData = event.data;
                const parsedData = JSON.parse(eventData);
                // console.log(parsedData.type, typeof parsedData.type);
                if (parsedData.type === "CHAT"){
                    setChats(chats=>[{message: parsedData.message}, ...chats]);
                }
            }
            

        }
    },[socket, loading, id])

// id      Int    @id @default(autoincrement())
//   message String
//   roomId  Int
//   userId  String
//   Room    Room   @relation(fields: [roomId], references: [id])
//   User    User   @relation(fields: [userId], references: [id])

    return <div>
        {chats.map(chat=>
            <div key={`${chat.message}`}>
                {chat.message}
            </div>
        )}
        <input type="text" value={currentMessage} onChange={e =>{
            setCurrentMessage(e.target.value);
        }}/>
        <button onClick={()=>{
            socket?.send(JSON.stringify({
                type: "CHAT",
                roomId: `${id}`,
                message: currentMessage
            }))
            // setChats([...chats, {message: currentMessage}]);
            setCurrentMessage("");
        }}>send</button>
    </div>
}