// Vivaah — Comprehensive Seed Data
// Aligned with the Vivaah Luxury design system and project requirements

export const initialUsers = [
  {
    id: "user-admin",
    name: "Pooja Singhania",
    email: "pooja@vivaahateliers.com",
    role: "admin",
    designation: "Managing Director & Agency Head",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: "user-enquiry",
    name: "Vikram Sen",
    email: "vikram@vivaahateliers.com",
    role: "enquiry_executive",
    designation: "Head of Client Relations",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: "user-planner",
    name: "Priya Sharma",
    email: "priya@vivaahateliers.com",
    role: "wedding_planner",
    designation: "Principal Wedding Architect",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: "user-coord",
    name: "Arjun Verma",
    email: "arjun@vivaahateliers.com",
    role: "event_coordinator",
    designation: "Senior Run-of-Show Coordinator",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: "user-finance",
    name: "Siddharth Goenka",
    email: "siddharth@vivaahateliers.com",
    role: "finance_executive",
    designation: "Finance Director",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: "user-client",
    name: "Aarav & Meera",
    email: "aarav.meera@client.vivaah.com",
    role: "client",
    designation: "The Couple",
    avatar: "https://images.unsplash.com/photo-1621801306168-c61a5b820a9a?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: "user-vendor-catering",
    name: "Chef Ranveer Brar",
    email: "proposals@royalfeastcatering.com",
    role: "vendor",
    designation: "Royal Feast Catering Director",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80"
  }
];

export const initialWeddings = [
  {
    id: "wed-001",
    title: "Aarav & Meera — Royal Jaipur Wedding",
    couple_names: "Aarav Singhania & Meera Kapoor",
    email: "aarav.meera@client.vivaah.com",
    phone: "+91 98200 44123",
    destination: "Jaipur, Rajasthan",
    venue: "City Palace & Rambagh Palace",
    dates: "18–20 December 2026",
    start_date: "2026-12-18",
    end_date: "2026-12-20",
    package_tier: "Full-Service Wedding Planning",
    expected_guests: 400,
    actual_checkins: 412,
    contract_amount: 18000000, // ₹1.8 Crore
    assigned_planner: "Priya Sharma",
    planner_id: "user-planner",
    client_id: "user-client",
    status: "Active Execution",
    progress: 74,
    cover_image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    enquiry_id: "enq-001"
  },
  {
    id: "wed-002",
    title: "Kabir & Rhea — The Lake Como Symphony",
    couple_names: "Kabir Oberoi & Rhea Talwar",
    email: "kabir.rhea@client.vivaah.com",
    phone: "+44 7700 900888",
    destination: "Lake Como, Italy",
    venue: "Villa Balbiano",
    dates: "12–14 January 2027",
    start_date: "2027-01-12",
    end_date: "2027-01-14",
    package_tier: "Destination Wedding",
    expected_guests: 180,
    actual_checkins: 0,
    contract_amount: 25000000, // ₹2.5 Crore
    assigned_planner: "Priya Sharma",
    planner_id: "user-planner",
    client_id: null,
    status: "Design & Vendor RFP",
    progress: 42,
    cover_image: "https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=1200&q=80",
    enquiry_id: "enq-002"
  },
  {
    id: "wed-003",
    title: "Dev & Ananya — Udaipur Sunset Palace",
    couple_names: "Devraj Chauhan & Ananya Birla",
    email: "dev.ananya@client.vivaah.com",
    phone: "+91 98111 22334",
    destination: "Udaipur, Rajasthan",
    venue: "Taj Lake Palace & Jagmandir",
    dates: "04–06 February 2027",
    start_date: "2027-02-04",
    end_date: "2027-02-06",
    package_tier: "Full-Service Wedding Planning",
    expected_guests: 320,
    actual_checkins: 0,
    contract_amount: 21000000,
    assigned_planner: "Arjun Verma",
    planner_id: "user-coord",
    client_id: null,
    status: "Design & Logistics",
    progress: 30,
    cover_image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
    enquiry_id: "enq-003"
  }
];

