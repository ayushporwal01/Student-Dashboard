import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AlertCircle,
  ArrowLeft
} from "lucide-react";

export function HowItWorksPage({ onBack }) {

  return (
    <div className="space-y-6 route-page">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Scanner
        </Button>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2 montserrat-font">
          How It Works
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* How It Works Steps */}
        <Card className="glass-card border-white/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Attendance Process
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Connect to BLE Beacon</h3>
                  <p className="text-sm text-muted-foreground">
                    Click the 'Connect to BLE Beacon' button to begin searching for nearby BLE beacons. 
                    Make sure your device's Bluetooth is enabled and you're in a classroom with a BLE beacon.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Device Selection</h3>
                  <p className="text-sm text-muted-foreground">
                    Your browser will show a list of available BLE devices. Select the classroom beacon 
                    from the list to establish a connection.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Automatic Connection</h3>
                  <p className="text-sm text-muted-foreground">
                    Connection will be established automatically after selecting a beacon. 
                    The system will verify the beacon's authenticity and establish a secure connection.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">4</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Attendance Marked</h3>
                  <p className="text-sm text-muted-foreground">
                    Attendance will be marked automatically after successful BLE connection. 
                    You'll see a confirmation message and your attendance percentage will update.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}