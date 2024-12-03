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

  // Add fancy border
  doc.setDrawColor(0, 123, 255);
  doc.setLineWidth(1);
  doc.rect(10, 10, 277, 190);
  doc.setLineWidth(0.5);
  doc.rect(12, 12, 273, 186);

  // Add logo/seal
  // Note: You'll need to add your own logo image
  // doc.addImage("logo.png", "PNG", 125, 30, 40, 40);

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(30);
  doc.setTextColor(44, 62, 80);
  doc.text("CERTIFICADO", 148.5, 50, { align: "center" });

  // Main text
  doc.setFont("helvetica", "normal");
  doc.setFontSize(16);
  doc.setTextColor(52, 73, 94);
  
  const text = [
    `Certificamos que ${data.studentName}`,
    `concluiu com êxito o curso de`,
    `${data.courseName}`,
    `com carga horária de ${data.courseHours} horas,`,
    `em ${format(new Date(data.completionDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}.`,
  ];

  let yPos = 80;
  text.forEach((line, index) => {
    if (index === 2) {
      doc.setFont("helvetica", "bold");
    }
    doc.text(line, 148.5, yPos, { align: "center" });
    if (index === 2) {
      doc.setFont("helvetica", "normal");
    }
    yPos += 12;
  });

  // Signature
  doc.setFont("dancing script", "normal"); // You'll need to add this font
  doc.text("João Silva", 148.5, 160, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text("Diretor de Ensino", 148.5, 165, { align: "center" });

  // Certificate ID
  doc.setFontSize(10);
  doc.setTextColor(128, 128, 128);
  doc.text(`Certificado Nº: ${data.certificateId}`, 20, 190);

  // Convert to base64
  const pdfBase64 = doc.output('datauristring');
  return pdfBase64;
};