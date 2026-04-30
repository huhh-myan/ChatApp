import express, { json, Request } from "express";
import { middleware } from "./middleware";
import { CreateUserSchema, SigninSchema } from "@repo/common/types";

import bcrypt from "bcrypt";
import { prismaClient } from "@repo/db";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import e from "express";
import cors from "cors";


const port = 3001;
const app = express();

//express body and json parser to parse incoming data

app.use(cors({
    origin:"http://localhost:3000",
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', middleware, (req,res)=>{
    console.log("Reached /")
    res.send('Hello There!');
})

//signup endpoint
app.post('/signup',async (req,res)=>{

    //console.log(1,req.body.email, req.body.password);
    // const username = req.body.username;
    // const password = req.body.password;

    //console.log(process.env.DATABASE_URL)
    const parsedData = CreateUserSchema.safeParse(req.body);

    //console.log(2,req.body.email, req.body.password);

    if(!parsedData.success){
        return res.status(400).json({
            message:"Incorrect Inputs"
        })
    }

    //function to hash password
    const saltrounds = 10;
    const genSaltRounds = await bcrypt.genSalt(saltrounds);
    const hashedPassword = await bcrypt.hash(parsedData.data.password, genSaltRounds)
    
    
    //function to check username uniqueness and push to db
    try{
        //console.log(3,req.body.email, req.body.password);
        const user = await prismaClient.user.create({
            data:{
                name: parsedData.data.name,
                email: parsedData.data.email,
                password: hashedPassword
            },
            select:{
                id: true
            }
        })
        //how to return userId
        res.json({
            message : `User signed Up with UserID: ${user.id}`,
        })
    }catch(e){
        //console.error("PRISMA ERROR", e);

        return res.status(409).json({
            e,
            message:"User Already Exists!"
        })
    }

    // res.json({
    //     message: "User SignedUp!" 
    // })
})


//middleware for token verification
// const tokenChecker = async (req, res, next)=>{
//     //function to validate token
//         //true-- next()
//         //false -- error
// }

//signin endpoint
app.post('/signin',async (req,res)=>{
    // const username = req.body.username;
    // const password = req.body.password;

    const parsedData = SigninSchema.safeParse(req.body);
    if(!parsedData.success){
        // is this return type better or return res.json({})
        return res.status(411).json({
            message:"Incorrect Inputs"
        })
        
    }

    //is below the right way to verify password or verify them together
    //can i make all db function to class, is it better?
    //can i make bcrypt to class and methods properties,is it wise?
    const user = await prismaClient.user.findUnique({
        where:{
            email: parsedData.data.email
        },
        select:{
            id: true,
            password: true
        }
    });
    if(!user){
        return res.status(404).json({
            message: "User not found!"
        });
    }
    //i donot need else right? -- does password match run before user verified ? cos user verified await
    const passwordMatch = await bcrypt.compare(parsedData.data.password, user.password);

    if(!passwordMatch){
        return res.status(400).json({
            message: "Invalid Password!"
        })
    }else{
        const token =  jwt.sign({userId: user.id}, JWT_SECRET);

        return res.json({
            token: `${token}`,
            message: "User Logged In!"
        })
    }



    //function to verify creds by checking with db
    //if false -- deny
    //else---
        //function to form a token and assign it to the user 

    // res.json({
    //     message: "User LoggedIn!"
    // })
})


app.post('/create-room', middleware, async (req, res)=>{
    //this endpoint guarded by middleware(function) that checks for signing by verifying token -- done
    const roomName = req.body.slug;
    //console.log(roomName);
    //console.log("request reached here");
    //this above data is not being safe parsed 

    //to make a new room entry in the table
    //in this funtion slug should be input by user -- i think zod schema required for Room incoming data,
    try {
        const room = await prismaClient.room.create({
            data:{
                slug: `${roomName}`,
                adminId: `${req.userId}`
            },
            select:{
                id: true
            }
        });

        return res.json({
            message: `Room ID: ${room.id}`
        });
    } catch (error) {
        return res.json({
            error,
            message: "Room already Exists!"
        })
    }


    //function to make a new ws server --- but do i connect to it through diff function or here only

    //return room id later and sharing link ig 
    // return  res.json({
    //     userId: `${req.userId}` ,
    //     message: "Room Created!",
    //     roomId: 'blahblahblah!'
    // })
})

//gets last 50 chats from a room
app.get("/chat/:roomId", middleware, async (req, res)=>{
    const room = req.params.roomId ;

    //checks the roomID isnt empty---how to replace this by zodschema
    if(!room || room ==""){
        return res.status(411).json({
            message:"ROOMID error!"
        })
    }

    //roomId is integer in db
    const roomId = parseInt(room as unknown as string);

    //verify user belongs to room before accessing chats and giving them from db
    //function to verify later ---- uncomment late

    // const userId = req.userId;
    // await prismaClient.user.findFirst({
    //     where:{
    //         id: userId,
    //         Room: {
    //             some: {
    //                 id: roomId
    //             }
    //         }
    //     }
    // })
    // if above query returns null then not suscribed to room like that

    try {
        // const chats = await prismaClient.room.findUnique({  
        //     where:{
        //         id: roomId
        //     },
        //     include: {
        //         Chat: {
        //             take: 50,
        //             orderBy: {
        //                 id: "desc"
        //             },
        //             select:{
        //                 id: true,
        //                 message: true,
        //                 roomId: true,
        //                 userId: true,
        //             }
        //         }
        //     },
        // })
        //this also works ig -- check which query works
        const chats = await prismaClient.chat.findMany({
            take: 50,
            where:{
                roomId: roomId
            },
            orderBy:{
                id: "desc"
            },
            select:{
                id: true,
                message: true,
                roomId: true,
                User: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
            }, 
        })

        //yep both feel right
        //STILL CHECK


        return res.json(chats);

    } catch (error) {
        

        return res.json({
            error,
            message: "Unable to get chats!"
        })
    }

})
//create-rooom -- shouldnt this be under ws backend or is that after forming of room

//returns room id from roomname
app.get("/room/:slug", middleware,async (req, res)=>{

    //This below shit is there in @types/express express-tests.ts----- wow
    //     // Params defaults to typed object
    // router.get("/:foo", req => {
    //     req.params.foo; // $ExpectType string
    //     // @ts-expect-error
    //     req.params[0];
    // });
    //donot do await in getting params will fuck it up
    const roomName =  req.params ;
    // conso
    // za   le.log(roomName);
    // console.log(roomName.slug);
    // console.log(`${roomName.slug}`);
    // //console.log(roomName.slug, "jerer", typeof roomName, 'SAddSD', typeof roomName.slug);
    //made slug into `` this to make it string
    try{
        const roomDetails = await prismaClient.room.findUnique({
            where:{
                slug: `${roomName.slug}`
            },
            select:{
                id: true,
            }
        })

        //console.log(roomDetails)
        return res.json(roomDetails);
    }catch(e){
        console.log(e);
        return res.json({
            e,
            message:"Error in geeting roomid from slug!"
        })
    }

})







// /room/list is also /room/slug


app.get("/roomsList", async (req, res)=>{
    // console.log("request hitting room/list")
    try{
        // const roomList = await prismaClient.room.findUnique({
        //     where:{
        //         slug: 'honeypot',
        //     },
        // });
        const roomsList = await prismaClient.room.findMany();
        // console.log(roomsList);
        return res.json(roomsList);
    }catch(e){
        return res.json({
            e,
            message: "Unable to get rooms!"
        })
    }
})

//ToDo
// \\ change room table to store users? because if i do this and scale then  people on diff be server will be on same room and no comm between
// 





app.listen(port,()=>{
    console.log(`HTTP backend running on ${port}.`)
})