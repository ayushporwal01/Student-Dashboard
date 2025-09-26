import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CheckCircle,
  CameraOff,
  Award,
  Clock,
  Calendar,
  User,
  School
} from "lucide-react";
import { motion } from "framer-motion";

export function AttendanceMarked({ onBack }) {
  // Get current date and time for display
  const now = new Date();
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
  
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
        <Card className="glass-card border-white/30 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Award className="h-6 w-6" />
              Attendance Confirmed
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="flex flex-col items-center justify-center py-8">
              {/* Animated success icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 260, 
                  damping: 20,
                  delay: 0.1
                }}
                className="relative"
              >
                <CheckCircle className="h-32 w-32 text-green-500" />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 260, 
                    damping: 20,
                    delay: 0.3
                  }}
                  className="absolute -top-2 -right-2 h-10 w-10 bg-green-500 rounded-full flex items-center justify-center"
                >
                  <CheckCircle className="h-6 w-6 text-white" />
                </motion.div>
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-3xl font-bold text-center mb-4 text-gray-800 dark:text-white"
              >
                Attendance Marked Successfully!
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center text-lg text-muted-foreground mb-8 max-w-md"
              >
                Your attendance has been recorded via QR code scan. Thank you for attending class today!
              </motion.p>
              
              {/* Attendance details card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="w-full max-w-md bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-200 dark:border-green-800/50 rounded-xl p-6 mb-8 shadow-lg"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 dark:bg-green-900/50 p-2 rounded-lg">
                      <User className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Student</p>
                      <p className="font-semibold">John Doe</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 dark:bg-green-900/50 p-2 rounded-lg">
                      <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-semibold">{now.toLocaleDateString('en-US', dateOptions)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 dark:bg-green-900/50 p-2 rounded-lg">
                      <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Time</p>
                      <p className="font-semibold">{now.toLocaleTimeString('en-US', timeOptions)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 dark:bg-green-900/50 p-2 rounded-lg">
                      <School className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Course</p>
                      <p className="font-semibold">Computer Science</p>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Completion message */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center"
              >
                <p className="text-lg font-semibold text-green-600 dark:text-green-400 mb-2">
                  ✓ Attendance Successfully Recorded
                </p>
                <p className="text-sm text-muted-foreground">
                  You can now close this scanner and continue with your day
                </p>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}