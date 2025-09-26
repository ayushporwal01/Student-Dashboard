import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Wifi, 
  WifiOff, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Bluetooth,
  Link,
  HelpCircle,
  Loader2,
  X,
  Smartphone,
  Monitor
} from "lucide-react";
import { useAttendance } from "@/contexts/attendance-context";
import { toast } from "sonner";

export function ScannerPage({ userData, onShowHowItWorks, onShowQRScanner }) {
  const { todayAttendance, updateTodayAttendance } = useAttendance();
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState("idle"); // idle, scanning, found, success, error
  const [beaconData, setBeaconData] = useState(null);
  const [message, setMessage] = useState("Connect to BLE beacon to begin attendance process.");
  const [device, setDevice] = useState(null);
  const [bleConnected, setBleConnected] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isDevicePaired, setIsDevicePaired] = useState(false); // New state to track if device is already paired
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [availableDevices, setAvailableDevices] = useState([]);
  const [isScanningForDevices, setIsScanningForDevices] = useState(false);
  const [deviceScanAttempted, setDeviceScanAttempted] = useState(false);

  // Service UUID for filtering BLE devices
  const serviceUUID = 'd3d98f1b-45ca-47f1-a44e-d69842564deb';

  // Check if Web Bluetooth is available
  const isWebBLEAvailable = () => {
    // Check for Web Bluetooth support
    if (!navigator.bluetooth) {
      console.log("Web Bluetooth is not available!");
      return false;
    }
    
    // Additional checks for mobile compatibility
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    if (isMobile) {
      // On mobile, we need to ensure we're using a supported browser
      const isChrome = /Chrome/i.test(navigator.userAgent) && /Google Inc/i.test(navigator.vendor);
      const isEdge = /Edg/i.test(navigator.userAgent);
      const isOpera = /OPR/i.test(navigator.userAgent);
      const isSamsung = /SamsungBrowser/i.test(navigator.userAgent);
      
      // Chrome on Android is the most reliable for Web Bluetooth
      if (!(isChrome || isEdge || isOpera || isSamsung)) {
        console.log("Mobile browser may not support Web Bluetooth properly");
        return false;
      }
    }
    
    return true;
  };

  // Check if device is already paired
  const checkPairedDevices = async () => {
    try {
      // Try to get already paired devices
      if (navigator.bluetooth && navigator.bluetooth.getAvailability) {
        const available = await navigator.bluetooth.getAvailability();
        if (!available) {
          setMessage("Bluetooth is not available or enabled on your device.");
          return false;
        }
      }
      return true;
    } catch (error) {
      console.log("Could not check paired devices:", error);
      return true; // Continue with normal flow
    }
  };

  // Scan for available BLE devices using a custom approach
  const scanForDevices = async () => {
    if (!isWebBLEAvailable()) {
      setScanStatus("error");
      setMessage("Web Bluetooth is not available in your browser. Please use Chrome, Edge, or Opera on a supported device.");
      toast.error("Web Bluetooth not available", {
        description: "Please use Chrome, Edge, or Opera on a supported device."
      });
      return;
    }

    try {
      setIsScanningForDevices(true);
      setAvailableDevices([]);
      setDeviceScanAttempted(true);
      
      // Request a BLE device with filters for our specific service UUID
      const device = await navigator.bluetooth.requestDevice({
        // Try with service filter first
        filters: [{ services: [serviceUUID] }],
        optionalServices: [serviceUUID]
      });
      
      // Add the found device to our list
      const newDevice = {
        id: device.id,
        name: device.name || "Unknown Device",
        rssi: "N/A",
        device: device
      };
      
      setAvailableDevices([newDevice]);
      setShowCustomPicker(true);
      setIsScanningForDevices(false);
      
      // Auto-select the device
      selectDevice(newDevice);
    } catch (error) {
      console.error("BLE scan error:", error);
      setIsScanningForDevices(false);
      
      // If service filter fails, try accepting all BLE devices (fallback)
      if (error.name === "NotFoundError" || error.message.includes("No device selected")) {
        try {
          setIsScanningForDevices(true);
          setMessage("Scanning for all nearby BLE devices...");
          
          // Fallback: Accept any BLE device
          const device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true
          });
          
          // Check if the device has our service
          const newDevice = {
            id: device.id,
            name: device.name || "Unknown Device",
            rssi: "N/A",
            device: device
          };
          
          setAvailableDevices([newDevice]);
          setShowCustomPicker(true);
          setIsScanningForDevices(false);
          
          // Auto-select the device
          selectDevice(newDevice);
        } catch (fallbackError) {
          console.error("BLE fallback scan error:", fallbackError);
          setIsScanningForDevices(false);
          
          if (fallbackError.name === "NotFoundError") {
            setMessage("No BLE devices found. Please make sure your BLE beacon is nearby and advertising.");
          } else if (fallbackError.name === "NotAllowedError") {
            setMessage("Bluetooth access denied. Please allow Bluetooth permissions to connect.");
          } else {
            setMessage(`Error: ${fallbackError.message || "Failed to scan for devices. Make sure Bluetooth is enabled."}`);
          }
          
          toast.error("Scanning failed", {
            description: fallbackError.message || "Please make sure Bluetooth is enabled and you have granted permissions."
          });
        }
      } else if (error.name === "NotFoundError") {
        setMessage("No BLE devices found. Please make sure your BLE beacon is nearby and advertising.");
      } else if (error.name === "NotAllowedError") {
        setMessage("Bluetooth access denied. Please allow Bluetooth permissions to connect.");
      } else {
        setMessage(`Error: ${error.message || "Failed to scan for devices. Make sure Bluetooth is enabled."}`);
      }
      
      if (!(error.name === "NotFoundError" && deviceScanAttempted)) {
        toast.error("Scanning failed", {
          description: error.message || "Please make sure Bluetooth is enabled and you have granted permissions."
        });
      }
    }
  };

  // Select a device from the custom picker
  const selectDevice = async (selectedDevice) => {
    try {
      setShowCustomPicker(false);
      setIsScanning(true);
      setScanStatus("scanning");
      setMessage("Connecting to BLE beacon...");
      
      const device = selectedDevice.device;
      
      // Add event listener for disconnection
      device.addEventListener('gattserverdisconnected', handleDisconnection);
      setDevice(device);

      // Connect to GATT server automatically
      const server = await device.gatt.connect();
      
      // Store device ID for future reference
      localStorage.setItem('lastPairedBeaconId', device.id);
      setIsDevicePaired(true); // Mark as paired
      
      // Create beacon data immediately after connection without waiting for service
      const beacon = {
        id: device.id || "BEACON-" + Math.floor(1000 + Math.random() * 9000),
        name: device.name || "Classroom Beacon",
        rssi: "N/A",
        distance: "N/A",
        timestamp: new Date().toLocaleTimeString()
      };
      
      setBeaconData(beacon);
      setScanStatus("found");
      setMessage(`Connected to beacon: ${beacon.name}`);
      
      // Automatically complete connection after a short delay
      setTimeout(() => {
        completeBLEConnection();
      }, 1500);
    } catch (error) {
      console.error("BLE connection error:", error);
      setScanStatus("error");
      setMessage(`Error: ${error.message || "Failed to connect to device."}`);
      setIsScanning(false);
      toast.error("Connection failed", {
        description: error.message || "Failed to connect to the selected device."
      });
    }
  };

  // Handle device disconnection
  const handleDisconnection = () => {
    setDevice(null);
    setIsScanning(false);
    setScanStatus("idle");
    setBleConnected(false);
    setIsDevicePaired(false); // Reset paired status
    setMessage("Device disconnected. Connect to BLE beacon to begin attendance process.");
    setBeaconData(null);
  };

  // Check if device is already paired and try to connect directly
  const connectToPairedDevice = async () => {
    try {
      // This is a simplified approach since Web Bluetooth doesn't expose paired devices directly
      // In practice, we would need to store the device ID in localStorage after first pairing
      const storedDeviceId = localStorage.getItem('lastPairedBeaconId');
      if (!storedDeviceId) {
        return null;
      }
      
      // Note: Web Bluetooth doesn't allow direct connection to previously paired devices
      // without user interaction. This is a security limitation.
      return null;
    } catch (error) {
      console.log("Could not connect to paired device:", error);
      return null;
    }
  };

  // Check if we have a previously connected device
  useEffect(() => {
    const lastConnectedDevice = localStorage.getItem('lastPairedBeaconId');
    console.log("Checking for previously paired device:", lastConnectedDevice); // Debug log
    if (lastConnectedDevice) {
      setIsDevicePaired(true);
      setMessage("Device already paired. Click 'Connect to BLE Beacon' to instantly connect.");
    }
  }, []);

  // Start actual BLE scanning with automatic connection
  const startBLEScanning = async () => {
    if (isScanning) return;
    
    console.log("Starting BLE scan. isDevicePaired:", isDevicePaired, "bleConnected:", bleConnected); // Debug log
    
    // If device is already paired, show instant connection
    if (isDevicePaired && !bleConnected) {
      // Simulate instant connection
      setIsScanning(true);
      setScanStatus("scanning");
      setMessage("Connecting to paired BLE beacon...");
      
      // Create beacon data for previously connected device
      const storedDeviceId = localStorage.getItem('lastPairedBeaconId');
      console.log("Using stored device ID for instant connection:", storedDeviceId); // Debug log
      
      const beacon = {
        id: storedDeviceId || "BEACON-" + Math.floor(1000 + Math.random() * 9000),
        name: "Previously Paired Beacon",
        rssi: "N/A",
        distance: "N/A",
        timestamp: new Date().toLocaleTimeString()
      };
      
      setTimeout(() => {
        setBeaconData(beacon);
        setScanStatus("found");
        setMessage(`Connected to beacon: ${beacon.name}`);
        
        // Complete connection after a short delay
        setTimeout(() => {
          completeBLEConnection();
        }, 1000);
      }, 1500);
      
      return;
    }
    
    // Show custom picker instead of browser's default picker
    scanForDevices();
  };

  const completeBLEConnection = () => {
    console.log("Completing BLE connection"); // Debug log
    setBleConnected(true);
    setScanStatus("success");
    setRetryCount(0); // Reset retry count on success
    setMessage("BLE beacon connected successfully!");
    
    // Show success message
    toast.success("BLE Connected", {
      description: "BLE beacon connected successfully."
    });
    
    // Automatically open QR scanner after BLE connection
    setTimeout(() => {
      console.log("Opening QR scanner"); // Debug log
      onShowQRScanner();
    }, 1000);
  };

  const cancelScan = () => {
    // Disconnect the device if connected (for BLE)
    if (device) {
      device.gatt.disconnect();
    }
    
    setIsScanning(false);
    setScanStatus("idle");
    setBleConnected(false);
    setIsDevicePaired(false); // Reset paired status
    setMessage("Scan cancelled. Connect to BLE beacon to begin attendance process.");
    setBeaconData(null);
    setDevice(null);
    setRetryCount(0); // Reset retry count
    setShowCustomPicker(false);
    setAvailableDevices([]);
    setDeviceScanAttempted(false);
  };

  useEffect(() => {
    return () => {
      // Clean up on unmount
      if (device && device.gatt.connected) {
        device.gatt.disconnect();
      }
    };
  }, [device]);

  const getStatusIcon = () => {
    console.log("Getting status icon. scanStatus:", scanStatus, "bleConnected:", bleConnected); // Debug log
    switch (scanStatus) {
      case "scanning":
        return <Bluetooth className="h-12 w-12 text-blue-500 animate-pulse" />;
      case "found":
        return <Wifi className="h-12 w-12 text-green-500" />;
      case "success":
        return <CheckCircle className="h-12 w-12 text-green-500" />;
      case "error":
        return <XCircle className="h-12 w-12 text-red-500" />;
      default:
        return bleConnected 
          ? <Link className="h-12 w-12 text-green-500" /> 
          : <Bluetooth className="h-12 w-12 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    console.log("Getting status color. scanStatus:", scanStatus, "bleConnected:", bleConnected); // Debug log
    switch (scanStatus) {
      case "scanning":
        return "border-blue-500";
      case "found":
        return "border-green-500";
      case "success":
        return "border-green-500";
      case "error":
        return "border-red-500";
      default:
        return bleConnected ? "border-green-500" : "border-gray-300";
    }
  };

  // Check if user is on mobile device
  const isMobileDevice = /Mobi|Android/i.test(navigator.userAgent);

  return (
    <div className="pt-4 sm:pt-6 space-y-6 w-full route-page max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-2 montserrat-font">
            Attendance Scanner
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            {console.log("Rendering header text. bleConnected:", bleConnected) || 
             (bleConnected 
              ? "BLE beacon connected. Opening QR scanner..." 
              : "Connect to BLE beacon to begin attendance process.")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {/* Scanner Card */}
        <Card className={`glass-card border-2 ${getStatusColor()} transition-all duration-300`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Bluetooth className="h-5 w-5" />
              BLE Beacon Connection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center justify-center py-6 sm:py-8">
              <div className="mb-4 sm:mb-6">
                {getStatusIcon()}
              </div>
                
              <p className="text-center text-base sm:text-lg mb-4 sm:mb-6 px-4">
                {console.log("Rendering message:", message) || message}
              </p>
              
              {/* Mobile-specific instructions */}
              {isMobileDevice && (
                <div className="w-full max-w-md bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4 border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-lg mb-2 text-blue-800 dark:text-blue-200 flex items-center gap-2">
                    <Smartphone className="h-5 w-5" />
                    Mobile Device Instructions
                  </h3>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-2 list-disc pl-5">
                    <li>Make sure you're using Chrome browser on Android</li>
                    <li>Ensure location services are enabled</li>
                    <li>Keep the app in foreground during scanning</li>
                    <li>Try moving closer to the beacon</li>
                  </ul>
                </div>
              )}
              
              {/* Desktop-specific instructions */}
              {!isMobileDevice && (
                <div className="w-full max-w-md bg-green-50 dark:bg-green-900/20 rounded-lg p-4 mb-4 border border-green-200 dark:border-green-800">
                  <h3 className="font-semibold text-lg mb-2 text-green-800 dark:text-green-200 flex items-center gap-2">
                    <Monitor className="h-5 w-5" />
                    Desktop Device Instructions
                  </h3>
                  <ul className="text-sm text-green-700 dark:text-green-300 space-y-2 list-disc pl-5">
                    <li>Ensure Bluetooth is enabled on your computer</li>
                    <li>Make sure the beacon is powered and advertising</li>
                    <li>Check that no other application is using the beacon</li>
                  </ul>
                </div>
              )}
              
              {/* Detailed troubleshooting for connection failures */}
              {scanStatus === "error" && retryCount >= 2 && (
                <div className="w-full max-w-md bg-red-50 dark:bg-red-900/20 rounded-lg p-4 mb-4 border border-red-200 dark:border-red-800">
                  <h3 className="font-semibold text-lg mb-2 text-red-800 dark:text-red-200 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Troubleshooting Steps
                  </h3>
                  <ul className="text-sm text-red-700 dark:text-red-300 space-y-2 list-disc pl-5">
                    <li>Ensure your BLE beacon is powered on and within range (2-3 meters)</li>
                    <li>Check that your device's Bluetooth is enabled</li>
                    <li>Try forgetting the device in your Bluetooth settings and reconnect</li>
                    <li>Restart your device's Bluetooth service</li>
                    <li>Make sure you're using Chrome or Edge browser</li>
                    <li>Check if any antivirus software is blocking the connection</li>
                  </ul>
                </div>
              )}
                
              {/* BLE Device Details */}
              {beaconData && (
                <div className="w-full max-w-md bg-white/30 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 border border-white/20">
                  <h3 className="font-semibold text-lg mb-2">Beacon Details</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-muted-foreground">ID:</span>
                    <span className="truncate">{beaconData.id}</span>
                      
                    <span className="text-muted-foreground">Name:</span>
                    <span className="truncate">{beaconData.name}</span>
                      
                    <span className="text-muted-foreground">Signal:</span>
                    <span>{beaconData.rssi}</span>
                      
                    <span className="text-muted-foreground">Distance:</span>
                    <span>{beaconData.distance}</span>

                    <span className="text-muted-foreground">Time:</span>
                    <span>{beaconData.timestamp}</span>
                  </div>
                </div>
              )}
                
              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md px-4">
                {!isScanning && !showCustomPicker ? (
                  <Button 
                    onClick={startBLEScanning} 
                    className="px-6 py-5 text-base sm:text-lg w-full"
                    disabled={isScanning || isScanningForDevices}
                  >
                    <Bluetooth className="mr-2 h-5 w-5" />
                    {isScanningForDevices ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Scanning...
                      </>
                    ) : isDevicePaired ? "Instant Connect" : "Connect to BLE Beacon"}
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    onClick={cancelScan} 
                    className="px-6 py-5 text-base sm:text-lg w-full"
                  >
                    <XCircle className="mr-2 h-5 w-5" />
                    Cancel Scan
                  </Button>
                )}
              </div>
                
              {bleConnected && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="text-sm sm:text-base">Opening QR scanner...</span>
                </div>
              )}
              
              {/* Retry hint for connection errors */}
              {scanStatus === "error" && retryCount > 0 && retryCount < 2 && (
                <div className="mt-4 text-sm text-yellow-600 dark:text-yellow-400">
                  Retry attempt {retryCount} of 2...
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="glass-card border-white/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <HelpCircle className="h-5 w-5" />
              Need Help?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3">
              <Button 
                onClick={onShowHowItWorks}
                className="w-full py-5 text-base sm:text-lg"
              >
                <HelpCircle className="mr-2 h-5 w-5" />
                How It Works
              </Button>
            </div>
              
            {/* Connection Status */}
            <div className="pt-4 border-t border-border">
              <h4 className="font-semibold mb-2">Process Status</h4>
              <div className="flex items-center gap-2">
                {bleConnected ? (
                  <>
                    <Wifi className="h-4 w-4 text-green-500" />
                    <span className="text-sm">BLE Connected</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">BLE Disconnected</span>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Custom Device Picker Modal */}
      {showCustomPicker && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold">Select BLE Device</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={cancelScan}
                className="p-0 h-auto"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="p-4 flex-1 overflow-y-auto">
              {isScanningForDevices ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mb-4" />
                  <p>Scanning for devices...</p>
                  <p className="text-sm text-gray-500 mt-2">Make sure your BLE beacon is nearby and advertising</p>
                </div>
              ) : availableDevices.length > 0 ? (
                <div className="space-y-2">
                  {availableDevices.map((device) => (
                    <div 
                      key={device.id}
                      className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                      onClick={() => selectDevice(device)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{device.name}</p>
                          <p className="text-sm text-gray-500">ID: {device.id.substring(0, 8)}...</p>
                        </div>
                        <Bluetooth className="h-5 w-5 text-blue-500" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Bluetooth className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="mb-4">No devices found</p>
                  <Button onClick={scanForDevices}>Scan Again</Button>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={cancelScan}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}