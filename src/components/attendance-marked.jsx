import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CheckCircle,
  CameraOff,
  Award,
  Clock,
  Calendar,
  User,
  School,
  BookOpen,
  GraduationCap
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
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2 montserrat-font">
            Attendance Marked
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card className="glass-card border-white/30 overflow-hidden shadow-xl">
            <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Award className="h-6 w-6" />
                Attendance Confirmed
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="flex flex-col items-center justify-center py-6">
                {/* Enhanced animated success icon */}
                <div className="relative mb-6 animate-fade-in">
                  <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
                  <CheckCircle className="h-32 w-32 text-green-500 animate-scale-in relative z-10" />
                  <div className="absolute -top-2 -right-2 h-10 w-10 bg-green-500 rounded-full flex items-center justify-center animate-pop-in">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                </div>
                
                <h2 className="text-3xl font-bold text-center mb-3 text-gray-800 dark:text-white animate-fade-in-delayed">
                  Attendance Marked Successfully!
                </h2>
                
                <p className="text-center text-lg text-muted-foreground mb-8 max-w-md animate-fade-in-delayed-2">
                  Your attendance has been recorded via QR code scan. Thank you for attending class today!
                </p>
                
                {/* Enhanced attendance details card */}
                <div className="w-full max-w-md bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800/30 rounded-2xl p-6 mb-8 shadow-lg animate-fade-in-delayed-3">
                  <div className="space-y-5">
                    <div className="flex items-center gap-4 p-3 rounded-xl bg-white/50 dark:bg-white/10 hover:bg-white/70 transition-all duration-300">
                      <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-xl">
                        <User className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Student</p>
                        <p className="font-semibold text-lg">Ayush Porwal</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-3 rounded-xl bg-white/50 dark:bg-white/10 hover:bg-white/70 transition-all duration-300">
                      <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-xl">
                        <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="font-semibold text-lg">{now.toLocaleDateString('en-US', dateOptions)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-3 rounded-xl bg-white/50 dark:bg-white/10 hover:bg-white/70 transition-all duration-300">
                      <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-xl">
                        <Clock className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Time</p>
                        <p className="font-semibold text-lg">{now.toLocaleTimeString('en-US', timeOptions)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-3 rounded-xl bg-white/50 dark:bg-white/10 hover:bg-white/70 transition-all duration-300">
                      <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-xl">
                        <BookOpen className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Subject</p>
                        <p className="font-semibold text-lg">Programming In C</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-3 rounded-xl bg-white/50 dark:bg-white/10 hover:bg-white/70 transition-all duration-300">
                      <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-xl">
                        <GraduationCap className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Teacher</p>
                        <p className="font-semibold text-lg">Prof Sharma</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Enhanced completion message */}
                <div className="text-center animate-fade-in-delayed-4 w-full max-w-md">
                  <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded-full mb-4">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span className="font-semibold text-green-700 dark:text-green-300">
                      Attendance Successfully Recorded
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    You can now close this scanner and continue with your day
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}