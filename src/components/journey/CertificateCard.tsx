import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CertificateCardProps {
  certificate: {
    id: string;
    issued_at: string;
    course: {
      title: string;
    };
    certificate_url?: string;
  };
}

const CertificateCard = ({ certificate }: CertificateCardProps) => {
  const handleDownload = () => {
    if (certificate.certificate_url) {
      window.open(certificate.certificate_url, '_blank');
    }
  };

  return (
    <Card className="p-4 bg-[#1a1717] border-none">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-white">{certificate.course.title}</h3>
          <p className="text-sm text-white/60">
            {format(new Date(certificate.issued_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </p>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={handleDownload}
          className="h-8 w-8"
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

export default CertificateCard;