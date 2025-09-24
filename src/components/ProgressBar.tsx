import { cn } from "@/lib/utils";
import { Trophy } from "lucide-react";

interface ProgressBarProps {
  progress: number;
  total: number;
  className?: string;
}

export const ProgressBar = ({ progress, total, className }: ProgressBarProps) => {
  const percentage = (progress / total) * 100;
  const isComplete = progress === total;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isComplete && <Trophy className="w-5 h-5 text-yellow-500 animate-bounce" />}
          <span className="text-sm font-medium text-white/90">
            完成進度: {progress}/{total} ({Math.round(percentage)}%)
          </span>
        </div>
        {isComplete && (
          <div className="text-xs text-white/70 animate-fade-in">
            🎉 恭喜完成所有目標！
          </div>
        )}
      </div>
      
      <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden backdrop-blur-sm">
        <div
          className={cn(
            "h-full transition-all duration-700 ease-out rounded-full",
            "bg-gradient-to-r from-yellow-400 to-orange-400",
            isComplete && "animate-pulse"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};