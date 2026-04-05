import { useEffect, useState } from "react";
import { WS_URL } from "../app/config";


//what the fuck is the need for this, ws npm provides with status code for connecting connected open and other stuff
//how is if it its connected or not checked in real life?
export function useSocket(){
    const [loading, setLoading] = useState(true);
    const [socket, setSocket ] =  useState<WebSocket>();

    useEffect(()=>{
        const ws = new WebSocket(WS_URL);
        ws.onopen = () => {
            setLoading(false);
            setSocket(ws);
        }
    }, []);

    return {
        socket,
        loading
    }
}