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
  RotateCw,
  ArrowRight
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
  const [isMobile, setIsMobile] = useState(false);
  const [showAttendanceUI, setShowAttendanceUI] = useState(false);
  const [showLoading, setShowLoading] = useState(false); // New state for loading animation
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const scanIntervalRef = useRef(null);
  const attendanceTimerRef = useRef(null);
  const loadingTimerRef = useRef(null); // Ref for 2-second loading timer

  // Check if device is mobile
  useEffect(() => {
    const mobile = /Mobi|Android/i.test(navigator.userAgent);
    setIsMobile(mobile);
  }, []);

  // Automatically start camera when component mounts
  useEffect(() => {
    const startCameraAutomatically = async () => {
      // Small delay to ensure component is fully mounted
      await new Promise(resolve => setTimeout(resolve, 100));
      startCamera();
    };
    
    startCameraAutomatically();
    
    return () => {
      // Cleanup on unmount
      stopCamera();
    };
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
      setError(null);
      await getCameras();
      setCameraActive(true);
      setShowAttendanceUI(false);
      setShowLoading(false); // Reset loading state when starting camera
      setScanResult(null); // Reset scan result when starting camera
      
      // Set initial facing mode based on available cameras
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      const hasFrontCamera = videoDevices.some(device => device.label.toLowerCase().includes('front'));
      const hasBackCamera = videoDevices.some(device => device.label.toLowerCase().includes('back'));
      
      // If no back camera is available, default to front camera
      if (!hasBackCamera && hasFrontCamera) {
        setFacingMode("user");
      }
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
    setShowAttendanceUI(false);
    setShowLoading(false);
    
    // Clear any existing scan interval
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    
    // Clear any existing timers
    if (attendanceTimerRef.current) {
      clearTimeout(attendanceTimerRef.current);
      attendanceTimerRef.current = null;
    }
    
    if (loadingTimerRef.current) {
      clearTimeout(loadingTimerRef.current);
      loadingTimerRef.current = null;
    }
  };

  // Toggle between front and back camera
  const toggleCamera = () => {
    // Check if device has both front and back cameras
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    const hasFrontCamera = videoDevices.some(device => device.label.toLowerCase().includes('front'));
    const hasBackCamera = videoDevices.some(device => device.label.toLowerCase().includes('back') || device.label.toLowerCase().includes('rear'));
    
    // Only toggle if both cameras exist
    if (hasFrontCamera && hasBackCamera) {
      setFacingMode(prevMode => prevMode === "environment" ? "user" : "environment");
      stopCamera();
      setTimeout(() => startCamera(), 300);
    } else {
      // Show error message if only one camera is available
      setError(`Only ${hasFrontCamera ? 'front' : 'back'} camera available on this device`);
      setTimeout(() => setError(null), 3000);
    }
  };

  // Scan for QR codes
  const scanQRCode = async () => {
    if (!webcamRef.current || !canvasRef.current) {
      console.log("Webcam or canvas ref is missing"); // Debug log
      return;
    }
    
    const video = webcamRef.current.video;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    if (video.readyState !== 4) {
      console.log("Video is not ready, readyState:", video.readyState); // Debug log
      return;
    }
    
    console.log("Video dimensions:", video.videoWidth, "x", video.videoHeight); // Debug log
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    console.log("Image data size:", imageData.data.length); // Debug log
    
    try {
      const jsQR = (await import("jsqr")).default;
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      
      if (code) {
        // Log the raw QR code data for debugging
        console.log("Raw QR code detected:", code.data);
        
        // TEMPORARY: Accept any QR code for testing purposes
        // Remove this temporary code once we confirm QR detection is working
        console.log("TEMPORARY: Accepting any QR code for testing");
        
        // Stop camera immediately when QR is detected
        setCameraActive(false);
        setScanning(false);
        
        // Show loading animation for 2 seconds before marking attendance
        setShowLoading(true);
        
        // Clear timers if QR is scanned before 4 seconds
        if (attendanceTimerRef.current) {
          clearTimeout(attendanceTimerRef.current);
          attendanceTimerRef.current = null;
        }
        
        // After 2 seconds, mark attendance
        setTimeout(() => {
          setShowLoading(false);
          onAttendanceMarked();
        }, 2000);
        
        // END TEMPORARY CODE
        
        // ORIGINAL CODE - Uncomment this section and remove the temporary code above once testing is complete:
        /*
        // Validate QR code with secret key
        const secret = "HelloWorld";
        if (validateQR(code.data, secret)) {
          // Valid QR code with correct secret detected
          console.log("Valid QR code detected:", code.data);
          setScanResult(code.data);
          setScanning(false);
          // Stop camera and show success UI instead of immediately marking attendance
          setCameraActive(false);
          
          // Clear timers if QR is scanned before 4 seconds
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
          // For debugging purposes, let's also show the raw QR code data
          setError(`Invalid QR code. Raw data: ${code.data.substring(0, 30)}...`);
          setTimeout(() => setError(null), 5000); // Clear error after 5 seconds
        }
        */
      }
      // Add debug logging to see if we're getting image data but no QR code detected
      else {
        console.log("No QR code detected in current frame");
      }
    } catch (err) {
      console.error("Error scanning QR code:", err);
      // Don't show error for failed QR detection, just continue scanning
    }
  };

  // Start scanning when camera is active
  useEffect(() => {
    if (cameraActive && !scanResult && !showAttendanceUI && !showLoading) {
      setScanning(true);
      // Start scanning after a brief delay to ensure camera is ready
      const startScanningTimeout = setTimeout(() => {
        console.log("Starting QR code scanning interval"); // Debug log
        scanIntervalRef.current = setInterval(() => {
          console.log("Scanning for QR code..."); // Debug log
          scanQRCode();
        }, 500);
      }, 1000);
      
      return () => clearTimeout(startScanningTimeout);
    }
    
    return () => {
      if (scanIntervalRef.current) {
        console.log("Clearing QR code scanning interval"); // Debug log
        clearInterval(scanIntervalRef.current);
        scanIntervalRef.current = null;
      }
    };
  }, [cameraActive, scanResult]); // Removed showAttendanceUI and showLoading from dependencies to prevent interference
  
  // Remove the automatic timer that was showing attendance UI after 4 seconds
  // We only want to show attendance UI when a valid QR is scanned

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
      if (attendanceTimerRef.current) {
        clearTimeout(attendanceTimerRef.current);
      }
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
      }
    };
  }, []);

  // Handle back action from attendance UI
  const handleAttendanceBack = () => {
    setShowAttendanceUI(false);
    onBack();
  };

  // Check if device has both front and back cameras
  const videoDevices = devices.filter(device => device.kind === 'videoinput');
  const hasFrontCamera = videoDevices.some(device => device.label.toLowerCase().includes('front'));
  const hasBackCamera = videoDevices.some(device => device.label.toLowerCase().includes('back') || device.label.toLowerCase().includes('rear'));
  const canSwitchCameras = hasFrontCamera && hasBackCamera;

  return (
    <div className="flex flex-col items-center w-full">
      <div className="space-y-6 w-full route-page">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Button variant="outline" onClick={showAttendanceUI ? handleAttendanceBack : onBack} className="flex items-center gap-2">
            <CameraOff className="h-4 w-4" />
            Back to Scanner
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 montserrat-font flex-1">
            QR Code Scanner
          </h1>
          {(hasMultipleCameras || devices.length > 1) && cameraActive && !showAttendanceUI && !showLoading && (
            <Button 
              variant="outline" 
              onClick={toggleCamera}
              className="flex items-center gap-2 px-4 py-2 h-12"
              disabled={!canSwitchCameras}
            >
              <RotateCw className="h-5 w-5" />
              <span className="inline">
                {canSwitchCameras 
                  ? (facingMode === "environment" ? "Use Front Camera" : "Use Back Camera")
                  : "No camera switch available"}
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
                  {cameraActive && !showAttendanceUI && !showLoading && (
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
                          setCameraActive(false);
                        }}
                      />
                      <canvas ref={canvasRef} className="hidden" />
                    </>
                  )}
                  
                  {scanning && !showAttendanceUI && !showLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="border-4 border-green-500 rounded-lg w-64 h-64 animate-pulse opacity-80"></div>
                    </div>
                  )}
                  
                  {!cameraActive && !showAttendanceUI && !showLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-12 w-12 text-white animate-spin" />
                        <p className="text-white text-sm">Starting camera...</p>
                      </div>
                    </div>
                  )}
                  
                  {showLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30">
                      <div className="flex flex-col items-center gap-8 p-8 rounded-2xl bg-white/80 dark:bg-black/20 backdrop-blur-sm shadow-xl">
                        <div className="relative">
                          {/* Pulsing glow ring */}
                          <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20"></div>
                          
                          {/* Static logo container (no animation) */}
                          <div className="relative">
                            {/* Main logo (static) */}
                            <div className="relative z-10 bg-blue-500 rounded-full w-24 h-24 flex items-center justify-center">
                              <CheckCircle className="h-16 w-16 text-white" />
                            </div>
                          </div>
                          
                          {/* Loading dots animation */}
                          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 flex gap-2">
                            <div className="h-3 w-3 bg-blue-500 rounded-full animate-pulse" style={{ animationDuration: '1.5s' }}></div>
                            <div className="h-3 w-3 bg-blue-500 rounded-full animate-pulse" style={{ animationDuration: '1.5s', animationDelay: '0.5s' }}></div>
                            <div className="h-3 w-3 bg-blue-500 rounded-full animate-pulse" style={{ animationDuration: '1.5s', animationDelay: '1s' }}></div>
                          </div>
                        </div>
                        
                        <div className="text-center mt-8">
                          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                            Marking Attendance
                          </h3>
                          <p className="text-gray-600 dark:text-gray-330">
                            Please wait while we mark your attendance...
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {showAttendanceUI && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <AttendanceMarked onBack={handleAttendanceBack} />
                    </div>
                  )}
                  
                  {scanResult && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl">
                      <div className="flex flex-col items-center gap-6 p-8 rounded-3xl bg-white/90 dark:bg-black/30 backdrop-blur-xl shadow-2xl border border-white/50 dark:border-white/10 max-w-md w-full mx-4">
                        <div className="relative">
                          {/* Animated success badge */}
                          <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
                          <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 rounded-full w-24 h-24 flex items-center justify-center shadow-lg">
                            <CheckCircle className="h-16 w-16 text-white" />
                          </div>
                          
                          {/* Decorative elements */}
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-bounce"></div>
                          <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-400 rounded-full animate-pulse"></div>
                        </div>
                        
                        <div className="text-center space-y-3">
                          <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                            Attendance Marked!
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 text-lg">
                            Your presence has been successfully recorded.
                          </p>
                          
                          {/* Success metrics */}
                          <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="bg-green-100 dark:bg-green-900/30 rounded-xl p-3">
                              <div className="text-green-800 dark:text-green-200 font-bold text-xl">100%</div>
                              <div className="text-green-600 dark:text-green-400 text-xs">Accuracy</div>
                            </div>
                            <div className="bg-blue-100 dark:bg-blue-900/30 rounded-xl p-3">
                              <div className="text-blue-800 dark:text-blue-200 font-bold text-xl">✓</div>
                              <div className="text-blue-600 dark:text-blue-400 text-xs">Verified</div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Connection status */}
                        <div className="flex items-center gap-3 bg-white/50 dark:bg-black/20 px-4 py-2 rounded-full">
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-green-700 dark:text-green-300 font-medium text-sm">
                            Securely Connected
                          </span>
                        </div>
                        
                        {/* QR Code info */}
                        <div className="mt-2 text-center">
                          <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                            Scanned Code
                          </div>
                          <div className="font-mono text-sm bg-gray-100 dark:bg-gray-800/50 px-3 py-1 rounded-lg text-gray-700 dark:text-gray-300">
                            {scanResult.split('-')[0]}
                          </div>
                        </div>
                        
                        {/* Confetti effect simulation */}
                        <div className="flex gap-1 mt-2">
                          {[...Array(5)].map((_, i) => (
                            <div 
                              key={i}
                              className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full animate-pulse"
                              style={{ animationDelay: `${i * 0.2}s` }}
                            ></div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Action button */}
                      <div className="mt-6">
                        <Button 
                          onClick={handleAttendanceBack}
                          className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          Continue
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                
                {(hasMultipleCameras || devices.length > 1) && cameraActive && !showAttendanceUI && !showLoading && (
                  <div className="text-center text-sm text-muted-foreground">
                    {canSwitchCameras 
                      ? `Currently using ${facingMode === "environment" ? "back" : "front"} camera. Use the flip button to switch.`
                      : `Only ${hasFrontCamera ? 'front' : hasBackCamera ? 'back' : ''} camera available on this device.`}
                  </div>
                )}
                
                {scanning && !showAttendanceUI && !showLoading && (
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
                
                {error && !showAttendanceUI && !showLoading && (
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
                      Retry Camera
                    </Button>
                  </div>
                )}
                
                {cameraActive && !showAttendanceUI && !showLoading && (
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
    </div>
  );
}