import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CheckCircle,
  CameraOff,
  Award
} from "lucide-react";

export function AttendanceMarked({ onBack }) {
  return (
    <div className="space-y-6 route-page">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <CameraOff className="h-4 w-4" />
          Back to Scanner
        </Button>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2 montserrat-font">
          Attendance Marked
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="glass-card border-white/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Success
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center justify-center py-12">
              <CheckCircle className="h-24 w-24 text-green-500 mb-6" />
              <h2 className="text-2xl font-bold text-center mb-4">Attendance Marked Successfully!</h2>
              <p className="text-center text-lg text-muted-foreground mb-6 max-w-md">
                Your attendance has been recorded via QR code scan. Thank you for attending class today!
              </p>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6">
                <p className="text-center font-semibold text-green-500">
                  Attendance recorded at {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}