import { Card, CardContent } from "@/components/ui/card";

export default function StatsCard({ title, value, icon, variant = "default" }) {
  const getVariantClasses = () => {
    switch (variant) {
      case "success":
        return "border-success";
      case "warning":
        return "border-warning";
      case "danger":
        return "border-danger";
      default:
        return "border-primary";
    }
  };

  const getIconClasses = () => {
    switch (variant) {
      case "success":
        return "text-success";
      case "warning":
        return "text-warning";
      case "danger":
        return "text-danger";
      default:
        return "text-primary";
    }
  };

  return (
    <Card className={`dashboard-card ${getVariantClasses()}`}>
      <CardContent className="p-4">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <p className="text-muted mb-1 small">{title}</p>
            <h3 className="fw-bold mb-0">{value}</h3>
          </div>
          <div className={`fs-1 ${getIconClasses()}`}>
            <i className={icon}></i>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}