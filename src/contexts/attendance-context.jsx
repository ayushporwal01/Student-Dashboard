import { createContext, useContext, useState, useEffect } from "react";

const AttendanceContext = createContext();

export function AttendanceProvider({ children }) {
  const [todayAttendance, setTodayAttendance] = useState(69); // Set fixed initial value to 69%
  const [attendanceHistory, setAttendanceHistory] = useState([]);

  // Generate sample attendance data from enrollment date to current date
  const generateAttendanceHistory = () => {
    const data = [];
    // Assuming enrollment date is 6 months ago
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6);
    
    const endDate = new Date();
    const currentDate = new Date(startDate);
    
    // Generate data for each day
    while (currentDate <= endDate) {
      // Simulate varying attendance percentages
      const baseAttendance = 70;
      const variance = Math.random() * 30 - 15; // -15 to +15
      const attendance = Math.max(0, Math.min(100, baseAttendance + variance));
      
      data.push({
        date: currentDate.toISOString().split('T')[0],
        attendance: Math.round(attendance)
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return data;
  };

  // Generate today's attendance data
  const generateTodayAttendance = () => {
    // Set a fixed attendance percentage instead of generating with random variance
    const todayAttendance = 69; // Fixed value at 69%
    return Math.max(0, Math.min(100, todayAttendance));
  };

  // Initialize attendance data
  useEffect(() => {
    // Generate initial attendance history
    const history = generateAttendanceHistory();
    setAttendanceHistory(history);
    
    // Generate initial today's attendance
    const today = generateTodayAttendance();
    setTodayAttendance(today);
    
    // Update today's attendance in the history
    if (history.length > 0) {
      const updatedHistory = [...history];
      updatedHistory[updatedHistory.length - 1] = {
        date: new Date().toISOString().split('T')[0],
        attendance: today
      };
      setAttendanceHistory(updatedHistory);
    }
  }, []);

  // Function to update today's attendance (would be called when data changes)
  const updateTodayAttendance = (newAttendance) => {
    const clampedAttendance = Math.max(0, Math.min(100, newAttendance));
    setTodayAttendance(clampedAttendance);
    
    // Update today's attendance in the history
    if (attendanceHistory.length > 0) {
      const updatedHistory = [...attendanceHistory];
      updatedHistory[updatedHistory.length - 1] = {
        date: new Date().toISOString().split('T')[0],
        attendance: clampedAttendance
      };
      setAttendanceHistory(updatedHistory);
    }
  };

  return (
    <AttendanceContext.Provider value={{
      todayAttendance,
      attendanceHistory,
      updateTodayAttendance
    }}>
      {children}
    </AttendanceContext.Provider>
  );
}

export function useAttendance() {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error("useAttendance must be used within an AttendanceProvider");
  }
  return context;
}