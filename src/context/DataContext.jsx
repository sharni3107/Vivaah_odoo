import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initialWeddings,
  initialEnquiries,
  initialTasks,
  initialVendors,
  initialQuotationRequests,
  initialQuotations,
  initialGuests,
  initialEvents,
  initialVendorArrivals,
  initialClientPayments,
  initialVendorPayments,
  initialExpenses,
  initialDocuments,
  initialActivityLogs
} from '../data/seedData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  // Helper to load with localStorage persistence fallback
  const usePersistentState = (key, initialValue) => {
    const [state, setState] = useState(() => {
      const stored = localStorage.getItem(`vivaah_${key}`);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error(`Error parsing localStorage for ${key}`, e);
        }
      }
      return initialValue;
    });

    useEffect(() => {
      localStorage.setItem(`vivaah_${key}`, JSON.stringify(state));
    }, [key, state]);

    return [state, setState];
  };

  const [weddings, setWeddings] = usePersistentState('weddings', initialWeddings);
  const [selectedWeddingId, setSelectedWeddingId] = useState('wed-001');
  const [enquiries, setEnquiries] = usePersistentState('enquiries', initialEnquiries);
  const [tasks, setTasks] = usePersistentState('tasks', initialTasks);
  const [vendors, setVendors] = usePersistentState('vendors', initialVendors);
  const [quotationRequests, setQuotationRequests] = usePersistentState('quotation_requests', initialQuotationRequests);
  const [quotations, setQuotations] = usePersistentState('quotations', initialQuotations);
  const [guests, setGuests] = usePersistentState('guests', initialGuests);
  const [events, setEvents] = usePersistentState('events', initialEvents);
  const [vendorArrivals, setVendorArrivals] = usePersistentState('vendor_arrivals', initialVendorArrivals);
  const [clientPayments, setClientPayments] = usePersistentState('client_payments', initialClientPayments);
  const [vendorPayments, setVendorPayments] = usePersistentState('vendor_payments', initialVendorPayments);
  const [expenses, setExpenses] = usePersistentState('expenses', initialExpenses);
  const [documents, setDocuments] = usePersistentState('documents', initialDocuments);
  const [activityLogs, setActivityLogs] = usePersistentState('activity_logs', initialActivityLogs);

  // Selected Wedding helper
  const selectedWedding = weddings.find(w => w.id === selectedWeddingId) || weddings[0];

  // Activity Logger
  const logActivity = (action, actorName, details, weddingId = selectedWeddingId) => {
    const newLog = {
      id: `act-${Date.now()}`,
      wedding_id: weddingId,
      action,
      actor_name: actorName,
      details,
      created_at: new Date().toISOString()
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  // 1. ENQUIRIES ACTIONS
  const createEnquiry = async (formData) => {
    const newEnquiry = {
      id: `enq-${Date.now().toString().slice(-4)}`,
      client_names: formData.client_names,
      email: formData.email,
      phone: formData.phone,
      represented_by: formData.represented_by || 'Self (The Couple)',
      wedding_date: formData.wedding_date,
      destination: formData.destination,
      expected_guests: parseInt(formData.expected_guests) || 250,
      package_type: formData.package_type || 'Full-Service Royal Atelier',
      estimated_budget: parseFloat(formData.estimated_budget) || 15000000,
      preferred_theme: formData.preferred_theme || '',
      additional_requirements: formData.additional_requirements || '',
      status: 'New',
      assigned_executive: 'Vikram Sen',
      notes: [
        {
          date: new Date().toISOString().split('T')[0],
          author: 'System Form',
          text: 'Inquiry received through public haute website.'
        }
      ],
      converted_wedding_id: null,
      created_at: new Date().toISOString()
    };

    setEnquiries(prev => [newEnquiry, ...prev]);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('enquiries').insert([newEnquiry]);
      } catch (err) {
        console.warn('Supabase sync skipped/failed:', err);
      }
    }

    logActivity('Enquiry Received', formData.client_names, `Public inquiry submitted for ${formData.destination}`);
    return newEnquiry;
  };

  const updateEnquiryStatus = (enquiryId, newStatus) => {
    setEnquiries(prev => prev.map(e => e.id === enquiryId ? { ...e, status: newStatus } : e));
    logActivity('Status Updated', 'Enquiry Desk', `Enquiry ${enquiryId} status changed to ${newStatus}`);
  };

  const addEnquiryNote = (enquiryId, noteText, authorName = 'Vikram Sen') => {
    const newNote = {
      date: new Date().toISOString().split('T')[0],
      author: authorName,
      text: noteText
    };
    setEnquiries(prev => prev.map(e => {
      if (e.id === enquiryId) {
        return {
          ...e,
          notes: [...(e.notes || []), newNote]
        };
      }
      return e;
    }));
    logActivity('Note Added', authorName, `Added call note to enquiry ${enquiryId}`);
  };

  // WORKFLOW A: CONVERT ENQUIRY TO WEDDING PROJECT
  // Reuses enquiry data directly & automatically generates 25+ default planning tasks
  const convertEnquiryToWedding = async (enquiryId, assignedPlanner = 'Priya Sharma') => {
    const enquiry = enquiries.find(e => e.id === enquiryId);
    if (!enquiry) return null;

    // Prevent duplicate wedding creation from repeated clicks
    if (enquiry.converted_wedding_id) {
      const existing = weddings.find(w => w.id === enquiry.converted_wedding_id);
      if (existing) {
        setSelectedWeddingId(existing.id);
        return existing;
      }
    }

    // Try backend API call if server is running
    try {
      const { api } = await import('../lib/api');
      api.convertEnquiryToWedding(enquiryId, assignedPlanner).catch(e => console.warn('API sync notice:', e));
    } catch (e) {
      // Ignore if offline
    }

    const newWeddingId = `wed-${Date.now().toString().slice(-4)}`;
    const newWedding = {
      id: newWeddingId,
      title: `${enquiry.client_names} — Royal Celebration`,
      couple_names: enquiry.client_names,
      email: enquiry.email,
      phone: enquiry.phone,
      destination: enquiry.destination,
      venue: `${enquiry.destination} Heritage Estate`,
      dates: `${enquiry.wedding_date}`,
      start_date: enquiry.wedding_date,
      end_date: enquiry.wedding_date,
      package_tier: enquiry.package_type,
      expected_guests: enquiry.expected_guests,
      actual_checkins: 0,
      contract_amount: enquiry.estimated_budget,
      assigned_planner: assignedPlanner,
      planner_id: 'user-planner',
      client_id: 'user-client',
      status: 'Active Planning',
      progress: 15,
      cover_image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
      enquiry_id: enquiry.id
    };

    // Update enquiry record
    setEnquiries(prev => prev.map(e => e.id === enquiryId ? {
      ...e,
      status: 'Confirmed',
      converted_wedding_id: newWeddingId
    } : e));

    // Add new wedding project
    setWeddings(prev => [newWedding, ...prev]);
    setSelectedWeddingId(newWeddingId);

    // Generate 27 default tasks
    const templateTasks = [
      { title: "Draft Executive Design Dossier & Budget Allocation Matrix", category: "Initial Planning", priority: "Urgent" },
      { title: "Establish Escrow Account & Schedule Milestone Invoicing", category: "Initial Planning", priority: "High" },
      { title: "Finalize Royal Invitation Box Typography & Wax Monogram Seals", category: "Initial Planning", priority: "Medium" },
      { title: "Lock Destination Heritage Palace & Courtyard Venues", category: "Venue", priority: "Urgent" },
      { title: "Obtain Heritage ASI & Noise Curfew Special Permissions", category: "Venue", priority: "High" },
      { title: "Finalize Generator Power Backups & Mandap AC Structures", category: "Venue", priority: "Medium" },
      { title: "Approve 3D Scenography & Mandap Render for Ceremony", category: "Decoration", priority: "Urgent" },
      { title: "Floral Procurement Lock with Domestic & Dutch Imports", category: "Decoration", priority: "High" },
      { title: "Curate Custom Velvet Table Linens & Gold Charger Settings", category: "Decoration", priority: "Medium" },
      { title: "Issue Catering RFP & Select 3 Luxury Banqueting Vendors", category: "Catering", priority: "Urgent" },
      { title: "Schedule Formal Food Tasting Session with Executive Chef", category: "Catering", priority: "High" },
      { title: "Contract Artisanal Mixology & Custom Spirit Bar Team", category: "Catering", priority: "Medium" },
      { title: "Contract Lead Celebrity Photographer & Cinema Director", category: "Photography", priority: "High" },
      { title: "Deliver Shot List & Royal Portrait Lighting Schematics", category: "Photography", priority: "Medium" },
      { title: "Book Master Celebrity Mehendi Artist & Assistant Crew", category: "Mehendi", priority: "High" },
      { title: "Install Garden Cabanas, Folk Dancers & Bangle Bazaar", category: "Mehendi", priority: "Medium" },
      { title: "Stage & Concert Trussing Setup for Musical Sangeet", category: "Sangeet", priority: "High" },
      { title: "Choreography Rehearsal Schedule & Family Cueing", category: "Sangeet", priority: "Medium" },
      { title: "Sound Check & Headlining Artist Hospitality Protocol", category: "Sangeet", priority: "Urgent" },
      { title: "Baraat Procession Route, Vintage Open Car & Royal Brass Band", category: "Wedding Ceremony", priority: "High" },
      { title: "Mandap Vedic Priest Coordination & Havan Samagri Pure Ghee Logistics", category: "Wedding Ceremony", priority: "Medium" },
      { title: "Rose Petal Showers & Synchronized Pyrotechnic Sparklers", category: "Wedding Ceremony", priority: "High" },
      { title: "Durbar Hall Black Tie Seating Plan & Royal Table Monograms", category: "Reception", priority: "Medium" },
      { title: "Live Symphony String Quartet & Toastmaster Coordination", category: "Reception", priority: "Low" },
      { title: "Dispatch Digital QR Invitations & Activate Concierge Portal", category: "Guest Coordination", priority: "Urgent" },
      { title: "Airport Chauffeur Dispatch & Fleet Management", category: "Guest Coordination", priority: "High" },
      { title: "Post-Event Damage Deposit Returns & Final Vendor Reconciliation", category: "Final Reconciliation", priority: "Medium" }
    ];

    const generatedTasks = templateTasks.map((t, idx) => ({
      id: `task-${Date.now()}-${idx}`,
      wedding_id: newWeddingId,
      title: t.title,
      category: t.category,
      assigned_member: assignedPlanner,
      due_date: new Date(Date.now() + (idx + 1) * 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: t.priority,
      status: "To Plan",
      notes: "Auto-generated from Full-Service Atelier template upon enquiry conversion."
    }));

    setTasks(prev => [...generatedTasks, ...prev]);

    // Initial milestone payments
    const bookingAmount = enquiry.estimated_budget * 0.15;
    const initialMilestones = [
      {
        id: `pay-c-${Date.now()}-1`,
        wedding_id: newWeddingId,
        milestone_name: "Retainer & Date Reservation Token (15%)",
        amount: bookingAmount,
        due_date: new Date().toISOString().split('T')[0],
        paid_date: new Date().toISOString().split('T')[0],
        status: "Received",
        payment_method: "Escrow Wire Transfer",
        reference_no: `ESCROW-${Date.now()}`,
        notes: "Retainer settled upon conversion."
      },
      {
        id: `pay-c-${Date.now()}-2`,
        wedding_id: newWeddingId,
        milestone_name: "First Production Advance (30%)",
        amount: enquiry.estimated_budget * 0.30,
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        paid_date: null,
        status: "Pending",
        payment_method: "Scheduled RTGS",
        reference_no: `INV-VIA-${newWeddingId}-01`,
        notes: "Design & Venue Lock Milestone."
      }
    ];

    setClientPayments(prev => [...initialMilestones, ...prev]);

    logActivity('Enquiry Converted', assignedPlanner, `Enquiry ${enquiry.client_names} converted into project ${newWeddingId} with 27 planning tasks.`, newWeddingId);
    return newWedding;
  };

  // 2. TASKS ACTIONS
  const createTask = (taskData) => {
    const newTask = {
      id: `task-${Date.now()}`,
      wedding_id: taskData.wedding_id || selectedWeddingId,
      title: taskData.title,
      category: taskData.category || "General Planning",
      assigned_member: taskData.assigned_member || "Priya Sharma",
      due_date: taskData.due_date || new Date().toISOString().split('T')[0],
      priority: taskData.priority || "Medium",
      status: taskData.status || "To Plan",
      notes: taskData.notes || ""
    };
    setTasks(prev => [newTask, ...prev]);
    logActivity('Task Created', newTask.assigned_member, `Created task "${newTask.title}"`);
    return newTask;
  };

  const updateTaskStatus = (taskId, newStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    logActivity('Task Updated', 'Wedding Planner', `Task status updated to ${newStatus}`);
  };

  // 3. VENDOR & QUOTATION ACTIONS
  const createQuotationRequest = (rfpData) => {
    const newRfp = {
      id: `rfp-${Date.now().toString().slice(-4)}`,
      wedding_id: rfpData.wedding_id || selectedWeddingId,
      category: rfpData.category,
      title: rfpData.title,
      description: rfpData.description,
      status: "Open",
      created_at: new Date().toISOString()
    };
    setQuotationRequests(prev => [newRfp, ...prev]);
    logActivity('RFP Issued', 'Priya Sharma', `Issued quotation request for ${rfpData.category}`);
    return newRfp;
  };

  const submitQuotation = (quotationData) => {
    const newQuote = {
      id: `quote-${Date.now().toString().slice(-4)}`,
      request_id: quotationData.request_id,
      wedding_id: quotationData.wedding_id || selectedWeddingId,
      vendor_id: quotationData.vendor_id,
      vendor_name: quotationData.vendor_name,
      price_per_plate_or_service: parseFloat(quotationData.price_per_plate_or_service),
      total_quoted_amount: parseFloat(quotationData.total_quoted_amount),
      service_inclusions: quotationData.service_inclusions,
      additional_charges: parseFloat(quotationData.additional_charges || 0),
      notes: quotationData.notes || "",
      proposal_pdf_url: quotationData.proposal_pdf_url || "/docs/Vendor_Proposal.pdf",
      status: "Submitted",
      shared_with_client: false,
      client_feedback: null,
      created_at: new Date().toISOString()
    };
    setQuotations(prev => [newQuote, ...prev]);
    logActivity('Quotation Submitted', quotationData.vendor_name, `Submitted proposal for ₹${newQuote.total_quoted_amount.toLocaleString('en-IN')}`);
    return newQuote;
  };

  // Share selected proposal with couple
  const shareQuotationWithClient = (quoteId) => {
    setQuotations(prev => prev.map(q => {
      if (q.id === quoteId) {
        return {
          ...q,
          status: "Shared with Client",
          shared_with_client: true
        };
      }
      return q;
    }));
    logActivity('Proposal Shared', 'Priya Sharma', `Shared quotation ${quoteId} with client via Client Portal`);
  };

  // Client approvals via Client Portal
  const clientApproveQuotation = (quoteId, feedback = "Approved by couple.") => {
    const quote = quotations.find(q => q.id === quoteId);
    if (!quote) return;

    setQuotations(prev => prev.map(q => {
      if (q.id === quoteId) {
        return {
          ...q,
          status: "Client Approved",
          client_feedback: feedback
        };
      }
      return q;
    }));

    logActivity('Client Proposal Approval', 'Aarav & Meera (Client)', `Couple approved proposal from ${quote.vendor_name}!`);
  };

  const clientRejectQuotation = (quoteId, feedback = "Requesting changes.") => {
    setQuotations(prev => prev.map(q => {
      if (q.id === quoteId) {
        return {
          ...q,
          status: "Client Rejected",
          client_feedback: feedback
        };
      }
      return q;
    }));
    logActivity('Client Requested Revisions', 'Aarav & Meera (Client)', `Client requested revisions on quotation ${quoteId}`);
  };

  // Confirm selected vendor: closes other quotations, marks confirmed, creates vendor assignment & payment ledger
  const confirmVendorQuotation = (quoteId) => {
    const winningQuote = quotations.find(q => q.id === quoteId);
    if (!winningQuote) return;

    // 1. Update winning quote
    setQuotations(prev => prev.map(q => {
      if (q.id === quoteId) {
        return { ...q, status: "Confirmed" };
      }
      if (q.request_id === winningQuote.request_id && q.id !== quoteId) {
        return { ...q, status: "Closed" };
      }
      return q;
    }));

    // 2. Update quotation request status
    setQuotationRequests(prev => prev.map(r => r.id === winningQuote.request_id ? { ...r, status: "Vendor Confirmed" } : r));

    // 3. Update vendor confirmed assignments
    setVendors(prev => prev.map(v => {
      if (v.id === winningQuote.vendor_id) {
        const assignments = v.confirmed_assignments || [];
        return {
          ...v,
          confirmed_assignments: assignments.includes(selectedWedding.title) ? assignments : [...assignments, selectedWedding.title]
        };
      }
      return v;
    }));

    // 4. Create vendor payment schedule in ledger
    const newVendorPayment = {
      id: `pay-v-${Date.now()}`,
      wedding_id: winningQuote.wedding_id,
      vendor_id: winningQuote.vendor_id,
      vendor_name: winningQuote.vendor_name,
      category: "Catering & Banqueting",
      milestone_name: "Initial Production Advance (30%)",
      agreed_amount: winningQuote.total_quoted_amount,
      amount_paid: 0,
      additional_charges: winningQuote.additional_charges,
      balance_due: winningQuote.total_quoted_amount + winningQuote.additional_charges,
      status: "Pending",
      due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    setVendorPayments(prev => [newVendorPayment, ...prev]);

    logActivity('Vendor Confirmed', 'Priya Sharma', `Vendor ${winningQuote.vendor_name} confirmed for ${winningQuote.total_quoted_amount.toLocaleString('en-IN')}. Other bids closed.`);
  };

  // 4. GUEST & EVENT CHECK-IN ACTIONS
  const addGuest = (guestData) => {
    const newGuest = {
      id: `gst-${Date.now()}`,
      wedding_id: guestData.wedding_id || selectedWeddingId,
      name: guestData.name,
      phone: guestData.phone || "",
      family_group: guestData.family_group || "General Guests",
      plus_ones: parseInt(guestData.plus_ones) || 0,
      invitation_category: guestData.invitation_category || "VIP",
      functions_attending: guestData.functions_attending || ["All"],
      rsvp_status: guestData.rsvp_status || "Pending",
      checked_in: false,
      checked_in_at: null,
      qr_code: `VIVAAH-W01-G${Date.now().toString().slice(-4)}-${guestData.name.replace(/\s+/g, '').toUpperCase()}`,
      table_assigned: guestData.table_assigned || "Unassigned"
    };
    setGuests(prev => [newGuest, ...prev]);
    logActivity('Guest Added', 'Concierge Desk', `Added guest ${guestData.name}`);
    return newGuest;
  };

  const checkInGuest = (identifier, isQr = false) => {
    // identifier can be guest ID or QR code text
    const target = guests.find(g => isQr ? g.qr_code === identifier : g.id === identifier);
    if (!target) {
      return { success: false, message: "Guest record not found." };
    }
    if (target.checked_in) {
      return {
        success: false,
        message: `Duplicate check-in prevented. ${target.name} already checked in at ${new Date(target.checked_in_at).toLocaleTimeString()}.`,
        guest: target
      };
    }

    const checkInTime = new Date().toISOString();
    setGuests(prev => prev.map(g => g.id === target.id ? {
      ...g,
      checked_in: true,
      checked_in_at: checkInTime
    } : g));

    // Update actual checkins count in wedding
    setWeddings(prev => prev.map(w => w.id === target.wedding_id ? {
      ...w,
      actual_checkins: (w.actual_checkins || 0) + 1 + (target.plus_ones || 0)
    } : w));

    logActivity('Guest Check-in', 'Arjun Verma (Run-of-Show)', `${target.name} checked in via ${isQr ? 'QR Code' : 'Manual Registry'}`);
    return {
      success: true,
      message: `Successfully checked in ${target.name} (+${target.plus_ones} accompanying)!`,
      guest: { ...target, checked_in: true, checked_in_at: checkInTime }
    };
  };

  const updateArrivalStatus = (arrivalId, newStatus, actualTime = null, issue = null) => {
    setVendorArrivals(prev => prev.map(a => {
      if (a.id === arrivalId) {
        return {
          ...a,
          arrival_status: newStatus,
          actual_arrival_time: actualTime || (newStatus === 'Arrived' ? new Date().toTimeString().slice(0, 5) : a.actual_arrival_time),
          reported_issue: issue !== null ? issue : a.reported_issue
        };
      }
      return a;
    }));
    logActivity('Vendor Arrival Updated', 'Arjun Verma', `Vendor arrival status marked as ${newStatus}`);
  };

  // 5. FINANCE ACTIONS
  const recordClientPayment = (paymentData) => {
    // Duplicate check
    const existing = clientPayments.find(p => p.reference_no && p.reference_no === paymentData.reference_no);
    if (existing) {
      throw new Error(`Duplicate transaction reference ${paymentData.reference_no} already exists.`);
    }

    const newPayment = {
      id: `pay-c-${Date.now()}`,
      wedding_id: paymentData.wedding_id || selectedWeddingId,
      milestone_name: paymentData.milestone_name,
      amount: parseFloat(paymentData.amount),
      due_date: paymentData.due_date,
      paid_date: new Date().toISOString().split('T')[0],
      status: "Received",
      payment_method: paymentData.payment_method || "RTGS Wire",
      reference_no: paymentData.reference_no || `TXN-${Date.now()}`,
      notes: paymentData.notes || ""
    };
    setClientPayments(prev => [newPayment, ...prev]);
    logActivity('Client Payment Recorded', 'Siddharth Goenka', `Received ₹${newPayment.amount.toLocaleString('en-IN')} for ${newPayment.milestone_name}`);
    return newPayment;
  };

  const recordVendorPayment = (paymentData) => {
    const target = vendorPayments.find(v => v.id === paymentData.vendor_payment_id);
    if (!target) return;

    const paymentAmount = parseFloat(paymentData.amount);
    const newPaid = target.amount_paid + paymentAmount;
    const newBalance = Math.max(0, target.agreed_amount + target.additional_charges - newPaid);

    setVendorPayments(prev => prev.map(v => {
      if (v.id === paymentData.vendor_payment_id) {
        return {
          ...v,
          amount_paid: newPaid,
          balance_due: newBalance,
          status: newBalance === 0 ? "Paid in Full" : "Partially Paid"
        };
      }
      return v;
    }));

    logActivity('Vendor Payment Disbursed', 'Siddharth Goenka', `Disbursed ₹${paymentAmount.toLocaleString('en-IN')} to ${target.vendor_name}`);
  };

  const addExpense = (expenseData) => {
    const newExp = {
      id: `exp-${Date.now()}`,
      wedding_id: expenseData.wedding_id || selectedWeddingId,
      category: expenseData.category,
      description: expenseData.description,
      amount: parseFloat(expenseData.amount),
      recorded_by: expenseData.recorded_by || "Priya Sharma",
      created_at: new Date().toISOString()
    };
    setExpenses(prev => [newExp, ...prev]);
    logActivity('Expense Recorded', newExp.recorded_by, `Logged ₹${newExp.amount.toLocaleString('en-IN')} under ${newExp.category}`);
    return newExp;
  };

  // 6. DOCUMENTS ACTION
  const uploadDocument = (docData) => {
    const newDoc = {
      id: `doc-${Date.now()}`,
      wedding_id: docData.wedding_id || selectedWeddingId,
      file_name: docData.file_name,
      file_url: docData.file_url || "/docs/Sample_Dossier.pdf",
      category: docData.category || "General",
      file_size: docData.file_size || "2.4 MB",
      uploaded_by: docData.uploaded_by || "Priya Sharma",
      created_at: new Date().toISOString()
    };
    setDocuments(prev => [newDoc, ...prev]);
    logActivity('Document Stored', newDoc.uploaded_by, `Uploaded ${newDoc.file_name}`);
    return newDoc;
  };

  // Calculated Financial Metrics for Selected Wedding
  const totalAgreedContract = selectedWedding?.contract_amount || 0;
  const weddingExpenses = expenses.filter(e => e.wedding_id === selectedWeddingId);
  const totalAdditionalExpenses = weddingExpenses.reduce((sum, e) => sum + e.amount, 0);

  const weddingClientPayments = clientPayments.filter(p => p.wedding_id === selectedWeddingId);
  const totalClientReceived = weddingClientPayments.filter(p => p.status === 'Received').reduce((sum, p) => sum + p.amount, 0);
  const totalClientPending = weddingClientPayments.filter(p => p.status === 'Pending').reduce((sum, p) => sum + p.amount, 0);

  const weddingVendorPayments = vendorPayments.filter(p => p.wedding_id === selectedWeddingId);
  const totalVendorAgreed = weddingVendorPayments.reduce((sum, v) => sum + v.agreed_amount + v.additional_charges, 0);
  const totalVendorPaid = weddingVendorPayments.reduce((sum, v) => sum + v.amount_paid, 0);
  const totalVendorBalanceDue = weddingVendorPayments.reduce((sum, v) => sum + v.balance_due, 0);

  // Revenue = Contract + Approved Client Extras
  const totalRevenue = totalAgreedContract;
  // Total Expenses = Vendor Costs + Additional Expenses
  const totalProjectExpenses = totalVendorAgreed + totalAdditionalExpenses;
  // Estimated Profit = Total Revenue - Total Expenses
  const estimatedProfit = totalRevenue - totalProjectExpenses;
  const profitMargin = totalRevenue > 0 ? ((estimatedProfit / totalRevenue) * 100).toFixed(1) : 0;

  return (
    <DataContext.Provider value={{
      // Core Data
      weddings,
      selectedWeddingId,
      setSelectedWeddingId,
      selectedWedding,
      enquiries,
      tasks,
      vendors,
      quotationRequests,
      quotations,
      guests,
      events,
      vendorArrivals,
      clientPayments,
      vendorPayments,
      expenses,
      documents,
      activityLogs,

      // Operations & Workflows
      createEnquiry,
      updateEnquiryStatus,
      addEnquiryNote,
      convertEnquiryToWedding,
      createTask,
      updateTaskStatus,
      createQuotationRequest,
      submitQuotation,
      shareQuotationWithClient,
      clientApproveQuotation,
      clientRejectQuotation,
      confirmVendorQuotation,
      addGuest,
      checkInGuest,
      updateArrivalStatus,
      recordClientPayment,
      recordVendorPayment,
      addExpense,
      uploadDocument,
      logActivity,

      // Computed Metrics
      financials: {
        totalAgreedContract,
        totalRevenue,
        totalClientReceived,
        totalClientPending,
        totalVendorAgreed,
        totalVendorPaid,
        totalVendorBalanceDue,
        totalAdditionalExpenses,
        totalProjectExpenses,
        estimatedProfit,
        profitMargin
      }
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
