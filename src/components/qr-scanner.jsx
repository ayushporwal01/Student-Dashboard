import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Camera, 
  CameraOff, 
  CheckCircle, 
  XCircle,
  Loader2,
  Wifi
} from "lucide-react";
import Webcam from "react-webcam";

export function QRScanner({ onAttendanceMarked, onBack }) {
  const [cameraActive, setCameraActive] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const scanIntervalRef = useRef(null);

  // Validate if QR code contains valid attendance data
  const isValidAttendanceQRCode = (data) => {
    // Check if data is a valid JSON string
    try {
      const parsedData = JSON.parse(data);
      
      // Check if it contains required attendance fields
      return parsedData && 
             typeof parsedData.subject === 'string' && 
             typeof parsedData.timestamp === 'string' && 
             typeof parsedData.location === 'string';
    } catch (e) {
      // If it's not JSON, check if it's a simple valid format
      // For example, a string with subject and timestamp separated by |
      return typeof data === 'string' && data.includes('|');
    }
  };

  // Start camera
  const startCamera = async () => {
    try {
      setCameraActive(true);
      setError(null);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Failed to access camera. Please ensure you've granted camera permissions.");
    }
  };

  // Stop camera
  const stopCamera = () => {
    setCameraActive(false);
    setScanning(false);
    setScanResult(null);
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
    }
  };

  // Scan for QR codes
  const scanQRCode = async () => {
    if (!webcamRef.current || !canvasRef.current) return;
    
    const video = webcamRef.current.video;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    if (video.readyState !== 4) return;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    try {
      const jsQR = (await import("jsqr")).default;
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      
      if (code) {
        // Validate QR code data before marking attendance
        // Check if the QR code contains valid attendance data
        if (isValidAttendanceQRCode(code.data)) {
          // Valid attendance QR code detected
          setScanResult(code.data);
          setScanning(false);
          stopCamera();
          
          // Mark attendance when valid QR code is detected
          setTimeout(() => {
            onAttendanceMarked();
          }, 1000);
        }
        // If QR code is not valid for attendance, continue scanning
      }
    } catch (err) {
      console.error("Error scanning QR code:", err);
      // Don't show error for failed QR detection, just continue scanning
    }
  };

  // Start scanning when camera is active
  useEffect(() => {
    if (cameraActive && !scanResult) {
      setScanning(true);
      // Start scanning immediately
      setTimeout(() => {
        scanIntervalRef.current = setInterval(scanQRCode, 500);
      }, 1000);
    }
    
    return () => {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
    };
  }, [cameraActive, scanResult]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
    };
  }, []);

  // Start camera automatically when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      startCamera();
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6 route-page">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <CameraOff className="h-4 w-4" />
          Back to Scanner
        </Button>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2 montserrat-font">
          QR Code Scanner
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="glass-card border-white/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Scan QR Code
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-6">
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                {cameraActive && (
                  <>
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      videoConstraints={{ facingMode: "environment" }}
                      className="w-full h-full object-cover"
                    />
                    <canvas ref={canvasRef} className="hidden" />
                  </>
                )}
                
                {scanning && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="border-4 border-green-500 rounded-lg w-64 h-64 animate-pulse"></div>
                  </div>
                )}
                
                {!cameraActive && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="h-12 w-12 text-white animate-spin" />
                  </div>
                )}
              </div>
              
              {scanning && (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Scanning for QR code... Point your camera at the QR code</span>
                </div>
              )}
              
              {scanResult && (
                <div className="flex flex-col items-center justify-center py-6">
                  <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Attendance Marked</h3>
                  <p className="text-center text-muted-foreground mb-4">
                    Your attendance has been successfully recorded.
                  </p>
                  <div className="flex items-center gap-2 text-green-500">
                    <Wifi className="h-5 w-5" />
                    <span>BLE Connected</span>
                  </div>
                </div>
              )}
              
              {error && (
                <div className="flex flex-col items-center justify-center py-6">
                  <XCircle className="h-16 w-16 text-red-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Error</h3>
                  <p className="text-center text-muted-foreground mb-4">
                    {error}
                  </p>
                </div>
              )}
              
              <div className="flex justify-center">
                <Button 
                  variant="outline" 
                  onClick={stopCamera}
                  className="px-8 py-6 text-lg"
                >
                  <CameraOff className="mr-2 h-5 w-5" />
                  Stop Camera
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}