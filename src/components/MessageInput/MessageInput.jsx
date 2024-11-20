import { faImage, faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import SpeechToText from "../SpeechToText/SpeechToText";
import { useSelector } from "react-redux";
import { handleSendMessage } from "../../utils/data";

const MessageInput = () => {
  // const date = new Date();
  const [userMessage, SetUserMessage] = useState("");
  const { currentUser } = useSelector((state) => state.currentUser);

  //for sending message
  const handleMessageSend = async (e) => {
    e.preventDefault();
    if (userMessage == "" || userMessage == " ") return;
    // setMessageChanger([
    //   ...messages,
    //   {
    //     userNumber: "You",
    //     message: userMessage && userMessage,
    //     time: `${date.getHours()} : ${date.getMinutes()}`,
    //   },
    // ]);
    // for sending message to backend
    const response = await handleSendMessage(
      currentUser?.userName,
      currentUser?.phone,
      userMessage
    );
    if (response.type == "success") {
      return SetUserMessage("");
    } else {
      return response.message;
    }
  };
  return (
    <div className="absolute left-0 bottom-2 w-full p-4">
      <form className="flex items-center" onSubmit={handleMessageSend}>
        <div className="relative w-full">
          {/* <button
            className="absolute inset-y-0 start-0 flex items-center ps-3"
            title="document"
          >
            <FontAwesomeIcon
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              icon={faPaperclip}
            />
          </button> */}
          <input
            placeholder="Type your message.."
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 outline-none block w-full p-3"
            type="text"
            value={userMessage}
            onChange={(e) => SetUserMessage(e.target.value)}
          />
          <SpeechToText
            transcript={userMessage}
            setTranscriptChanger={SetUserMessage}
          />
          {/* <button
            className="absolute inset-y-0 end-0 flex items-center pe-3"
            type="button"
          >
            <svg
              viewBox="0 0 16 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="w-4 h-4 text-gray-500 hover:text-gray-900"
            >
              <path
                d="M15 7v3a5.006 5.006 0 0 1-5 5H6a5.006 5.006 0 0 1-5-5V7m7 9v3m-3 0h6M7 1h2a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V4a3 3 0 0 1 3-3Z"
                strokeWidth="1.8"
                strokeLinejoin="round"
                strokeLinecap="round"
                stroke="currentColor"
              ></path>
            </svg>
          </button> */}
        </div>
        {/* <button
          className="inline-flex items-center py-2.5 px-3 ms-2 text-sm font-medium hover:bg-blue-700 rounded-lg border border-gray-300 hover:text-gray-100 text-black focus:ring-4 focus:outline-none focus:ring-blue-300"
          title="image"
          type="submit"
        >
          <FontAwesomeIcon icon={faImage} />
        </button> */}
        <button
          className="inline-flex items-center py-3 px-3 ms-2 text-sm font-medium text-white bg-theme-blue rounded-lg border border-theme-blue hover:bg-theme-blue-light focus:ring-4 focus:outline-none focus:ring-theme-blue-light"
          title="send"
          type="submit"
        >
          <FontAwesomeIcon className="rotate-45" icon={faPaperPlane} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
