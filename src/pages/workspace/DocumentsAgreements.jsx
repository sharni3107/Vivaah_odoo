import React, { useState, useRef } from 'react';
import { useData } from '../../context/DataContext';
import PdfPreviewModal from '../../components/common/PdfPreviewModal';
import { downloadDocumentPdf, getDocumentPreviewUrl } from '../../lib/pdfHelper';

export default function DocumentsAgreements() {
  const { documents, weddings, selectedWeddingId, setSelectedWeddingId, uploadDocument, getDocumentSignedUrl } = useData();

  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchDoc, setSearchDoc] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadCategory, setUploadCategory] = useState('Client Agreement');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // State for active preview modal
  const [previewDoc, setPreviewDoc] = useState(null);

  const categories = ['All', 'Client Agreement', 'Vendor Quotation', 'Permits & Licenses', 'Invoices', 'Receipts'];

  const filteredDocs = documents
    .filter(d => d.wedding_id === selectedWeddingId)
    .filter(d => categoryFilter === 'All' || d.category === categoryFilter)
    .filter(d => d.file_name.toLowerCase().includes(searchDoc.toLowerCase()));

  const currentWedding = weddings.find(w => w.id === selectedWeddingId) || weddings[0];

  const handleFileChange = (e) => {
    setUploadError('');
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 15MB)
    const maxSizeBytes = 15 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setUploadError('File exceeds the 15MB maximum limit. Please select a smaller file.');
      return;
    }

    setSelectedFile(file);
    if (!uploadTitle) {
      setUploadTitle(file.name);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setUploadError('');

    if (!selectedFile && !uploadTitle) {
      setUploadError('Please select a file to upload.');
      return;
    }

    setIsUploading(true);

    try {
      const fileName = uploadTitle.trim() || selectedFile?.name || 'Document.pdf';
      const cleanFileName = fileName.endsWith('.pdf') || fileName.includes('.')
        ? fileName
        : `${fileName}.pdf`;

      // Create persistent Blob URL
      let blobUrl = null;
      let calculatedSize = '1.8 MB';

      if (selectedFile) {
        blobUrl = URL.createObjectURL(selectedFile);
        calculatedSize = formatFileSize(selectedFile.size);
      }

      await uploadDocument({
        wedding_id: selectedWeddingId,
        file_name: cleanFileName,
        file: selectedFile,
        category: uploadCategory,
        file_size: calculatedSize,
        file_url: blobUrl || `/documents/${cleanFileName}`,
        blob_url: blobUrl,
        uploaded_by: 'Priya Sharma (Assigned Planner)'
      });

      setSelectedFile(null);
      setUploadTitle('');
      setUploadCategory('Client Agreement');
      setShowUploadModal(false);
    } catch (err) {
      setUploadError('Failed to upload document: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleViewPdf = async (doc) => {
    if (!doc || (!doc.file_name && !doc.file_url && !doc.blob_url)) {
      alert('Document error: The requested document record is missing or invalid.');
      return;
    }

    // Pre-open blank tab synchronously in response to user click to prevent popup blockers
    let newTab = null;
    try {
      newTab = window.open('about:blank', '_blank');
    } catch {
      // Pop-up blocker intercepted or iframe sandbox; inline modal fallback will activate
    }

    try {
      let previewUrl = null;
      const weddingTitle = currentWedding?.title || currentWedding?.couple_names || 'Aarav & Meera — Royal Jaipur Wedding';
      const uploader = doc.uploaded_by || 'Priya Sharma (Assigned Planner)';

      // 1. Supabase Storage: If private storage path exists, generate signed URL
      if (doc.blob_url && !doc.blob_url.startsWith('blob:') && !doc.blob_url.startsWith('/docs') && getDocumentSignedUrl) {
        previewUrl = await getDocumentSignedUrl(doc.blob_url);
      } else if (doc.blob_url && (doc.blob_url.startsWith('blob:') || doc.blob_url.startsWith('http'))) {
        previewUrl = doc.blob_url;
      }

      // 2. Dynamic generation: If no physical storage blob, generate authentic PDF blob
      if (!previewUrl && doc.file_name) {
        previewUrl = getDocumentPreviewUrl(doc.file_name, doc.category, weddingTitle, uploader);
      }

      if (!previewUrl) {
        if (newTab && !newTab.closed) newTab.close();
        alert(`Document error: Unable to load or generate PDF for "${doc.file_name || 'Document'}". File is missing.`);
        return;
      }

      // 3. Open actual PDF in the prepared tab or modal fallback
      if (newTab && !newTab.closed) {
        newTab.location.href = previewUrl;
      } else {
        // Fallback to inline modal if pop-up blocker intercepted new tab
        setPreviewDoc({
          documentTitle: doc.file_name,
          category: doc.category,
          weddingTitle,
          uploadedBy: uploader,
          customUrl: previewUrl
        });
      }
    } catch (err) {
      if (newTab && !newTab.closed) newTab.close();
      console.error('DocumentsAgreements: View PDF error:', err);
      alert(`Error viewing document PDF: ${err.message || 'Unable to open file.'}`);
    }
  };

  const handleDownload = async (doc) => {
    try {
      const weddingTitle = currentWedding?.title || currentWedding?.couple_names || 'Aarav & Meera — Royal Jaipur Wedding';
      const uploader = doc.uploaded_by || 'Priya Sharma (Assigned Planner)';

      if (doc.blob_url && !doc.blob_url.startsWith('blob:') && !doc.blob_url.startsWith('/docs') && getDocumentSignedUrl) {
        const signedUrl = await getDocumentSignedUrl(doc.blob_url);
        if (signedUrl) {
          const a = document.createElement('a');
          a.href = signedUrl;
          a.download = doc.file_name;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          return;
        }
      } else if (doc.blob_url && (doc.blob_url.startsWith('blob:') || doc.blob_url.startsWith('http'))) {
        const a = document.createElement('a');
        a.href = doc.blob_url;
        a.download = doc.file_name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return;
      }

      downloadDocumentPdf(
        doc.file_name,
        doc.category,
        weddingTitle,
        uploader
      );
    } catch (err) {
      console.error('DocumentsAgreements: Download PDF error:', err);
      alert(`Error downloading document PDF: ${err.message || 'Unable to download file.'}`);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-[1720px] mx-auto w-full font-sans antialiased text-[#241820]">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#B99A72]/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider text-[#B99A72] font-semibold">
              Official Records &amp; Agreements
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#B99A72]" />
            <span className="text-[11px] uppercase tracking-wider text-[#343A35]/70 font-tabular-nums">
              {filteredDocs.length} Documents Stored
            </span>
          </div>
          <h1 className="text-3xl text-[#241820] font-serif font-normal tracking-tight mt-1">
            Documents &amp; Agreements
          </h1>
          <p className="text-xs text-[#343A35]/80 max-w-2xl mt-0.5 leading-relaxed">
            Centralized document storage for client service agreements, vendor quotation attachments, permits, invoices, and payment receipts.
          </p>
        </div>

        <button
          onClick={() => {
            setUploadError('');
            setSelectedFile(null);
            setUploadTitle('');
            setShowUploadModal(true);
          }}
          className="px-4 py-2 bg-[#241820] text-[#F5EFE7] text-xs font-semibold uppercase tracking-wider rounded-lg shadow-sm hover:bg-[#34242e] transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[16px]">upload_file</span>
          <span>Upload Document</span>
        </button>
      </div>

      {/* 2. Controls & Filter Bar */}
      <div className="p-4 rounded-xl bg-white border border-[#B99A72]/25 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-4 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider text-[#343A35] font-semibold">Wedding:</span>
            <select
              value={selectedWeddingId}
              onChange={(e) => setSelectedWeddingId(e.target.value)}
              className="p-2 bg-[#FAF7F2] border border-[#B99A72]/30 font-medium text-xs text-[#241820] rounded-lg focus:outline-none"
            >
              {weddings.map((w) => (
                <option key={w.id} value={w.id}>{w.couple_names}</option>
              ))}
            </select>
          </div>

          <div className="relative flex-1 max-w-xs">
            <span className="material-symbols-outlined absolute left-2.5 top-2 text-[#343A35]/60 text-[16px]">search</span>
            <input
              type="text"
              placeholder="Search documents by name..."
              value={searchDoc}
              onChange={(e) => setSearchDoc(e.target.value)}
              className="w-full h-8 pl-8 pr-3 bg-[#FAF7F2] border border-[#B99A72]/30 rounded-lg text-xs text-[#241820] focus:outline-none focus:border-[#241820]"
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                categoryFilter === cat
                  ? 'bg-[#241820] text-[#F5EFE7] shadow-xs'
                  : 'bg-[#FAF7F2] text-[#343A35] hover:bg-[#F5EFE7]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Documents Grid Table */}
      <div className="bg-white rounded-xl border border-[#B99A72]/25 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAF7F2] text-[#343A35] h-10 border-b border-[#B99A72]/20 font-semibold uppercase text-[10.5px] tracking-wider">
                <th className="px-4 py-2">Document Title</th>
                <th className="px-4 py-2">Classification</th>
                <th className="px-4 py-2">Wedding Context</th>
                <th className="px-4 py-2">File Size</th>
                <th className="px-4 py-2">Uploaded By</th>
                <th className="px-4 py-2">Upload Date</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#B99A72]/15">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-[#343A35]/70">
                    No documents found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                    <td className="px-4 py-3.5 font-medium text-[#241820] flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-[#B99A72] text-[20px]">
                        {doc.file_name.endsWith('.png') || doc.file_name.endsWith('.jpg') ? 'image' : 'picture_as_pdf'}
                      </span>
                      <span className="font-semibold">{doc.file_name}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-[#B99A72]/15 text-[#241820] font-semibold border border-[#B99A72]/30">
                        {doc.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-[#343A35]">{currentWedding?.couple_names || 'Aarav & Meera'}</td>
                    <td className="px-4 py-3.5 font-tabular-nums text-[#343A35]/80">{doc.file_size}</td>
                    <td className="px-4 py-3.5 text-[#343A35]">{doc.uploaded_by}</td>
                    <td className="px-4 py-3.5 font-tabular-nums text-[#343A35]/80">
                      {new Date(doc.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleViewPdf(doc)}
                          className="px-2.5 py-1 bg-[#FAF7F2] hover:bg-[#241820] text-[#241820] hover:text-[#F5EFE7] rounded text-[11px] font-semibold transition-colors border border-[#B99A72]/40 flex items-center gap-1 shadow-2xs"
                          title="Preview Document"
                        >
                          <span className="material-symbols-outlined text-[14px]">visibility</span>
                          <span>View PDF</span>
                        </button>
                        <button
                          onClick={() => handleDownload(doc)}
                          className="px-2.5 py-1 bg-[#241820] hover:bg-[#34242e] text-[#F5EFE7] rounded text-[11px] font-semibold transition-colors flex items-center gap-1 shadow-2xs"
                          title="Download actual file"
                        >
                          <span className="material-symbols-outlined text-[14px]">download</span>
                          <span>Download</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* REAL FILE UPLOAD MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 rounded-2xl border border-[#B99A72]/30 shadow-2xl space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-[#B99A72]/20 pb-2">
              <h3 className="text-lg text-[#241820] font-serif font-normal">Upload Document</h3>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedFile(null);
                }}
                className="text-base text-[#343A35]/70 hover:text-[#241820]"
              >
                ✕
              </button>
            </div>

            {uploadError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">error</span>
                <span>{uploadError}</span>
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="space-y-4 pt-1">
              {/* File Selector Dropzone */}
              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#343A35] font-semibold block mb-1">
                  Choose File (PDF, Word, or Image) *
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="p-6 border-2 border-dashed border-[#B99A72]/40 rounded-xl bg-[#FAF7F2] hover:bg-[#F5EFE7] transition-colors cursor-pointer text-center space-y-2"
                >
                  <span className="material-symbols-outlined text-3xl text-[#B99A72]">
                    {selectedFile ? 'task' : 'cloud_upload'}
                  </span>
                  {selectedFile ? (
                    <div>
                      <span className="font-semibold text-primary block truncate max-w-xs mx-auto">
                        {selectedFile.name}
                      </span>
                      <span className="text-[10px] text-on-surface-variant font-tabular-nums">
                        {formatFileSize(selectedFile.size)} • Click to replace
                      </span>
                    </div>
                  ) : (
                    <div>
                      <span className="font-semibold text-primary block">
                        Click to select document from your device
                      </span>
                      <span className="text-[10px] text-on-surface-variant">
                        Supports PDF, DOC, DOCX, PNG, JPG (up to 15MB)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#343A35] font-semibold block mb-1">
                  Display Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Master_Agreement_Signed.pdf"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#B99A72]/30 rounded-lg text-xs text-[#241820] focus:outline-none focus:border-[#241820]"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#343A35] font-semibold block mb-1">
                  Document Classification
                </label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#B99A72]/30 rounded-lg text-xs text-[#241820] focus:outline-none"
                >
                  <option value="Client Agreement">Client Agreement</option>
                  <option value="Vendor Quotation">Vendor Quotation</option>
                  <option value="Permits & Licenses">Permits & Licenses</option>
                  <option value="Invoices">Invoices</option>
                  <option value="Receipts">Receipts</option>
                </select>
              </div>

              <div className="pt-3 border-t border-[#B99A72]/20 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false);
                    setSelectedFile(null);
                  }}
                  className="px-4 py-2 bg-[#FAF7F2] text-[#343A35] rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-[#F5EFE7]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2 bg-[#241820] text-[#F5EFE7] rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-[#34242e] shadow-sm disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isUploading && <span className="material-symbols-outlined text-[14px] animate-spin">refresh</span>}
                  <span>{isUploading ? 'Uploading...' : 'Save & Store'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PDF PREVIEW MODAL */}
      {previewDoc && (
        <PdfPreviewModal
          isOpen={Boolean(previewDoc)}
          onClose={() => setPreviewDoc(null)}
          documentTitle={previewDoc.documentTitle}
          category={previewDoc.category}
          weddingTitle={previewDoc.weddingTitle}
          uploadedBy={previewDoc.uploadedBy}
          customUrl={previewDoc.customUrl}
        />
      )}
    </div>
  );
}
