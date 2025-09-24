import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface BingoCardProps {
  goal: string;
  category: string;
  completed: boolean;
  onClick: () => void;
  animationDelay?: number;
}

export const BingoCard = ({ 
  goal, 
  category, 
  completed, 
  onClick, 
  animationDelay = 0 
}: BingoCardProps) => {
  return (
    <div
      className={cn(
        "bingo-card relative aspect-square p-4 cursor-pointer group",
        "flex items-center justify-center text-center",
        "animate-fade-in",
        completed && "completed animate-pulse-success"
      )}
      style={{ animationDelay: `${animationDelay}ms` }}
      onClick={onClick}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        <span className={cn(
          "text-sm font-medium leading-tight transition-all duration-300",
          completed ? "text-primary font-semibold" : "text-card-foreground"
        )}>
          {goal}
        </span>
        
        {completed && (
          <div className="absolute inset-0 flex items-center justify-center bg-primary/10 rounded-lg animate-bounce-in">
            <div className="bg-primary rounded-full p-1.5 shadow-lg">
              <Check className="w-4 h-4 text-primary-foreground" />
            </div>
          </div>
        )}
        
        <div className={cn(
          "absolute inset-0 rounded-xl transition-all duration-300 opacity-0 group-hover:opacity-100",
          "bg-gradient-to-br from-primary/5 to-accent/5"
        )} />
      </div>
    </div>
  );
};