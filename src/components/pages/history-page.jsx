import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

export function HistoryPage() {
  // Initial attendance data
  const initialAttendanceData = [
    {
      id: 1,
      date: "15 Mar",
      day: "Friday",
      subject: "Computer Graphics",
      status: "present",
      time: "09:15 AM",
      subjectValue: "computer-graphics",
      monthValue: "march2024"
    },
    {
      id: 2,
      date: "14 Mar",
      day: "Thursday",
      subject: "Python Programming",
      status: "present",
      time: "09:08 AM",
      subjectValue: "python-programming",
      monthValue: "march2024"
    },
    {
      id: 3,
      date: "13 Mar",
      day: "Wednesday",
      subject: "MySQL",
      status: "absent",
      time: "-",
      subjectValue: "mysql",
      monthValue: "march2024"
    },
    {
      id: 4,
      date: "12 Mar",
      day: "Tuesday",
      subject: "Cloud Computing",
      status: "present",
      time: "09:12 AM",
      subjectValue: "cloud-computing",
      monthValue: "march2024"
    },
    {
      id: 5,
      date: "11 Mar",
      day: "Monday",
      subject: "English",
      status: "absent",
      time: "-",
      subjectValue: "english",
      monthValue: "march2024"
    },
    {
      id: 6,
      date: "08 Mar",
      day: "Friday",
      subject: "Computer Graphics",
      status: "present",
      time: "09:05 AM",
      subjectValue: "computer-graphics",
      monthValue: "march2024"
    },
    {
      id: 7,
      date: "07 Mar",
      day: "Thursday",
      subject: "Python Programming",
      status: "present",
      time: "09:18 AM",
      subjectValue: "python-programming",
      monthValue: "march2024"
    },
    {
      id: 8,
      date: "06 Mar",
      day: "Wednesday",
      subject: "MySQL",
      status: "present",
      time: "09:10 AM",
      subjectValue: "mysql",
      monthValue: "march2024"
    },
    {
      id: 9,
      date: "05 Mar",
      day: "Tuesday",
      subject: "Web Technology",
      status: "present",
      time: "09:03 AM",
      subjectValue: "web-technology",
      monthValue: "march2024"
    },
    {
      id: 10,
      date: "04 Mar",
      day: "Monday",
      subject: "English",
      status: "present",
      time: "09:07 AM",
      subjectValue: "english",
      monthValue: "march2024"
    }
  ];

  // Sample attendance progress data
  const attendanceProgressData = [
    { date: "2023-09-01", attendance: 82 },
    { date: "2023-09-08", attendance: 84 },
    { date: "2023-09-15", attendance: 80 },
    { date: "2023-09-22", attendance: 85 },
    { date: "2023-09-29", attendance: 87 },
    { date: "2023-10-06", attendance: 83 },
    { date: "2023-10-13", attendance: 86 },
    { date: "2023-10-20", attendance: 88 },
    { date: "2023-10-27", attendance: 85 },
    { date: "2023-11-03", attendance: 89 },
    { date: "2023-11-10", attendance: 87 },
    { date: "2023-11-17", attendance: 90 },
    { date: "2023-11-24", attendance: 92 },
    { date: "2023-12-01", attendance: 88 },
    { date: "2023-12-08", attendance: 91 },
    { date: "2023-12-15", attendance: 89 },
    { date: "2023-12-22", attendance: 93 },
    { date: "2023-12-29", attendance: 90 },
    { date: "2024-01-05", attendance: 94 },
    { date: "2024-01-12", attendance: 92 },
    { date: "2024-01-19", attendance: 95 },
    { date: "2024-01-26", attendance: 93 },
    { date: "2024-02-02", attendance: 91 },
    { date: "2024-02-09", attendance: 94 },
    { date: "2024-02-16", attendance: 96 },
    { date: "2024-02-23", attendance: 93 },
    { date: "2024-03-02", attendance: 95 },
    { date: "2024-03-09", attendance: 92 },
    { date: "2024-03-16", attendance: 94 },
    { date: "2024-03-23", attendance: 96 },
    { date: "2024-03-30", attendance: 93 },
    { date: "2024-04-06", attendance: 95 },
    { date: "2024-04-13", attendance: 97 },
    { date: "2024-04-20", attendance: 94 },
    { date: "2024-04-27", attendance: 96 },
    { date: "2024-05-04", attendance: 98 },
    { date: "2024-05-11", attendance: 95 },
    { date: "2024-05-18", attendance: 97 },
    { date: "2024-05-25", attendance: 94 },
    { date: "2024-06-01", attendance: 96 },
    { date: "2024-06-08", attendance: 98 },
    { date: "2024-06-15", attendance: 95 },
    { date: "2024-06-22", attendance: 97 },
    { date: "2024-06-29", attendance: 94 }
  ];

  const [attendanceData, setAttendanceData] = useState(initialAttendanceData);
  const [filteredData, setFilteredData] = useState(initialAttendanceData);
  const [filters, setFilters] = useState({
    subject: 'all',
    month: 'march2024',
    status: 'all'
  });

  // Filter data based on selected filters
  useEffect(() => {
    let result = attendanceData;
    
    if (filters.subject !== 'all') {
      result = result.filter(item => item.subjectValue === filters.subject);
    }
    
    if (filters.month !== 'all') {
      result = result.filter(item => item.monthValue === filters.month);
    }
    
    if (filters.status !== 'all') {
      result = result.filter(item => item.status === filters.status);
    }
    
    setFilteredData(result);
  }, [filters, attendanceData]);

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Stats data
  const totalDays = 22;
  const presentDays = 18;
  const absentDays = 4;

  // Analytics data
  const trendData = [
    { month: "January 2024", days: "18/19 days", percentage: 94.2 },
    { month: "February 2024", days: "22/24 days", percentage: 91.7 },
    { month: "March 2024", days: "18/21 days", percentage: 85.7 }
  ];

  const subjectData = [
    { name: "Computer Graphics", ratio: "19/20", percentage: 95 },
    { name: "Python Programming", ratio: "17/19", percentage: 89 },
    { name: "MySQL", ratio: "17/20", percentage: 85 },
    { name: "Cloud Computing", ratio: "14/17", percentage: 82 },
    { name: "English", ratio: "14/18", percentage: 78 }
  ];

  // Format date for chart
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Get min and max attendance for Y-axis
  const minAttendance = Math.min(...attendanceProgressData.map(d => d.attendance)) - 5;
  const maxAttendance = Math.max(...attendanceProgressData.map(d => d.attendance)) + 5;
  const todayAttendance = attendanceProgressData[attendanceProgressData.length - 1]?.attendance || 0;

  return (
    <div className="pt-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground mb-2 montserrat-font">Attendance History</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Days</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="4" rx="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
              </svg>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDays}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{presentDays}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" x2="9" y1="9" y2="15" />
                <line x1="9" x2="15" y1="9" y2="15" />
              </svg>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{absentDays}</div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Progress Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Progress</CardTitle>
          <p className="text-sm text-muted-foreground">
            Track your attendance percentage from enrollment to current date
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={attendanceProgressData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  domain={[minAttendance, maxAttendance]} 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Attendance']}
                  labelFormatter={formatDate}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="attendance"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Attendance %"
                  animationDuration={1500}
                  animationEasing="ease-out"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm text-muted-foreground">Attendance Percentage</span>
            </div>
            {attendanceProgressData.length > 0 && (
              <>
                <div className="text-sm text-muted-foreground">
                  Current: <span className="font-semibold">{todayAttendance}%</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Highest: <span className="font-semibold">{Math.max(...attendanceProgressData.map(d => d.attendance))}%</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Lowest: <span className="font-semibold">{Math.min(...attendanceProgressData.map(d => d.attendance))}%</span>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Analytics Section with Bar Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trend Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={trendData.map(item => ({
                    ...item,
                    percentage: item.percentage,
                    shortMonth: item.month.split(' ')[0]
                  }))}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                  <XAxis 
                    dataKey="shortMonth" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    domain={[0, 100]} 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Attendance']}
                  />
                  <Bar 
                    dataKey="percentage" 
                    fill="#3b82f6" 
                    name="Attendance %"
                    radius={[4, 4, 0, 0]}
                    animationDuration={1500}
                    animationEasing="ease-out"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Subject-wise Attendance Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Subject-wise Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={subjectData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 70, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                  <XAxis 
                    type="number" 
                    domain={[0, 100]} 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    tick={{ fontSize: 12 }}
                    width={60}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Attendance']}
                  />
                  <Bar 
                    dataKey="percentage" 
                    fill="#10b981" 
                    name="Attendance %"
                    radius={[0, 4, 4, 0]}
                    animationDuration={1500}
                    animationEasing="ease-out"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-1 block">Subject</label>
              <Select value={filters.subject} onValueChange={(value) => handleFilterChange('subject', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  <SelectItem value="computer-graphics">Computer Graphics</SelectItem>
                  <SelectItem value="python-programming">Python Programming</SelectItem>
                  <SelectItem value="mysql">MySQL</SelectItem>
                  <SelectItem value="cloud-computing">Cloud Computing</SelectItem>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="web-technology">Web Technology</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-1 block">Month</label>
              <Select value={filters.month} onValueChange={(value) => handleFilterChange('month', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="March 2024" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="march2024">March 2024</SelectItem>
                  <SelectItem value="feb2024">February 2024</SelectItem>
                  <SelectItem value="jan2024">January 2024</SelectItem>
                  <SelectItem value="dec2023">December 2023</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-1 block">Status</label>
              <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Table */}
      <Card>
        <CardContent className="pt-6">
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Day</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Subject</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-muted/50">
                    <td className="p-4 align-middle">{item.date}</td>
                    <td className="p-4 align-middle">{item.day}</td>
                    <td className="p-4 align-middle">{item.subject}</td>
                    <td className="p-4 align-middle">
                      <Badge 
                        variant="outline" 
                        className={item.status === 'present' ? 'text-green-600 border-green-600' : 'text-red-600 border-red-600'}
                      >
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="p-4 align-middle">{item.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredData.length} of {attendanceData.length} records
          </div>
        </CardContent>
      </Card>
    </div>
  );
}