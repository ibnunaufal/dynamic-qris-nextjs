"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Download } from "lucide-react";

interface Props {
  value: string | null;
  downloadLabel: string;
  emptyHint?: string;
}

export function QrCodeCard({ value, downloadLabel, emptyHint }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!value || !canvasRef.current) {
      setReady(false);
      return;
    }
    QRCode.toCanvas(canvasRef.current, value, {
      width: 280,
      margin: 1,
      color: { dark: "#12151C", light: "#FFFFFF" },
      errorCorrectionLevel: "M",
    })
      .then(() => setReady(true))
      .catch(() => setReady(false));
  }, [value]);

  function handleDownload() {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "qris.png";
    a.click();
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="rounded-2xl bg-white p-4 shadow-inner shadow-black/5">
        {value ? (
          <canvas ref={canvasRef} className="h-[220px] w-[220px] sm:h-[260px] sm:w-[260px]" />
        ) : (
          <div className="flex h-[220px] w-[220px] items-center justify-center text-center text-sm text-mist sm:h-[260px] sm:w-[260px]">
            {emptyHint}
          </div>
        )}
      </div>
      {value && ready && (
        <button
          type="button"
          onClick={handleDownload}
          className="flex items-center gap-1.5 text-sm font-medium text-mist hover:text-white"
        >
          <Download size={15} />
          {downloadLabel}
        </button>
      )}
    </div>
  );
}
