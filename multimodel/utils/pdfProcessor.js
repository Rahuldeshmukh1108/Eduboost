import { PDFDocument } from "pdf-lib"
import fetch from "node-fetch"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { dirname } from "path"

// Get directory name
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const extractTextFromPdf = async (pdfUrl) => {
  try {
    console.log(`Processing PDF: ${pdfUrl}`)

    // Download the PDF if it's a remote URL
    let pdfPath
    let pdfBuffer

    if (pdfUrl.startsWith("http")) {
      const response = await fetch(pdfUrl)
      pdfBuffer = await response.arrayBuffer()
    } else {
      // If it's a local path, read the file
      pdfPath = path.join(__dirname, "..", pdfUrl.replace(/^\//, ""))
      pdfBuffer = fs.readFileSync(pdfPath)
    }

    // Load the PDF
    const pdfDoc = await PDFDocument.load(pdfBuffer)
    const pageCount = pdfDoc.getPageCount()

    // Since pdf-lib doesn't have text extraction capabilities,
    // we'll return a placeholder message
    // In a production app, you'd use a library like pdf.js or pdfjs-dist

    return {
      text: `This PDF has ${pageCount} pages. In a production environment, we would extract the text content using a library like pdf.js.`,
      metadata: {
        pageCount: pageCount,
        pdfUrl: pdfUrl,
      },
    }
  } catch (error) {
    console.error("Error processing PDF:", error)
    return {
      text: "Error processing PDF. Could not extract text.",
      error: error.message,
      metadata: {
        pdfUrl: pdfUrl,
      },
    }
  }
}
