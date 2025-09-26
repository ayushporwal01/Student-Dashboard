import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAttendance } from "@/contexts/attendance-context";
import { AlertTriangle } from "lucide-react";

export function AttendanceProgress() {
  const { todayAttendance } = useAttendance();

  const student = {
    firstName: "Ayush",
    lastName: "Porwal",
    totalAttendance: todayAttendance,
    requiredAttendance: 75,
  };

  // Calculate how many classes needed to reach 75%
  const calculateClassesNeeded = (currentAttendance) => {
    // Assuming a typical semester has about 60 classes (15 weeks * 4 classes per week)
    const totalClasses = 60;
    const attendedClasses = Math.round((currentAttendance / 100) * totalClasses);
    const requiredClasses = Math.round((75 / 100) * totalClasses);
    
    // Calculate how many more classes needed
    const classesNeeded = Math.max(0, requiredClasses - attendedClasses);
    
    return classesNeeded;
  };

  const classesNeeded = calculateClassesNeeded(student.totalAttendance);
  const showAttendanceAlert = student.totalAttendance < student.requiredAttendance;

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-gray-900">
              Overall Attendance
            </h2>
            <span className="text-3xl font-bold text-gray-900">
              {student.totalAttendance.toFixed(1)}%
            </span>
          </div>

          <Progress value={student.totalAttendance} className="h-3" />

          <div className="flex justify-between text-base text-gray-600">
            <span>Current Progress</span>
            <span>Target: {student.requiredAttendance}%</span>
          </div>
          
          {showAttendanceAlert && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-700">
                <span className="font-medium">Action needed:</span> Attend approximately <strong>{classesNeeded} more classes</strong> to reach {student.requiredAttendance}% target.
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}