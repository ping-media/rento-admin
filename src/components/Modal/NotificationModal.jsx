import { useRef, useState } from "react";
import UserSearchInput from "../InputAndDropdown/UserSearchInput";
import { postData } from "../../Data/index";
import { useSelector } from "react-redux";

const NotificationModal = ({ isActive, setIsActive }) => {
  const { token } = useSelector((state) => state.user);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const timeoutRef = useRef(null); // debounce ref passed to child

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedUsers.length === 0) return;

    setLoading(true);
    setResult(null);
    try {
      const userIds = selectedUsers.map((u) => u._id);
      const response = await postData(
        "/notifications/send",
        { userIds, title, message },
        token,
      );
      setResult(response?.data);
    } catch {
      setResult({ error: "Failed to send notifications." });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsActive(false);
    // reset everything
    setTitle("");
    setMessage("");
    setSelectedUsers([]);
    setInputValue("");
    setResult(null);
  };

  return (
    <div
      className={`fixed ${!isActive ? "hidden" : ""} z-40 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4`}
    >
      <div className="relative top-40 mx-auto shadow-xl rounded-md bg-white max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-3">
          <h4 className="text-lg font-semibold text-theme">
            Send Notification
          </h4>
          <button
            onClick={handleClose}
            type="button"
            className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
          {/* User search */}
          <UserSearchInput
            token={token}
            inputValue={inputValue}
            setInputValue={setInputValue}
            selectedUsers={selectedUsers}
            setSelectedUsers={setSelectedUsers}
            timeoutRef={timeoutRef}
            required
          />

          {/* Title */}
          <div>
            <label className="block text-gray-800 font-semibold text-sm mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Notification title"
              required
              className="block w-full rounded-md px-5 py-3 ring-1 ring-inset ring-gray-400 focus:text-gray-800 outline-none"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-gray-800 font-semibold text-sm mb-2">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Notification message"
              required
              rows={3}
              className="block w-full rounded-md px-5 py-3 ring-1 ring-inset ring-gray-400 focus:text-gray-800 outline-none resize-none"
            />
          </div>

          {/* Result summary */}
          {result && !result.error && (
            <div className="text-sm rounded-md p-3 bg-green-50 border border-green-200 text-green-700">
              Sent: <strong>{result.sent}</strong>&nbsp;|&nbsp; Failed:{" "}
              <strong>{result.failed}</strong>
            </div>
          )}
          {result?.error && (
            <div className="text-sm rounded-md p-3 bg-red-50 border border-red-200 text-red-700">
              {result.error}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-md text-sm text-gray-600 border border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || selectedUsers.length === 0}
              className="px-4 py-2 rounded-md text-sm bg-theme text-white hover:opacity-90 disabled:opacity-50"
            >
              {loading
                ? "Sending..."
                : `Send${selectedUsers.length > 1 ? ` (${selectedUsers.length})` : ""}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NotificationModal;
