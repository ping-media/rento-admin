import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.25;

// Draws every page onto a canvas. No toolbar, no download, no sidebar.
const PdfViewer = ({ url, token, onReady }) => {
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;
  const [error, setError] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    let cancelled = false;
    let pdfDoc = null;
    let loadingTask = null;
    setError(false);

    (async () => {
      try {
        const headers = token
          ? { token, Authorization: `Bearer ${token}` }
          : {};
        const resp = await fetch(url, { headers });
        if (!resp.ok) throw new Error("Failed to load PDF");
        const data = new Uint8Array(await resp.arrayBuffer());
        loadingTask = pdfjsLib.getDocument({ data });
        pdfDoc = await loadingTask.promise;
        setZoom(1);
        const width = wrapperRef.current.clientWidth; // fit-to-width, unaffected by zoom
        const dpr = window.devicePixelRatio || 1;

        for (let i = 1; i <= pdfDoc.numPages; i++) {
          const page = await pdfDoc.getPage(i);
          if (cancelled) return;

          const base = page.getViewport({ scale: 1 });
          // 2x extra resolution so zooming in stays sharp
          const viewport = page.getViewport({
            scale: (width / base.width) * Math.min(dpr, 2) * 2,
          });

          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          canvas.style.width = "100%";
          canvas.style.height = "auto";
          canvas.style.marginBottom = "8px";
          canvas.style.borderRadius = "4px";
          container.appendChild(canvas);

          await page.render({
            canvasContext: canvas.getContext("2d"),
            viewport,
          }).promise;

          if (i === 1) onReadyRef.current?.(); // hide the skeleton after page 1
        }
      } catch (e) {
        if (!cancelled) {
          setError(true);
          onReadyRef.current?.();
        }
      }
    })();

    return () => {
      cancelled = true;
      container.innerHTML = "";
      // the loading task owns the worker resources; the document may not have destroy()
      try {
        loadingTask?.destroy?.();
      } catch (e) {
        // already destroyed, nothing to do
      }
    };
  }, [url, token]);

  const changeZoom = (delta) =>
    setZoom((z) =>
      Math.min(
        MAX_ZOOM,
        Math.max(MIN_ZOOM, Math.round((z + delta) * 100) / 100),
      ),
    );

  return (
    <div ref={wrapperRef} className="w-full">
      <div className="sticky top-0 z-[5] mb-2 flex items-center justify-center gap-2 rounded-md bg-white/90 py-1 backdrop-blur">
        <button
          type="button"
          onClick={() => changeZoom(-ZOOM_STEP)}
          disabled={zoom <= MIN_ZOOM}
          aria-label="Zoom out"
          className="h-9 w-9 rounded-md border border-gray-300 text-lg font-semibold hover:border-theme hover:text-theme disabled:opacity-40"
        >
          −
        </button>
        <button
          type="button"
          onClick={() => setZoom(1)}
          aria-label="Reset zoom"
          className="min-w-[3.5rem] rounded-md px-2 py-1 text-sm font-semibold text-gray-700"
        >
          {Math.round(zoom * 100)}%
        </button>
        <button
          type="button"
          onClick={() => changeZoom(ZOOM_STEP)}
          disabled={zoom >= MAX_ZOOM}
          aria-label="Zoom in"
          className="h-9 w-9 rounded-md border border-gray-300 text-lg font-semibold hover:border-theme hover:text-theme disabled:opacity-40"
        >
          +
        </button>
      </div>

      {/* scrolls sideways when zoomed in */}
      <div className="overflow-x-auto">
        <div
          ref={containerRef}
          style={{ width: `${zoom * 100}%` }}
          className="select-none border-2 border-gray-400"
          onContextMenu={(e) => e.preventDefault()}
        />
      </div>

      {error && (
        <p className="py-6 text-center text-sm text-gray-500">
          Unable to display this document.
        </p>
      )}
    </div>
  );
};

export default PdfViewer;