export const initialEnquiries = [
  {
    id: "enq-001",
    client_names: "Aarav Singhania & Meera Kapoor",
    email: "aarav.meera@client.vivaah.com",
    phone: "+91 98200 44123",
    represented_by: "Self (The Couple)",
    wedding_date: "2026-12-18",
    destination: "Jaipur, Rajasthan",
    expected_guests: 400,
    package_type: "Full-Service Wedding Planning",
    estimated_budget: 18000000,
    preferred_theme: "Mughal Opulence meets Contemporary Architectural Romance",
    additional_requirements: "Helicopter petal drop, multi-cuisine silver thali feast, 400 VIP hospitality desk.",
    status: "Confirmed",
    assigned_executive: "Vikram Sen",
    notes: [
      { date: "2026-09-02", author: "Vikram Sen", text: "Initial phone consultation held. Extremely warm family, requested Jaipur City Palace priority." },
      { date: "2026-09-10", author: "Priya Sharma", text: "In-person design presentation at Taj Mahal Hotel Mumbai. Approved Full-Service retainer." },
      { date: "2026-09-15", author: "Pooja Singhania", text: "Contract signed, ₹25 Lakhs booking advance settled. Converted to Project wed-001." }
    ],
    converted_wedding_id: "wed-001",
    created_at: "2026-09-01T10:14:00Z"
  },
  {
    id: "enq-002",
    client_names: "Kabir Oberoi & Rhea Talwar",
    email: "kabir.rhea@client.vivaah.com",
    phone: "+44 7700 900888",
    represented_by: "Chief of Staff / Private Secretary",
    wedding_date: "2027-01-12",
    destination: "Lake Como, Italy",
    expected_guests: 180,
    package_type: "Destination Wedding",
    estimated_budget: 25000000,
    preferred_theme: "Alpine Waterfront Belle Époque",
    additional_requirements: "Private yacht transfers for guests from Bellagio to Villa Balbiano, Michelin star catering.",
    status: "Consultation Scheduled",
    assigned_executive: "Vikram Sen",
    notes: [
      { date: "2026-10-14", author: "Vikram Sen", text: "Family office reached out from Mayfair office. Site inspection in Como booked for next week." }
    ],
    converted_wedding_id: "wed-002",
    created_at: "2026-10-12T14:22:00Z"
  },
  {
    id: "enq-003",
    client_names: "Devraj Chauhan & Ananya Birla",
    email: "dev.ananya@client.vivaah.com",
    phone: "+91 98111 22334",
    represented_by: "Self (The Couple)",
    wedding_date: "2027-02-04",
    destination: "Udaipur, Rajasthan",
    expected_guests: 320,
    package_type: "Full-Service Wedding Planning",
    estimated_budget: 21000000,
    preferred_theme: "Royal Rajputana Grandeur & Candlelit Lake Courtyards",
    additional_requirements: "Jagmandir Island illuminated reception, Rajasthani royal folk musicians, private chartered jets.",
    status: "Follow-up",
    assigned_executive: "Vikram Sen",
    notes: [
      { date: "2026-10-20", author: "Vikram Sen", text: "Sent detailed moodboard portfolio. Awaiting budget signoff from patrons." }
    ],
    converted_wedding_id: "wed-003",
    created_at: "2026-10-18T09:30:00Z"
  },
  {
    id: "enq-004",
    client_names: "Vivaan Malhotra & Tara Shah",
    email: "vivaan.tara@malhotragroup.in",
    phone: "+91 98333 11223",
    represented_by: "Family Office / Trustee",
    wedding_date: "2027-03-22",
    destination: "South Goa Coastal Estate",
    expected_guests: 250,
    package_type: "Partial / Day-of Coordination",
    estimated_budget: 12000000,
    preferred_theme: "Tropical Modernist Sunset Soirée",
    additional_requirements: "Boho chic beach mandap, electronic music DJ setup for afterparty till dawn.",
    status: "Contacted",
    assigned_executive: "Vikram Sen",
    notes: [
      { date: "2026-10-26", author: "Vikram Sen", text: "Shared introductory agency brochure. Follow-up call booked for Nov 4." }
    ],
    converted_wedding_id: null,
    created_at: "2026-10-24T16:00:00Z"
  },
  {
    id: "enq-005",
    client_names: "Vikramaditya Rathore & Devika Deshmukh",
    email: "rathore.devika@heritageestates.co",
    phone: "+91 99201 55667",
    represented_by: "Self (The Couple)",
    wedding_date: "2027-04-10",
    destination: "Jodhpur Umaid Bhawan",
    expected_guests: 450,
    package_type: "Full-Service Wedding Planning",
    estimated_budget: 28000000,
    preferred_theme: "Art Deco Fortified Monarchy",
    additional_requirements: "Grand royal elephant procession with police escort clearance, 5-night stay buyout.",
    status: "New",
    assigned_executive: "Vikram Sen",
    notes: [],
    converted_wedding_id: null,
    created_at: "2026-10-30T11:45:00Z"
  },
  {
    id: "enq-006",
    client_names: "Dr. Siddharth Rao & Natasha Mehta",
    email: "siddharth.natasha@londonclinic.uk",
    phone: "+44 7911 123456",
    represented_by: "Self (The Couple)",
    wedding_date: "2027-05-18",
    destination: "French Riviera, Cannes",
    expected_guests: 150,
    package_type: "Destination Wedding",
    estimated_budget: 22000000,
    preferred_theme: "Côte d'Azur Champagne & White Floral Arch",
    additional_requirements: "Luxury catamaran welcome cruise, fireworks over Cannes bay.",
    status: "New",
    assigned_executive: "Vikram Sen",
    notes: [],
    converted_wedding_id: null,
    created_at: "2026-10-31T08:15:00Z"
  }
];

