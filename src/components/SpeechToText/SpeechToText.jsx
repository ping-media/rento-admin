import { useEffect, useState } from "react";

const SpeechToText = ({ transcript, setTranscriptChanger }) => {
  //   const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Create a new instance of SpeechRecognition
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true; // Keep listening until stopped
    recognition.interimResults = true; // Show interim results while speaking

    // Event handlers
    recognition.onresult = (event) => {
      const { transcript } = event.results[event.results.length - 1][0];
      setTranscriptChanger((prev) => prev + " " + transcript);
    };

    recognition.onerror = (event) => {
      setError(event.error);
    };

    if (isListening) {
      recognition.start();
    } else {
      recognition.stop();
    }

    // Cleanup on component unmount
    return () => {
      recognition.stop();
    };
  }, [isListening]);

  const toggleListening = () => {
    setIsListening((prev) => !prev);
  };

  return (
    <button
      className={`absolute inset-y-0 end-0 flex items-center px-3 my-1 py-1 mx-1 ${
        isListening && "bg-theme-blue rounded-full text-gray-100"
      }`}
      type="button"
      onClick={toggleListening}
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
          className={`${isListening && "stroke-white"}`}
        ></path>
      </svg>
    </button>
  );
};

export default SpeechToText;
