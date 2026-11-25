import { useEffect, useRef, useState } from "react";

const read = () => {
  const vv = window.visualViewport;
  return {
    height: vv ? vv.height : window.innerHeight,
    offsetTop: vv ? vv.offsetTop : 0,
  };
};

// Gives the height of the area the user can actually see (keyboard excluded)
const useVisualViewport = (active = true) => {
  const [vp, setVp] = useState(read);
  const baseline = useRef(0); // tallest height seen = keyboard closed

  useEffect(() => {
    if (!active) return;
    const vv = window.visualViewport;

    const update = () => {
      const next = read();
      baseline.current = Math.max(baseline.current, next.height);
      setVp(next);
    };
    const resetBaseline = () => {
      baseline.current = 0;
      setTimeout(update, 300);
    };

    baseline.current = 0;
    update();
    vv?.addEventListener("resize", update);
    vv?.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", resetBaseline);
    return () => {
      vv?.removeEventListener("resize", update);
      vv?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", resetBaseline);
    };
  }, [active]);

  const keyboardOpen = baseline.current - vp.height > 150;
  return { ...vp, keyboardOpen };
};

export default useVisualViewport;