// 25+ Essential Tasks for Aarav & Meera (wed-001)
export const initialTasks = [
  // Initial Planning
  {
    id: "task-001",
    wedding_id: "wed-001",
    title: "Draft Wedding Plan & Budget Allocation Matrix",
    category: "Initial Planning",
    assigned_member: "Priya Sharma",
    due_date: "2026-09-25",
    priority: "Urgent",
    status: "Done",
    notes: "Approved by couple and parents at Taj Lands End presentation."
  },
  {
    id: "task-002",
    wedding_id: "wed-001",
    title: "Set Up Payment Schedule & Schedule Milestone Invoicing",
    category: "Initial Planning",
    assigned_member: "Siddharth Goenka",
    due_date: "2026-09-30",
    priority: "High",
    status: "Done",
    notes: "Payment schedule initialized with HDFC Special Accounts branch."
  },
  {
    id: "task-003",
    wedding_id: "wed-001",
    title: "Finalize Royal Invitation Box Typography & Wax Monogram Seals",
    category: "Initial Planning",
    assigned_member: "Priya Sharma",
    due_date: "2026-10-15",
    priority: "Medium",
    status: "Done",
    notes: "Letterpress prints on 600gsm cotton stock completed in London."
  },

  // Venue
  {
    id: "task-004",
    wedding_id: "wed-001",
    title: "Lock City Palace Zenana Courtyard & Rambagh Palace Hall",
    category: "Venue",
    assigned_member: "Priya Sharma",
    due_date: "2026-10-05",
    priority: "Urgent",
    status: "Done",
    notes: "Contract signed, 30L advance transferred."
  },
  {
    id: "task-005",
    wedding_id: "wed-001",
    title: "Obtain Rajasthan Heritage ASI Permissions & Noise Curtew Waivers",
    category: "Venue",
    assigned_member: "Vikram Sen",
    due_date: "2026-11-05",
    priority: "High",
    status: "In Progress",
    notes: "Application filed with District Magistrate's office."
  },
  {
    id: "task-006",
    wedding_id: "wed-001",
    title: "Finalize Generator Power Backups & Air Conditioned Mandap Shell",
    category: "Venue",
    assigned_member: "Arjun Verma",
    due_date: "2026-11-20",
    priority: "Medium",
    status: "To Plan",
    notes: "3x 250kVA silent generators requisitioned."
  },

  // Decoration & Scenography
  {
    id: "task-007",
    wedding_id: "wed-001",
    title: "Approve 3D Scenography & Mandap Render for Lake Pavilion",
    category: "Decoration",
    assigned_member: "Priya Sharma",
    due_date: "2026-10-28",
    priority: "Urgent",
    status: "Done",
    notes: "Render approved with 45,000 Dutch roses and brass filigree columns."
  },
  {
    id: "task-008",
    wedding_id: "wed-001",
    title: "Floral Procurement Lock with Bangalore & Dutch Imports",
    category: "Decoration",
    assigned_member: "Priya Sharma",
    due_date: "2026-11-15",
    priority: "High",
    status: "In Progress",
    notes: "Advance paid to Floral Couture by Rohini."
  },
  {
    id: "task-009",
    wedding_id: "wed-001",
    title: "Curate Custom Velvet Table Linens & Gold Cutlery Chargers",
    category: "Decoration",
    assigned_member: "Priya Sharma",
    due_date: "2026-11-25",
    priority: "Medium",
    status: "To Plan",
    notes: "Sample settings sent to bride for final signoff."
  },

  // Catering & Bar
  {
    id: "task-010",
    wedding_id: "wed-001",
    title: "Evaluate 3 Luxury Catering Proposals (Royal Feast vs Maharaja)",
    category: "Catering",
    assigned_member: "Priya Sharma",
    due_date: "2026-10-20",
    priority: "Urgent",
    status: "Done",
    notes: "Royal Feast Catering selected and shared with couple for signoff."
  },
  {
    id: "task-011",
    wedding_id: "wed-001",
    title: "Schedule Formal Food Tasting Session in Mumbai Office",
    category: "Catering",
    assigned_member: "Priya Sharma",
    due_date: "2026-11-08",
    priority: "High",
    status: "Review",
    notes: "7-course royal Awadhi and European tasting menu scheduled."
  },
  {
    id: "task-012",
    wedding_id: "wed-001",
    title: "Procure Custom Artisanal Spirits & Bartending Team (The Wedding Bartenders)",
    category: "Catering",
    assigned_member: "Arjun Verma",
    due_date: "2026-11-22",
    priority: "Medium",
    status: "To Plan",
    notes: "Signature cocktails named after bride and groom."
  },

  // Photography & Cinema
  {
    id: "task-013",
    wedding_id: "wed-001",
    title: "Contract Lead Photographer & Film Director (Stories by Joseph Radhik)",
    category: "Photography",
    assigned_member: "Priya Sharma",
    due_date: "2026-10-10",
    priority: "High",
    status: "Done",
    notes: "Signed for 12-member crew including 2 drone pilots."
  },
  {
    id: "task-014",
    wedding_id: "wed-001",
    title: "Deliver Shot List & Royal Portrait Lighting Schematics",
    category: "Photography",
    assigned_member: "Priya Sharma",
    due_date: "2026-11-30",
    priority: "Medium",
    status: "To Plan",
    notes: "Golden hour sunset portrait locations mapped at City Palace."
  },

  // Mehendi
  {
    id: "task-015",
    wedding_id: "wed-001",
    title: "Book Celebrity Mehendi Artist (Veena Nagda) & 10 Assistants",
    category: "Mehendi",
    assigned_member: "Priya Sharma",
    due_date: "2026-10-18",
    priority: "High",
    status: "Done",
    notes: "Deposit transferred. Arrival scheduled 17 Dec evening."
  },
  {
    id: "task-016",
    wedding_id: "wed-001",
    title: "Install Garden Cabanas, Rajasthani Puppet Troupe & Bangle Bazaar",
    category: "Mehendi",
    assigned_member: "Arjun Verma",
    due_date: "2026-12-05",
    priority: "Medium",
    status: "To Plan",
    notes: "Artisans confirmed from Jodhpur crafts cluster."
  },

  // Sangeet
  {
    id: "task-017",
    wedding_id: "wed-001",
    title: "Stage & Concert Trussing Setup at Rambagh Palace Lawn",
    category: "Sangeet",
    assigned_member: "Arjun Verma",
    due_date: "2026-12-10",
    priority: "High",
    status: "To Plan",
    notes: "Concert grade L-Acoustics sound system reserved."
  },
  {
    id: "task-018",
    wedding_id: "wed-001",
    title: "Choreography Rehearsal Master Schedule & Family Performance Cueing",
    category: "Sangeet",
    assigned_member: "Priya Sharma",
    due_date: "2026-12-01",
    priority: "Medium",
    status: "In Progress",
    notes: "14 family dance routines scheduled across 3 weekends."
  },
  {
    id: "task-019",
    wedding_id: "wed-001",
    title: "Sound Check & Headlining Artist Hospitality Protocol",
    category: "Sangeet",
    assigned_member: "Arjun Verma",
    due_date: "2026-12-15",
    priority: "Urgent",
    status: "To Plan",
    notes: "VIP green room rider approved."
  },

  // Wedding Ceremony
  {
    id: "task-020",
    wedding_id: "wed-001",
    title: "Baraat Procession Route, Vintage Open Car & Royal Brass Band",
    category: "Wedding Ceremony",
    assigned_member: "Arjun Verma",
    due_date: "2026-12-08",
    priority: "High",
    status: "To Plan",
    notes: "1936 vintage Packard and 40-piece royal marching brass band."
  },
  {
    id: "task-021",
    wedding_id: "wed-001",
    title: "Mandap Vedic Priest Coordination & Havan Samagri Pure Ghee Logistics",
    category: "Wedding Ceremony",
    assigned_member: "Priya Sharma",
    due_date: "2026-12-09",
    priority: "Medium",
    status: "To Plan",
    notes: "Chief priest from Varanasi confirmed with 4 assistants."
  },
  {
    id: "task-022",
    wedding_id: "wed-001",
    title: "Rose Petal Showers & Synchronized Pyrotechnic Sparklers",
    category: "Wedding Ceremony",
    assigned_member: "Arjun Verma",
    due_date: "2026-12-12",
    priority: "High",
    status: "To Plan",
    notes: "Cold pyros compliant with Rajasthan safety regulations."
  },

  // Reception
  {
    id: "task-023",
    wedding_id: "wed-001",
    title: "Durbar Hall Black Tie Seating Plan & Royal Table Monograms",
    category: "Reception",
    assigned_member: "Priya Sharma",
    due_date: "2026-12-14",
    priority: "Medium",
    status: "To Plan",
    notes: "40 tables with laser cut name plaques and personalized menus."
  },
  {
    id: "task-024",
    wedding_id: "wed-001",
    title: "Live Symphony String Quartet & Toastmaster Coordination",
    category: "Reception",
    assigned_member: "Arjun Verma",
    due_date: "2026-12-14",
    priority: "Low",
    status: "To Plan",
    notes: "Rehearsal with toastmaster Lord Alistair on 19 Dec."
  },

  // Guest Coordination
  {
    id: "task-025",
    wedding_id: "wed-001",
    title: "Dispatch Digital QR Invitations & Activate Guest Portal",
    category: "Guest Coordination",
    assigned_member: "Arjun Verma",
    due_date: "2026-11-01",
    priority: "Urgent",
    status: "Done",
    notes: "All 400 guests assigned secure QR check-in codes."
  },
  {
    id: "task-026",
    wedding_id: "wed-001",
    title: "Airport Chauffeur Dispatch & Fleet of 45 Mercedes S-Class",
    category: "Guest Coordination",
    assigned_member: "Arjun Verma",
    due_date: "2026-12-12",
    priority: "High",
    status: "To Plan",
    notes: "Airport welcome lounge setup at Jaipur Terminal 2."
  },

  // Final Reconciliation
  {
    id: "task-027",
    wedding_id: "wed-001",
    title: "Post-Event Damage Deposit Returns & Final Vendor Reconciliation",
    category: "Final Reconciliation",
    assigned_member: "Siddharth Goenka",
    due_date: "2026-12-28",
    priority: "Medium",
    status: "To Plan",
    notes: "Audit of all bills vs advance payments."
  }
];

