import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { BrowserMultiFormatReader } from "@zxing/browser";

export default function VendorScan() {
  const videoRef = useRef(null);
  const router = useRouter();
  const [vendorId, setVendorId] = useState("");

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();

    let controls;

    async function loadVendor() {

  const token = localStorage.getItem("token");

  const response = await fetch("/api/vendors/dashboard", {

    headers: {
      Authorization: `Bearer ${token}`,
    },

  });

  const data = await response.json();

  if (data.success) {
    return data.vendor.id;
  }

  return null;

}

    async function startScanner(vendorId) {
      try {
        const devices =
          await BrowserMultiFormatReader.listVideoInputDevices();

        if (devices.length === 0) {
          alert("No camera found");
          return;
        }

        controls = await codeReader.decodeFromVideoDevice(
          devices[0].deviceId,
          videoRef.current,
          (result, error) => {
            if (result) {
              const value = result.getText();

              console.log("QR:", value);

              // Stop scanning
              controls.stop();

              // Open membership page with vendorId
              router.push(`${value}?vendorId=${vendorId}`);
            }
          }
        );
      } catch (err) {
        console.error(err);
      }
    }

    async function init() {
  await loadVendor();
  startScanner();
}

init();

    return () => {
      if (controls) {
        controls.stop();
      }
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">

      <h1 className="text-4xl font-bold mb-8">
        Vendor QR Scanner
      </h1>

      <video
        ref={videoRef}
        className="w-[500px] rounded-xl border-4 border-green-600"
      />

      <p className="mt-5">
        Point the camera at the Membership QR Code
      </p>

    </div>
  );
}