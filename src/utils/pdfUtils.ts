import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Cliente, Certificado, Config } from '../types';
import { formatDate } from './dateUtils';

// Add type definition for jsPDF with autotable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

// Generate a PDF certificate
export const generateCertificatePDF = (
  cliente: Cliente,
  certificado: Certificado,
  config: Config
): jsPDF => {
  const doc = new jsPDF();
  
  // Add company logo if available
  if (config.empresa.logo) {
    // In a real app, you would handle the logo as an image
    // For this example, we'll just add a placeholder
    doc.setFontSize(24);
    doc.setTextColor(37, 99, 235); // Primary blue
    doc.text('REVISIONES GAS PRO', 105, 20, { align: 'center' });
  }
  
  // Add certificate title
  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0);
  doc.text('CERTIFICADO DE REVISIÓN DE GAS', 105, 40, { align: 'center' });
  
  // Add certificate number
  doc.setFontSize(14);
  doc.text(`Nº ${certificado.numeroSerie}`, 105, 50, { align: 'center' });
  
  // Add company information
  doc.setFontSize(10);
  doc.text(`${config.empresa.nombre}`, 20, 70);
  doc.text(`${config.empresa.direccion}`, 20, 75);
  doc.text(`Tel: ${config.empresa.telefono}`, 20, 80);
  doc.text(`Email: ${config.empresa.email}`, 20, 85);
  
  // Add line separator
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 90, 190, 90);
  
  // Add client information
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('DATOS DEL CLIENTE', 20, 100);
  doc.setFont(undefined, 'normal');
  doc.setFontSize(10);
  doc.text(`Nombre: ${cliente.nombre}`, 20, 110);
  doc.text(`DNI/NIF: ${cliente.dni || 'No especificado'}`, 20, 115);
  doc.text(`Dirección: ${cliente.direccion}`, 20, 120);
  doc.text(`Teléfono: ${cliente.telefono}`, 20, 125);
  doc.text(`Email: ${cliente.email}`, 20, 130);
  
  // Add installation information
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('DATOS DE LA INSTALACIÓN', 20, 145);
  doc.setFont(undefined, 'normal');
  doc.setFontSize(10);
  doc.text(`Tipo de instalación: ${cliente.tipoInstalacion || 'No especificado'}`, 20, 155);
  doc.text(`Tipo de gas: ${cliente.tipoGas || 'No especificado'}`, 20, 160);
  doc.text(`Número de contrato: ${cliente.numeroContrato || 'No especificado'}`, 20, 165);
  doc.text(`Empresa instaladora: ${cliente.empresaInstaladora || 'No especificado'}`, 20, 170);
  
  // Add certificate information
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('DATOS DEL CERTIFICADO', 20, 185);
  doc.setFont(undefined, 'normal');
  doc.setFontSize(10);
  doc.text(`Fecha de emisión: ${formatDate(certificado.fechaEmision)}`, 20, 195);
  doc.text(`Fecha de caducidad: ${formatDate(certificado.fechaCaducidad)}`, 20, 200);
  
  // Add technical observations
  if (certificado.observacionesTecnicas) {
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('OBSERVACIONES TÉCNICAS', 20, 215);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    doc.text(certificado.observacionesTecnicas, 20, 225);
  }
  
  // Add signature area
  doc.setFontSize(10);
  doc.text('Firma del técnico:', 140, 240);
  doc.setDrawColor(100, 100, 100);
  doc.rect(140, 245, 40, 20);
  
  // Add footer
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(
    'Este certificado tiene una validez de 5 años desde la fecha de emisión.',
    105,
    280,
    { align: 'center' }
  );
  
  return doc;
};

// Generate a client list PDF
export const generateClientListPDF = (clientes: Cliente[]): jsPDF => {
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.text('LISTADO DE CLIENTES', 105, 20, { align: 'center' });
  
  const tableColumn = ['Nombre', 'Teléfono', 'Email', 'Dirección', 'Tipo Gas'];
  const tableRows = clientes.map(cliente => [
    cliente.nombre,
    cliente.telefono,
    cliente.email,
    cliente.direccion,
    cliente.tipoGas || '-'
  ]);
  
  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 30,
    theme: 'grid',
    styles: { fontSize: 8 },
    headStyles: { fillColor: [37, 99, 235] }
  });
  
  return doc;
};

// Generate an expiry report PDF
export const generateExpiryReportPDF = (
  certificados: Certificado[],
  clientes: Record<string, Cliente>
): jsPDF => {
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.text('INFORME DE VENCIMIENTOS', 105, 20, { align: 'center' });
  
  const tableColumn = ['Cliente', 'Nº Certificado', 'F. Emisión', 'F. Caducidad', 'Estado'];
  const tableRows = certificados.map(cert => {
    const cliente = clientes[cert.clienteId];
    return [
      cliente?.nombre || 'Cliente desconocido',
      cert.numeroSerie,
      formatDate(cert.fechaEmision),
      formatDate(cert.fechaCaducidad),
      cert.estado === 'vigente' ? 'Vigente' :
        cert.estado === 'proximo' ? 'Próximo a vencer' : 'Vencido'
    ];
  });
  
  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 30,
    theme: 'grid',
    styles: { fontSize: 8 },
    headStyles: { fillColor: [37, 99, 235] },
    bodyStyles: { textColor: [50, 50, 50] },
    columnStyles: {
      4: {
        fontStyle: 'bold',
        textColor: (cell) => {
          const value = cell.raw.toString();
          if (value === 'Vigente') return [16, 185, 129]; // Green
          if (value === 'Próximo a vencer') return [245, 158, 11]; // Orange
          return [239, 68, 68]; // Red for vencido
        }
      }
    }
  });
  
  return doc;
};