export const initialVendors = [
  {
    id: "ven-001",
    name: "Royal Feast Catering",
    category: "Catering & Banqueting",
    contact_person: "Chef Ranveer Brar",
    phone: "+91 98210 99887",
    email: "proposals@royalfeastcatering.com",
    services: "Royal Rajput, Awadhi & Modern European Fine Dining",
    location: "Mumbai & Jaipur",
    status: "Active",
    rating: 4.98,
    confirmed_assignments: ["Aarav & Meera — Royal Jaipur Wedding"]
  },
  {
    id: "ven-002",
    name: "Maharaja Kitchens",
    category: "Catering & Banqueting",
    contact_person: "Sanjay Singhania",
    phone: "+91 98100 44321",
    email: "contact@maharajakitchens.com",
    services: "Traditional Marwari & Continental Luxury Banquets",
    location: "Jaipur & Delhi",
    status: "Active",
    rating: 4.85,
    confirmed_assignments: []
  },
  {
    id: "ven-003",
    name: "The Grand Platter",
    category: "Catering & Banqueting",
    contact_person: "Armaan Lamba",
    phone: "+91 98300 12345",
    email: "info@thegrandplatter.com",
    services: "Luxury Experiential Food Stations & Global Street Gourmet",
    location: "Delhi & Udaipur",
    status: "Active",
    rating: 4.80,
    confirmed_assignments: []
  },
  {
    id: "ven-004",
    name: "City Palace Jaipur (Zenana & Manek Chowk)",
    category: "Venue",
    contact_person: "Thakur Mahendra Singh",
    phone: "+91 141 4088888",
    email: "royalvenue@citypalacejaipur.com",
    services: "Heritage 18th Century Royal Palace & Courtyards",
    location: "Jaipur",
    status: "Active",
    rating: 5.0,
    confirmed_assignments: ["Aarav & Meera — Royal Jaipur Wedding"]
  },
  {
    id: "ven-005",
    name: "Floral Couture by Rohini",
    category: "Decoration",
    contact_person: "Rohini Shirke",
    phone: "+91 98205 67890",
    email: "rohini@floralcouture.in",
    services: "Architectural Botanical Installations & Imported Exotic Florals",
    location: "Mumbai",
    status: "Active",
    rating: 4.95,
    confirmed_assignments: ["Aarav & Meera — Royal Jaipur Wedding"]
  },
  {
    id: "ven-006",
    name: "Stories by Joseph Radhik",
    category: "Photography",
    contact_person: "Joseph Radhik",
    phone: "+91 98450 11223",
    email: "studio@josephradhik.com",
    services: "Celebrity Wedding Photography & Masterclass Cinema",
    location: "Mumbai",
    status: "Active",
    rating: 5.0,
    confirmed_assignments: ["Aarav & Meera — Royal Jaipur Wedding"]
  }
];

export const initialQuotationRequests = [
  {
    id: "rfp-001",
    wedding_id: "wed-001",
    category: "Catering & Banqueting",
    title: "Multi-Day Royal Banquet & Sangeet Gala (400 Guests)",
    description: "Full service 3-day catering including Welcome Mehendi tea garden, Royal Sangeet gourmet feast, Ceremony high-tea, and Durbar Hall 7-course plated reception.",
    status: "Under Client Review",
    created_at: "2026-10-01T10:00:00Z"
  }
];

