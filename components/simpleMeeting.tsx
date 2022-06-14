import { useEffect, useRef, useState } from "react";
import { useDyteClient, DyteProvider } from '@dytesdk/react-web-core';
import { DyteMeeting } from '@dytesdk/react-ui-kit';
import LoaderIcon from "./loader";
import { useRouter } from "next/router";

function SimpleMeeting({ roomName, authToken} : { roomName: string, authToken: string }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [meeting, initMeeting] = useDyteClient();
  const router = useRouter();
  useEffect(() => {
    if (authToken && roomName && !isLoaded) {
      initMeeting({
        authToken,
        roomName,
        apiBase: process.env.NEXT_PUBLIC_REACT_APP_DYTE_BASE_URL,
      });
      setIsLoaded(true);
    }
  },[initMeeting, authToken, roomName, isLoaded]);


  useEffect(()=> {
    if (meeting) {
      meeting.self.on("roomLeft", () => {
        sessionStorage.clear();
        router.back();
      });
    }
  }, [meeting, router]);

  if (!meeting || !authToken || !roomName)  return <LoaderIcon />;
  if (!isLoaded) return <LoaderIcon />;
  return (
    <DyteProvider value={meeting}>
        <div style={{height:'100vh', width: '100vw'}}>
            <DyteMeeting mode="fill" showSetupScreen={false} meeting={meeting}/>
        </div>
    </DyteProvider>
  );
}

export default SimpleMeeting;