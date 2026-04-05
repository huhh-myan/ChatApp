"use client"
// import Image, { type ImageProps } from "next/image";
//import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
//import styles from "./page.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";

// type Props = Omit<ImageProps, "src"> & {
//   srcLight: string;
//   srcDark: string;
// };


//dark mode light mode convertion
// const ThemeImage = (props: Props) => {
//   const { srcLight, srcDark, ...rest } = props;

//   return (
//     <>
//       <Image {...rest} src={srcLight} className="imgLight" />
//       <Image {...rest} src={srcDark} className="imgDark" />
//     </>
//   );
// };


export default function Home() {

  const [roomName, setRoomName] = useState("");
  const router = useRouter();


  return (
    <div>
      Hello There
      <div>
        <Card className="" title="CARD TEST 1" href="sasd">This is a card test stay awake!</Card>
      </div>

      <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw"
      }}>
      
        <input style={{padding:10, margin:20}} value={roomName} onChange={(e)=>{
          setRoomName(e.target.value);
        }} type="text" placeholder="ROOM Name"/>
        
        
        <button style={{padding:5, margin:2}} onClick={()=>{
          router.push(`/room/${roomName}`)
        }}>JOIN ROOM</button>
      
      </div>
y

      <div>
        
      </div>
    </div>
  );
}
