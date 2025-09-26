import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, TrendingUp, TrendingDown, Calendar } from "lucide-react";

export function AttendanceAnalytics() {
  const [subjectData] = useState([
    { name: "Computer Graphics", attendance: 85, present: 17, absent: 3 },
    { name: "Python", attendance: 90, present: 18, absent: 2 },
    { name: "Cloud Computing", attendance: 70, present: 14, absent: 6 },
    { name: "Web Designing", attendance: 75, present: 15, absent: 5 },
    { name: "MySQL", attendance: 30, present: 6, absent: 14 },
  ]);

  const COLORS = ["#4b5563", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];
  
  const mostMissedSubject = subjectData.reduce((min, subject) => 
    subject.attendance < min.attendance ? subject : min, subjectData[0]
  );
  
  const monthlyTrend = 2.5;
  const attendanceStreak = 7;

  // AttendoMeter component
  const AttendoMeter = ({ subject, color, index }) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (subject.attendance / 100) * circumference;
    
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="relative w-32 h-32">
          {/* Background circle */
          }
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
            />
            {/* Progress circle - no animation */
            }
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth="8"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
            />
          </svg>
          {/* Percentage text in the center with attendance text restored */
          }
          <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
            <span className="text-xl font-bold text-gray-900 mb-1">
              {subject.attendance}%
            </span>
            <span className="text-xs text-gray-600 mt-1">
              Attendance
            </span>
          </div>
        </div>
        <div className="text-center">
          <p className="text-base font-medium text-gray-900 truncate w-full">
            {subject.name}
          </p>
          <p className="text-sm text-gray-600">
            {subject.present}P/{subject.absent}A
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      {/* Attendance Meter Section */
      }
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-gray-900">
            Attendance Meter
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {subjectData.map((subject, index) => (
              <AttendoMeter
                key={`attendometer-${subject.name}-${index}`}
                subject={subject}
                color={COLORS[index]}
                index={index}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analytics Cards */
      }
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-md flex-shrink-0">
                <Target className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-base text-gray-600">
                  Most Missed Subject
                </p>
                <p className="text-lg font-semibold text-gray-900 truncate">
                  {mostMissedSubject.name}
                </p>
                <p className="text-base text-red-600">
                  {mostMissedSubject.attendance}% attendance
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-md flex-shrink-0">
                {monthlyTrend > 0 ? (
                  <TrendingUp className="h-5 w-5 text-green-600" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-600" />
                )}
              </div>
              <div>
                <p className="text-base text-gray-600">
                  Monthly Trend
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {monthlyTrend > 0 ? "+" : ""}
                  {monthlyTrend}%
                </p>
                <p className="text-base text-green-600">
                  {monthlyTrend > 0 ? "Improved" : "Decreased"} from last month
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm sm:col-span-2 lg:col-span-1">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-md flex-shrink-0">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-base text-gray-600">
                  Attendance Streak
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {attendanceStreak} days
                </p>
                <p className="text-base text-blue-600">
                  Current streak
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}