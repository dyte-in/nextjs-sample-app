import { useEffect, useRef, useState } from "react";
import { useDyteClient, DyteProvider } from '@dytesdk/react-web-core';
import LoaderIcon from "./loader";
import DyteCustomMeeting from "./dyte-custom-meeting";
import { useRouter } from "next/router";

function CustomMeeting({ roomName, authToken} : { roomName: string, authToken: string }) {
  const firstMountedRef = useRef(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [meeting, initMeeting] = useDyteClient();
  const router = useRouter();
  useEffect(() => {
    if (firstMountedRef.current) {
      firstMountedRef.current = false;
      return;
    }

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

  if (!isLoaded) return <LoaderIcon />;
  return (
    <DyteProvider value={meeting}>
      <DyteCustomMeeting />
    </DyteProvider>
  );
}

export default CustomMeeting;