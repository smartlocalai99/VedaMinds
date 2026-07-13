import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";

export default function QRCodeScanner({ onScanSuccess }) {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      false
    );

    scanner.render(
      (decodedText) => {
        scanner.clear();
        onScanSuccess(decodedText);
      },
      () => {
        // Ignore scan errors
      }
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [onScanSuccess]);

  return <div id="reader"></div>;
}