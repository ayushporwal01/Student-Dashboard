import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function AttendanceCalendar({ onDateSelect }) {
  // Initialize calendar to current month/year
  const [currentDate, setCurrentDate] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState(null);

  const attendanceData = {
    // September 16, 2025 (Tuesday) - specific subjects
    "2025-09-16": {
      status: "partial",
      subjects: ["Computer Graphics", "Python", "MySQL", "Cloud Computing"],
      subjectDetails: [
        { name: "Computer Graphics", status: "absent", time: "09:30 AM - 10:30 AM" },
        { name: "Python", status: "present", time: "10:30 AM - 11:30 AM" },
        { name: "MySQL", status: "absent", time: "11:30 AM - 12:30 PM" },
        { name: "Cloud Computing", status: "present", time: "12:30 PM - 01:30 PM" },
      ],
    },
    // September 17, 2025 (Wednesday) - specific subjects
    "2025-09-17": {
      status: "scheduled",
      subjects: ["Computer Graphics", "MySQL", "Python", "Cloud Computing"],
      subjectDetails: [
        { name: "Computer Graphics", status: "scheduled", time: "09:30 AM - 10:30 AM" },
        { name: "MySQL", status: "scheduled", time: "10:30 AM - 11:30 AM" },
        { name: "Python", status: "scheduled", time: "11:30 AM - 12:30 PM" },
        { name: "Cloud Computing", status: "scheduled", time: "12:30 PM - 01:30 PM" },
      ],
    },
    // September 15, 2025 (Monday) - specific subjects
    "2025-09-15": {
      status: "partial",
      subjects: ["Web Designing", "Computer Graphics", "Python", "Cloud Computing"],
      subjectDetails: [
        { name: "Web Designing", status: "present", time: "09:30 AM - 10:30 AM" },
        { name: "Computer Graphics", status: "present", time: "10:30 AM - 11:30 AM" },
        { name: "Python", status: "absent", time: "11:30 AM - 12:30 PM" },
        { name: "Cloud Computing", status: "present", time: "12:30 PM - 01:30 PM" },
      ],
    },
    // September 18, 2025 (Thursday) - specific subjects
    "2025-09-18": {
      status: "partial",
      subjects: ["MySQL", "Cloud Computing", "Web Designing"],
      subjectDetails: [
        { name: "MySQL", status: "absent", time: "09:30 AM - 10:30 AM" },
        { name: "Cloud Computing", status: "present", time: "10:30 AM - 11:30 AM" },
        { name: "Web Designing", status: "absent", time: "11:30 AM - 12:30 PM" },
      ],
    },
    // September 19, 2025 (Friday) - specific subjects
    "2025-09-19": {
      status: "partial",
      subjects: ["Python", "Computer Graphics"],
      subjectDetails: [
        { name: "Python", status: "present", time: "09:30 AM - 10:30 AM" },
        { name: "Computer Graphics", status: "absent", time: "10:30 AM - 11:30 AM" },
      ],
    },
    // September 10, 2025 (Wednesday) - specific subjects
    "2025-09-10": {
      status: "partial",
      subjects: ["Web Designing", "Cloud Computing"],
      subjectDetails: [
        { name: "Web Designing", status: "present", time: "09:30 AM - 10:30 AM" },
        { name: "Cloud Computing", status: "absent", time: "10:30 AM - 11:30 AM" },
      ],
    },
    // Past attendance data with mix of present/absent
    "2025-01-13": {
      status: "partial",
      subjects: ["Computer Graphics", "Python", "Web Designing"],
      subjectDetails: [
        { name: "Computer Graphics", status: "present", time: "09:30 AM - 10:30 AM" },
        { name: "Python", status: "absent", time: "10:30 AM - 11:30 AM" },
        { name: "Cloud Computing", status: "present", time: "11:30 AM - 12:30 PM" },
        { name: "Web Designing", status: "absent", time: "12:30 PM - 01:30 PM" },
        { name: "MySQL", status: "present", time: "01:30 PM - 02:30 PM" },
      ],
    },
    "2025-01-12": {
      status: "partial",
      subjects: ["Computer Graphics", "Python", "Cloud Computing", "Web Designing", "MySQL"],
      subjectDetails: [
        { name: "Computer Graphics", status: "absent", time: "09:30 AM - 10:30 AM" },
        { name: "Python", status: "present", time: "10:30 AM - 11:30 AM" },
        { name: "Cloud Computing", status: "absent", time: "11:30 AM - 12:30 PM" },
        { name: "Web Designing", status: "present", time: "12:30 PM - 01:30 PM" },
        { name: "MySQL", status: "absent", time: "01:30 PM - 02:30 PM" },
      ],
    },
    "2025-01-11": {
      status: "partial",
      subjects: ["Computer Graphics", "Python", "Cloud Computing", "Web Designing", "MySQL"],
      subjectDetails: [
        { name: "Computer Graphics", status: "present", time: "09:30 AM - 10:30 AM" },
        { name: "Python", status: "absent", time: "10:30 AM - 11:30 AM" },
        { name: "Cloud Computing", status: "present", time: "11:30 AM - 12:30 PM" },
        { name: "Web Designing", status: "absent", time: "12:30 PM - 01:30 PM" },
        { name: "MySQL", status: "present", time: "01:30 PM - 02:30 PM" },
      ],
    },
    "2025-01-10": {
      status: "partial",
      subjects: ["Computer Graphics", "Cloud Computing"],
      subjectDetails: [
        { name: "Computer Graphics", status: "absent", time: "09:30 AM - 10:30 AM" },
        { name: "Python", status: "present", time: "10:30 AM - 11:30 AM" },
        { name: "Cloud Computing", status: "absent", time: "11:30 AM - 12:30 PM" },
        { name: "Web Designing", status: "present", time: "12:30 PM - 01:30 PM" },
        { name: "MySQL", status: "absent", time: "01:30 PM - 02:30 PM" },
      ],
    },
    "2025-01-09": { 
      status: "partial", 
      subjects: ["Computer Graphics", "Cloud Computing"],
      subjectDetails: [
        { name: "Computer Graphics", status: "present", time: "09:30 AM - 10:30 AM" },
        { name: "Cloud Computing", status: "absent", time: "10:30 AM - 11:30 AM" },
      ]
    },
  };

  const today = new Date();
  const isToday = (date) => {
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const getDateKey = (date) => {
    // Create date key in YYYY-MM-DD format without timezone conversion issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const hasAttendanceData = (date) => {
    return getDateKey(date) in attendanceData;
  };

  const getAttendanceStatus = (date) => {
    const data = attendanceData[getDateKey(date)];
    return data?.status || null;
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleDateClick = (day) => {
    // Create date directly to avoid timezone issues
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    
    setSelectedDate(clickedDate);

    const dateKey = getDateKey(clickedDate);
    const dateData = attendanceData[dateKey];
    onDateSelect?.(clickedDate, dateData);
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  
  // Always render 6 rows to maintain consistent height
  // const totalCells = firstDay + daysInMonth;
  // const rows = Math.ceil(totalCells / 7);

  return (
    <Card className="border border-gray-200 shadow-sm h-full flex flex-col">
      <CardHeader className="pb-3 pt-4 flex-shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Attendance Calendar
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateMonth("prev")}
              className="h-8 w-8 sm:h-9 sm:w-9 border border-gray-300"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <span className="text-base sm:text-lg font-semibold min-w-[100px] text-center text-gray-800">
              {currentDate.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateMonth("next")}
              className="h-8 w-8 sm:h-9 sm:w-9 border border-gray-300"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 px-3 flex-grow flex flex-col">
        <div className="grid grid-cols-7 gap-1 mt-2 mb-1 flex-shrink-0">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="p-1 text-center text-sm sm:text-base font-medium text-gray-600"
            >
              <span className="hidden sm:inline">{day}</span>
              <span className="sm:hidden">{day.charAt(0)}</span>
            </div>
          ))}
        </div>

        {/* Always render 6 rows to maintain consistent height */}
        <div className="grid grid-cols-7 gap-1 mb-1 flex-grow" style={{ minHeight: '250px' }}>
          {Array.from({ length: 6 }).map((_, weekIndex) => {
            const startIndex = weekIndex * 7;
            const weekDays = [];
            
            for (let i = 0; i < 7; i++) {
              const dayIndex = startIndex + i - firstDay;
              
              if (dayIndex < 0) {
                // Empty cell before the first day of the month
                weekDays.push(
                  <div key={`empty-${weekIndex}-${i}`} className="p-0" />
                );
              } else if (dayIndex >= daysInMonth) {
                // Empty cell after the last day of the month
                weekDays.push(
                  <div key={`empty-${weekIndex}-${i}`} className="p-0" />
                );
              } else {
                // Actual day cell
                const day = dayIndex + 1;
                const date = new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  day
                );
                const dateKey = getDateKey(date);
                const status = getAttendanceStatus(date);
                
                const finalStatus = status;
                const isFuture = date > today;
                const tomorrow = new Date(today);
                tomorrow.setDate(today.getDate() + 1);
                const isTomorrow = date.toDateString() === tomorrow.toDateString();
                
                // Calculate day after tomorrow (x+2) to explicitly block it
                const dayAfterTomorrow = new Date(today);
                dayAfterTomorrow.setDate(today.getDate() + 2);
                const isDayAfterTomorrow = date.toDateString() === dayAfterTomorrow.toDateString();
                
                const isWeekend = date.getDay() === 0 || date.getDay() === 6; // Sunday or Saturday
                
                // Updated access control:
                // - All past dates and all dates with attendance data are accessible
                // - After Sept 17, 2025 are blocked (except Sept 10 which we're adding)
                const hasData = hasAttendanceData(date);
                const isAccessiblePastDate = !isFuture || hasData;
                const isBlockedDate = date > new Date(2025, 8, 17) && dateKey !== "2025-09-10"; // After September 17, 2025 (but allow Sept 10)
                const isClickable = isAccessiblePastDate && !isBlockedDate;

                weekDays.push(
                  <Button
                    key={day}
                    variant="ghost"
                    className={cn(
                      "h-8 w-8 sm:h-10 sm:w-10 p-0 text-base sm:text-lg font-medium relative rounded-md focus:outline-none focus:ring-0 focus:ring-offset-0",
                      // Apply black box styling for Sept 16 only
                      dateKey === "2025-09-16" && "bg-gray-900 text-white", // BLACK background for Sept 16
                      dateKey === "2025-09-17" && "text-blue-600", // BLUE text for Sept 17
                      isWeekend && 
                        dateKey !== "2025-09-16" &&
                        dateKey !== "2025-09-17" &&
                        "bg-gray-100 text-gray-600",
                      finalStatus === "scheduled" &&
                        dateKey !== "2025-09-16" &&
                        dateKey !== "2025-09-17" &&
                        dateKey !== "2025-09-18" && 
                        dateKey !== "2025-09-19" &&
                        !isWeekend &&
                        "bg-blue-100 text-blue-800 border border-blue-200",
                      isFuture && !isClickable && "text-gray-400 cursor-not-allowed border-transparent",
                      isFuture && isClickable && 
                        dateKey !== "2025-09-17" && 
                        dateKey !== "2025-09-16" &&
                        dateKey !== "2025-09-18" && 
                        dateKey !== "2025-09-19" && 
                        !isWeekend && 
                        "text-blue-600",
                      isBlockedDate && "text-gray-400 cursor-not-allowed border-transparent",
                      // Show blue background for selected date with a strong blue box
                      isSelected(date) && "bg-blue-500 text-white border-2 border-blue-600 shadow-lg"
                    )}
                    onClick={() => {
                      if (isClickable && !isBlockedDate) {
                        handleDateClick(day);
                      }
                    }}
                    onTouchStart={(e) => {
                      // Prevent focus on touch devices
                      e.preventDefault();
                    }}
                    disabled={!isClickable || isBlockedDate}
                  >
                    {day}
                  </Button>
                );
              }
            }
            
            return weekDays;
          })}
        </div>
      </CardContent>
    </Card>
  );
}