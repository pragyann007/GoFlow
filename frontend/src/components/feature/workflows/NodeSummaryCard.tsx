import { Badge } from "@/components/ui/badge";
import DynamicIcon from "../common/DynamicIcon";

interface NodeSummaryCardProps {
  name: string;
  description: string;
  icon: string;
  comingSoon?: boolean
  onClick?: () => void;
}

export function NodeSummaryCard({ name, description, icon, comingSoon, onClick, }: NodeSummaryCardProps) {
  return (
    <div onClick={onClick} className={`flex gap-6 w-full min-h-12 bg-card border p-3 rounded-2xl  cursor-pointer
	hover:bg-primary/10 hover:border-primary/30 ${comingSoon ? "bg-primary-foreground":""}
   items-center`} >
      <div>
        <DynamicIcon iconName={icon} />
      </div>

      <div className="flex flex-col  gap-2 justify-center" >
        <h3 className="text-md text-card-foreground" >{name}</h3>
        <p className="text-muted-foreground" >{description}</p>
        {comingSoon ? <Badge >Coming Soon</Badge> : "" }
      </div>
    </div>
  );
}
