import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/components/ui/use-toast";
import { generateCertificate } from "@/utils/certificateGenerator";
import { supabase } from "@/integrations/supabase/client";

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
  const { toast } = useToast();
  
  const handleDownload = async () => {
    try {
      if (certificate.certificate_url) {
        window.open(certificate.certificate_url, '_blank');
      } else {
        // Generate certificate if URL doesn't exist
        const { data: userData } = await supabase.auth.getUser();
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', userData.user?.id)
          .single();

        if (!profile) throw new Error('Profile not found');

        const certificateData = {
          studentName: `${profile.first_name} ${profile.last_name}`,
          courseName: certificate.course.title,
          completionDate: certificate.issued_at,
          courseHours: 40, // You might want to get this from the course data
          certificateId: certificate.id
        };

        const pdfBase64 = await generateCertificate(certificateData);
        
        // Update certificate URL in database
        const { error: updateError } = await supabase
          .from('certificates')
          .update({ certificate_url: pdfBase64 })
          .eq('id', certificate.id);

        if (updateError) throw updateError;

        // Open the generated PDF
        window.open(pdfBase64, '_blank');
      }
    } catch (error) {
      console.error('Error generating certificate:', error);
      toast({
        title: "Erro",
        description: "Erro ao gerar certificado. Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-4 bg-[#1a1717] border-none cursor-pointer hover:bg-[#2a2727] transition-colors">
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
          className="h-8 w-8"
          onClick={(e) => {
            e.stopPropagation();
            handleDownload();
          }}
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

export default CertificateCard;