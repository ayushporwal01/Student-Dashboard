import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, CheckCircle, XCircle } from "lucide-react";
import { useAttendance } from "@/contexts/attendance-context";

export function WelcomeSection({ selectedDate, selectedDateData, showStatusOnly, todayAttendance }) {
  const { todayAttendance: contextTodayAttendance } = useAttendance();
  
  // Use the passed todayAttendance or fallback to context
  const currentAttendance = todayAttendance !== undefined ? todayAttendance : contextTodayAttendance;

  const student = {
    firstName: "Ayush",
    lastName: "Porwal",
    totalAttendance: currentAttendance,
    requiredAttendance: 75,
  };

  // Define subjects state
  const [subjects, setSubjects] = useState([
    { name: "Computer Graphics", time: "09:30 AM - 10:30 AM", status: "present" },
    { name: "Python", time: "10:30 AM - 11:30 AM", status: "present" },
    { name: "MySQL", time: "11:30 AM - 12:30 PM", status: "present" },
    { name: "Cloud Computing", time: "12:30 PM - 01:30 PM", status: "present" },
  ]);

  const [tomorrowSubjects] = useState([
    { name: "Web Designing", time: "09:30 AM - 10:30 AM", status: "scheduled" },
    { name: "Computer Graphics", time: "10:30 AM - 11:30 AM", status: "scheduled" },
    { name: "Python", time: "11:30 AM - 12:30 PM", status: "scheduled" },
    { name: "Cloud Computing", time: "12:30 PM - 01:30 PM", status: "scheduled" },
  ]);

  const classesNeeded = Math.ceil(
    (student.requiredAttendance - student.totalAttendance) * 4
  );

  const getDateText = () => {
    if (!selectedDate) return "Today's Status";

    const today = new Date();
    const diffTime = selectedDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today's Status";
    if (diffDays === -1) return "Yesterday's Status";
    if (diffDays === 1) return "Tomorrow's Status";
    if (diffDays < 0) {
      // For past dates, show actual date in "date monthname year" format
      return selectedDate.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }
    return `${diffDays} days later`;
  };

  const markAttendance = (index, status) => {
    setSubjects((prev) =>
      prev.map((subject, i) => (i === index ? { ...subject, status } : subject))
    );
  };

  if (showStatusOnly) {
    // Determine which subjects to show based on selected date
    const today = new Date();
    // Reset time part for accurate date comparison
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const selectedDateOnly = selectedDate && new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    
    // Calculate the difference in days
    const timeDiff = selectedDateOnly && selectedDateOnly.getTime() - todayDate.getTime();
    const dayDiff = timeDiff && Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    const isTomorrow = dayDiff === 1;
    const isToday = dayDiff === 0;
    const isYesterday = dayDiff === -1;
    
    // Check if selected date is weekend (Saturday = 6, Sunday = 0)
    const isWeekend = selectedDate && (selectedDate.getDay() === 0 || selectedDate.getDay() === 6);
    
    // If it's a weekend, show holiday message
    if (isWeekend) {
      const dayName = selectedDate.getDay() === 0 ? 'Sunday' : 'Saturday';
      return (
        <Card className="border border-gray-200 shadow-sm h-full">
          <CardContent className="p-4 sm:p-5 h-full flex flex-col">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
              {getDateText()}
            </h3>
            <div className="flex flex-col items-center justify-center flex-grow" style={{ minHeight: '250px' }}>
              <p className="text-sm sm:text-base text-gray-600 text-center">
                No classes scheduled today. Enjoy your weekend!
              </p>
            </div>
          </CardContent>
        </Card>
      );
    }
    
    let subjectsToShow;
    // Prioritize selectedDateData if available, otherwise use fallback logic
    if (selectedDateData?.subjectDetails && selectedDateData.subjectDetails.length > 0) {
      subjectsToShow = selectedDateData.subjectDetails;
    } else if (isTomorrow) {
      subjectsToShow = tomorrowSubjects;
    } else if (dayDiff > 0) {
      // Future dates show scheduled classes
      subjectsToShow = tomorrowSubjects;
    } else {
      // Today and past dates show actual attendance
      subjectsToShow = subjects;
    }

    return (
      <div className="space-y-3 h-full">
        <Card className="border border-gray-200 shadow-sm h-full flex flex-col">
          <CardContent className="p-4 sm:p-5 flex-grow flex flex-col">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
              {getDateText()}
            </h3>

            <div className="space-y-2 flex-grow" style={{ minHeight: '250px' }}>
              {subjectsToShow && subjectsToShow.length > 0 ? (
                subjectsToShow.map(
                  (subject, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border border-gray-200 gap-2"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium text-sm sm:text-base text-gray-900">
                          {subject.name}
                        </span>
                        {subject.time && (
                          <span className="text-xs sm:text-sm text-gray-600">
                            {subject.time}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        {subject.status === "present" ? (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-xs sm:text-sm text-green-700 font-medium">
                              Present
                            </span>
                          </div>
                        ) : subject.status === "scheduled" ? (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-blue-600" />
                            <span className="text-xs sm:text-sm text-blue-700 font-medium">
                              Scheduled
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <XCircle className="h-4 w-4 text-red-600" />
                            <span className="text-xs sm:text-sm text-red-700 font-medium">
                              Absent
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                )
              ) : (
                <div className="flex flex-col items-center justify-center flex-grow">
                  <p className="text-sm sm:text-base text-gray-600 text-center">
                    No classes scheduled for this date.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Card className="border border-gray-200 shadow-sm h-full">
      <CardContent className="p-4 sm:p-5 h-full flex flex-col">
        <div className="space-y-3 flex-grow" style={{ minHeight: '250px' }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">
              Overall Attendance
            </h2>
            <span className="text-2xl font-bold text-gray-900">
              {student.totalAttendance.toFixed(1)}%
            </span>
          </div>

          <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${student.totalAttendance}%` }}
            ></div>
          </div>

          <div className="flex justify-between text-xs sm:text-sm text-gray-600">
            <span>Current Progress</span>
            <span>Target: {student.requiredAttendance}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}