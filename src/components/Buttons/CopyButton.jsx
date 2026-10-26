import { tableIcons } from "../../Data/Icons";
import React, { useState } from "react";

const CopyButton = ({
  textToCopy,
  onCopy,
  label,
  className = "mx-1 text-sm text-gray-400 lowercase focus:outline-none",
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    try {
      e.stopPropagation();

      // Fallback for older browsers
      if (!navigator.clipboard) {
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        textArea.style.position = "fixed";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        const successful = document.execCommand("copy");
        document.body.removeChild(textArea);

        if (!successful) throw new Error("Fallback copy failed");
      } else {
        await navigator.clipboard.writeText(textToCopy);
      }

      setCopied(true);
      if (onCopy) onCopy();
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  return (
    <button
      className={className}
      onClick={(e) => handleCopy(e)}
      style={{ cursor: "pointer" }}
      aria-label="Copy to clipboard"
      type="button"
    >
      {copied ? "Copied!" : (label ?? tableIcons.copy)}
    </button>
  );
};

export default CopyButton;