export const initialQuotations = [
  {
    id: "quote-001",
    request_id: "rfp-001",
    wedding_id: "wed-001",
    vendor_id: "ven-001",
    vendor_name: "Royal Feast Catering",
    price_per_plate_or_service: 4200,
    total_quoted_amount: 3360000, // 400 pax * 2 major banquets = 800 covers avg
    service_inclusions: "7-course Royal Silver Thali banquet, live truffle pasta station, imported French patisserie bar, 60 royal attired butler staff, crystal glassware service.",
    additional_charges: 150000, // Specialized kitchen setup at heritage site
    notes: "Chef Ranveer will personally oversee banquet execution on Sangeet & Reception nights.",
    proposal_pdf_url: "/docs/Royal_Feast_Catering_Bespoke_Proposal.pdf",
    status: "Shared with Client", // Planner shared this proposal with couple
    shared_with_client: true,
    client_feedback: "Loved the silver thali concept and truffle stations. Seeking final tasting confirmation.",
    created_at: "2026-10-08T11:30:00Z"
  },
  {
    id: "quote-002",
    request_id: "rfp-001",
    wedding_id: "wed-001",
    vendor_id: "ven-002",
    vendor_name: "Maharaja Kitchens",
    price_per_plate_or_service: 4800,
    total_quoted_amount: 3840000,
    service_inclusions: "Authentic royal Marwari dawat, live woodfire tandoors, gold-leaf dessert cart, 50 servers, vintage copper tableware.",
    additional_charges: 200000,
    notes: "Higher price point; excellent for traditional recipes, but limited European cuisine flair.",
    proposal_pdf_url: "/docs/Maharaja_Kitchens_Proposal.pdf",
    status: "Submitted", // Stored in agency records, NOT shared with client
    shared_with_client: false,
    client_feedback: null,
    created_at: "2026-10-09T14:15:00Z"
  },
  {
    id: "quote-003",
    request_id: "rfp-001",
    wedding_id: "wed-001",
    vendor_id: "ven-003",
    vendor_name: "The Grand Platter",
    price_per_plate_or_service: 3900,
    total_quoted_amount: 3120000,
    service_inclusions: "Fusion Asian & Mediterranean food theatre, molecular cocktail snacks, dessert greenhouse installation, 45 servers.",
    additional_charges: 100000,
    notes: "Modern concept; good budget fit, but lacks the formal imperial thali presentation requested by parents.",
    proposal_pdf_url: "/docs/Grand_Platter_Catering_Proposal.pdf",
    status: "Submitted", // Retained internally
    shared_with_client: false,
    client_feedback: null,
    created_at: "2026-10-10T16:00:00Z"
  }
];

