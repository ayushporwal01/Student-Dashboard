import { Button } from "@/components/ui/button";
import {
  Home,
  User,
  Bell,
  Settings,
  LogOut,
  Scan,
  History,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";

export function DashboardSidebar({ currentPage, onPageChange, onExpandedChange, isMobileMenuOpen }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isMobile = useIsMobile();
  const topLineRef = useRef(null);
  const middleLineRef = useRef(null);
  const timelineRef = useRef(null);

  useEffect(() => {
    // Initialize GSAP timeline
    timelineRef.current = gsap.timeline();
    
    // Animate top line to cross position
    timelineRef.current.to(topLineRef.current, {
      attr: { d: "M6 6l12 12" },
      duration: 0.2,
      ease: "power2.inOut"
    }, 0);
    
    // Animate middle line to cross position
    timelineRef.current.to(middleLineRef.current, {
      attr: { d: "M6 18l12-12" },
      duration: 0.2,
      ease: "power2.inOut"
    }, 0);
    
    // Pause the timeline initially
    timelineRef.current.pause(0);
  }, []);

  useEffect(() => {
    // Play or reverse animation based on isExpanded state
    if (timelineRef.current) {
      if (isExpanded) {
        timelineRef.current.play();
      } else {
        timelineRef.current.reverse();
      }
    }
  }, [isExpanded]);

  // Handle mobile menu open state
  useEffect(() => {
    if (isMobile) {
      setIsExpanded(isMobileMenuOpen || false);
    }
  }, [isMobileMenuOpen, isMobile]);

  // Also handle the case when we're no longer on mobile
  useEffect(() => {
    if (!isMobile) {
      setIsExpanded(true); // Always expanded on desktop
    }
  }, [isMobile]);

  const menuItems = [
    { icon: Home, label: "Dashboard", page: "dashboard" },
    { icon: User, label: "Profile", page: "profile" },
    { icon: History, label: "Attendance History", page: "history" },
    { icon: Scan, label: "Attendance Scanner", page: "scanner" },
    { icon: Bell, label: "Notifications", page: "notifications" },
    { icon: Settings, label: "Settings", page: "settings" },
  ];

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      // Handle logout logic here
      console.log("User confirmed logout");
      alert("You have been successfully logged out!");
      // Add additional logout logic here (e.g., clear session, redirect, etc.)
    } else {
      console.log("Logout cancelled");
    }
  };

  // Close sidebar on mobile after navigation
  const handleNavigation = (page) => {
    onPageChange(page);
    if (isMobile) {
      setIsExpanded(false);
      // Only call onExpandedChange if it's a function
      if (typeof onExpandedChange === 'function') {
        onExpandedChange(false);
      }
    }
  };

  const toggleSidebar = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    // Only call onExpandedChange if it's a function
    if (typeof onExpandedChange === 'function') {
      onExpandedChange(newExpanded);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isExpanded && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => {
            setIsExpanded(false);
            onExpandedChange?.(false);
          }}
        />
      )}

      <aside
        className={cn(
          "glass-sidebar fixed left-0 top-0 h-screen transition-all duration-300 ease-in-out z-40",
          isMobile
            ? isExpanded
              ? "w-64 translate-x-0"
              : "w-64 -translate-x-full"
            : isExpanded
            ? "w-64"
            : "w-16"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Spacer for header */}
          <div className="h-[73px] sm:h-[89px] flex-shrink-0"></div>
          
          <div className="px-1 sm:px-2 py-2 sm:py-1 space-y-1 pt-6 sm:pt-8">
            <Button
              variant="ghost"
              onClick={toggleSidebar}
              className={cn(
                "text-sidebar-foreground text-sm sm:text-base h-12 sm:h-14",
                isExpanded 
                  ? "w-full justify-start gap-2 sm:gap-3"
                  : "w-12 sm:w-14 p-0 flex items-center justify-center shrink-0"
              )}
            >
              <div className="flex items-center justify-center min-w-[24px]">
                <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-8 h-8 sm:w-10 sm:h-10 text-sidebar-foreground"
                  >
                    <path
                      ref={topLineRef}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      d="M4 6h16"
                    />
                    <path
                      ref={middleLineRef}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      d="M4 12h16"
                    />
                  </svg>
                </div>
              </div>
              <span className={cn("truncate", isExpanded ? "block" : "hidden")}>
              </span>
            </Button>
          </div>

          <nav className="flex-1 px-1 sm:px-2 space-y-3">
            {menuItems.map((item, index) => (
              <Button
                key={index}
                variant={currentPage === item.page ? "default" : "ghost"}
                onClick={() => handleNavigation(item.page)}
                className={cn(
                  "text-sm sm:text-base h-10 sm:h-12",
                  isExpanded 
                    ? "w-full justify-start gap-2 sm:gap-3"
                    : "w-12 p-0 flex items-center justify-center shrink-0",
                  currentPage === item.page
                    ? "bg-primary text-primary-foreground shadow-lg py-1"
                    : "text-sidebar-foreground"
                )}
              >
                <div className="flex items-center justify-center min-w-[20px]">
                  <item.icon className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0" />
                </div>
                <span className={cn("truncate", isExpanded ? "block" : "hidden")}>
                  {item.label}
                </span>
              </Button>
            ))}
          </nav>

          <div className="p-1 sm:p-2 border-t border-border">
            <Button
              variant="ghost"
              onClick={handleLogout}
              className={cn(
                "text-sidebar-foreground text-sm sm:text-base h-10 sm:h-12",
                isExpanded 
                  ? "w-full justify-start gap-2 sm:gap-3"
                  : "w-12 p-0 flex items-center justify-center shrink-0",
                currentPage === "logout"
                  ? "bg-primary text-primary-foreground shadow-lg py-1"
                  : "text-sidebar-foreground"
              )}
            >
              <div className="flex items-center justify-center min-w-[20px]">
                <LogOut className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0" />
              </div>
              <span className={cn("truncate", isExpanded ? "block" : "hidden")}>
                Logout
              </span>
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}