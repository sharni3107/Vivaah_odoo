import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
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
import { useAuth } from './AuthContext';
import { isUUID } from '../lib/uuid';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const { currentUser, isLoading: isAuthLoading } = useAuth();
  const isDemoMode = import.meta.env.VITE_DEMO_MODE !== 'false';

  // Loading & Connection States
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);
  const [tableErrors, setTableErrors] = useState({});
  const [connectionStatus, setConnectionStatus] = useState(isSupabaseConfigured ? 'connected' : 'offline');

  // Helper to load stored demo data without polluting it with authenticated user data
  const getStoredDemoData = (key, fallback) => {
    const stored = localStorage.getItem(`vivaah_demo_${key}`) || localStorage.getItem(`vivaah_${key}`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(`Error parsing stored demo data for ${key}`, e);
      }
    }
    return fallback;
  };

  // Helper to load with localStorage persistence fallback
  const usePersistentState = (key, initialValue) => {
    const [state, setState] = useState(() => {
      // In production mode, do not default to seed data if nothing is stored
      if (!isDemoMode && !localStorage.getItem(`vivaah_demo_${key}`) && !localStorage.getItem(`vivaah_${key}`)) {
        return [];
      }
      return isDemoMode ? getStoredDemoData(key, initialValue) : [];
    });

    useEffect(() => {
      // ONLY sync to demo storage if in demo mode AND no authenticated user is logged in
      // This strictly prevents private Supabase records from authenticated sessions polluting demo storage!
      if (state !== undefined && isDemoMode && !currentUser) {
        localStorage.setItem(`vivaah_demo_${key}`, JSON.stringify(state));
      }
    }, [key, state, currentUser, isDemoMode]);

    return [state, setState];
  };

  const [weddings, setWeddings] = usePersistentState('weddings', initialWeddings);
  const [selectedWeddingId, setSelectedWeddingId] = useState('wed-001');
  const [enquiries, setEnquiries] = usePersistentState('enquiries', initialEnquiries);
  const [tasks, setTasks] = usePersistentState('tasks', initialTasks);
  const [vendors, setVendors] = usePersistentState('vendors', initialVendors);
  const [quotationRequests, setQuotationRequests] = usePersistentState('quotation_requests', initialQuotationRequests);
  const [quotations, setQuotations] = usePersistentState('quotations', initialQuotations);
  const [weddingVendors, setWeddingVendors] = usePersistentState('wedding_vendors', []);
  const [guests, setGuests] = usePersistentState('guests', initialGuests);
  const [events, setEvents] = usePersistentState('events', initialEvents);
  const [vendorArrivals, setVendorArrivals] = usePersistentState('vendor_arrivals', initialVendorArrivals);
  const [clientPayments, setClientPayments] = usePersistentState('client_payments', initialClientPayments);
  const [vendorPayments, setVendorPayments] = usePersistentState('vendor_payments', initialVendorPayments);
  const [expenses, setExpenses] = usePersistentState('expenses', initialExpenses);
  const [documents, setDocuments] = usePersistentState('documents', initialDocuments);
  const [activityLogs, setActivityLogs] = usePersistentState('activity_logs', initialActivityLogs);

  // Clear all private application state (used on logout and account-switching)
  const clearPrivateState = useCallback(() => {
    setWeddings([]);
    setEnquiries([]);
    setTasks([]);
    setVendors([]);
    setQuotationRequests([]);
    setQuotations([]);
    setWeddingVendors([]);
    setGuests([]);
    setEvents([]);
    setVendorArrivals([]);
    setClientPayments([]);
    setVendorPayments([]);
    setExpenses([]);
    setDocuments([]);
    setActivityLogs([]);
  }, [
    setWeddings, setEnquiries, setTasks, setVendors, setQuotationRequests,
    setQuotations, setWeddingVendors, setGuests, setEvents, setVendorArrivals,
    setClientPayments, setVendorPayments, setExpenses, setDocuments, setActivityLogs
  ]);

  // Demo State Hydration: restores clean demo records (preserving customized demo records, not previous user's private data)
  const hydrateDemoState = useCallback(() => {
    if (!isDemoMode) return;
    setWeddings(getStoredDemoData('weddings', initialWeddings));
    setEnquiries(getStoredDemoData('enquiries', initialEnquiries));
    setTasks(getStoredDemoData('tasks', initialTasks));
    setVendors(getStoredDemoData('vendors', initialVendors));
    setQuotationRequests(getStoredDemoData('quotation_requests', initialQuotationRequests));
    setQuotations(getStoredDemoData('quotations', initialQuotations));
    setGuests(getStoredDemoData('guests', initialGuests));
    setEvents(getStoredDemoData('events', initialEvents));
    setVendorArrivals(getStoredDemoData('vendor_arrivals', initialVendorArrivals));
    setClientPayments(getStoredDemoData('client_payments', initialClientPayments));
    setVendorPayments(getStoredDemoData('vendor_payments', initialVendorPayments));
    setExpenses(getStoredDemoData('expenses', initialExpenses));
    setDocuments(getStoredDemoData('documents', initialDocuments));
    setActivityLogs(getStoredDemoData('activity_logs', initialActivityLogs));
  }, [
    isDemoMode, setWeddings, setEnquiries, setTasks, setVendors, setQuotationRequests,
    setQuotations, setGuests, setEvents, setVendorArrivals, setClientPayments,
    setVendorPayments, setExpenses, setDocuments, setActivityLogs
  ]);

  // Primary Supabase Data Fetcher
  const fetchData = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      setConnectionStatus('offline');
      setIsLoading(false);
      return;
    }

    setIsFetching(true);
    setError(null);
    const newErrors = {};

    try {
      // Query all tables in parallel filtered by is_demo
      const results = await Promise.allSettled([
        supabase.from('weddings').select('*').eq('is_demo', isDemoMode),
        supabase.from('enquiries').select('*').eq('is_demo', isDemoMode),
        supabase.from('tasks').select('*').eq('is_demo', isDemoMode),
        supabase.from('vendors').select('*').eq('is_demo', isDemoMode),
        supabase.from('quotation_requests').select('*').eq('is_demo', isDemoMode),
        supabase.from('quotations').select('*').eq('is_demo', isDemoMode),
        supabase.from('wedding_vendors').select('*').eq('is_demo', isDemoMode),
        supabase.from('guests').select('*').eq('is_demo', isDemoMode),
        supabase.from('events').select('*').eq('is_demo', isDemoMode),
        supabase.from('vendor_arrivals').select('*').eq('is_demo', isDemoMode),
        supabase.from('client_payments').select('*').eq('is_demo', isDemoMode),
        supabase.from('vendor_payments').select('*').eq('is_demo', isDemoMode),
        supabase.from('expenses').select('*').eq('is_demo', isDemoMode),
        supabase.from('documents').select('*').eq('is_demo', isDemoMode),
        supabase.from('activity_logs').select('*').eq('is_demo', isDemoMode).order('created_at', { ascending: false })
      ]);

      const [
        weddingsRes,
        enquiriesRes,
        tasksRes,
        vendorsRes,
        quotationReqsRes,
        quotationsRes,
        weddingVendorsRes,
        guestsRes,
        eventsRes,
        vendorArrivalsRes,
        clientPaymentsRes,
        vendorPaymentsRes,
        expensesRes,
        documentsRes,
        activityLogsRes
      ] = results;

      let connectedTablesCount = 0;

      // Helper to process table response without wiping valid state on query failure
      const processTableResult = (res, tableName, setState, initialFallback) => {
        if (res.status === 'fulfilled' && !res.value.error) {
          const data = res.value.data;
          if (data && data.length > 0) {
            setState(data);
            connectedTablesCount++;
          } else if (!isDemoMode) {
            // In production mode, an empty table legitimately means 0 records
            setState([]);
            connectedTablesCount++;
          } else {
            // In demo mode, if remote table has 0 demo records, preserve existing demo state or restore seed fallback
            setState(prev => (prev && prev.length > 0 ? prev : (initialFallback || [])));
            connectedTablesCount++;
          }
        } else {
          const errMsg = res.status === 'rejected'
            ? (res.reason?.message || 'Promise rejected')
            : (res.value?.error?.message || 'Query error');
          newErrors[tableName] = errMsg;
          console.error(`DataContext: Supabase query error for table '${tableName}':`, errMsg);
          // Failed queries must preserve existing valid data belonging to the current session!
          setState(prev => {
            if (prev && prev.length > 0) return prev;
            return isDemoMode ? (initialFallback || []) : [];
          });
        }
      };

      processTableResult(weddingsRes, 'weddings', setWeddings, initialWeddings);
      processTableResult(enquiriesRes, 'enquiries', setEnquiries, initialEnquiries);
      processTableResult(tasksRes, 'tasks', setTasks, initialTasks);

      // Vendors Table: handles private base table with public_vendor_directory fallback
      if (vendorsRes.status === 'fulfilled' && !vendorsRes.value.error && vendorsRes.value.data?.length > 0) {
        setVendors(vendorsRes.value.data);
        connectedTablesCount++;
      } else {
        // Fall back to public vendor directory view
        try {
          const pubDirRes = await supabase.from('public_vendor_directory').select('*');
          if (!pubDirRes.error && pubDirRes.data && pubDirRes.data.length > 0) {
            setVendors(pubDirRes.data);
            connectedTablesCount++;
          } else if (!isDemoMode) {
            setVendors([]);
          } else {
            setVendors(prev => (prev && prev.length > 0 ? prev : initialVendors));
          }
        } catch (dirErr) {
          newErrors.vendors = dirErr.message;
          console.error('DataContext: public_vendor_directory query failed:', dirErr);
          setVendors(prev => {
            if (prev && prev.length > 0) return prev;
            return isDemoMode ? initialVendors : [];
          });
        }
      }

      processTableResult(quotationReqsRes, 'quotation_requests', setQuotationRequests, initialQuotationRequests);
      processTableResult(quotationsRes, 'quotations', setQuotations, initialQuotations);
      processTableResult(weddingVendorsRes, 'wedding_vendors', setWeddingVendors, []);
      processTableResult(guestsRes, 'guests', setGuests, initialGuests);
      processTableResult(eventsRes, 'events', setEvents, initialEvents);
      processTableResult(vendorArrivalsRes, 'vendor_arrivals', setVendorArrivals, initialVendorArrivals);
      processTableResult(clientPaymentsRes, 'client_payments', setClientPayments, initialClientPayments);
      processTableResult(vendorPaymentsRes, 'vendor_payments', setVendorPayments, initialVendorPayments);
      processTableResult(expensesRes, 'expenses', setExpenses, initialExpenses);
      processTableResult(documentsRes, 'documents', setDocuments, initialDocuments);
      processTableResult(activityLogsRes, 'activity_logs', setActivityLogs, initialActivityLogs);

      setTableErrors(newErrors);
      setConnectionStatus(connectedTablesCount > 0 ? 'connected' : 'offline');
    } catch (err) {
      console.warn('DataContext: Supabase fetch notice:', err.message);
      setError(err.message || 'Database connection notice');
      setConnectionStatus('error');
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  }, [isDemoMode, currentUser, setWeddings, setEnquiries, setTasks, setVendors, setQuotationRequests, setQuotations, setWeddingVendors, setGuests, setEvents, setVendorArrivals, setClientPayments, setVendorPayments, setExpenses, setDocuments, setActivityLogs]);

  // Auth Lifecycle: Watch currentUser and isAuthLoading changes safely
  const prevUserIdRef = useRef(null);
  const initialAuthDoneRef = useRef(false);

  useEffect(() => {
    // Wait until initial session check in AuthContext has fully completed
    if (isAuthLoading) return;

    const currentId = currentUser?.id || null;

    if (!initialAuthDoneRef.current) {
      initialAuthDoneRef.current = true;
      prevUserIdRef.current = currentId;

      if (currentId) {
        fetchData();
      } else if (isDemoMode) {
        // In demo mode without login, ensure demo data is hydrated
        hydrateDemoState();
      } else {
        // In production mode without login, clear private state
        clearPrivateState();
      }
      return;
    }

    // Subsequent user state transitions
    if (currentId !== prevUserIdRef.current) {
      const prevId = prevUserIdRef.current;
      prevUserIdRef.current = currentId;

      if (currentId && prevId && currentId !== prevId) {
        // Switching between authenticated users: clear previous user's private records immediately!
        clearPrivateState();
        fetchData();
      } else if (currentId && !prevId) {
        // User logged in: clear demo state and fetch user's private data
        clearPrivateState();
        fetchData();
      } else if (!currentId && prevId) {
        // Explicit logout: clear previous user's private records completely
        clearPrivateState();
        if (isDemoMode) {
          // In demo mode, hydrate clean demo data separately after private records are cleared
          hydrateDemoState();
        }
      }
    }
  }, [currentUser, isAuthLoading, isDemoMode, fetchData, clearPrivateState, hydrateDemoState]);

  // Auth Lifecycle: Listen to live Supabase auth events
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setIsLoading(false);
      return;
    }

    // Trigger initial fetch
    fetchData();

    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      // Avoid a full database reload on routine TOKEN_REFRESHED events
      if (event === 'TOKEN_REFRESHED') return;

      if (event === 'SIGNED_OUT') {
        if (!isDemoMode) {
          clearPrivateState();
        } else {
          hydrateDemoState();
        }
      } else if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        fetchData();
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [clearPrivateState, fetchData, hydrateDemoState, isDemoMode]);

  // Ensure selectedWeddingId is valid whenever weddings list updates
  useEffect(() => {
    if (weddings && weddings.length > 0) {
      const exists = weddings.some(w => w.id === selectedWeddingId);
      if (!exists) {
        setSelectedWeddingId(weddings[0].id);
      }
    }
  }, [weddings, selectedWeddingId]);

  // Selected Wedding helper
  const selectedWedding = weddings.find(w => w.id === selectedWeddingId) || weddings[0] || null;

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

  // ==============================================================================
  // CATEGORY 1: ENQUIRIES & WEDDING PROJECTS (Supabase Connected)
  // ==============================================================================

  const createEnquiry = async (formData) => {
    const enquiryId = crypto.randomUUID();
    const clientNames = formData.client_names || formData.client_name || '';
    const email = formData.email || '';
    const phone = formData.phone || '';
    const weddingDate = formData.wedding_date || new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0];
    const destination = formData.destination || 'Jaipur';

    // Verify assigned_executive_id format: must be a valid UUID referencing public.profiles(id)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const validAssignedExecId = formData.assigned_executive_id && uuidRegex.test(formData.assigned_executive_id)
      ? formData.assigned_executive_id
      : null;

    // Supabase database payload strictly matching public.enquiries table schema
    const dbPayload = {
      id: enquiryId,
      client_names: clientNames,
      email: email,
      phone: phone,
      represented_by: formData.represented_by || 'Self (The Couple)',
      wedding_date: weddingDate,
      destination: destination,
      expected_guests: parseInt(formData.expected_guests, 10) || 250,
      package_type: formData.package_type || 'Full-Service Wedding Planning',
      estimated_budget: parseFloat(formData.estimated_budget) || 15000000,
      preferred_theme: formData.preferred_theme || '',
      additional_requirements: formData.additional_requirements || '',
      status: 'New',
      notes: [
        {
          date: new Date().toISOString().split('T')[0],
          author: 'System Form',
          text: 'Inquiry received through public website.'
        }
      ],
      converted_wedding_id: null,
      is_demo: isDemoMode
    };

    if (validAssignedExecId) {
      dbPayload.assigned_executive_id = validAssignedExecId;
    }

    if (isSupabaseConfigured && supabase) {
      // Respect RLS: Public anonymous submit policy allows INSERT with status = 'New'
      // Note: do not use .select() for anonymous inserts to respect patron read privacy
      const { error: insertErr } = await supabase.from('enquiries').insert([dbPayload]);
      if (insertErr) {
        console.error('DataContext: Supabase enquiry insert error:', insertErr);
        throw new Error(`Failed to submit enquiry to database: ${insertErr.message}`);
      }
    }

    // In-memory representation for UI components
    const newEnquiry = {
      ...dbPayload,
      assigned_executive: formData.assigned_executive || 'Vikram Sen',
      created_at: new Date().toISOString()
    };

    // Update React state only after successful database operation
    setEnquiries(prev => [newEnquiry, ...prev]);
    logActivity('Enquiry Received', clientNames, `Public inquiry submitted for ${destination}`);
    return newEnquiry;
  };

  const updateEnquiryStatus = async (enquiryId, newStatus) => {
    if (isSupabaseConfigured && supabase && isUUID(enquiryId)) {
      const { error: updateErr } = await supabase
        .from('enquiries')
        .update({ status: newStatus })
        .eq('id', enquiryId);

      if (updateErr) {
        console.error('DataContext: Supabase enquiry status update error:', updateErr);
        throw new Error(`Database error updating status: ${updateErr.message}`);
      }
    }

    // Update React state
    setEnquiries(prev => prev.map(e => e.id === enquiryId ? { ...e, status: newStatus } : e));
    logActivity('Status Updated', 'Enquiry Desk', `Enquiry ${enquiryId} status changed to ${newStatus}`);
    return { success: true, status: newStatus };
  };

  const addEnquiryNote = async (enquiryId, noteText, authorName = 'Vikram Sen') => {
    const targetEnquiry = enquiries.find(e => e.id === enquiryId);
    const newNote = {
      date: new Date().toISOString().split('T')[0],
      author: authorName,
      text: noteText
    };
    const updatedNotes = targetEnquiry ? [...(targetEnquiry.notes || []), newNote] : [newNote];

    if (isSupabaseConfigured && supabase && isUUID(enquiryId)) {
      const { error: noteErr } = await supabase
        .from('enquiries')
        .update({ notes: updatedNotes })
        .eq('id', enquiryId);

      if (noteErr) {
        console.error('DataContext: Supabase add note error:', noteErr);
        throw new Error(`Database error saving note: ${noteErr.message}`);
      }
    }

    // Update React state only after successful database operation
    setEnquiries(prev => prev.map(e => {
      if (e.id === enquiryId) {
        return {
          ...e,
          notes: updatedNotes
        };
      }
      return e;
    }));
    logActivity('Note Added', authorName, `Added call note to enquiry ${enquiryId}`);
    return { success: true, note: newNote };
  };

  // WORKFLOW A: CONVERT ENQUIRY TO WEDDING PROJECT
  const convertEnquiryToWedding = async (enquiryId, assignedPlanner = 'Priya Sharma') => {
    const enquiry = enquiries.find(e => e.id === enquiryId);
    if (!enquiry) {
      throw new Error(`Enquiry ${enquiryId} not found.`);
    }

    // Prevent duplicate wedding creation if the same enquiry is converted more than once
    if (enquiry.converted_wedding_id) {
      const existing = weddings.find(w => w.id === enquiry.converted_wedding_id);
      if (existing) {
        setSelectedWeddingId(existing.id);
        return existing;
      }
    }

    const newWeddingId = crypto.randomUUID();
    const newWedding = {
      id: newWeddingId,
      enquiry_id: enquiry.id,
      title: `${enquiry.client_names} — Royal Celebration`,
      couple_names: enquiry.client_names,
      email: enquiry.email,
      phone: enquiry.phone,
      destination: enquiry.destination,
      venue: `${enquiry.destination} Heritage Estate`,
      start_date: enquiry.wedding_date,
      end_date: enquiry.wedding_date,
      package_tier: enquiry.package_type,
      expected_guests: enquiry.expected_guests,
      actual_checkins: 0,
      contract_amount: enquiry.estimated_budget,
      assigned_planner: assignedPlanner,
      status: 'In Planning',
      progress: 15,
      cover_image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
      notes: `Converted from enquiry ${enquiry.id}. Requirements: ${enquiry.additional_requirements || 'Standard'}`,
      is_demo: isDemoMode,
      created_at: new Date().toISOString()
    };

    // Generate 27 default tasks
    const templateTasks = [
      { title: "Draft Wedding Plan & Budget Allocation Matrix", category: "Initial Planning", priority: "Urgent" },
      { title: "Set Up Payment Schedule & Schedule Milestone Invoicing", category: "Initial Planning", priority: "High" },
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
      { title: "Dispatch Digital QR Invitations & Activate Guest Portal", category: "Guest Coordination", priority: "Urgent" },
      { title: "Airport Chauffeur Dispatch & Fleet Management", category: "Guest Coordination", priority: "High" },
      { title: "Post-Event Damage Deposit Returns & Final Vendor Reconciliation", category: "Final Reconciliation", priority: "Medium" }
    ];

    const generatedTasks = templateTasks.map((t, idx) => ({
      id: crypto.randomUUID(),
      wedding_id: newWeddingId,
      title: t.title,
      category: t.category,
      assigned_member: assignedPlanner,
      due_date: new Date(Date.now() + (idx + 1) * 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: t.priority,
      status: "To Plan",
      notes: "Auto-generated upon enquiry conversion.",
      is_demo: isDemoMode,
      created_at: new Date().toISOString()
    }));

    // Initial milestone payments
    const bookingAmount = enquiry.estimated_budget * 0.15;
    const initialMilestones = [
      {
        id: crypto.randomUUID(),
        wedding_id: newWeddingId,
        milestone_name: "Retainer & Date Reservation Token (15%)",
        amount: bookingAmount,
        due_date: new Date().toISOString().split('T')[0],
        paid_date: new Date().toISOString().split('T')[0],
        status: "Received",
        payment_method: "Direct Wire Transfer",
        reference_no: `TXN-${Date.now()}`,
        is_demo: isDemoMode,
        created_at: new Date().toISOString()
      },
      {
        id: crypto.randomUUID(),
        wedding_id: newWeddingId,
        milestone_name: "First Production Advance (30%)",
        amount: enquiry.estimated_budget * 0.30,
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        paid_date: null,
        status: "Pending",
        payment_method: "Scheduled RTGS",
        reference_no: `INV-VIA-${newWeddingId.slice(-4)}-01`,
        is_demo: isDemoMode,
        created_at: new Date().toISOString()
      }
    ];

    if (isSupabaseConfigured && supabase) {
      // 1. Insert wedding project
      const { error: wedErr } = await supabase.from('weddings').insert([newWedding]);
      if (wedErr) {
        console.error('DataContext: Failed to insert wedding into Supabase:', wedErr);
        throw new Error(`Database error creating wedding project: ${wedErr.message}`);
      }

      // 2. Update enquiry with converted_wedding_id and Confirmed status
      const { error: enqErr } = await supabase
        .from('enquiries')
        .update({ status: 'Confirmed', converted_wedding_id: newWeddingId })
        .eq('id', enquiry.id);
      if (enqErr) {
        console.warn('DataContext: Notice updating converted_wedding_id on enquiry:', enqErr);
      }

      // 3. Batch insert generated tasks into public.tasks
      const { error: tasksErr } = await supabase.from('tasks').insert(generatedTasks);
      if (tasksErr) {
        console.warn('DataContext: Notice batch-inserting initial tasks in Supabase:', tasksErr);
      }

      // 4. Batch insert initial client payment milestones
      const { error: paymentsErr } = await supabase.from('client_payments').insert(initialMilestones);
      if (paymentsErr) {
        console.warn('DataContext: Notice batch-inserting client payments in Supabase:', paymentsErr);
      }
    }

    // Update React state only after successful database operations
    setWeddings(prev => [newWedding, ...prev]);
    setSelectedWeddingId(newWeddingId);
    setEnquiries(prev => prev.map(e => e.id === enquiryId ? {
      ...e,
      status: 'Confirmed',
      converted_wedding_id: newWeddingId
    } : e));
    setTasks(prev => [...generatedTasks, ...prev]);
    setClientPayments(prev => [...initialMilestones, ...prev]);

    logActivity('Enquiry Converted', assignedPlanner, `Enquiry ${enquiry.client_names} converted into project ${newWeddingId} with ${generatedTasks.length} planning tasks.`, newWeddingId);
    return newWedding;
  };

  // ==============================================================================
  // CATEGORY 2: TASKS (Supabase Connected)
  // ==============================================================================

  const createTask = async (taskData) => {
    const targetWeddingId = taskData.wedding_id || selectedWeddingId;
    // Verify wedding_id references an existing authorized wedding project
    const targetWedding = weddings.find(w => w.id === targetWeddingId);
    if (!targetWedding && weddings.length > 0) {
      throw new Error(`Cannot create task: wedding project ${targetWeddingId} not found.`);
    }

    const taskId = crypto.randomUUID();
    const newTask = {
      id: taskId,
      wedding_id: targetWeddingId,
      title: taskData.title,
      category: taskData.category || "General Planning",
      assigned_member: taskData.assigned_member || "Priya Sharma",
      due_date: taskData.due_date || new Date().toISOString().split('T')[0],
      priority: taskData.priority || "Medium",
      status: taskData.status || "To Plan",
      notes: taskData.notes || "",
      is_demo: isDemoMode,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase && isUUID(targetWeddingId)) {
      const { error: taskErr } = await supabase.from('tasks').insert([newTask]);
      if (taskErr) {
        console.error('DataContext: Supabase task creation error:', taskErr);
        throw new Error(`Database error creating task: ${taskErr.message}`);
      }
    }

    // Update React state
    setTasks(prev => [newTask, ...prev]);
    logActivity('Task Created', newTask.assigned_member, `Created task "${newTask.title}"`, targetWeddingId);
    return newTask;
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    // Only send to Supabase if taskId is a real UUID (avoids invalid input syntax for demo IDs like 'task-001')
    if (isSupabaseConfigured && supabase && isUUID(taskId)) {
      const { error: updateErr } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', taskId);

      if (updateErr) {
        console.error('DataContext: Supabase task status update error:', updateErr);
        throw new Error(`Database error updating task status: ${updateErr.message}`);
      }
    }

    // Update React state
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    logActivity('Task Updated', 'Wedding Planner', `Task status updated to ${newStatus}`);
    return { success: true, status: newStatus };
  };

  // ==============================================================================
  // CATEGORY 4: VENDORS, RFQS & QUOTATIONS (Supabase Connected)
  // ==============================================================================

  const createQuotationRequest = async (rfpData) => {
    const rfpId = crypto.randomUUID();
    const newRfp = {
      id: rfpId,
      wedding_id: rfpData.wedding_id || selectedWeddingId,
      vendor_id: rfpData.vendor_id || null,
      category: rfpData.category,
      title: rfpData.title,
      description: rfpData.description || "",
      status: "Open",
      is_demo: isDemoMode,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase && isUUID(newRfp.wedding_id)) {
      const { error: rfpErr } = await supabase.from('quotation_requests').insert([newRfp]);
      if (rfpErr) {
        console.error('DataContext: Supabase RFQ creation error:', rfpErr);
        throw new Error(`Database error creating quotation request: ${rfpErr.message}`);
      }
    }

    setQuotationRequests(prev => [newRfp, ...prev]);
    logActivity('RFP Issued', 'Priya Sharma', `Issued quotation request for ${rfpData.category}`, newRfp.wedding_id);
    return newRfp;
  };

  const submitQuotation = async (quotationData) => {
    const quoteId = crypto.randomUUID();
    const newQuote = {
      id: quoteId,
      request_id: quotationData.request_id,
      wedding_id: quotationData.wedding_id || selectedWeddingId,
      vendor_id: quotationData.vendor_id,
      price_per_plate_or_service: parseFloat(quotationData.price_per_plate_or_service),
      total_quoted_amount: parseFloat(quotationData.total_quoted_amount),
      service_inclusions: quotationData.service_inclusions || "",
      additional_charges: parseFloat(quotationData.additional_charges || 0),
      notes: quotationData.notes || "",
      proposal_pdf_url: quotationData.proposal_pdf_url || "/docs/Vendor_Proposal.pdf",
      status: "Submitted",
      shared_with_client: false,
      client_feedback: null,
      is_demo: isDemoMode,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase && isUUID(newQuote.wedding_id) && isUUID(newQuote.request_id)) {
      const { error: quoteErr } = await supabase.from('quotations').insert([newQuote]);
      if (quoteErr) {
        console.error('DataContext: Supabase quote submission error:', quoteErr);
        throw new Error(`Database error submitting quotation: ${quoteErr.message}`);
      }
    }

    setQuotations(prev => [newQuote, ...prev]);
    logActivity('Quotation Submitted', quotationData.vendor_name || 'Vendor Partner', `Submitted proposal for ₹${newQuote.total_quoted_amount.toLocaleString('en-IN')}`, newQuote.wedding_id);
    return newQuote;
  };

  const shareQuotationWithClient = async (quoteId) => {
    if (isSupabaseConfigured && supabase && isUUID(quoteId)) {
      const { error: shareErr } = await supabase
        .from('quotations')
        .update({ shared_with_client: true })
        .eq('id', quoteId);

      if (shareErr) {
        console.error('DataContext: Supabase quote share error:', shareErr);
        throw new Error(`Database error sharing quotation: ${shareErr.message}`);
      }
    }

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
    return { success: true };
  };

  // Client approvals via Client Portal (Supabase Connected)
  const clientApproveQuotation = async (quoteId, feedback = "Approved by couple.") => {
    const quote = quotations.find(q => q.id === quoteId);
    if (!quote) throw new Error("Quotation not found");

    if (isSupabaseConfigured && supabase && isUUID(quoteId)) {
      const { error: quoteErr } = await supabase
        .from('quotations')
        .update({
          status: "Client Approved",
          client_feedback: feedback
        })
        .eq('id', quoteId);

      if (quoteErr) {
        console.error('DataContext: Supabase quote approval error:', quoteErr);
        throw new Error(`Database error approving quotation: ${quoteErr.message}`);
      }
    }

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

    logActivity('Client Proposal Approval', 'Aarav & Meera (Client)', `Couple approved proposal from ${quote.vendor_name || 'Vendor Partner'}!`);
    return { success: true };
  };

  const clientRejectQuotation = async (quoteId, feedback = "Requesting changes.") => {
    const quote = quotations.find(q => q.id === quoteId);
    if (!quote) throw new Error("Quotation not found");

    if (isSupabaseConfigured && supabase && isUUID(quoteId)) {
      const { error: quoteErr } = await supabase
        .from('quotations')
        .update({
          status: "Client Rejected",
          client_feedback: feedback
        })
        .eq('id', quoteId);

      if (quoteErr) {
        console.error('DataContext: Supabase quote rejection error:', quoteErr);
        throw new Error(`Database error rejecting quotation: ${quoteErr.message}`);
      }
    }

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
    return { success: true };
  };

  // Confirm selected vendor: closes other quotations, marks confirmed, creates vendor assignment & payment ledger
  const confirmVendorQuotation = async (quoteId) => {
    const winningQuote = quotations.find(q => q.id === quoteId);
    if (!winningQuote) throw new Error("Quotation not found");

    const weddingId = winningQuote.wedding_id || selectedWeddingId;
    const vendorId = winningQuote.vendor_id;
    const agreedAmount = Number(winningQuote.total_quoted_amount) || 0;
    const addlCharges = Number(winningQuote.additional_charges) || 0;
    const totalAgreed = agreedAmount + addlCharges;
    const weddingTitle = selectedWedding?.title || 'Wedding Project';

    const newWvId = crypto.randomUUID();
    const newVpId = crypto.randomUUID();
    const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    if (isSupabaseConfigured && supabase && isUUID(quoteId) && isUUID(weddingId)) {
      // 1. Update winning quote
      const { error: winErr } = await supabase
        .from('quotations')
        .update({ status: "Confirmed" })
        .eq('id', quoteId);
      if (winErr) throw new Error(`Database error confirming quotation: ${winErr.message}`);

      // 2. Close competing quotes if request_id exists
      if (winningQuote.request_id) {
        await supabase
          .from('quotations')
          .update({ status: "Closed" })
          .eq('request_id', winningQuote.request_id)
          .neq('id', quoteId);

        // Update RFQ status
        await supabase
          .from('quotation_requests')
          .update({ status: "Vendor Confirmed" })
          .eq('id', winningQuote.request_id);
      }

      // 3. Insert confirmed assignment into wedding_vendors
      const { error: wvErr } = await supabase
        .from('wedding_vendors')
        .insert({
          id: newWvId,
          wedding_id: weddingId,
          vendor_id: vendorId,
          category: winningQuote.category || "Catering",
          agreed_amount: agreedAmount,
          contract_status: "Confirmed",
          is_demo: isDemoMode
        });
      if (wvErr) {
        console.warn('DataContext: wedding_vendors insert warning:', wvErr);
      }

      // 4. Update vendor's confirmed_assignments array
      const targetVendor = vendors.find(v => v.id === vendorId);
      if (targetVendor && isUUID(vendorId)) {
        const existingAssignments = targetVendor.confirmed_assignments || [];
        if (!existingAssignments.includes(weddingTitle)) {
          const updatedAssignments = [...existingAssignments, weddingTitle];
          await supabase
            .from('vendors')
            .update({ confirmed_assignments: updatedAssignments })
            .eq('id', vendorId);
        }
      }

      // 5. Insert initial payment milestone into vendor_payments
      const { error: vpErr } = await supabase
        .from('vendor_payments')
        .insert({
          id: newVpId,
          wedding_id: weddingId,
          vendor_id: vendorId,
          milestone_name: "Initial Production Advance (30%)",
          agreed_amount: agreedAmount,
          amount_paid: 0,
          additional_charges: addlCharges,
          balance_due: totalAgreed,
          status: "Pending",
          due_date: dueDate,
          is_demo: isDemoMode
        });
      if (vpErr) {
        console.warn('DataContext: vendor_payments insert warning:', vpErr);
      }
    }

    // Update React State
    setQuotations(prev => prev.map(q => {
      if (q.id === quoteId) return { ...q, status: "Confirmed" };
      if (winningQuote.request_id && q.request_id === winningQuote.request_id && q.id !== quoteId) {
        return { ...q, status: "Closed" };
      }
      return q;
    }));

    if (winningQuote.request_id) {
      setQuotationRequests(prev => prev.map(r => r.id === winningQuote.request_id ? { ...r, status: "Vendor Confirmed" } : r));
    }

    setVendors(prev => prev.map(v => {
      if (v.id === vendorId) {
        const assignments = v.confirmed_assignments || [];
        return {
          ...v,
          confirmed_assignments: assignments.includes(weddingTitle) ? assignments : [...assignments, weddingTitle]
        };
      }
      return v;
    }));

    const newWeddingVendor = {
      id: newWvId,
      wedding_id: weddingId,
      vendor_id: vendorId,
      category: winningQuote.category || "Catering",
      agreed_amount: agreedAmount,
      contract_status: "Confirmed",
      is_demo: isDemoMode
    };
    setWeddingVendors(prev => [...prev, newWeddingVendor]);

    const newVendorPayment = {
      id: newVpId,
      wedding_id: weddingId,
      vendor_id: vendorId,
      vendor_name: winningQuote.vendor_name,
      category: winningQuote.category || "Catering & Banqueting",
      milestone_name: "Initial Production Advance (30%)",
      agreed_amount: agreedAmount,
      amount_paid: 0,
      additional_charges: addlCharges,
      balance_due: totalAgreed,
      status: "Pending",
      due_date: dueDate,
      is_demo: isDemoMode
    };
    setVendorPayments(prev => [newVendorPayment, ...prev]);

    logActivity('Vendor Confirmed', 'Priya Sharma', `Vendor ${winningQuote.vendor_name || 'Partner'} confirmed for ₹${agreedAmount.toLocaleString('en-IN')}. Other bids closed.`);
    return { success: true, winningQuote, newVendorPayment };
  };

  // ==============================================================================
  // CATEGORY 3: GUESTS & ATOMIC CHECK-IN (Supabase Connected)
  // ==============================================================================

  const addGuest = async (guestData) => {
    const guestId = crypto.randomUUID();
    const qrCode = guestData.qr_code || `VIVAAH-W01-G${Date.now().toString().slice(-4)}-${guestData.name.replace(/\s+/g, '').toUpperCase()}`;
    const newGuest = {
      id: guestId,
      wedding_id: guestData.wedding_id || selectedWeddingId,
      name: guestData.name,
      phone: guestData.phone || "",
      family_group: guestData.family_group || "General Guests",
      plus_ones: parseInt(guestData.plus_ones, 10) || 0,
      invitation_category: guestData.invitation_category || "VIP",
      rsvp_status: guestData.rsvp_status || "Pending",
      checked_in: false,
      checked_in_at: null,
      qr_code: qrCode,
      table_assigned: guestData.table_assigned || "Unassigned",
      is_demo: isDemoMode,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase && isUUID(newGuest.wedding_id)) {
      const { error: guestErr } = await supabase.from('guests').insert([newGuest]);
      if (guestErr) {
        console.error('DataContext: Supabase add guest error:', guestErr);
        throw new Error(`Database error adding guest: ${guestErr.message}`);
      }
    }

    // Update React state only after successful database operation
    setGuests(prev => [newGuest, ...prev]);
    logActivity('Guest Added', 'Guest Operations Desk', `Added guest ${guestData.name}`, newGuest.wedding_id);
    return newGuest;
  };

  const updateGuest = async (guestId, updatedFields) => {
    if (isSupabaseConfigured && supabase && isUUID(guestId)) {
      const { error: updateErr } = await supabase
        .from('guests')
        .update(updatedFields)
        .eq('id', guestId);

      if (updateErr) {
        console.error('DataContext: Supabase update guest error:', updateErr);
        throw new Error(`Database error updating guest: ${updateErr.message}`);
      }
    }

    // Update React state
    setGuests(prev => prev.map(g => g.id === guestId ? { ...g, ...updatedFields } : g));
    logActivity('Guest Updated', 'Guest Operations Desk', `Updated guest details`);
    return { success: true };
  };

  const deleteGuest = async (guestId) => {
    if (isSupabaseConfigured && supabase && isUUID(guestId)) {
      const { error: deleteErr } = await supabase
        .from('guests')
        .delete()
        .eq('id', guestId);

      if (deleteErr) {
        console.error('DataContext: Supabase delete guest error:', deleteErr);
        throw new Error(`Database error deleting guest: ${deleteErr.message}`);
      }
    }

    // Update React state
    setGuests(prev => prev.filter(g => g.id !== guestId));
    logActivity('Guest Removed', 'Guest Operations Desk', `Removed guest record`);
    return { success: true };
  };

  const checkInGuest = async (identifier, isQr = false) => {
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
    let updatedTotalCheckins = null;

    // Only query Supabase if target.id is a real UUID (protects demo records like 'gst-005')
    if (isSupabaseConfigured && supabase && isUUID(target.id)) {
      try {
        const { data: rpcRes, error: rpcErr } = await supabase.rpc('check_in_guest', {
          p_guest_id: isQr ? null : (isUUID(target.id) ? target.id : null),
          p_qr_code: isQr ? identifier : null
        });

        if (!rpcErr && rpcRes) {
          if (!rpcRes.success) {
            return rpcRes;
          }
          if (rpcRes.actual_checkins !== undefined) {
            updatedTotalCheckins = rpcRes.actual_checkins;
          }
        } else if (isUUID(target.id)) {
          // Fallback to transaction-safe conditional update
          const { error: updateGuestErr } = await supabase
            .from('guests')
            .update({ checked_in: true, checked_in_at: checkInTime })
            .eq('id', target.id)
            .eq('checked_in', false);

          if (updateGuestErr) {
            console.error('DataContext: Supabase check-in error:', updateGuestErr);
            return { success: false, message: `Database error during check-in: ${updateGuestErr.message}` };
          }

          // Recalculate actual check-ins from guests table
          if (isUUID(target.wedding_id)) {
            const { data: checkedGuests } = await supabase
              .from('guests')
              .select('plus_ones')
              .eq('wedding_id', target.wedding_id)
              .eq('checked_in', true);

            if (checkedGuests) {
              const calculatedTotal = checkedGuests.reduce((sum, g) => sum + 1 + (g.plus_ones || 0), 0);
              updatedTotalCheckins = calculatedTotal;
              await supabase
                .from('weddings')
                .update({ actual_checkins: calculatedTotal })
                .eq('id', target.wedding_id);
            }
          }
        }
      } catch (err) {
        console.error('DataContext: Check-in RPC exception:', err);
        return { success: false, message: `Failed to record check-in: ${err.message}` };
      }
    }

    // Update React state
    const updatedGuest = { ...target, checked_in: true, checked_in_at: checkInTime };
    setGuests(prev => prev.map(g => g.id === target.id ? updatedGuest : g));

    setWeddings(prev => prev.map(w => {
      if (w.id === target.wedding_id) {
        const newCount = updatedTotalCheckins !== null
          ? updatedTotalCheckins
          : (w.actual_checkins || 0) + 1 + (target.plus_ones || 0);
        return { ...w, actual_checkins: newCount };
      }
      return w;
    }));

    logActivity('Guest Check-in', 'Arjun Verma (Run-of-Show)', `${target.name} checked in via ${isQr ? 'QR Code' : 'Manual Registry'}`, target.wedding_id);
    return {
      success: true,
      message: `Successfully checked in ${target.name} (+${target.plus_ones} accompanying)!`,
      guest: updatedGuest,
      actual_checkins: updatedTotalCheckins
    };
  };

  const undoCheckInGuest = async (guestId) => {
    const target = guests.find(g => g.id === guestId);
    if (!target) return { success: false, message: 'Guest not found' };

    let updatedTotalCheckins = null;

    if (isSupabaseConfigured && supabase && isUUID(guestId)) {
      try {
        const { data: rpcRes, error: rpcErr } = await supabase.rpc('undo_guest_check_in', {
          p_guest_id: guestId
        });

        if (!rpcErr && rpcRes) {
          if (!rpcRes.success) return rpcRes;
          if (rpcRes.actual_checkins !== undefined) {
            updatedTotalCheckins = rpcRes.actual_checkins;
          }
        } else {
          const { error: undoErr } = await supabase
            .from('guests')
            .update({ checked_in: false, checked_in_at: null })
            .eq('id', guestId)
            .eq('checked_in', true);

          if (undoErr) {
            return { success: false, message: `Database error undoing check-in: ${undoErr.message}` };
          }

          if (isUUID(target.wedding_id)) {
            const { data: checkedGuests } = await supabase
              .from('guests')
              .select('plus_ones')
              .eq('wedding_id', target.wedding_id)
              .eq('checked_in', true);

            if (checkedGuests) {
              const calculatedTotal = checkedGuests.reduce((sum, g) => sum + 1 + (g.plus_ones || 0), 0);
              updatedTotalCheckins = calculatedTotal;
              await supabase
                .from('weddings')
                .update({ actual_checkins: calculatedTotal })
                .eq('id', target.wedding_id);
            }
          }
        }
      } catch (err) {
        console.error('DataContext: Undo check-in exception:', err);
        return { success: false, message: `Failed to reverse check-in: ${err.message}` };
      }
    }

    // Update React state
    setGuests(prev => prev.map(g => g.id === guestId ? { ...g, checked_in: false, checked_in_at: null } : g));
    setWeddings(prev => prev.map(w => {
      if (w.id === target.wedding_id) {
        const newCount = updatedTotalCheckins !== null
          ? updatedTotalCheckins
          : Math.max(0, (w.actual_checkins || 0) - (1 + (target.plus_ones || 0)));
        return { ...w, actual_checkins: newCount };
      }
      return w;
    }));

    logActivity('Guest Check-in Reversed', 'Guest Desk', `Reversed check-in for ${target.name}`, target.wedding_id);
    return { success: true, message: `Check-in reversed for ${target.name}` };
  };

  // ==============================================================================
  // CATEGORY 5: EVENTS & VENDOR ARRIVALS (Supabase Connected)
  // ==============================================================================

  const updateArrivalStatus = async (arrivalId, newStatus, actualTime = null, issue = null) => {
    const target = vendorArrivals.find(a => a.id === arrivalId);
    if (!target) throw new Error("Vendor arrival record not found");

    const calculatedTime = actualTime || (newStatus === 'Arrived' ? new Date().toTimeString().slice(0, 5) : target.actual_arrival_time);
    const updatePayload = {
      arrival_status: newStatus,
      actual_arrival_time: calculatedTime
    };
    if (issue !== null) {
      updatePayload.reported_issue = issue;
    }

    // Only update Supabase if arrivalId is a valid UUID (avoids invalid input syntax for demo IDs like 'arr-001')
    if (isSupabaseConfigured && supabase && isUUID(arrivalId)) {
      const { error: arrErr } = await supabase
        .from('vendor_arrivals')
        .update(updatePayload)
        .eq('id', arrivalId);

      if (arrErr) {
        console.error('DataContext: Supabase arrival update error:', arrErr);
        throw new Error(`Database error updating arrival status: ${arrErr.message}`);
      }
    }

    setVendorArrivals(prev => prev.map(a => {
      if (a.id === arrivalId) {
        return {
          ...a,
          ...updatePayload,
          reported_issue: issue !== null ? issue : a.reported_issue
        };
      }
      return a;
    }));
    logActivity('Vendor Arrival Updated', 'Arjun Verma', `Vendor arrival status marked as ${newStatus}`, target.wedding_id);
    return { success: true };
  };

  const addEvent = async (eventData) => {
    const eventId = crypto.randomUUID();
    const newEvent = {
      id: eventId,
      wedding_id: eventData.wedding_id || selectedWeddingId,
      event_name: eventData.event_name,
      date: eventData.date,
      start_time: eventData.start_time || '10:00',
      end_time: eventData.end_time || '14:00',
      location: eventData.location || '',
      dress_code: eventData.dress_code || 'Festive Indian / Formal',
      description: eventData.description || '',
      is_demo: isDemoMode
    };

    if (isSupabaseConfigured && supabase && isUUID(newEvent.wedding_id)) {
      const { error: evtErr } = await supabase
        .from('events')
        .insert(newEvent);

      if (evtErr) {
        console.error('DataContext: Supabase event creation error:', evtErr);
        throw new Error(`Database error adding event: ${evtErr.message}`);
      }
    }

    setEvents(prev => [...prev, newEvent]);
    logActivity('Event Added', 'Run-of-Show', `Added event: ${newEvent.event_name}`, newEvent.wedding_id);
    return newEvent;
  };

  const updateEvent = async (eventId, updatedFields) => {
    if (isSupabaseConfigured && supabase && isUUID(eventId)) {
      const { error: evtErr } = await supabase
        .from('events')
        .update(updatedFields)
        .eq('id', eventId);

      if (evtErr) {
        console.error('DataContext: Supabase event update error:', evtErr);
        throw new Error(`Database error updating event: ${evtErr.message}`);
      }
    }

    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, ...updatedFields } : e));
    logActivity('Event Updated', 'Run-of-Show', `Updated event details`);
    return { success: true };
  };

  const deleteEvent = async (eventId) => {
    if (isSupabaseConfigured && supabase && isUUID(eventId)) {
      const { error: evtErr } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (evtErr) {
        console.error('DataContext: Supabase event deletion error:', evtErr);
        throw new Error(`Database error deleting event: ${evtErr.message}`);
      }
    }

    setEvents(prev => prev.filter(e => e.id !== eventId));
    logActivity('Event Removed', 'Run-of-Show', `Removed event`);
    return { success: true };
  };

  // ==============================================================================
  // CATEGORY 4 (Continued): VENDOR DIRECTORY PARTNERS (Supabase Connected)
  // ==============================================================================

  const addVendor = async (vendorData) => {
    const vendorId = crypto.randomUUID();
    const newVendor = {
      id: vendorId,
      name: vendorData.name,
      category: vendorData.category || 'Catering',
      contact_person: vendorData.contact_person || '',
      phone: vendorData.phone || '',
      email: vendorData.email || '',
      services: vendorData.services || '',
      location: vendorData.location || 'Jaipur, Rajasthan',
      status: vendorData.status || 'Active',
      rating: parseFloat(vendorData.rating) || 4.8,
      confirmed_assignments: vendorData.confirmed_assignments || [],
      is_demo: isDemoMode
    };

    if (isSupabaseConfigured && supabase) {
      const { error: venErr } = await supabase
        .from('vendors')
        .insert(newVendor);

      if (venErr) {
        console.error('DataContext: Supabase vendor creation error:', venErr);
        throw new Error(`Database error creating vendor: ${venErr.message}`);
      }
    }

    setVendors(prev => [...prev, newVendor]);
    logActivity('Vendor Added', 'Vendor Management', `Added vendor partner: ${newVendor.name}`);
    return newVendor;
  };

  const updateVendor = async (vendorId, updatedFields) => {
    if (isSupabaseConfigured && supabase && isUUID(vendorId)) {
      const { error: venErr } = await supabase
        .from('vendors')
        .update(updatedFields)
        .eq('id', vendorId);

      if (venErr) {
        console.error('DataContext: Supabase vendor update error:', venErr);
        throw new Error(`Database error updating vendor: ${venErr.message}`);
      }
    }

    setVendors(prev => prev.map(v => v.id === vendorId ? { ...v, ...updatedFields } : v));
    logActivity('Vendor Updated', 'Vendor Management', `Updated vendor record`);
    return { success: true };
  };

  const deleteVendor = async (vendorId) => {
    if (isSupabaseConfigured && supabase && isUUID(vendorId)) {
      const { error: venErr } = await supabase
        .from('vendors')
        .delete()
        .eq('id', vendorId);

      if (venErr) {
        console.error('DataContext: Supabase vendor deletion error:', venErr);
        throw new Error(`Database error deleting vendor: ${venErr.message}`);
      }
    }

    setVendors(prev => prev.filter(v => v.id !== vendorId));
    logActivity('Vendor Removed', 'Vendor Management', `Removed vendor record`);
    return { success: true };
  };

  // ==============================================================================
  // CATEGORY 6: FINANCIAL LEDGERS & EXPENSES (Supabase Connected)
  // ==============================================================================

  const recordClientPayment = async (paymentData) => {
    // Duplicate check
    const existing = clientPayments.find(p => p.reference_no && p.reference_no === paymentData.reference_no);
    if (existing) {
      throw new Error(`Duplicate transaction reference ${paymentData.reference_no} already exists.`);
    }

    const paymentId = crypto.randomUUID();
    const newPayment = {
      id: paymentId,
      wedding_id: paymentData.wedding_id || selectedWeddingId,
      milestone_name: paymentData.milestone_name,
      amount: parseFloat(paymentData.amount),
      due_date: paymentData.due_date || new Date().toISOString().split('T')[0],
      paid_date: new Date().toISOString().split('T')[0],
      status: "Received",
      payment_method: paymentData.payment_method || "RTGS Wire Transfer",
      reference_no: paymentData.reference_no || `TXN-${Date.now()}`,
      notes: paymentData.notes || "",
      is_demo: isDemoMode
    };

    if (isSupabaseConfigured && supabase && isUUID(newPayment.wedding_id)) {
      // Exclude UI-only fields if table schema does not include notes
      const { notes, ...dbPayload } = newPayment;
      const { error: payErr } = await supabase
        .from('client_payments')
        .insert(dbPayload);

      if (payErr) {
        console.error('DataContext: Supabase client payment error:', payErr);
        throw new Error(`Database error recording client payment: ${payErr.message}`);
      }
    }

    setClientPayments(prev => [newPayment, ...prev]);
    logActivity('Client Payment Recorded', 'Siddharth Goenka', `Received ₹${newPayment.amount.toLocaleString('en-IN')} for ${newPayment.milestone_name}`, newPayment.wedding_id);
    return newPayment;
  };

  const recordVendorPayment = async (paymentData) => {
    const target = vendorPayments.find(v => v.id === paymentData.vendor_payment_id);
    if (!target) throw new Error("Vendor payment schedule not found");

    const paymentAmount = parseFloat(paymentData.amount);
    const newPaid = Number(target.amount_paid || 0) + paymentAmount;
    const totalDue = Number(target.agreed_amount || 0) + Number(target.additional_charges || 0);
    const newBalance = Math.max(0, totalDue - newPaid);
    const newStatus = newBalance === 0 ? "Paid in Full" : "Partially Paid";

    if (isSupabaseConfigured && supabase && isUUID(paymentData.vendor_payment_id)) {
      const { error: payErr } = await supabase
        .from('vendor_payments')
        .update({
          amount_paid: newPaid,
          balance_due: newBalance,
          status: newStatus
        })
        .eq('id', paymentData.vendor_payment_id);

      if (payErr) {
        console.error('DataContext: Supabase vendor payment error:', payErr);
        throw new Error(`Database error recording vendor payment: ${payErr.message}`);
      }
    }

    setVendorPayments(prev => prev.map(v => {
      if (v.id === paymentData.vendor_payment_id) {
        return {
          ...v,
          amount_paid: newPaid,
          balance_due: newBalance,
          status: newStatus
        };
      }
      return v;
    }));

    logActivity('Vendor Payment Disbursed', 'Siddharth Goenka', `Disbursed ₹${paymentAmount.toLocaleString('en-IN')} to ${target.vendor_name || 'Vendor'}`, target.wedding_id);
    return { success: true };
  };

  const addExpense = async (expenseData) => {
    const expId = crypto.randomUUID();
    const newExp = {
      id: expId,
      wedding_id: expenseData.wedding_id || selectedWeddingId,
      category: expenseData.category,
      description: expenseData.description,
      amount: parseFloat(expenseData.amount),
      recorded_by: expenseData.recorded_by || "Priya Sharma",
      is_demo: isDemoMode
    };

    if (isSupabaseConfigured && supabase && isUUID(newExp.wedding_id)) {
      const { error: expErr } = await supabase
        .from('expenses')
        .insert(newExp);

      if (expErr) {
        console.error('DataContext: Supabase expense error:', expErr);
        throw new Error(`Database error adding expense: ${expErr.message}`);
      }
    }

    setExpenses(prev => [newExp, ...prev]);
    logActivity('Expense Recorded', newExp.recorded_by, `Logged ₹${newExp.amount.toLocaleString('en-IN')} under ${newExp.category}`, newExp.wedding_id);
    return newExp;
  };

  // ==============================================================================
  // CATEGORY 7: PRIVATE DOCUMENTS & SUPABASE STORAGE (Signed URLs & Cleanup)
  // ==============================================================================

  const uploadDocument = async (docData) => {
    const docId = crypto.randomUUID();
    const weddingId = docData.wedding_id || selectedWeddingId;
    let storagePath = null;
    let signedFileUrl = null;

    // Handle real file upload to private bucket 'wedding-documents'
    if (isSupabaseConfigured && supabase && docData.file && (docData.file instanceof Blob || docData.file instanceof File)) {
      try {
        const cleanName = docData.file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        storagePath = `${weddingId}/${Date.now()}_${cleanName}`;

        const { error: storageErr } = await supabase.storage
          .from('wedding-documents')
          .upload(storagePath, docData.file, {
            cacheControl: '3600',
            upsert: false
          });

        if (storageErr) {
          console.warn('DataContext: Supabase Storage upload error (falling back to URL):', storageErr.message);
          storagePath = null;
        } else {
          // Generate signed URL (valid for 24 hours)
          const { data: signData, error: signErr } = await supabase.storage
            .from('wedding-documents')
            .createSignedUrl(storagePath, 86400);

          if (!signErr && signData?.signedUrl) {
            signedFileUrl = signData.signedUrl;
          }
        }
      } catch (err) {
        console.warn('DataContext: Storage upload exception:', err);
      }
    }

    const calculatedSize = docData.file_size || (docData.file ? `${(docData.file.size / (1024 * 1024)).toFixed(1)} MB` : '2.4 MB');
    const newDoc = {
      id: docId,
      wedding_id: weddingId,
      file_name: docData.file_name,
      file_url: signedFileUrl || docData.file_url || "/docs/Sample_Dossier.pdf",
      blob_url: storagePath || docData.blob_url || null,
      category: docData.category || "General",
      file_size: calculatedSize,
      uploaded_by: docData.uploaded_by || "Priya Sharma",
      is_demo: isDemoMode
    };

    if (isSupabaseConfigured && supabase && isUUID(weddingId)) {
      const { error: docErr } = await supabase
        .from('documents')
        .insert(newDoc);

      if (docErr) {
        // Cleanup storage orphan if database insert failed
        if (storagePath) {
          try {
            await supabase.storage.from('wedding-documents').remove([storagePath]);
          } catch (cleanErr) {
            console.error('DataContext: Failed to clean up storage orphan:', cleanErr);
          }
        }
        console.error('DataContext: Supabase document insert error:', docErr);
        throw new Error(`Database error saving document: ${docErr.message}`);
      }
    }

    setDocuments(prev => [newDoc, ...prev]);
    logActivity('Document Stored', newDoc.uploaded_by, `Uploaded ${newDoc.file_name}`, newDoc.wedding_id);
    return newDoc;
  };

  const getDocumentSignedUrl = async (docOrBlobPath) => {
    if (!isSupabaseConfigured || !supabase) return null;
    const blobPath = typeof docOrBlobPath === 'string' ? docOrBlobPath : docOrBlobPath?.blob_url;
    if (!blobPath) return null;

    try {
      const { data, error } = await supabase.storage
        .from('wedding-documents')
        .createSignedUrl(blobPath, 3600);
      if (error) {
        console.warn('DataContext: createSignedUrl error:', error);
        return null;
      }
      return data?.signedUrl || null;
    } catch (err) {
      console.warn('DataContext: getDocumentSignedUrl exception:', err);
      return null;
    }
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
      // Connection & Loading States
      isLoading,
      isFetching,
      error,
      tableErrors,
      connectionStatus,
      isDemoMode,
      refreshData: fetchData,

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
      weddingVendors,
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
      updateGuest,
      deleteGuest,
      checkInGuest,
      undoCheckInGuest,
      addEvent,
      updateEvent,
      deleteEvent,
      addVendor,
      updateVendor,
      deleteVendor,
      updateArrivalStatus,
      recordClientPayment,
      recordVendorPayment,
      addExpense,
      uploadDocument,
      getDocumentSignedUrl,
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
