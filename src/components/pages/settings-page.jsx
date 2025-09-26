import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Smartphone,
  Save,
  Key,
  Mail
} from "lucide-react";
import { useState } from "react";
import { PasswordChangeModal } from "@/components/password-change-modal";
import { PrivacyPolicyModal } from "@/components/privacy-policy-modal";
import { useAttendance } from "@/contexts/attendance-context";

export function SettingsPage() {
  // State for interactive buttons
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [offlineMode, setOfflineMode] = useState(true);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isPrivacyPolicyModalOpen, setIsPrivacyPolicyModalOpen] = useState(false);
  const { todayAttendance, attendanceHistory } = useAttendance();

  const handleForgotPassword = () => {
    // Handle forgot password logic here
    console.log("Forgot password clicked");
    // This would typically trigger a password reset email
    alert("Password reset instructions will be sent to your registered email address.");
  };

  const togglePushNotifications = () => {
    setPushNotifications(!pushNotifications);
  };

  const toggleEmailNotifications = () => {
    setEmailNotifications(!emailNotifications);
  };

  const toggleOfflineMode = () => {
    setOfflineMode(!offlineMode);
  };

  return (
    <div className="pt-6 space-y-4 max-w-6xl w-full route-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2 montserrat-font">
            Settings
          </h1>
          <p className="text-muted-foreground">
            Customize your experience and manage your preferences.
          </p>
        </div>
      </div>

      {/* General Settings - Removed as requested */}
      
      {/* Notification Preferences */}
      <Card className="glass-card border-white/30">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/20 border border-white/20">
              <div>
                <h4 className="font-medium text-foreground">Email Notifications</h4>
                <p className="text-sm text-muted-foreground">Receive updates and alerts via email</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleEmailNotifications}
                className={emailNotifications 
                  ? "bg-green-100 text-green-700 border-green-300" 
                  : "bg-red-100 text-red-700 border-red-300"}
              >
                {emailNotifications ? "Enabled" : "Disabled"}
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/20 border border-white/20">
              <div>
                <h4 className="font-medium text-foreground">Push Notifications</h4>
                <p className="text-sm text-muted-foreground">Get real-time notifications on your device</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={togglePushNotifications}
                className={pushNotifications 
                  ? "bg-green-100 text-green-700 border-green-300" 
                  : "bg-red-100 text-red-700 border-red-300"}
              >
                {pushNotifications ? "Enabled" : "Disabled"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card className="glass-card border-white/30">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy & Security
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/20 border border-white/20">
              <div className="flex items-center gap-3">
                <Key className="h-5 w-5 text-blue-600" />
                <div>
                  <h4 className="font-medium text-foreground">Change Password</h4>
                  <p className="text-sm text-muted-foreground">Update your account password</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsPasswordModalOpen(true)}
              >
                Change
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-white/20 border border-white/20">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-orange-600" />
                <div>
                  <h4 className="font-medium text-foreground">Forgot Password</h4>
                  <p className="text-sm text-muted-foreground">Reset your password via email</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleForgotPassword}
                className="bg-orange-50/80 text-orange-700 border-orange-300"
              >
                Reset
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-white/20 border border-white/20">
              <div>
                <h4 className="font-medium text-foreground">Privacy Policy</h4>
                <p className="text-sm text-muted-foreground">Review our privacy policy and terms</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsPrivacyPolicyModalOpen(true)}
              >
                View
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Device Settings */}
      <Card className="glass-card border-white/30">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Device Settings
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/20 border border-white/20">
              <div>
                <h4 className="font-medium text-foreground">Offline Mode</h4>
                <p className="text-sm text-muted-foreground">Cache data for offline viewing</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleOfflineMode}
                className={offlineMode 
                  ? "bg-green-100 text-green-700 border-green-300" 
                  : "bg-red-100 text-red-700 border-red-300"}
              >
                {offlineMode ? "Enabled" : "Disabled"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Password Change Modal */}
      <PasswordChangeModal 
        open={isPasswordModalOpen} 
        onOpenChange={setIsPasswordModalOpen} 
      />

      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal 
        open={isPrivacyPolicyModalOpen} 
        onOpenChange={setIsPrivacyPolicyModalOpen} 
      />

      {/* Save Changes */}
      <div className="flex justify-end">
        <Button className="gap-2">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}