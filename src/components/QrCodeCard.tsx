"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Download } from "lucide-react";

interface Props {
  value: string | null;
  downloadLabel: string;
  qrName?: string;
  amountLabel?: string;
  emptyHint?: string;
}

export function QrCodeCard({ value, downloadLabel, qrName, amountLabel, emptyHint }: Props) {
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

    let source: HTMLCanvasElement = canvasRef.current;
    if (qrName && amountLabel) {
      const qr = canvasRef.current;
      const padding = 32;
      const textGap = 4;
      const qrToTextGap = 20;
      const fontFamily =
        getComputedStyle(document.documentElement).getPropertyValue("--font-space-grotesk").trim() ||
        "sans-serif";

      const composed = document.createElement("canvas");
      const ctx = composed.getContext("2d");
      if (!ctx) return;

      ctx.font = `600 24px ${fontFamily}, sans-serif`;
      ctx.textBaseline = "alphabetic";
      const nameWidth = ctx.measureText(qrName).width;
      ctx.font = `700 32px ${fontFamily}, sans-serif`;
      const amountWidth = ctx.measureText(amountLabel).width;

      const textWidth = Math.max(nameWidth, amountWidth);
      const contentWidth = Math.max(qr.width, textWidth);
      const totalHeight = padding * 2 + 24 + textGap + 32 + qrToTextGap + qr.height;
      composed.width = contentWidth + padding * 2;
      composed.height = totalHeight;

      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, composed.width, composed.height);

      ctx.textAlign = "center";
      ctx.fillStyle = "#12151C";
      ctx.font = `600 24px ${fontFamily}, sans-serif`;
      ctx.fillText(qrName, composed.width / 2, padding + 24);
      ctx.font = `700 32px ${fontFamily}, sans-serif`;
      ctx.fillText(amountLabel, composed.width / 2, padding + 24 + textGap + 32);

      ctx.drawImage(qr, (composed.width - qr.width) / 2, padding + 24 + textGap + 32 + qrToTextGap);

      source = composed;
    }

    const url = source.toDataURL("image/png");
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
