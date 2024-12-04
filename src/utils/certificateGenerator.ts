import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CertificateData {
  studentName: string;
  courseName: string;
  completionDate: string;
  courseHours: number;
  certificateId: string;
}

export const generateCertificate = async (data: CertificateData): Promise<string> => {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  // Configurações da página
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Adicionar borda decorativa
  doc.setDrawColor(0, 123, 255);
  doc.setLineWidth(1);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
  doc.setLineWidth(0.5);
  doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

  // Título
  doc.setFont("helvetica", "bold");
  doc.setFontSize(40);
  doc.setTextColor(44, 62, 80);
  doc.text("CERTIFICADO", pageWidth / 2, 50, { align: "center" });

  // Texto principal
  doc.setFont("helvetica", "normal");
  doc.setFontSize(16);
  doc.setTextColor(52, 73, 94);
  
  const text = [
    `Certificamos que ${data.studentName}`,
    `concluiu com êxito o curso`,
    `${data.courseName}`,
    `com carga horária de ${data.courseHours} horas,`,
    `em ${format(new Date(data.completionDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}.`,
  ];

  let yPos = 80;
  text.forEach((line, index) => {
    if (index === 2) {
      doc.setFont("helvetica", "bold");
    }
    doc.text(line, pageWidth / 2, yPos, { align: "center" });
    if (index === 2) {
      doc.setFont("helvetica", "normal");
    }
    yPos += 12;
  });

  // Assinatura
  doc.setFont("helvetica", "bold");
  doc.text("_____________________", pageWidth / 2, 160, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text("Diretor de Ensino", pageWidth / 2, 170, { align: "center" });

  // ID do certificado
  doc.setFontSize(10);
  doc.setTextColor(128, 128, 128);
  doc.text(`Certificado Nº: ${data.certificateId}`, 20, pageHeight - 15);

  // Data de emissão
  const dataEmissao = format(new Date(), "'Emitido em' dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  doc.text(dataEmissao, pageWidth - 20, pageHeight - 15, { align: "right" });

  // Converter para base64
  const pdfBase64 = doc.output('datauristring');
  return pdfBase64;
};