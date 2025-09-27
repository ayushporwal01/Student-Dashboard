import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CheckCircle,
  CameraOff
} from "lucide-react";

export function AttendanceMarked({ onBack }) {
  // Get current date and time for display
  const now = new Date();
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
  
  return (
    <div className="flex flex-col items-center w-full">
      <div className="space-y-6 w-full route-page">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            <CameraOff className="h-4 w-4" />
            Back to Scanner
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card className="border-white/30 overflow-hidden shadow">
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center">
                {/* Animated Success Icon */}
                <div className="mt-8 relative">
                  {/* Pulsing glow ring */}
                  <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
                  
                  {/* Static logo container */}
                  <div className="relative">
                    {/* Main logo - original size and color */}
                    <div className="relative z-10 w-16 h-16 flex items-center justify-center rounded-full bg-green-100 text-green-600">
                      <CheckCircle className="w-10 h-10" />
                    </div>
                  </div>
                </div>

                {/* Attendance Confirmed Text - Ensuring visibility */}
                <h3 className="text-2xl font-bold text-black mt-8 mb-4 text-center z-0">
                  Attendance Confirmed
                </h3>

                {/* Subtext */}
                <p className="mt-1 text-gray-600 text-center max-w-md">
                  Your attendance has been recorded via QR code scan.
                  <br />
                  Thank you for attending class today!
                </p>

                {/* Details Card */}
                <div className="mt-8 w-full max-w-md bg-white shadow rounded-2xl p-4 space-y-3">
                  <div className="bg-gray-800 text-white p-3 rounded-lg">
                    <p className="text-sm opacity-80">Student Name</p>
                    <p className="font-medium">Ayush Porwal</p>
                  </div>

                  <div className="bg-gray-800 text-white p-3 rounded-lg">
                    <p className="text-sm opacity-80">Date</p>
                    <p className="font-medium">{now.toLocaleDateString('en-US', dateOptions)}</p>
                  </div>

                  <div className="bg-gray-800 text-white p-3 rounded-lg">
                    <p className="text-sm opacity-80">Time</p>
                    <p className="font-medium">{now.toLocaleTimeString('en-US', timeOptions)}</p>
                  </div>

                  <div className="bg-gray-800 text-white p-3 rounded-lg">
                    <p className="text-sm opacity-80">Subject</p>
                    <p className="font-medium">Programming in C</p>
                  </div>

                  <div className="bg-gray-800 text-white p-3 rounded-lg">
                    <p className="text-sm opacity-80">Teacher Name</p>
                    <p className="font-medium">Prof Sharma</p>
                  </div>
                </div>

                {/* Closing Note */}
                <p className="mt-4 text-gray-500 text-sm text-center">
                  You can now close this scanner and continue with your day
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}