const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const api = {
  async getHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`);
      return await res.json();
    } catch (e) {
      return { status: 'offline', error: e.message };
    }
  },

  async getWeddings() {
    const res = await fetch(`${API_BASE}/weddings`);
    if (!res.ok) throw new Error('Failed to fetch weddings');
    return await res.json();
  },

  async getTasks(weddingId = 'wed-001') {
    const res = await fetch(`${API_BASE}/tasks?wedding_id=${weddingId}`);
    if (!res.ok) throw new Error('Failed to fetch tasks');
    return await res.json();
  },

  async createTask(task) {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
    });
    return await res.json();
  },

  async updateTask(taskId, updates) {
    const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return await res.json();
  },

  async submitEnquiry(enquiry) {
    const res = await fetch(`${API_BASE}/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(enquiry)
    });
    return await res.json();
  },

  async convertEnquiryToWedding(enquiryId, plannerName = 'Priya Sharma') {
    const res = await fetch(`${API_BASE}/enquiries/${enquiryId}/convert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assigned_planner: plannerName })
    });
    return await res.json();
  },

  async checkInGuest(qrCodeOrId, weddingId = 'wed-001') {
    const res = await fetch(`${API_BASE}/guests/check-in`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qr_code_or_id: qrCodeOrId, wedding_id: weddingId })
    });
    return await res.json();
  },

  async shareQuotation(quoteId) {
    const res = await fetch(`${API_BASE}/vendors/quotations/${quoteId}/share`, {
      method: 'POST'
    });
    return await res.json();
  },

  async approveQuotation(quoteId, feedback = 'Approved by client.') {
    const res = await fetch(`${API_BASE}/vendors/quotations/${quoteId}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ feedback })
    });
    return await res.json();
  },

  async rejectQuotation(quoteId, feedback = 'Revisions requested.') {
    const res = await fetch(`${API_BASE}/vendors/quotations/${quoteId}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ feedback })
    });
    return await res.json();
  },

  async confirmVendor(quoteId) {
    const res = await fetch(`${API_BASE}/vendors/quotations/${quoteId}/confirm`, {
      method: 'POST'
    });
    return await res.json();
  },

  async recordClientPayment(paymentId, referenceNo, paymentMethod = 'Wire Transfer') {
    const res = await fetch(`${API_BASE}/finance/client-payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        payment_id: paymentId,
        paid_date: new Date().toISOString().split('T')[0],
        payment_method: paymentMethod,
        reference_no: referenceNo
      })
    });
    return await res.json();
  },

  async getFinanceSummary(weddingId = 'wed-001') {
    const res = await fetch(`${API_BASE}/finance/summary?wedding_id=${weddingId}`);
    if (!res.ok) throw new Error('Failed to fetch finance summary');
    return await res.json();
  },

  async getReportsSummary() {
    const res = await fetch(`${API_BASE}/reports/summary`);
    if (!res.ok) throw new Error('Failed to fetch reports summary');
    return await res.json();
  }
};
