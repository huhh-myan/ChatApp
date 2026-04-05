// import { useParams } from "next/navigation"
import axios from "axios";
import { BACKEND_URL } from "../../config";
import { ChatGetter } from "../../../_components/ChatRoom";


async function getChats(slug: string) {
    try{
        const response = await axios.get(`${BACKEND_URL}/room/${slug}`,{
            headers:{
                "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxNmM3OTFhYi1iZDE4LTQxZTAtOTM4Ny0zNjNlZjFkZTVkYTMiLCJpYXQiOjE3NzQzMDYxNjR9.ltOZ6uKbgR4PK3NhZiyHKK1zLD-NqKo4_2RI8QssnpU"            }
        });
        //console.log(response);
        return response.data.id;
    }catch(e){
        console.log(e);
    }
}

export default async function ChatRoom({
    params
}: {
    params: {
        slug: string
    }
}) {

    const { slug } = await params;
    const roomId = await getChats(slug);
    //console.log(roomId);
    //console.log(slug);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
    //const roomId = useParams<{roomId: string}>();

    return (
        <div>
            Hello There
            <div>
                Welcome to room --- {slug}--------
                ROOMID ---- {roomId ? `${roomId}`: "error in getting ID"};
            </div>

            <ChatGetter id={roomId}></ChatGetter>
        </div>
    )
}