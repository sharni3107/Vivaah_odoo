import React, { useState } from 'react';
import { useData } from '../../context/DataContext';

export default function DocumentsAgreements() {
  const { documents, weddings, selectedWeddingId, setSelectedWeddingId, uploadDocument } = useData();

  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchDoc, setSearchDoc] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);

  const [newDoc, setNewDoc] = useState({
    file_name: '',
    category: 'Client Agreement',
    file_size: '3.5 MB'
  });

  const categories = [
    'All',
    'Client Agreement',
    'Venue Contract',
    'Vendor Quotation',
    'Design Blueprint',
    'Payment Receipt'
  ];

  const filteredDocs = documents.filter((d) => {
    const matchesWedding = !selectedWeddingId || d.wedding_id === selectedWeddingId;
    const matchesCat = categoryFilter === 'All' || d.category === categoryFilter;
    const matchesSearch = d.file_name.toLowerCase().includes(searchDoc.toLowerCase());
    return matchesWedding && matchesCat && matchesSearch;
  });

  const handleUpload = (e) => {
    e.preventDefault();
    if (!newDoc.file_name) return;
    uploadDocument({
      ...newDoc,
      wedding_id: selectedWeddingId
    });
    setNewDoc({ file_name: '', category: 'Client Agreement', file_size: '3.5 MB' });
    setShowUploadModal(false);
  };

  return (
    <div className="p-8 space-y-8 max-w-[1720px] mx-auto w-full">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-secondary/15 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-label-sm text-[10px] uppercase tracking-widest text-secondary font-semibold">
              Archival Repository &amp; Legal Dossiers
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
            <span className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant font-tabular-nums">
              {filteredDocs.length} Documents Stored
            </span>
          </div>
          <h1 className="font-headline-lg text-3xl text-primary font-serif tracking-tight mt-1">
            Documents &amp; Agreements Vault
          </h1>
          <p className="font-body-md text-xs text-on-surface-variant max-w-2xl mt-0.5">
            Centralized archival storage for client service agreements, vendor quotation attachments, NDAs, and escrow payment receipts.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2 bg-primary-container text-on-primary font-title-md text-xs rounded shadow-sm hover:bg-secondary-dark transition-colors flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[16px]">upload_file</span>
          <span>Upload Document</span>
        </button>
      </div>

      {/* 2. Controls & Filter Bar */}
      <div className="p-4 rounded-lg bg-surface-container-lowest border border-secondary/20 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-4 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-label-caps uppercase text-[10px] text-secondary font-semibold">Wedding Account:</span>
            <select
              value={selectedWeddingId}
              onChange={(e) => setSelectedWeddingId(e.target.value)}
              className="p-1.5 bg-surface-container-low border border-secondary/20 font-medium text-xs text-primary rounded"
            >
              {weddings.map((w) => (
                <option key={w.id} value={w.id}>{w.couple_names}</option>
              ))}
            </select>
          </div>

          <div className="relative flex-1 max-w-xs">
            <span className="material-symbols-outlined absolute left-2.5 text-on-surface-variant text-[14px]">search</span>
            <input
              type="text"
              placeholder="Search documents by name..."
              value={searchDoc}
              onChange={(e) => setSearchDoc(e.target.value)}
              className="w-full h-8 pl-8 pr-3 bg-surface-container-low border border-secondary/20 rounded text-xs focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded text-xs whitespace-nowrap transition-colors ${
                categoryFilter === cat
                  ? 'bg-primary text-surface font-semibold shadow-sm'
                  : 'bg-surface-container-low text-on-surface-variant hover:text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Documents Grid Table */}
      <div className="bg-surface-container-lowest rounded-lg border border-secondary/20 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant h-9 border-b border-secondary/15">
                <th className="px-4 py-2 font-label-sm uppercase font-semibold">Document Title</th>
                <th className="px-4 py-2 font-label-sm uppercase font-semibold">Classification</th>
                <th className="px-4 py-2 font-label-sm uppercase font-semibold">Wedding Context</th>
                <th className="px-4 py-2 font-label-sm uppercase font-semibold">File Weight</th>
                <th className="px-4 py-2 font-label-sm uppercase font-semibold">Uploaded By</th>
                <th className="px-4 py-2 font-label-sm uppercase font-semibold">Timestamp</th>
                <th className="px-4 py-2 font-label-sm uppercase font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary/10">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-surface-container-low/50">
                  <td className="px-4 py-3 font-medium text-primary flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[20px]">picture_as_pdf</span>
                    <span>{doc.file_name}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-secondary-container/40 text-on-secondary-container font-semibold">
                      {doc.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-on-surface">Aarav &amp; Meera</td>
                  <td className="px-4 py-3 font-tabular-nums text-on-surface-variant">{doc.file_size}</td>
                  <td className="px-4 py-3 text-on-surface">{doc.uploaded_by}</td>
                  <td className="px-4 py-3 font-tabular-nums text-on-surface-variant">
                    {new Date(doc.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => alert(`Downloading ${doc.file_name}`)}
                      className="px-2.5 py-1 bg-surface-container hover:bg-secondary text-primary rounded text-[10px] font-semibold transition-colors border border-secondary/20"
                    >
                      Download ↓
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* UPLOAD MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-primary/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest max-w-md w-full p-6 rounded-lg border border-secondary/30 shadow-2xl space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-secondary/20 pb-2">
              <h3 className="font-headline-sm text-lg text-primary font-serif">Upload Archival Document</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-lg">✕</button>
            </div>

            <form onSubmit={handleUpload} className="space-y-3">
              <div>
                <label className="font-label-caps uppercase text-[10px] text-secondary font-semibold">File Name *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Floral_Couture_Signed_Contract.pdf"
                  value={newDoc.file_name}
                  onChange={(e) => setNewDoc({ ...newDoc, file_name: e.target.value })}
                  className="w-full p-2 bg-surface-container-low border border-secondary/20 rounded text-xs mt-1 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-label-caps uppercase text-[10px] text-secondary font-semibold">Classification Category</label>
                <select
                  value={newDoc.category}
                  onChange={(e) => setNewDoc({ ...newDoc, category: e.target.value })}
                  className="w-full p-2 bg-surface-container-low border border-secondary/20 rounded text-xs mt-1"
                >
                  <option value="Client Agreement">Client Agreement</option>
                  <option value="Venue Contract">Venue Contract</option>
                  <option value="Vendor Quotation">Vendor Quotation</option>
                  <option value="Design Blueprint">Design Blueprint</option>
                  <option value="Payment Receipt">Payment Receipt</option>
                </select>
              </div>

              <div className="p-4 border-2 border-dashed border-secondary/30 rounded text-center bg-surface-container-low space-y-1">
                <span className="material-symbols-outlined text-[32px] text-secondary">cloud_upload</span>
                <p className="text-xs text-on-surface-variant font-medium">Select PDF or drop file here</p>
                <span className="text-[10px] text-on-surface-variant">Max file size 25MB (Encrypted storage)</span>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-secondary/20">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-3 py-1.5 bg-surface-container text-on-surface-variant font-label-caps uppercase text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-primary text-surface rounded font-label-caps uppercase text-xs font-semibold hover:bg-secondary-dark"
                >
                  Save to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
