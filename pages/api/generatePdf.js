// pages/api/generatePdf.js
import { PDFDocument, StandardFonts } from "pdf-lib";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { letter } = req.body;

  if (!letter) {
    return res.status(400).json({ error: "Letter content is required" });
  }

  try {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const fontSize = 12;
    const margin = 50;
    const maxWidth = width - 2 * margin;

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const lines = letter.split("\n");
    let yPosition = height - margin;

    for (const line of lines) {
      const wrappedLines = font.splitTextIntoLines(line, maxWidth, fontSize);
      for (const wrappedLine of wrappedLines) {
        if (yPosition < margin) {
          page = pdfDoc.addPage();
          yPosition = height - margin;
        }
        page.drawText(wrappedLine, { x: margin, y: yPosition, size: fontSize, font });
        yPosition -= fontSize + 4; // Line spacing
      }
    }

    const pdfBytes = await pdfDoc.save();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=letter.pdf");
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
