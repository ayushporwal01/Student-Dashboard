import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { DashboardPage } from "@/components/pages/dashboard-page";
import { ProfilePage } from "@/components/pages/profile-page";
import { NotificationsPage } from "@/components/pages/notifications-page";
import { SettingsPage } from "@/components/pages/settings-page";
import { ScannerPage } from "@/components/pages/scanner-page";
import { HowItWorksPage } from "@/components/pages/how-it-works-page";
import { HistoryPage } from "@/components/pages/history-page";
import { QRScanner } from "@/components/qr-scanner";
import { AttendanceMarked } from "@/components/attendance-marked";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAttendance } from "@/contexts/attendance-context";

import { cn } from "@/lib/utils";
import { useRegisterSW } from 'virtual:pwa-register/react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";

function App() {
  return (
    <AppContent />
  );
}

function DashboardLayout({ 
  currentPage,
  userData,
  sidebarExpanded,
  isMobile,
  handleMenuClick,
  handleProfileClick,
  handleSidebarNavigation,
  renderPage,
  welcomeTextRef,
  contentRef,
  displayText,
  typingComplete
}) {
  return (
    <>
      <DashboardHeader 
        userData={userData} 
        onProfileClick={handleProfileClick}
        onMenuClick={handleMenuClick}
      />
      <div className="flex pt-[55px] sm:pt-[65px]">
        <DashboardSidebar 
          currentPage={currentPage} 
          onPageChange={handleSidebarNavigation}
          onExpandedChange={handleMenuClick} // Pass the same function that opens the menu to close it
          isMobileMenuOpen={sidebarExpanded && isMobile}
        />
        <main className={cn(
          "flex-1 transition-all duration-300 ease-in-out flex justify-center",
          isMobile 
            ? "ml-0"  // Remove margin on mobile since sidebar slides in
            : sidebarExpanded 
            ? "ml-64" 
            : "ml-16"
        )}>
          <div className="max-w-6xl w-full p-3 sm:p-4 space-y-4 sm:space-y-6">
            {/* Welcome text with slide-in animation from outside left - only show on dashboard */}
            {currentPage === "dashboard" && (
              <div
                ref={welcomeTextRef}
                className="w-full flex justify-center mt-6 sm:mt-8"
              >
                <div className="w-full max-w-6xl">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-center gradient-text text-enhanced montserrat-font">
                    <span 
                      style={{minWidth: '300px', display: 'inline-block'}}
                    >
                      {displayText}
                    </span>
                  </h1>
                </div>
              </div>
            )}
            
            {/* Dashboard content with slide-in animation from outside left */}
            <div ref={contentRef}>
              {renderPage()}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

function AppContent() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showAttendanceMarked, setShowAttendanceMarked] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [typingComplete, setTypingComplete] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();

  // Set current page based on URL
  useEffect(() => {
    const path = location.pathname;
    if (path === "/" || path === "/dashboard") {
      setCurrentPage("dashboard");
    } else if (path === "/profile") {
      setCurrentPage("profile");
    } else if (path === "/notifications") {
      setCurrentPage("notifications");
    } else if (path === "/settings") {
      setCurrentPage("settings");
    } else if (path === "/scanner") {
      setCurrentPage("scanner");
    } else if (path === "/history") {
      setCurrentPage("history");
    }
  }, [location]);
  
  // PWA update functionality
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ', r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    }
  });
  
  // Refs for GSAP animations
  const welcomeTextRef = useRef(null);
  const contentRef = useRef(null);
  
  // Shared user data state
  const [userData, setUserData] = useState({
    firstName: "Ayush",
    lastName: "Porwal",
    email: "ayushporwal@ipsacademy.org",
    phone: "+917696942840",
    studentId: "S69652",
    course: "None",
    courseValue: "none",
    academicYear: "2023-2026",
    enrollmentDate: "September 2022",
    avatar: "/default-img.png",
  });

  const welcomeText = `Welcome ${userData.firstName} ${userData.lastName}`;

  // Set display text immediately without typing animation
  useEffect(() => {
    setDisplayText(welcomeText);
    setTypingComplete(true);
  }, [welcomeText]);

  // GSAP animations
  useEffect(() => {
    if (welcomeTextRef.current && contentRef.current) {
      // Reset positions
      gsap.set([welcomeTextRef.current, contentRef.current], { opacity: 0, x: -100 });
      
      // Animate welcome text
      gsap.to(welcomeTextRef.current, {
        opacity: 1,
        x: 0,
        duration: 0.6,
        ease: "power2.out"
      });
      
      // Animate content with delay
      gsap.to(contentRef.current, {
        opacity: 1,
        x: 0,
        duration: 0.6,
        delay: 0.1,
        ease: "power2.out"
      });
    }
  }, [currentPage]);

  // Function to update user data
  const updateUserData = (newData) => {
    setUserData(prev => ({
      ...prev,
      ...newData
    }));
  };

  const handleAttendanceMarked = () => {
    setShowAttendanceMarked(true);
    setShowQRScanner(false);
  };

  // Update navigation to use router
  const navigateToPage = (page) => {
    navigate(`/${page}`);
  };

  // Update sidebar navigation
  const handleSidebarNavigation = (page) => {
    // When navigating away from scanner, hide all scanner-related pages
    if (page !== "scanner") {
      setShowHowItWorks(false);
      setShowQRScanner(false);
      setShowAttendanceMarked(false);
    }
    navigateToPage(page);
  };

  // Update profile click to use router
  const handleProfileClick = () => {
    navigateToPage("profile");
  };

  const handleMenuClick = () => {
    setSidebarExpanded(prev => !prev);
  };

  const renderPage = () => {
    // If showing How It Works page, render it instead
    if (showHowItWorks && currentPage === "scanner") {
      return <HowItWorksPage onBack={() => setShowHowItWorks(false)} />;
    }
    
    // If showing QR Scanner page, render it instead
    if (showQRScanner && currentPage === "scanner") {
      return <QRScanner 
        onAttendanceMarked={handleAttendanceMarked} 
        onBack={() => setShowQRScanner(false)} 
      />;
    }
    
    // If showing Attendance Marked page, render it instead
    if (showAttendanceMarked && currentPage === "scanner") {
      return <AttendanceMarked onBack={() => {
        setShowAttendanceMarked(false);
        // Reset to scanner page
        setCurrentPage("scanner");
      }} />;
    }
    
    switch (currentPage) {
      case "dashboard":
        return <DashboardPage onPageChange={handleSidebarNavigation} />;
      case "profile":
        return <ProfilePage userData={userData} onUpdateUser={updateUserData} />;
      case "notifications":
        return <NotificationsPage />;
      case "settings":
        return <SettingsPage />;
      case "scanner":
        return <ScannerPage 
          userData={userData} 
          onShowHowItWorks={() => setShowHowItWorks(true)} 
          onShowQRScanner={() => setShowQRScanner(true)} 
        />;
      case "history":
        return <HistoryPage />;
      default:
        return <DashboardPage onPageChange={handleSidebarNavigation} />;
    }
  };

  return (
    <div className="min-h-screen">
      {needRefresh && (
        <div className="fixed top-0 left-0 right-0 bg-blue-500 text-white text-center p-2 z-50">
          <div className="container mx-auto flex justify-between items-center">
            <span>New version available</span>
            <div>
              <button 
                className="bg-white text-blue-500 px-3 py-1 rounded mr-2"
                onClick={() => updateServiceWorker(true)}
              >
                Update
              </button>
              <button 
                className="bg-white/20 text-white px-3 py-1 rounded"
                onClick={() => setNeedRefresh(false)}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
      <Routes>
        <Route path="/" element={<DashboardLayout 
          currentPage={currentPage}
          userData={userData}
          sidebarExpanded={sidebarExpanded}
          isMobile={isMobile}
          handleMenuClick={handleMenuClick}
          handleProfileClick={handleProfileClick}
          handleSidebarNavigation={handleSidebarNavigation}
          renderPage={renderPage}
          welcomeTextRef={welcomeTextRef}
          contentRef={contentRef}
          displayText={displayText}
          typingComplete={typingComplete}
        />} />
        <Route path="/dashboard" element={<DashboardLayout 
          currentPage={currentPage}
          userData={userData}
          sidebarExpanded={sidebarExpanded}
          isMobile={isMobile}
          handleMenuClick={handleMenuClick}
          handleProfileClick={handleProfileClick}
          handleSidebarNavigation={handleSidebarNavigation}
          renderPage={renderPage}
          welcomeTextRef={welcomeTextRef}
          contentRef={contentRef}
          displayText={displayText}
          typingComplete={typingComplete}
        />} />
        <Route path="/profile" element={<DashboardLayout 
          currentPage={currentPage}
          userData={userData}
          sidebarExpanded={sidebarExpanded}
          isMobile={isMobile}
          handleMenuClick={handleMenuClick}
          handleProfileClick={handleProfileClick}
          handleSidebarNavigation={handleSidebarNavigation}
          renderPage={renderPage}
          welcomeTextRef={welcomeTextRef}
          contentRef={contentRef}
          displayText={displayText}
          typingComplete={typingComplete}
        />} />
        <Route path="/notifications" element={<DashboardLayout 
          currentPage={currentPage}
          userData={userData}
          sidebarExpanded={sidebarExpanded}
          isMobile={isMobile}
          handleMenuClick={handleMenuClick}
          handleProfileClick={handleProfileClick}
          handleSidebarNavigation={handleSidebarNavigation}
          renderPage={renderPage}
          welcomeTextRef={welcomeTextRef}
          contentRef={contentRef}
          displayText={displayText}
          typingComplete={typingComplete}
        />} />
        <Route path="/settings" element={<DashboardLayout 
          currentPage={currentPage}
          userData={userData}
          sidebarExpanded={sidebarExpanded}
          isMobile={isMobile}
          handleMenuClick={handleMenuClick}
          handleProfileClick={handleProfileClick}
          handleSidebarNavigation={handleSidebarNavigation}
          renderPage={renderPage}
          welcomeTextRef={welcomeTextRef}
          contentRef={contentRef}
          displayText={displayText}
          typingComplete={typingComplete}
        />} />
        <Route path="/scanner" element={<DashboardLayout 
          currentPage={currentPage}
          userData={userData}
          sidebarExpanded={sidebarExpanded}
          isMobile={isMobile}
          handleMenuClick={handleMenuClick}
          handleProfileClick={handleProfileClick}
          handleSidebarNavigation={handleSidebarNavigation}
          renderPage={renderPage}
          welcomeTextRef={welcomeTextRef}
          contentRef={contentRef}
          displayText={displayText}
          typingComplete={typingComplete}
        />} />
        <Route path="/history" element={<DashboardLayout 
          currentPage={currentPage}
          userData={userData}
          sidebarExpanded={sidebarExpanded}
          isMobile={isMobile}
          handleMenuClick={handleMenuClick}
          handleProfileClick={handleProfileClick}
          handleSidebarNavigation={handleSidebarNavigation}
          renderPage={renderPage}
          welcomeTextRef={welcomeTextRef}
          contentRef={contentRef}
          displayText={displayText}
          typingComplete={typingComplete}
        />} />
      </Routes>
    </div>
  );
}

export default App;