// pages/api/generatePdf.js
import { PDFDocument } from "pdf-lib";

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

    const lines = letter.split("\n");
    let yPosition = height - 40;

    for (const line of lines) {
      page.drawText(line, { x: 50, y: yPosition, size: fontSize });
      yPosition -= fontSize + 4; // Line spacing
    }

    const pdfBytes = await pdfDoc.save();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=letter.pdf");
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

