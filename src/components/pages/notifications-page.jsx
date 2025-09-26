import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Check, Clock, AlertTriangle, X, Calendar, Trophy, BookOpen, User } from "lucide-react";

export function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      type: "warning",
      title: "Attendance Alert",
      message: "Your attendance is below 75%. Attend 4 more classes to meet requirements.",
      time: "2 hours ago",
      unread: true,
      icon: AlertTriangle,
    },
    {
      id: 2,
      type: "info",
      title: "Class Schedule Update",
      message: "Tomorrow's Python class has been moved to 11:00 AM.",
      time: "1 day ago",
      unread: true,
      icon: Calendar,
    },
    {
      id: 3,
      type: "info",
      title: "Upcoming Class Reminder",
      message: "Next Computer Science lecture starts in 1 hour. Prepare your materials.",
      time: "45 minutes ago",
      unread: true,
      icon: Bell,
    },
    {
      id: 4,
      type: "success",
      title: "Attendance Milestone",
      message: "Congratulations! You reached 80% attendance in Mathematics this month.",
      time: "Just now",
      unread: true,
      icon: Trophy,
    },
  ];

  const getIcon = (IconComponent, type) => {
    const iconProps = { className: "h-5 w-5" };
    
    switch (type) {
      case "warning":
        iconProps.className += " text-yellow-600";
        break;
      case "success":
        iconProps.className += " text-green-600";
        break;
      case "info":
      default:
        iconProps.className += " text-blue-600";
        break;
    }
    
    return <IconComponent {...iconProps} />;
  };

  const getBorderColor = (type) => {
    switch (type) {
      case "warning":
        return "border-yellow-300";
      case "success":
        return "border-green-300";
      case "info":
      default:
        return "border-blue-300";
    }
  };

  return (
    <div className="pt-6 space-y-4 route-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2 montserrat-font">
            Notifications
          </h1>
          <p className="text-muted-foreground">
            Important updates, alerts, and announcements related to your attendance and studies.
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Check className="h-4 w-4" />
          Mark All Read
        </Button>
      </div>

      <Card className="glass-card border-white/30">
        <CardContent className="p-5">
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg bg-white/30 backdrop-blur-sm border ${getBorderColor(notification.type)} ${
                  notification.unread ? "ring-2 ring-blue-200/50" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {getIcon(notification.icon, notification.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">
                          {notification.title}
                        </h3>
                        {notification.unread && (
                          <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {notification.time}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 opacity-50">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}