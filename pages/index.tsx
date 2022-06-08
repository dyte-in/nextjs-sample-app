import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useEffect, useState, useCallback, useRef } from 'react';
import axios from "axios";
import styles from '../styles/Home.module.css';
import LoaderIcon from '../components/loader';

const Home: NextPage = () => {
  const MY_BACKEND = process.env.NEXT_PUBLIC_REACT_APP_MY_BACKEND;
  const firstMountRef = useRef(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [allMeeetings, setAllMeeting] = useState<any[]>([]);
  const [newMeetingTitle, setNewMeetingTitle] = useState<string>("");
  const [selectedExample, setSelectedExample] =
    useState<string>("simple-meeting");

  const router = useRouter();
  const handleCreateRoomClick = useCallback(
    (title: string) => {
      axios({
        url: `${MY_BACKEND}/meeting/create`,
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        data: {
          title: title,
        },
      })
        .then((res) => {
          let rooms = [...allMeeetings];
          rooms.push(res.data.data.meeting);
          setAllMeeting([...rooms]);
          setNewMeetingTitle("");
        })
        .catch((err) => console.error(err));
    },
    [MY_BACKEND, allMeeetings]
  );

  const joinRoom = async (
    meetingId: string,
    roomName: string,
    isHost: boolean = false
  ) => {
    const resp = await axios({
      url: `${MY_BACKEND}/participant/create`,
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      data: {
        roleName: isHost ? 'host' : 'participant',
        meetingId: meetingId,
        clientSpecificId: Math.random().toString(36).substring(7)
      },
    });

    const authResponse = resp.data.data.authResponse;
    const authToken = authResponse.authToken;

    //saving meeting details in session storage
    sessionStorage.setItem("auth", authToken);
    sessionStorage.setItem("roomName", roomName);

    //redirecting to the example meeting page
    router.push(`/meeting/${selectedExample}/${roomName}`);
  };

  useEffect(() => {
    if (firstMountRef.current) {
      firstMountRef.current = false;
      return;
    }

    // api call to get list of available/existing meeting rooms
    axios({
      url: `${MY_BACKEND}/meetings`,
      method: "GET",
    })
      .then((response) => {
        setAllMeeting(response.data.data.meetings);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [MY_BACKEND]);

  return (
    <div className={styles['main-screen-wrapper']}>
      <Image src="/dyte_logo_white.svg" height="100" width="500" alt="dyte-logo" />
      <h1>Welcome to the nextjs example app.</h1>
      <div className={`${styles.flex} ${styles.row}`}>
        <input
          type="text"
          value={newMeetingTitle}
          placeholder="New meeting title"
          onChange={(e) => setNewMeetingTitle(e.target.value)}
        />
        <button
          className={`${styles['margin-left']}`}
          onClick={() => handleCreateRoomClick(newMeetingTitle)}
        >
          Create Room
        </button>
      </div>
      <div className={styles.divider} />
      <h3>Choose Example </h3>
      <select onChange={(e) => setSelectedExample(e.target.value)}>
        <option value="simple-meeting">simple-meeting</option>
        <option value="custom-meeting">custom-meeting</option>
      </select>
      <div className={styles.exDet}>
        <div>Check the example component here</div>
        <br />
        <code>/components/{selectedExample}/</code>
      </div>
      <div className={styles.divider} />
      <div className={`${styles['existing-meeting-wrapper']} ${styles.flex} ${styles.column}`}>
        <h3>List of created rooms.</h3>
        <h5>Click to join as new participant or as a host.</h5>
        <div className={`${styles['existing-meeting-list']} ${styles.flex} ${styles.row}`}>
          {!loading &&
            allMeeetings.map((el, k) => {
              return (
                <div key={el.id} className={`${styles['meeting-list-wrapper']} ${styles.flex} ${styles.column}`}>
                  <li key={k}>{el.title}</li>
                  <div className={`${styles.flex} ${styles.row}`}>
                    <button
                      onClick={() => joinRoom(el.id, el.roomName, true)}
                    >
                      Join as Host{" "}
                    </button>
                    <button
                      className={`${styles['margin-left']}`}
                      onClick={() => joinRoom(el.id, el.roomName)}
                    >
                      Join as Participant{" "}
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
        {!loading && !allMeeetings.length && (
          <div className="flex no-rooms column">
            <div>No existing rooms 🙁 !</div>
            <div>Create a new room above</div>
          </div>
        )}
        {loading && <LoaderIcon />}
      </div>
    </div>
  );
}

export default Home
