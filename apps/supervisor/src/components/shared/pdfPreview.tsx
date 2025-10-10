// components/PdfPreview.tsx

import { Document, Page, pdfjs } from "react-pdf";
import { useState } from "react";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

type Props = {
  file: Blob;
};

export default function PdfPreview({ file }: Props) {
  const [numPages, setNumPages] = useState<number>();

  return (
    <div className="border rounded p-2 max-h-[700px] overflow-y-auto">
      <Document
        file={file}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
      >
        {Array.from(new Array(numPages), (_, index) => (
          <Page key={index} pageNumber={index + 1} />
        ))}
      </Document>
    </div>
  );
}
