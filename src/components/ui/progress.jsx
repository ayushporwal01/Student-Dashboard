import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"
import { gsap } from "gsap"

const Progress = React.forwardRef(({ className, value, ...props }, ref) => {
  const progressFillRef = React.useRef(null);
  
  // GSAP animation for progress fill - always animate from 0% to value
  React.useEffect(() => {
    if (progressFillRef.current && value !== undefined) {
      // Reset to 0% first, then animate to target value
      gsap.set(progressFillRef.current, { width: "0%" });
      
      // Animate from 0% to the target value
      gsap.to(progressFillRef.current, {
        width: `${value}%`,
        duration: 1,
        ease: "power2.out",
        delay: 0.3 // Small delay to ensure reset happens first
      });
    }
  }, [value]);
  
  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn("relative h-3 w-full overflow-hidden rounded-full bg-gray-100", className)}
      {...props}
    >
      <div
        ref={progressFillRef}
        className="h-full bg-gray-900 rounded-full"
      />
    </ProgressPrimitive.Root>
  )
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }