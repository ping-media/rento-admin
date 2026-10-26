import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import CopyButton from "../Buttons/CopyButton";

const PasswordField = ({
  id = "password",
  label = "Password",
  value,
  onChange,
  onGenerate, // shows a "Generate" link when passed
  onEnter, // called on Enter, which never submits a surrounding form
  error = "",
  hint = "",
  showCopy = false,
  defaultVisible = false,
  disabled = false,
  placeholder = "Enter password",
}) => {
  const [visible, setVisible] = useState(defaultVisible);

  return (
    <div className="w-full text-left">
      <label htmlFor={id} className="block text-sm font-semibold text-gray-800">
        {label}
      </label>

      <div className="relative mt-2">
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onEnter?.();
            }
          }}
          disabled={disabled}
          placeholder={placeholder}
          autoComplete="new-password"
          aria-invalid={!!error}
          className={`block w-full rounded-md px-4 py-2.5 pr-11 text-sm outline-none ring-1 ring-inset focus:text-gray-800 ${
            error ? "ring-red-400" : "ring-gray-400"
          } disabled:bg-gray-400 disabled:bg-opacity-20`}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
        >
          {visible ? (
            <VisibilityOff fontSize="small" />
          ) : (
            <Visibility fontSize="small" />
          )}
        </button>
      </div>

      <div className="mt-1.5 flex items-start justify-between gap-3 text-xs">
        {error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <p className="text-gray-500">{hint}</p>
        )}
        <div className="flex shrink-0 items-center gap-3">
          {showCopy && value && <CopyButton textToCopy={value} />}
          {onGenerate && (
            <button
              type="button"
              onClick={onGenerate}
              className="font-semibold text-theme hover:underline"
            >
              Generate
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordField;
