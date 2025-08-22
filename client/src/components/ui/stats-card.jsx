import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  variant?: "default" | "success" | "warning" | "info";
  className?: string;
}

export default function StatsCard({ 
  title, 
  value, 
  icon, 
  variant = "default",
  className 
}: StatsCardProps) {
  return (
    <Card className={cn(
      "stats-card text-white",
      variant === "success" && "stats-card-success",
      variant === "warning" && "stats-card-warning", 
      variant === "info" && "stats-card-info",
      className
    )}>
      <CardContent className="p-4 text-center">
        <i className={`${icon} fa-2x mb-2`}></i>
        <h3 className="fw-bold">{value}</h3>
        <p className="mb-0">{title}</p>
      </CardContent>
    </Card>
  );
}
