import { passwordRules } from "../../utils/Helper/password";

const PasswordRulesChecklist = ({ password = "", className = "" }) => (
  <div className={className}>
    {passwordRules(password).map((rule) => (
      <p
        key={rule.label}
        className={`mt-1 text-left text-sm ${
          rule.valid ? "text-green-600" : "text-red-500"
        }`}
      >
        {rule.valid ? "✓" : "✗"} {rule.label}
      </p>
    ))}
  </div>
);

export default PasswordRulesChecklist;
