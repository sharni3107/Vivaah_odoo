import React, { useState, useEffect } from 'react';
import { getDocumentPreviewUrl, downloadDocumentPdf } from '../../lib/pdfHelper';

export default function PdfPreviewModal({
  isOpen,
  onClose,
  documentTitle = 'Document.pdf',
  category = 'Agreement',
  weddingTitle = 'Aarav & Meera — Royal Jaipur Wedding',
  uploadedBy = 'Priya Sharma',
  customUrl = null
}) {
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    if (isOpen && (customUrl || documentTitle)) {
      if (customUrl && !customUrl.startsWith('/docs')) {
        setPdfUrl(customUrl);
      } else {
        const url = getDocumentPreviewUrl(documentTitle, category, weddingTitle, uploadedBy);
        setPdfUrl(url);
        return () => {
          if (url && url.startsWith('blob:')) URL.revokeObjectURL(url);
        };
      }
    } else {
      setPdfUrl(null);
    }
  }, [isOpen, documentTitle, category, weddingTitle, uploadedBy, customUrl]);

  if (!isOpen) return null;

  const handleDownload = () => {
    downloadDocumentPdf(documentTitle, category, weddingTitle, uploadedBy);
  };

  const handleOpenNewTab = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white w-full max-w-5xl h-[88vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-[#B99A72]/40">
        {/* Modal Header */}
        <div className="h-14 px-6 bg-[#241820] text-[#F5EFE7] flex items-center justify-between border-b border-[#B99A72]/30 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <span className="material-symbols-outlined text-[#B99A72] text-[20px]">picture_as_pdf</span>
            <div className="truncate">
              <h3 className="font-serif text-base font-normal text-[#F5EFE7] truncate">
                {documentTitle}
              </h3>
              <p className="text-[10px] uppercase tracking-wider text-[#B99A72] truncate">
                {category} · {weddingTitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleOpenNewTab}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-[#F5EFE7] rounded text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-sm"
              title="Open PDF in new tab"
            >
              <span className="material-symbols-outlined text-[16px]">open_in_new</span>
              <span className="hidden sm:inline">Open in Tab</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-3.5 py-1.5 bg-[#B99A72] text-[#241820] rounded text-xs font-semibold uppercase tracking-wider hover:bg-[#cbb08d] transition-colors flex items-center gap-1.5 shadow-sm"
              title="Download PDF file"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span className="hidden sm:inline">Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-[#F5EFE7] flex items-center justify-center transition-colors text-base"
              title="Close Preview"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Body: PDF Viewer */}
        <div className="flex-1 w-full bg-[#343A35]/10 relative p-1 sm:p-2">
          {pdfUrl ? (
            <iframe
              src={pdfUrl}
              title={documentTitle}
              className="w-full h-full rounded-xl border border-black/10 shadow-inner bg-white"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-[#343A35] space-y-2">
              <span className="material-symbols-outlined text-4xl text-[#B99A72] animate-spin">progress_activity</span>
              <p className="text-xs">Generating secure PDF preview...</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="h-10 px-6 bg-[#FAF7F2] border-t border-[#B99A72]/20 flex items-center justify-between text-[11px] text-[#343A35]/70 shrink-0">
          <span>Protected under Vivaah Document Discretion Protocol</span>
          <span className="font-medium text-[#241820]">100% Authentic PDF Render</span>
        </div>
      </div>
    </div>
  );
}
