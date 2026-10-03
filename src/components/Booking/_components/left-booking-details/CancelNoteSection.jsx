import React from "react";

const CancelNoteSection = ({ CancelNotes }) => {
  return (
    <div className="text-sm text-end italic text-gray-400 mb-1">
      {/* here we will show only notes with noteType cancel  */}
      {CancelNotes.map((note, index) => (
        <p key={note._id || index}>
          {`Cancel note by ${note.key}: (${note.value})`}
        </p>
      ))}
    </div>
  );
};

export default React.memo(CancelNoteSection);
