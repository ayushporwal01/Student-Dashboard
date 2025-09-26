import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export function DashboardHeader({ userData, onProfileClick, onMenuClick }) {
  const student = userData || {
    firstName: "Ayush",
    lastName: "Porwal",
    studentId: "S69652",
    avatar: "/default-img.png",
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="flex items-center justify-between px-6 sm:px-8 py-3 sm:py-4">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden h-12 w-12"
            onClick={onMenuClick}
          >
            <Menu className="h-8 w-8" />
          </Button>
          <div className="flex items-center gap-3">
            <img 
              src="/app-logo (2).png" 
              alt="TrackMate Logo" 
              className="h-11 w-11 sm:h-12 sm:w-12 drop-shadow-lg"
            />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">TrackMate</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-lg font-medium text-gray-900 inter-text">
              {student.firstName} {student.lastName}
            </div>
            <div className="text-base text-gray-500 inter-text">
              {student.studentId || "S69652"}
            </div>
          </div>
          <Avatar className="h-10 w-10 sm:h-12 sm:w-12 cursor-pointer border-2 border-blue-500" onClick={onProfileClick}>
            <AvatarImage 
              src={student.avatar || "/student-profile.png"} 
              alt={`${student.firstName} ${student.lastName}`} 
            />
            <AvatarFallback className="bg-blue-100 text-blue-800 font-medium">
              {student.firstName?.charAt(0)}
              {student.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}