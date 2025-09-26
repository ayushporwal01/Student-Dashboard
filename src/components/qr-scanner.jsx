import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Camera, 
  CameraOff, 
  CheckCircle, 
  XCircle,
  Loader2,
  Wifi,
  RotateCw
} from "lucide-react";
import Webcam from "react-webcam";
import { AttendanceMarked } from "@/components/attendance-marked";

export function QRScanner({ onAttendanceMarked, onBack }) {
  const [cameraActive, setCameraActive] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const [facingMode, setFacingMode] = useState("environment"); // "user" for front, "environment" for back
  const [devices, setDevices] = useState([]);
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);
  const [showCameraButton, setShowCameraButton] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showAttendanceUI, setShowAttendanceUI] = useState(false); // New state for 4-second attendance UI
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const scanIntervalRef = useRef(null);
  const attendanceTimerRef = useRef(null); // Ref for 4-second timer

  // Check if device is mobile
  useEffect(() => {
    const mobile = /Mobi|Android/i.test(navigator.userAgent);
    setIsMobile(mobile);
  }, []);

  // Get available camera devices
  const getCameras = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setDevices(videoDevices);
      setHasMultipleCameras(videoDevices.length > 1);
      return videoDevices;
    } catch (err) {
      console.error("Error getting camera devices:", err);
      // Assume multiple cameras are available on mobile devices
      setHasMultipleCameras(isMobile);
      return [];
    }
  };

  // Validate QR code with secret key
  const validateQR = (content, secret) => {
    if (!content.includes("-")) return false; // no delimiter → invalid

    const parts = content.split("-");
    if (parts.length !== 2) return false; // must be exactly 2 parts

    const qrSecret = parts[1].trim(); // remove extra spaces if any
    return qrSecret === secret;
  };

  // Start camera with explicit user interaction
  const startCamera = async () => {
    try {
      setShowCameraButton(false);
      setError(null);
      await getCameras();
      setCameraActive(true);
      setShowAttendanceUI(false); // Reset attendance UI when starting camera
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Failed to access camera. Please ensure you've granted camera permissions.");
      setShowCameraButton(true);
    }
  };

  // Stop camera
  const stopCamera = () => {
    setCameraActive(false);
    setScanning(false);
    setScanResult(null);
    setShowCameraButton(true);
    setShowAttendanceUI(false);
    
    // Clear any existing scan interval
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    
    // Clear any existing timer
    if (attendanceTimerRef.current) {
      clearTimeout(attendanceTimerRef.current);
      attendanceTimerRef.current = null;
    }
  };

  // Toggle between front and back camera
  const toggleCamera = () => {
    setFacingMode(prevMode => prevMode === "environment" ? "user" : "environment");
    stopCamera();
    setTimeout(() => startCamera(), 300);
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
        // Validate QR code with secret key
        const secret = "HelloWorld";
        if (validateQR(code.data, secret)) {
          // Valid QR code with correct secret detected
          console.log("Valid QR code detected:", code.data);
          setScanResult(code.data);
          setScanning(false);
          // Stop camera and show success UI instead of immediately marking attendance
          setCameraActive(false);
          
          // Clear timer if QR is scanned before 4 seconds
          if (attendanceTimerRef.current) {
            clearTimeout(attendanceTimerRef.current);
            attendanceTimerRef.current = null;
          }
          
          // Show success message for 2 seconds before marking attendance
          setTimeout(() => {
            onAttendanceMarked();
          }, 2000);
        } else {
          // Invalid QR code, continue scanning
          console.log("Invalid QR code detected:", code.data);
          setError("Invalid QR code. Please scan a valid attendance QR code.");
          setTimeout(() => setError(null), 3000); // Clear error after 3 seconds
        }
      }
    } catch (err) {
      console.error("Error scanning QR code:", err);
      // Don't show error for failed QR detection, just continue scanning
    }
  };

  // Start scanning when camera is active
  useEffect(() => {
    if (cameraActive && !scanResult && !showAttendanceUI) {
      setScanning(true);
      // Start scanning after a brief delay to ensure camera is ready
      const startScanningTimeout = setTimeout(() => {
        scanIntervalRef.current = setInterval(scanQRCode, 500);
      }, 1000);
      
      return () => clearTimeout(startScanningTimeout);
    }
    
    return () => {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
        scanIntervalRef.current = null;
      }
    };
  }, [cameraActive, scanResult, showAttendanceUI]);
  
  // Start 4-second timer when camera is active to show attendance UI
  useEffect(() => {
    if (cameraActive && !scanResult && !showAttendanceUI) {
      // Clear any existing timer
      if (attendanceTimerRef.current) {
        clearTimeout(attendanceTimerRef.current);
      }
      
      attendanceTimerRef.current = setTimeout(() => {
        // Stop scanning and camera
        setScanning(false);
        
        // Clear the scan interval to stop QR scanning
        if (scanIntervalRef.current) {
          clearInterval(scanIntervalRef.current);
          scanIntervalRef.current = null;
        }
        
        // Stop camera and show attendance UI instantly
        setCameraActive(false);
        setShowAttendanceUI(true);
      }, 4000);
    }
    
    return () => {
      if (attendanceTimerRef.current) {
        clearTimeout(attendanceTimerRef.current);
        attendanceTimerRef.current = null;
      }
    };
  }, [cameraActive, scanResult, showAttendanceUI, onAttendanceMarked]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
      if (attendanceTimerRef.current) {
        clearTimeout(attendanceTimerRef.current);
      }
    };
  }, []);

  // Handle back action from attendance UI
  const handleAttendanceBack = () => {
    setShowAttendanceUI(false);
    onBack();
  };

  return (
    <div className="space-y-6 route-page">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Button variant="outline" onClick={showAttendanceUI ? handleAttendanceBack : onBack} className="flex items-center gap-2">
          <CameraOff className="h-4 w-4" />
          Back to Scanner
        </Button>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 montserrat-font flex-1">
          QR Code Scanner
        </h1>
        {(hasMultipleCameras || devices.length > 1) && cameraActive && !showAttendanceUI && (
          <Button 
            variant="outline" 
            onClick={toggleCamera}
            className="flex items-center gap-2 px-4 py-2 h-12"
          >
            <RotateCw className="h-5 w-5" />
            <span className="inline">
              {facingMode === "environment" ? "Use Front Camera" : "Use Back Camera"}
            </span>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="glass-card border-white/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Scan QR Code for Attendance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-6">
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                {cameraActive && !showAttendanceUI && (
                  <>
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      videoConstraints={{ 
                        facingMode: facingMode,
                        width: { min: 640, ideal: 1280, max: 1920 },
                        height: { min: 480, ideal: 720, max: 1080 }
                      }}
                      className="w-full h-full object-cover"
                      onUserMedia={() => console.log("Camera started successfully")}
                      onUserMediaError={(error) => {
                        console.error("Camera error:", error);
                        setError(`Camera error: ${error.message || "Failed to access camera. Please check permissions."}`);
                        setShowCameraButton(true);
                        setCameraActive(false);
                      }}
                    />
                    <canvas ref={canvasRef} className="hidden" />
                  </>
                )}
                
                {scanning && !showAttendanceUI && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="border-4 border-green-500 rounded-lg w-64 h-64 animate-pulse opacity-80"></div>
                  </div>
                )}
                
                {!cameraActive && showCameraButton && !showAttendanceUI && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                    <Button 
                      onClick={startCamera}
                      className="px-8 py-4 text-lg"
                      size="lg"
                    >
                      <Camera className="mr-2 h-6 w-6" />
                      Start Camera to Scan QR
                    </Button>
                    <p className="text-sm text-gray-400 text-center px-4">
                      Point your camera at the attendance QR code to mark your presence
                    </p>
                  </div>
                )}
                
                {!cameraActive && !showCameraButton && !showAttendanceUI && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="h-12 w-12 text-white animate-spin" />
                      <p className="text-white text-sm">Starting camera...</p>
                    </div>
                  </div>
                )}
                
                {showAttendanceUI && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <AttendanceMarked onBack={handleAttendanceBack} />
                  </div>
                )}
                
                {scanResult && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center py-8 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="h-20 w-20 text-green-500 mb-4 animate-pulse" />
                    <h3 className="text-2xl font-bold mb-2 text-green-700 dark:text-green-300">
                      Attendance Marked Successfully!
                    </h3>
                    <p className="text-center text-green-600 dark:text-green-400 mb-4 px-4">
                      Your attendance has been recorded. You may now close this scanner.
                    </p>
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-800/30 px-3 py-1 rounded-full">
                      <Wifi className="h-4 w-4" />
                      <span className="text-sm font-medium">Verified & Connected</span>
                    </div>
                    <div className="mt-4 text-xs text-green-600 dark:text-green-500 font-mono bg-green-100 dark:bg-green-800/30 px-3 py-2 rounded">
                      QR: {scanResult.split('-')[0]}
                    </div>
                  </div>
                )}
              </div>
              
              {(hasMultipleCameras || devices.length > 1) && cameraActive && !showAttendanceUI && (
                <div className="text-center text-sm text-muted-foreground">
                  Currently using {facingMode === "environment" ? "back" : "front"} camera. Use the flip button to switch.
                </div>
              )}
              
              {scanning && !showAttendanceUI && (
                <div className="flex flex-col items-center justify-center gap-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                    <span className="text-blue-700 dark:text-blue-300 font-medium">Scanning for QR code...</span>
                  </div>
                  <p className="text-sm text-blue-600 dark:text-blue-400 text-center">
                    Hold your device steady and point the camera at the QR code
                  </p>
                </div>
              )}
              
              {error && !showAttendanceUI && (
                <div className="flex flex-col items-center justify-center py-6 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <XCircle className="h-16 w-16 text-red-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-red-700 dark:text-red-300">Error</h3>
                  <p className="text-center text-red-600 dark:text-red-400 mb-4 px-4">
                    {error}
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setError(null);
                      if (!cameraActive) {
                        startCamera();
                      }
                    }}
                    className="mt-2"
                  >
                    {cameraActive ? "Continue Scanning" : "Retry Camera"}
                  </Button>
                </div>
              )}
              
              {cameraActive && !showAttendanceUI && (
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
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}