// 25+ Guests for Aarav & Meera
export const initialGuests = [
  {
    id: "gst-001",
    wedding_id: "wed-001",
    name: "Justice K. K. Singhania",
    phone: "+91 98200 11001",
    family_group: "Groom's Immediate Family",
    plus_ones: 1,
    invitation_category: "VIP Royal Patron",
    functions_attending: ["Mehendi", "Sangeet", "Wedding Ceremony", "Reception"],
    rsvp_status: "Attending",
    checked_in: true,
    checked_in_at: "2026-12-18T15:10:00Z",
    qr_code: "VIVAAH-W01-G001-SINGHANIA",
    table_assigned: "Table 1 (Imperial Head Table)"
  },
  {
    id: "gst-002",
    wedding_id: "wed-001",
    name: "Mrs. Gayatri Singhania",
    phone: "+91 98200 11002",
    family_group: "Groom's Immediate Family",
    plus_ones: 0,
    invitation_category: "VIP Royal Patron",
    functions_attending: ["Mehendi", "Sangeet", "Wedding Ceremony", "Reception"],
    rsvp_status: "Attending",
    checked_in: true,
    checked_in_at: "2026-12-18T15:10:00Z",
    qr_code: "VIVAAH-W01-G002-GAYATRI",
    table_assigned: "Table 1 (Imperial Head Table)"
  },
  {
    id: "gst-003",
    wedding_id: "wed-001",
    name: "Dr. Vikram Kapoor",
    phone: "+91 98110 33445",
    family_group: "Bride's Immediate Family",
    plus_ones: 1,
    invitation_category: "VIP Royal Patron",
    functions_attending: ["Mehendi", "Sangeet", "Wedding Ceremony", "Reception"],
    rsvp_status: "Attending",
    checked_in: true,
    checked_in_at: "2026-12-18T15:25:00Z",
    qr_code: "VIVAAH-W01-G003-KAPOOR",
    table_assigned: "Table 2 (Bride Dignitaries)"
  },
  {
    id: "gst-004",
    wedding_id: "wed-001",
    name: "Mrs. Shobhana Kapoor",
    phone: "+91 98110 33446",
    family_group: "Bride's Immediate Family",
    plus_ones: 0,
    invitation_category: "VIP Royal Patron",
    functions_attending: ["Mehendi", "Sangeet", "Wedding Ceremony", "Reception"],
    rsvp_status: "Attending",
    checked_in: true,
    checked_in_at: "2026-12-18T15:25:00Z",
    qr_code: "VIVAAH-W01-G004-SHOBHANA",
    table_assigned: "Table 2 (Bride Dignitaries)"
  },
  {
    id: "gst-005",
    wedding_id: "wed-001",
    name: "Lord Alistair Sterling",
    phone: "+44 7700 900111",
    family_group: "International VIPs",
    plus_ones: 1,
    invitation_category: "VVIP Dignitary",
    functions_attending: ["Sangeet", "Reception"],
    rsvp_status: "Attending",
    checked_in: false,
    checked_in_at: null,
    qr_code: "VIVAAH-W01-G005-STERLING",
    table_assigned: "Table 4 (International Envoys)"
  },
  {
    id: "gst-006",
    wedding_id: "wed-001",
    name: "Rohan & Natasha Mehra",
    phone: "+91 98205 88990",
    family_group: "Groom Close Friends",
    plus_ones: 1,
    invitation_category: "Friends & Fellows",
    functions_attending: ["All"],
    rsvp_status: "Attending",
    checked_in: true,
    checked_in_at: "2026-12-18T16:05:00Z",
    qr_code: "VIVAAH-W01-G006-MEHRA",
    table_assigned: "Table 8"
  },
  {
    id: "gst-007",
    wedding_id: "wed-001",
    name: "Anika Birla",
    phone: "+91 98212 33445",
    family_group: "Bride Close Friends",
    plus_ones: 1,
    invitation_category: "Friends & Fellows",
    functions_attending: ["All"],
    rsvp_status: "Attending",
    checked_in: true,
    checked_in_at: "2026-12-18T16:15:00Z",
    qr_code: "VIVAAH-W01-G007-BIRLA",
    table_assigned: "Table 9"
  },
  {
    id: "gst-008",
    wedding_id: "wed-001",
    name: "Ambassador Harish Salve",
    phone: "+91 98100 99881",
    family_group: "Government & Judiciary Dignitaries",
    plus_ones: 1,
    invitation_category: "VVIP Dignitary",
    functions_attending: ["Wedding Ceremony", "Reception"],
    rsvp_status: "Attending",
    checked_in: false,
    checked_in_at: null,
    qr_code: "VIVAAH-W01-G008-SALVE",
    table_assigned: "Table 3 (State Guests)"
  },
  {
    id: "gst-009",
    wedding_id: "wed-001",
    name: "Karan Johar",
    phone: "+91 98200 99999",
    family_group: "Creative & Film Industry",
    plus_ones: 0,
    invitation_category: "VIP Royal Patron",
    functions_attending: ["Sangeet", "Reception"],
    rsvp_status: "Attending",
    checked_in: false,
    checked_in_at: null,
    qr_code: "VIVAAH-W01-G009-KJOHAR",
    table_assigned: "Table 5"
  },
  {
    id: "gst-010",
    wedding_id: "wed-001",
    name: "Sunil & Sangeeta Mittal",
    phone: "+91 98110 55443",
    family_group: "Industrialist Delegation",
    plus_ones: 1,
    invitation_category: "VVIP Dignitary",
    functions_attending: ["Reception"],
    rsvp_status: "Attending",
    checked_in: false,
    checked_in_at: null,
    qr_code: "VIVAAH-W01-G010-MITTAL",
    table_assigned: "Table 6"
  },
  {
    id: "gst-011",
    wedding_id: "wed-001",
    name: "Devendra & Poonam Bhagat",
    phone: "+91 98221 77889",
    family_group: "Groom Extended Family",
    plus_ones: 2,
    invitation_category: "Family",
    functions_attending: ["All"],
    rsvp_status: "Attending",
    checked_in: false,
    checked_in_at: null,
    qr_code: "VIVAAH-W01-G011-BHAGAT",
    table_assigned: "Table 11"
  },
  {
    id: "gst-012",
    wedding_id: "wed-001",
    name: "Rajiv & Ritu Dalmia",
    phone: "+91 98310 44556",
    family_group: "Bride Extended Family",
    plus_ones: 2,
    invitation_category: "Family",
    functions_attending: ["All"],
    rsvp_status: "Attending",
    checked_in: false,
    checked_in_at: null,
    qr_code: "VIVAAH-W01-G012-DALMIA",
    table_assigned: "Table 12"
  },
  {
    id: "gst-013",
    wedding_id: "wed-001",
    name: "Sameer Nair",
    phone: "+91 98201 12344",
    family_group: "Colleagues & Corporate",
    plus_ones: 1,
    invitation_category: "Corporate",
    functions_attending: ["Sangeet", "Reception"],
    rsvp_status: "Pending",
    checked_in: false,
    checked_in_at: null,
    qr_code: "VIVAAH-W01-G013-SNAIR",
    table_assigned: "Table 15"
  },
  {
    id: "gst-014",
    wedding_id: "wed-001",
    name: "Deepak & Reena Parekh",
    phone: "+91 98200 77123",
    family_group: "Advisory Board",
    plus_ones: 1,
    invitation_category: "VIP Royal Patron",
    functions_attending: ["Reception"],
    rsvp_status: "Attending",
    checked_in: false,
    checked_in_at: null,
    qr_code: "VIVAAH-W01-G014-PAREKH",
    table_assigned: "Table 7"
  },
  {
    id: "gst-015",
    wedding_id: "wed-001",
    name: "Tanya Ghavri",
    phone: "+91 98198 66778",
    family_group: "Couture Styling Team",
    plus_ones: 1,
    invitation_category: "Friends & Fellows",
    functions_attending: ["All"],
    rsvp_status: "Attending",
    checked_in: true,
    checked_in_at: "2026-12-18T14:40:00Z",
    qr_code: "VIVAAH-W01-G015-GHAVRI",
    table_assigned: "Table 10"
  },
  {
    id: "gst-016",
    wedding_id: "wed-001",
    name: "Lt. Gen. Baljit Singh",
    phone: "+91 98188 55442",
    family_group: "Armed Forces Veterans",
    plus_ones: 1,
    invitation_category: "VVIP Dignitary",
    functions_attending: ["Wedding Ceremony", "Reception"],
    rsvp_status: "Attending",
    checked_in: false,
    checked_in_at: null,
    qr_code: "VIVAAH-W01-G016-BSINGH",
    table_assigned: "Table 3"
  },
  {
    id: "gst-017",
    wedding_id: "wed-001",
    name: "Rishi & Neetu Tandon",
    phone: "+91 98202 33441",
    family_group: "Groom Close Friends",
    plus_ones: 1,
    invitation_category: "Friends & Fellows",
    functions_attending: ["All"],
    rsvp_status: "Attending",
    checked_in: false,
    checked_in_at: null,
    qr_code: "VIVAAH-W01-G017-TANDON",
    table_assigned: "Table 8"
  },
  {
    id: "gst-018",
    wedding_id: "wed-001",
    name: "Pranav & Shalini Adani",
    phone: "+91 98250 11998",
    family_group: "Industrialist Delegation",
    plus_ones: 1,
    invitation_category: "VVIP Dignitary",
    functions_attending: ["Reception"],
    rsvp_status: "Attending",
    checked_in: false,
    checked_in_at: null,
    qr_code: "VIVAAH-W01-G018-ADANI",
    table_assigned: "Table 6"
  },
  {
    id: "gst-019",
    wedding_id: "wed-001",
    name: "Zoya Akhtar",
    phone: "+91 98200 44332",
    family_group: "Creative & Film Industry",
    plus_ones: 0,
    invitation_category: "VIP Royal Patron",
    functions_attending: ["Sangeet", "Reception"],
    rsvp_status: "Attending",
    checked_in: false,
    checked_in_at: null,
    qr_code: "VIVAAH-W01-G019-ZAKHTAR",
    table_assigned: "Table 5"
  },
  {
    id: "gst-020",
    wedding_id: "wed-001",
    name: "Ashwin & Preeti Muthiah",
    phone: "+91 98400 99112",
    family_group: "Corporate & Heritage",
    plus_ones: 1,
    invitation_category: "VIP Royal Patron",
    functions_attending: ["Reception"],
    rsvp_status: "Declined",
    checked_in: false,
    checked_in_at: null,
    qr_code: "VIVAAH-W01-G020-MUTHIAH",
    table_assigned: "None"
  }
];

