import { useEffect } from "react";

export function useAutoFocus(ref, trigger) {
  useEffect(() => {
    if (trigger && ref.current) {
      ref.current.focus();
    }
  }, [trigger, ref]);
}
