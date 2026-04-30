import WebSocket, { WebSocketServer } from "ws";
import jwt, { Jwt, JwtPayload } from "jsonwebtoken";
import {JWT_SECRET} from "@repo/backend-common/config";
import { prismaClient } from "@repo/db";

const wss = new WebSocketServer({ port:8080 })

interface Decoded extends JwtPayload{
    userId?: string
}

//should this have zod schema?
interface ReceivedData {
    type: String,
    roomId: String,
    message?: String
}
//how do i make this above such that type will have possible values like JOIN_ROOM LEAVE_ROOM CHAT and when type==CHAT then message is available as input ig;
//that i can do in frontend restriction;

//should RoomId be number
interface User {
    userId: String,
    ws: WebSocket,
    rooms: String[]
}

const users: User[] = [];

// convert the jwt checking to function
function checkUserToken(token: string ): string | null{
    try{
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

        if(!decoded || !decoded.userId){
                return null
        }

        return decoded.userId;
    }catch(e){
        return null;
    }

}


wss.on('connection', function connection(ws, request){
    //type casted to get rid of string|null error because url sure exists
    const url = request.url?.toString() as string; // ws://localhost:8080/?token=asdfhsdfsdfjn
    console.log(url);
    const param = new URLSearchParams( url.split('?')[1] ); // this is only works for solo token as query param
    const token = param.get("token") || " "; //this means if null make token " "
    const userId = checkUserToken(token);
    // if(token){
    //     const decoded : Decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    //     if(!decoded || !decoded.userId){
    //         ws.close();
    //         return ;
    //     }
    // }else{
    //     throw new Error('Token Not Present');
    // }

    //avoids type error
    if(userId == null){
        ws.close();
        return null;
    }

    users.push({
        userId,
        ws,
        rooms: [],
    })

    // console.log(users);

    ws.on('error', console.error);

    ws.on('message', async function message(data) {
        console.log(`received: ${data}`);

        //define parsed data type.. and i dont think implicity any turned on tsconfig.json
        const parsedData: ReceivedData = JSON.parse(data.toString());
        
        if(parsedData.type=="JOIN_ROOM"){
            const user = users.find(x=> x.ws === ws);
            user?.rooms.push(parsedData.roomId);
        }

        if(parsedData.type=="LEAVE_ROOM"){
            const user = users.find(x => x.ws===ws);
            // console.log(user);
            // console.log(users);
            if(!user){
                return null;
            }
            //this below hmmm
            user.rooms = user?.rooms.filter(x => x === parsedData.roomId);

            //console.log(user);
        }

        if(parsedData.type=="CHAT"){
            const roomId = parsedData.roomId;
            const message = parsedData.message;

            //below filters users having that particular room and then runs a for loop to send the message
            // const roomsUsers = users.filter(x => x.rooms.includes(roomId));
            // roomsUsers.forEach(x => {
            //     x.ws.send(`${message}`);
            // })

            users.forEach(user=>{
                console.log(user.userId, user.rooms);
                if(user.rooms.includes(roomId)){
                    console.log(user.userId, user.rooms);

                    //how come even with multiple register of a uesr in a room it still sends a 
                    // single message --- includes returns only true or false executed once, doesnt matter how many times room occurs.
                    user.ws.send(JSON.stringify({
                        type: "CHAT",
                        userId,
                        roomId,
                        message
                    }))
                }
            })

            
            // const user = users.find(user=> user.userId == userId);
            // console.log(user);
            //const condition = user?.rooms.includes(roomId);
            //console.log(condition);
            //below checks if user is in room then only puts the message in db
            if((users.find(user=> user.userId == userId))?.rooms.includes(roomId)){
                const chat = await prismaClient.chat.create({
                    data:{
                        message: `${message}`,
                        roomId: Number(roomId),
                        userId: userId
                    },
                    select:{
                        id: true
                    }
                })

                // console.log(chat);
            }
            
        }
    });


    ws.send('connected to websocket server');
})