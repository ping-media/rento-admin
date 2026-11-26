import { Link } from "react-router-dom";
import ConfirmActionModal from "./ConfirmActionModal";
import CopyButton from "../Buttons/CopyButton";
import PasswordField from "../InputAndDropdown/PasswordField";
import PasswordRulesChecklist from "../InputAndDropdown/PasswordRulesChecklist";

const TITLES = {
  done: "Manager login ready",
  noEmail: "Email required",
  confirm: "Change Customer to Manager?",
};

const ConvertCustomerModal = ({ convert }) => {
  const {
    isOpen,
    target,
    targetName,
    password,
    isPasswordValid,
    credentials,
    converting,
    modalView,
    setPassword,
    regeneratePassword,
    close,
    convert: handleConvert,
  } = convert;

  const messages = {
    done: "Share these login details with the manager. The password can't be viewed again, so copy it before closing.",
    noEmail: `${targetName} has no valid email. Managers log in with email and password, so add an email to this customer first.`,
    confirm: `Do you want to change ${targetName} from customer to manager? Their login password is set below.`,
  };

  return (
    <ConfirmActionModal
      active={isOpen}
      position="responsive"
      title={TITLES[modalView]}
      message={messages[modalView]}
      confirmText="Yes, change"
      cancelText={modalView === "confirm" ? "Cancel" : "Close"}
      showConfirm={modalView === "confirm"}
      persistent={modalView === "done"}
      loading={converting}
      confirmDisabled={!isPasswordValid}
      onConfirm={handleConvert}
      onCancel={close}
    >
      {modalView === "confirm" && (
        <div className="mt-4">
          <PasswordField
            id="newManagerPassword"
            label="Manager login password"
            value={password}
            onChange={setPassword}
            onGenerate={regeneratePassword}
            onEnter={isPasswordValid ? handleConvert : undefined}
            defaultVisible
          />
          <PasswordRulesChecklist password={password} className="mt-2" />
        </div>
      )}

      {modalView === "noEmail" &&
        !location.pathname.includes("/all-users/") && (
          <Link
            to={`/all-users/${target?._id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-sm font-semibold text-theme underline underline-offset-2"
          >
            Open customer profile
          </Link>
        )}

      {modalView === "done" && (
        <div className="mt-4 rounded-md border border-theme/40 bg-theme/10 p-4">
          <p className="text-xs uppercase text-gray-500">Email</p>
          <p className="break-all text-sm font-semibold text-gray-800">
            {credentials.email}
          </p>
          <p className="mt-3 text-xs uppercase text-gray-500">Password</p>
          <p className="select-all break-all font-mono text-sm font-semibold text-gray-800">
            {credentials.password}
          </p>
          <CopyButton
            textToCopy={`Email: ${credentials.email}\nPassword: ${credentials.password}`}
            label="Copy email & password"
            className="mt-4 w-full rounded-lg bg-theme px-4 py-3 text-sm font-semibold text-white hover:bg-theme-dark"
          />
        </div>
      )}
    </ConfirmActionModal>
  );
};

export default ConvertCustomerModal;