export const initialEvents = [
  {
    id: "evt-001",
    wedding_id: "wed-001",
    event_name: "The Royal Mehendi & Bangle Soirée",
    date: "2026-12-18",
    start_time: "15:00",
    end_time: "19:00",
    location: "Zenana Garden Courtyard, City Palace",
    description: "Traditional afternoon high tea, Rajasthani folk music, traditional mehendi artists and marigold floral swings.",
    dress_code: "Regal Pastels & Chanderi Silks"
  },
  {
    id: "evt-002",
    wedding_id: "wed-001",
    event_name: "The Celestial Sangeet Night",
    date: "2026-12-18",
    start_time: "20:00",
    end_time: "02:00",
    location: "Rambagh Palace Royal Lawns",
    description: "Star-studded musical evening with synchronized family performances, concert acoustics, and gourmet silver banquet.",
    dress_code: "Black Tie & Velvet Bandhgala / Glittering Lehengas"
  },
  {
    id: "evt-003",
    wedding_id: "wed-001",
    event_name: "Haldi & Phoolon Ki Holi",
    date: "2026-12-19",
    start_time: "10:30",
    end_time: "13:30",
    location: "Poolside Pavilion, Rambagh Palace",
    description: "Fragrant saffron haldi rituals, organic rose petal showers, dhol beats, and breezy cotton cabanas.",
    dress_code: "Sunburst Ochre & Marigold Yellow"
  },
  {
    id: "evt-004",
    wedding_id: "wed-001",
    event_name: "The Sacred Vedic Pheras & Baraat",
    date: "2026-12-19",
    start_time: "17:30",
    end_time: "22:30",
    location: "Manek Chowk Mandap, City Palace",
    description: "Imperial vintage car procession with royal brass band, floating floral mandap on reflection pool, and Vedic hymns.",
    dress_code: "Traditional Heritage Gold & Crimson"
  },
  {
    id: "evt-005",
    wedding_id: "wed-001",
    event_name: "The Imperial Durbar Reception & Gala",
    date: "2026-12-20",
    start_time: "19:30",
    end_time: "01:30",
    location: "Durbar Hall, City Palace",
    description: "Formal diplomatic seated dinner, live symphony string orchestra, champagne fountains, and royal toastmaster address.",
    dress_code: "Royal Black Tie & Couturier Gowns"
  }
];

export const initialVendorArrivals = [
  {
    id: "arr-001",
    event_id: "evt-001",
    wedding_id: "wed-001",
    vendor_id: "ven-005",
    vendor_name: "Floral Couture by Rohini",
    category: "Decor & Floral",
    expected_time: "09:00",
    arrival_status: "Arrived",
    actual_arrival_time: "08:45",
    coordinator_notes: "Truck 1 & 2 unloaded successfully at Zenana gate. 45,000 marigolds ready for installation.",
    reported_issue: null
  },
  {
    id: "arr-002",
    event_id: "evt-001",
    wedding_id: "wed-001",
    vendor_id: "ven-001",
    vendor_name: "Royal Feast Catering",
    category: "Catering",
    expected_time: "11:00",
    arrival_status: "Arrived",
    actual_arrival_time: "10:55",
    coordinator_notes: "Mobile plating kitchens live. Head chef checked in with event coordinator.",
    reported_issue: null
  },
  {
    id: "arr-003",
    event_id: "evt-002",
    wedding_id: "wed-001",
    vendor_id: "ven-006",
    vendor_name: "Stories by Joseph Radhik",
    category: "Photography & Cinema",
    expected_time: "17:00",
    arrival_status: "Arrived",
    actual_arrival_time: "16:40",
    coordinator_notes: "Crew of 12 on site. Drone test flight completed with ASI clearance.",
    reported_issue: null
  },
  {
    id: "arr-004",
    event_id: "evt-002",
    wedding_id: "wed-001",
    vendor_id: "ven-003",
    vendor_name: "L-Acoustics Sound & Concert Trussing",
    category: "AV & Sound",
    expected_time: "14:00",
    arrival_status: "Delayed",
    actual_arrival_time: null,
    coordinator_notes: "Transit truck delayed at Jaipur toll checkpoint. Generator team dispatched to assist.",
    reported_issue: "Toll delay of 45 mins. Sound check rescheduled from 16:00 to 17:15."
  }
];

export const initialClientPayments = [
  {
    id: "pay-c01",
    wedding_id: "wed-001",
    milestone_name: "Retainer & Date Reservation Token",
    amount: 2500000,
    due_date: "2026-09-15",
    paid_date: "2026-09-15",
    status: "Received",
    payment_method: "Direct Wire Transfer",
    reference_no: "HDFC-ESC-908122",
    notes: "Booking confirmed, project created."
  },
  {
    id: "pay-c02",
    wedding_id: "wed-001",
    milestone_name: "First Production Advance (Venue & Design Lock)",
    amount: 5500000,
    due_date: "2026-10-10",
    paid_date: "2026-10-10",
    status: "Received",
    payment_method: "RTGS Bank Transfer",
    reference_no: "HDFC-RTGS-341908",
    notes: "Disbursed to City Palace and Floral designers."
  },
  {
    id: "pay-c03",
    wedding_id: "wed-001",
    milestone_name: "Second Production Advance (Catering & Technical Lock)",
    amount: 6000000,
    due_date: "2026-11-15",
    paid_date: null,
    status: "Pending",
    payment_method: "Scheduled RTGS",
    reference_no: "INVOICE-VIA-2026-088",
    notes: "Milestone invoice sent to family office."
  },
  {
    id: "pay-c04",
    wedding_id: "wed-001",
    milestone_name: "Final Balance & Settlement Reconciliation",
    amount: 4000000,
    due_date: "2026-12-10",
    paid_date: null,
    status: "Pending",
    payment_method: "Scheduled Wire",
    reference_no: "INVOICE-VIA-2026-089",
    notes: "Due 8 days prior to inaugurating festivities."
  }
];

