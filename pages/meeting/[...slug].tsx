import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import LoaderIcon from "../../components/loader";
import { useRouter } from "next/router";
import Link from "next/link";

// prevent ssr on refresh
const CustomMeeting = dynamic(
    () => { return import("../../components/customMeeting");},
    { ssr: false }
);

const SimpleMeeting = dynamic(
    () => { return import("../../components/simpleMeeting");},
    { ssr: false }
);

function Meeting() {
    const router = useRouter();
    const [authToken, setAuthToken] = useState('');
    const slug = router.query.slug || [];
    const firstMountedRef = useRef(true);
  
    useEffect(() => {
        if (firstMountedRef.current) {
            firstMountedRef.current = false;
            return;
        }
        setAuthToken(sessionStorage.getItem("auth") as string);
    }, []);

    if (firstMountedRef.current || !authToken) return <LoaderIcon />;

    if (slug[0] === 'simple-meeting') {
        return <SimpleMeeting roomName={slug[1]} authToken={authToken}/>
    } else if (slug[0] === 'custom-meeting') {
        return <CustomMeeting roomName={slug[1]} authToken={authToken}/>
    }

    return (
        <>
            <br />
            <br />
            <br />
            Please choose one of the meeting templates from <Link href="/">here.</Link>
            <br />
            <br />
            <br />
        </>
    );
}

export default Meeting;