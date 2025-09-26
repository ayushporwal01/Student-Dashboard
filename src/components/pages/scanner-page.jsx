import { useState, useEffect } from "react";
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
  Loader2
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

  // Service UUID for filtering BLE devices
  const serviceUUID = 'd3d98f1b-45ca-47f1-a44e-d69842564deb';

  // Check if Web Bluetooth is available
  const isWebBLEAvailable = () => {
    if (!navigator.bluetooth) {
      console.log("Web Bluetooth is not available!");
      return false;
    }
    return true;
  };

  // Handle device disconnection
  const handleDisconnection = () => {
    setDevice(null);
    setIsScanning(false);
    setScanStatus("idle");
    setBleConnected(false);
    setMessage("Device disconnected. Connect to BLE beacon to begin attendance process.");
    setBeaconData(null);
  };

  // Start actual BLE scanning with automatic connection
  const startBLEScanning = async () => {
    if (isScanning) return;
    
    if (!isWebBLEAvailable()) {
      setScanStatus("error");
      setMessage("Web Bluetooth is not available in your browser. Please use Chrome or Edge on a supported device.");
      toast.error("Web Bluetooth not available", {
        description: "Please use Chrome or Edge on a supported device."
      });
      return;
    }

    try {
      setIsScanning(true);
      setScanStatus("scanning");
      setMessage("Scanning for nearby BLE beacons... Please ensure your device's Bluetooth is enabled.");
      setBeaconData(null);
      
      // Request a BLE device with filters for our specific service UUID
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: [serviceUUID] }],
        optionalServices: [serviceUUID]
      });

      // Add event listener for disconnection
      device.addEventListener('gattserverdisconnected', handleDisconnection);
      setDevice(device);

      // Connect to GATT server automatically
      setMessage("Connecting to BLE beacon...");
      const server = await device.gatt.connect();
      
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
      }, 1000);
    } catch (error) {
      console.error("BLE scan error:", error);
      setScanStatus("error");
      // Provide more specific error messages
      if (error.name === "NotFoundError") {
        setMessage("No BLE devices found. Please make sure your BLE beacon is nearby and advertising.");
      } else if (error.name === "NotAllowedError") {
        setMessage("Bluetooth access denied. Please allow Bluetooth permissions to connect.");
      } else {
        setMessage(`Error: ${error.message || "Failed to scan for devices. Make sure Bluetooth is enabled."}`);
      }
      setIsScanning(false);
      toast.error("Scanning failed", {
        description: error.message || "Please make sure Bluetooth is enabled and you have granted permissions."
      });
    }
  };

  const completeBLEConnection = () => {
    setBleConnected(true);
    setScanStatus("success");
    setMessage("BLE beacon connected successfully!");
    
    // Show success message
    toast.success("BLE Connected", {
      description: "BLE beacon connected successfully."
    });
    
    // Automatically open QR scanner after BLE connection
    setTimeout(() => {
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
    setMessage("Scan cancelled. Connect to BLE beacon to begin attendance process.");
    setBeaconData(null);
    setDevice(null);
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

  return (
    <div className="pt-4 sm:pt-6 space-y-6 route-page">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-2 montserrat-font">
            Attendance Scanner
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            {bleConnected 
              ? "BLE beacon connected. Opening QR scanner..." 
              : "Connect to BLE beacon to begin attendance process."}
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
                {message}
              </p>
              
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
                {!isScanning ? (
                  <Button 
                    onClick={startBLEScanning} 
                    className="px-6 py-5 text-base sm:text-lg w-full"
                    disabled={isScanning}
                  >
                    <Bluetooth className="mr-2 h-5 w-5" />
                    Connect to BLE Beacon
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
    </div>
  );
}