export const initialVendorPayments = [
  {
    id: "pay-v01",
    wedding_id: "wed-001",
    vendor_id: "ven-004",
    vendor_name: "City Palace Jaipur",
    category: "Venue",
    milestone_name: "Royal Courtyards Reservation Fee",
    agreed_amount: 5000000,
    amount_paid: 3000000,
    additional_charges: 0,
    balance_due: 2000000,
    status: "Partially Paid",
    due_date: "2026-11-20"
  },
  {
    id: "pay-v02",
    wedding_id: "wed-001",
    vendor_id: "ven-001",
    vendor_name: "Royal Feast Catering",
    category: "Catering",
    milestone_name: "Catering 3-Day Banquet Advance",
    agreed_amount: 3360000,
    amount_paid: 1000000,
    additional_charges: 252000, // +60 extra guest covers logged on Sangeet
    balance_due: 2612000,
    status: "Partially Paid",
    due_date: "2026-11-25"
  },
  {
    id: "pay-v03",
    wedding_id: "wed-001",
    vendor_id: "ven-005",
    vendor_name: "Floral Couture by Rohini",
    category: "Decoration",
    milestone_name: "Floral Import & Architectural Scenography",
    agreed_amount: 2800000,
    amount_paid: 1500000,
    additional_charges: 0,
    balance_due: 1300000,
    status: "Partially Paid",
    due_date: "2026-11-30"
  },
  {
    id: "pay-v04",
    wedding_id: "wed-001",
    vendor_id: "ven-006",
    vendor_name: "Stories by Joseph Radhik",
    category: "Photography & Cinema",
    milestone_name: "Full Feature Film & Photography Retainer",
    agreed_amount: 1600000,
    amount_paid: 800000,
    additional_charges: 0,
    balance_due: 800000,
    status: "Partially Paid",
    due_date: "2026-12-05"
  }
];

export const initialExpenses = [
  {
    id: "exp-001",
    wedding_id: "wed-001",
    category: "Additional Catering Covers",
    description: "60 additional guests confirmed for Sangeet Gala (+60 covers @ ₹4,200)",
    amount: 252000,
    recorded_by: "Priya Sharma",
    created_at: "2026-10-24T12:00:00Z"
  },
  {
    id: "exp-002",
    wedding_id: "wed-001",
    category: "VIP Chauffeur Fleet Upgrade",
    description: "5 additional Mercedes Maybach limousines for dignitary airport transfers",
    amount: 180000,
    recorded_by: "Arjun Verma",
    created_at: "2026-10-26T15:30:00Z"
  },
  {
    id: "exp-003",
    wedding_id: "wed-001",
    category: "Pyrotechnics & Security",
    description: "Rajasthan fire clearance and synchronized low-smoke royal fireworks over Lake",
    amount: 320000,
    recorded_by: "Arjun Verma",
    created_at: "2026-10-28T09:15:00Z"
  }
];

export const initialDocuments = [
  {
    id: "doc-001",
    wedding_id: "wed-001",
    file_name: "Aarav_Meera_Master_Service_Agreement_Signed.pdf",
    file_url: "/docs/Aarav_Meera_Master_Agreement.pdf",
    category: "Client Agreement",
    file_size: "4.8 MB",
    uploaded_by: "Pooja Singhania",
    created_at: "2026-09-15T12:00:00Z"
  },
  {
    id: "doc-002",
    wedding_id: "wed-001",
    file_name: "City_Palace_Jaipur_Heritage_Lease_Permit.pdf",
    file_url: "/docs/City_Palace_Permit.pdf",
    category: "Venue Contract",
    file_size: "12.4 MB",
    uploaded_by: "Priya Sharma",
    created_at: "2026-10-06T14:30:00Z"
  },
  {
    id: "doc-003",
    wedding_id: "wed-001",
    file_name: "Royal_Feast_Catering_Bespoke_Proposal.pdf",
    file_url: "/docs/Royal_Feast_Proposal.pdf",
    category: "Vendor Quotation",
    file_size: "3.2 MB",
    uploaded_by: "Chef Ranveer Brar",
    created_at: "2026-10-08T11:30:00Z"
  },
  {
    id: "doc-004",
    wedding_id: "wed-001",
    file_name: "Scenography_3D_Mandap_Technical_Drawings.pdf",
    file_url: "/docs/Scenography_3D_Drawings.pdf",
    category: "Design Blueprint",
    file_size: "18.9 MB",
    uploaded_by: "Priya Sharma",
    created_at: "2026-10-28T16:00:00Z"
  },
  {
    id: "doc-005",
    wedding_id: "wed-001",
    file_name: "Escrow_Milestone_Bank_Receipt_1.pdf",
    file_url: "/docs/Escrow_Receipt_1.pdf",
    category: "Payment Receipt",
    file_size: "1.1 MB",
    uploaded_by: "Siddharth Goenka",
    created_at: "2026-09-15T15:00:00Z"
  }
];

export const initialActivityLogs = [
  {
    id: "act-001",
    wedding_id: "wed-001",
    action: "Enquiry Converted",
    actor_name: "Vikram Sen",
    details: "Enquiry enq-001 converted to Wedding Project wed-001.",
    created_at: "2026-09-15T10:00:00Z"
  },
  {
    id: "act-002",
    wedding_id: "wed-001",
    action: "Tasks Generated",
    actor_name: "System Automation",
    details: "Generated 27 default planning tasks for Full-Service Royal package.",
    created_at: "2026-09-15T10:01:00Z"
  },
  {
    id: "act-003",
    wedding_id: "wed-001",
    action: "Quotation Shared",
    actor_name: "Priya Sharma",
    details: "Shared Royal Feast Catering proposal with Aarav & Meera via Client Portal.",
    created_at: "2026-10-12T16:00:00Z"
  },
  {
    id: "act-004",
    wedding_id: "wed-001",
    action: "Proposal Approved",
    actor_name: "Aarav & Meera (Client)",
    details: "Client approved Royal Feast Catering proposal in client portal.",
    created_at: "2026-10-18T14:20:00Z"
  }
];
