import { tableIcons } from "../../Data/Icons";
import React, { useState } from "react";

const CopyButton = ({ textToCopy, onCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      if (onCopy) onCopy();
      setTimeout(() => setCopied(false), 2000); // Reset "copied" state after 2 seconds
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  return (
    <button
      className="mx-1 text-sm text-gray-400 lowercase"
      onClick={handleCopy}
      style={{ cursor: "pointer" }}
    >
      {copied ? "Copied!" : tableIcons.copy}
    </button>
  );
};

export default CopyButton;
