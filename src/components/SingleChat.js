import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import Peer from "simple-peer";
import "./styles.css";
import { IconButton, Spinner, useToast, Button } from "@chakra-ui/react";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModal from "./miscellaneous/ProfileModal";
import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";
import {baseUrl} from '../constant'

import io from "socket.io-client";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { ChatState } from "../Context/ChatProvider";
const ENDPOINT = baseUrl;
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const toast = useToast();

  const [me, setMe] = useState("");
  const [stream, setStream] = useState(null);
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [test, setTest] = useState(false);  
  const [idToCall, setIdToCall] = useState("");
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");
  const [userCallerId, setUserCallerId] = useState("");

  const userVideo = useRef();
  const connectionRef = useRef();
  const myVideo = useRef(null);

  const { selectedChat, setSelectedChat, user, notification, setNotification, videoCall, setVideoCall } = ChatState();

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
    localStorage.setItem("name", user.name)
    socket.on("me", (id) => {
      setMe(id);
    });
    socket.on("callUser", (data) => {
      setReceivingCall(true);
      setName(data.name)
      setCaller(data.from);
      setCallerSignal(data.signal);
    });
  }, []);

  useEffect(async () => {
    if (userCallerId) {
      await callUser(userCallerId)
    }
  }, [userCallerId])

  useEffect(async () => {
    if (videoCall) {
      navigator.mediaDevices.getUserMedia({ video: false, audio: true })
        .then((stream) => {
          setStream(stream);
          if (myVideo.current) {
            myVideo.current.srcObject = stream;
          }
        })
      selectedChat.users.forEach((o) => {
        if(o._id == user._id) return;
        socket.emit("initVideoCall", o._id);
      })      
    }
  }, [videoCall]);

  

  useEffect(() => {
    socket.on("getUserCallerId", () => {
      setUserCallerId(me)
    })
    socket.on("message recieved", async (newMessageRecieved) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const callUser = async (id) => {
    const peer = new Peer({ initiator: true, trickle: false, stream: stream })
    peer.on("signal", (data) => {
      socket.emit("callUser", { userToCall: id, signalData: data, from: me, name: localStorage.getItem("name") })
    })
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream
    })
    socket.on("callAccepted", (signal) => {
      setCallAccepted(true)
      peer.signal(signal)
    })
    connectionRef.current = peer
  }

  const answerCall = () => {
    setCallAccepted(true)
    setTest(true)
    const peer = new Peer({ initiator: false, trickle: false, stream: stream })
    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: caller })
    })
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream
    })
    peer.signal(callerSignal)
    connectionRef.current = peer
  }

  const leaveCall = () => {
    setCallEnded(true)
    setVideoCall(false)
    connectionRef.current.destroy()
    stream.getTracks().forEach(function (track) {
      track.stop();
    });
  }

  const defaultOptions = {
    loop: true, autoplay: true, animationData: animationData, rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    }
  };


  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const config = { headers: { "Content-type": "application/json", Authorization: `Bearer ${user.token}` } };
      setLoading(true);
      const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({ title: "Error Occured!", description: "Failed to Load the Messages", status: "error", duration: 5000, isClosable: true, position: "bottom", });
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = { headers: { "Content-type": "application/json", Authorization: `Bearer ${user.token}` } };
        setNewMessage("");
        const { data } = await axios.post("/api/message", { content: newMessage, chatId: selectedChat }, config);
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({ title: "Error Occured!", description: "Failed to send the Message", status: "error", duration: 5000, isClosable: true, position: "bottom" });
      }
    }
  };

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);
  

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text fontSize={{ base: "28px", md: "30px" }} pb={3} px={2} w="100%" fontFamily="Work sans" d="flex" justifyContent={{ base: "space-between" }} alignItems="center">
            <IconButton d={{ base: "flex", md: "none" }} icon={<ArrowBackIcon />} onClick={() => setSelectedChat("")} />

            {messages && (!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal fetchMessages={fetchMessages} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}
                />
              </>
            ))}
          </Text>
          {
            !receivingCall && !videoCall ?
              <Box d="flex" flexDir="column" justifyContent="flex-end" p={3} bg="#E8E8E8" w="100%" h="100%" borderRadius="lg" overflowY="hidden" >
                {loading ? <Spinner size="xl" w={20} h={20} alignSelf="center" margin="auto" />
                  : <div className="messages">
                    <ScrollableChat messages={messages} />
                  </div>
                }
                <FormControl onKeyDown={sendMessage} id="first-name" isRequired mt={3} >
                  {istyping ? <Lottie options={defaultOptions} width={70} style={{ marginBottom: 15, marginLeft: 0 }} /> : ""}
                  <Input variant="filled" bg="#E0E0E0" placeholder="Enter a message.." value={newMessage} onChange={typingHandler} />
                </FormControl>
              </Box> : ""
          }

          {/* this is video call-------------------------------------------------------------------------------------------------------- */}
          {receivingCall && !callAccepted ?
            <div className="caller">
              <h1 >{name} is calling...</h1>
              <Button variant="contained" color="primary" onClick={answerCall}> Answer </Button>
            </div>
            : null}   
          {/* {test ? <h1>AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA</h1>: ""}          */}
          {callAccepted && !callEnded && test ? <video id="callUser" className="rounded-full" playsInline ref={userVideo} autoPlay style={{ width: "500px" }} /> : null}
          {videoCall && !callEnded && stream ? <video id="callSelf" className="rounded-full" playsInline ref={myVideo} autoPlay style={{ width: "500px" }} /> : null}
          {callAccepted && !callEnded ? <Button onClick={() => leaveCall()} colorScheme='blue'>End Call</Button> : ""}
          {/* this is video call-------------------------------------------------------------------------------------------------------- */}
        </>
      ) : (
        // to get socket.io on same page
        <Box d="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
