import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { AttendanceProgress } from "@/components/attendance-progress";
import { AttendanceCalendar } from "@/components/attendance-calendar";
import { AttendanceAnalytics } from "@/components/attendance-analytics";
import { WelcomeSection } from "@/components/welcome-section";
import { useAttendance } from "@/contexts/attendance-context";

export function DashboardPage({ onPageChange }) {
  const [selectedDate, setSelectedDate] = useState();
  const [selectedDateData, setSelectedDateData] = useState();
  const { todayAttendance } = useAttendance();
  
  // Refs for GSAP animations
  const containerRef = useRef(null);
  const progressRef = useRef(null);
  const calendarRef = useRef(null);
  const analyticsRef = useRef(null);

  // GSAP animations
  useEffect(() => {
    if (containerRef.current && progressRef.current && calendarRef.current && analyticsRef.current) {
      // Reset positions
      gsap.set([progressRef.current, calendarRef.current, analyticsRef.current], { opacity: 0, x: -100 });
      
      // Animate progress section
      gsap.to(progressRef.current, {
        opacity: 1,
        x: 0,
        duration: 0.5,
        ease: "power2.out"
      });
      
      // Animate calendar section with delay
      gsap.to(calendarRef.current, {
        opacity: 1,
        x: 0,
        duration: 0.5,
        delay: 0.1,
        ease: "power2.out"
      });
      
      // Animate analytics section with delay
      gsap.to(analyticsRef.current, {
        opacity: 1,
        x: 0,
        duration: 0.5,
        delay: 0.2,
        ease: "power2.out"
      });
    }
  }, []);

  const handleDateSelect = (date, data) => {
    setSelectedDate(date);
    setSelectedDateData(data);
  };

  return (
    <div 
      ref={containerRef}
      className="space-y-4 sm:space-y-6"
    >
      <div ref={progressRef}>
        <AttendanceProgress />
      </div>

      <div
        ref={calendarRef}
        className="grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4"
      >
        <div className="flex flex-col h-full">
          <AttendanceCalendar onDateSelect={handleDateSelect} />
        </div>
        <div className="flex flex-col h-full">
          <WelcomeSection
            selectedDate={selectedDate}
            selectedDateData={selectedDateData}
            showStatusOnly={true}
            todayAttendance={todayAttendance} // Pass today's attendance to welcome section
          />
        </div>
      </div>

      <div ref={analyticsRef}>
        <AttendanceAnalytics />
      </div>
    </div>
  );
}