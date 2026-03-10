import { Button } from "@heroui/button";

interface PageHeaderProps {
  salonName: string;
  salonSite: string;
  ownerName: string | null | undefined;
  onBack: () => void;
}

export default function PageHeader({ salonName, salonSite, ownerName, onBack }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">تقرير الصالون التفصيلي</h1>
        <p className="text-default-500">{salonName} — {salonSite}</p>
        <p className="text-sm text-default-400 mt-1">المالك: {ownerName || "غير محدد"}</p>
      </div>
      <Button
        color="default"
        variant="bordered"
        onPress={onBack}
        className="print:hidden self-start md:self-auto"
      >
        ← العودة
      </Button>
    </div>
  );
}
