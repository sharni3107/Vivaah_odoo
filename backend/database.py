import uuid
from datetime import datetime, date, timedelta
from typing import Dict, List, Optional, Any
from backend.supabase_client import get_supabase_client

# ==============================================================================
# DEFAULT 25+ PLANNING TASKS GENERATOR
# ==============================================================================
DEFAULT_TASKS_TEMPLATE = [
    {"title": "Initial Couple Consultation & Vision Alignment", "category": "Initial Planning", "priority": "High", "days_before": 240, "assigned": "Priya Sharma"},
    {"title": "Overall Budget Allocation & Escrow Setup", "category": "Initial Planning", "priority": "Urgent", "days_before": 230, "assigned": "Siddharth Goenka"},
    {"title": "Jaipur Palace Site Inspection & Hold Dates", "category": "Venue", "priority": "Urgent", "days_before": 210, "assigned": "Pooja Singhania"},
    {"title": "Palace Lease & Security Agreement Execution", "category": "Venue", "priority": "High", "days_before": 195, "assigned": "Siddharth Goenka"},
    {"title": "Master Theme & Palette Definition (Deep Plum & Champagne Gold)", "category": "Decoration", "priority": "High", "days_before": 180, "assigned": "Priya Sharma"},
    {"title": "Issue RFP to Royal Feast Catering & 2 Competing Caterers", "category": "Catering", "priority": "High", "days_before": 170, "assigned": "Priya Sharma"},
    {"title": "Stage 1 Catering Food Tasting & Menu Shortlisting", "category": "Catering", "priority": "Medium", "days_before": 150, "assigned": "Arjun Verma"},
    {"title": "Selection of Celebrity Wedding Photographer & Cinematographer", "category": "Photography", "priority": "High", "days_before": 140, "assigned": "Pooja Singhania"},
    {"title": "Save the Date Digital Cards & Courier Dispatch", "category": "Guest Coordination", "priority": "Medium", "days_before": 130, "assigned": "Vikram Sen"},
    {"title": "Sound, Lighting & Trussing Technical Specifications Sign-off", "category": "Decoration", "priority": "High", "days_before": 120, "assigned": "Arjun Verma"},
    {"title": "Sangeet Choreographer & Music Playlist Finalisation", "category": "Sangeet", "priority": "Medium", "days_before": 100, "assigned": "Arjun Verma"},
    {"title": "Mehendi Artisans & Organic Henna Procurement", "category": "Mehendi", "priority": "Medium", "days_before": 90, "assigned": "Priya Sharma"},
    {"title": "Bar & Beverage Menu Curation with Sommelier", "category": "Catering", "priority": "Medium", "days_before": 80, "assigned": "Pooja Singhania"},
    {"title": "Guest Flight Details Collection & Airport Transfer Matrix", "category": "Guest Coordination", "priority": "High", "days_before": 60, "assigned": "Vikram Sen"},
    {"title": "Wedding Wardrobe & Jewellery Fitting Coordination", "category": "Initial Planning", "priority": "Medium", "days_before": 50, "assigned": "Priya Sharma"},
    {"title": "Mandap Floral Mockup & Structural Engineering Check", "category": "Wedding Ceremony", "priority": "Urgent", "days_before": 40, "assigned": "Arjun Verma"},
    {"title": "Guest Room Welcome Hampers Assembly & Quality Check", "category": "Guest Coordination", "priority": "Low", "days_before": 30, "assigned": "Vikram Sen"},
    {"title": "Panditji Consultation & Vedic Pooja Samagri Procurement", "category": "Wedding Ceremony", "priority": "High", "days_before": 25, "assigned": "Priya Sharma"},
    {"title": "Detailed 3-Day Minute-by-Minute Run of Show Finalisation", "category": "Initial Planning", "priority": "Urgent", "days_before": 20, "assigned": "Arjun Verma"},
    {"title": "Fire Safety, Police & Sound Permissions Verification", "category": "Venue", "priority": "Urgent", "days_before": 15, "assigned": "Siddharth Goenka"},
    {"title": "Vendor Advance Disbursement & Receipt Collection", "category": "Catering", "priority": "High", "days_before": 10, "assigned": "Siddharth Goenka"},
    {"title": "Production Load-in & Palace Courtyard Rigging", "category": "Decoration", "priority": "Urgent", "days_before": 3, "assigned": "Arjun Verma"},
    {"title": "Guest Welcome Desk Setup & QR Check-in Terminal Test", "category": "Guest Coordination", "priority": "High", "days_before": 1, "assigned": "Vikram Sen"},
    {"title": "Mehendi & Sangeet Ground Coordination & Artist Cues", "category": "Sangeet", "priority": "Urgent", "days_before": 1, "assigned": "Arjun Verma"},
    {"title": "Royal Mandap Pheras Live Execution & Timeline Adherence", "category": "Wedding Ceremony", "priority": "Urgent", "days_before": 0, "assigned": "Priya Sharma"},
    {"title": "Grand Reception Dinner, Cake Cutting & Fireworks Cues", "category": "Reception", "priority": "Urgent", "days_before": 0, "assigned": "Pooja Singhania"},
    {"title": "Post-Event Teardown Inspection & Security Deposit Clearance", "category": "Venue", "priority": "Medium", "days_before": -2, "assigned": "Arjun Verma"}
]

# ==============================================================================
# IN-MEMORY STATEFUL REPOSITORY (SEED DATA & LOCAL RUNTIME)
# ==============================================================================
class DatabaseStore:
    def __init__(self):
        self.reset_to_seed_data()

    def reset_to_seed_data(self):
        # 1. Profiles / Users
        self.profiles = [
            {"id": "user-admin", "name": "Pooja Singhania", "email": "pooja@vivaahateliers.com", "role": "admin", "designation": "Managing Director", "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"},
            {"id": "user-planner", "name": "Priya Sharma", "email": "priya@vivaahateliers.com", "role": "wedding_planner", "designation": "Principal Wedding Architect", "avatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80"},
            {"id": "user-enquiry", "name": "Vikram Sen", "email": "vikram@vivaahateliers.com", "role": "enquiry_executive", "designation": "Head of Client Relations", "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"},
            {"id": "user-coord", "name": "Arjun Verma", "email": "arjun@vivaahateliers.com", "role": "event_coordinator", "designation": "Senior Run-of-Show Coordinator", "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"},
            {"id": "user-finance", "name": "Siddharth Goenka", "email": "siddharth@vivaahateliers.com", "role": "finance_executive", "designation": "Commercial & Finance Director", "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80"},
            {"id": "user-client", "name": "Aarav & Meera", "email": "aarav.meera@client.vivaah.com", "role": "client", "designation": "The Couple", "avatar": "https://images.unsplash.com/photo-1621801306168-c61a5b820a9a?auto=format&fit=crop&w=200&q=80"},
            {"id": "user-vendor-catering", "name": "Chef Ranveer Brar", "email": "proposals@royalfeastcatering.com", "role": "vendor", "designation": "Royal Feast Catering Director", "avatar": "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80"}
        ]

        # 2. Weddings (Aarav & Meera - Royal Jaipur Wedding)
        self.weddings = [
            {
                "id": "wed-001",
                "enquiry_id": "enq-001",
                "title": "Aarav & Meera — Royal Jaipur Palace Wedding",
                "couple_names": "Aarav Singhania & Meera Kapoor",
                "email": "aarav.meera@client.vivaah.com",
                "phone": "+91 98201 11223",
                "destination": "Jaipur, Rajasthan",
                "dates": "18–20 Dec 2026",
                "start_date": "2026-12-18",
                "end_date": "2026-12-20",
                "package_tier": "Full-Service Wedding Planning",
                "expected_guests": 400,
                "actual_checkins": 312,
                "contract_amount": 18000000,
                "assigned_planner": "Priya Sharma",
                "status": "In Planning",
                "cover_image": "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=1200&q=80",
                "notes": "Exclusive booking at Rambagh Palace. 3-day royal festivities with high-profile dignitaries."
            }
        ]

        # 3. Enquiries
        self.enquiries = [
            {
                "id": "enq-001",
                "client_names": "Aarav Singhania & Meera Kapoor",
                "email": "aarav.meera@client.vivaah.com",
                "phone": "+91 98201 11223",
                "wedding_date": "2026-12-18",
                "destination": "Jaipur",
                "expected_guests": 400,
                "package_type": "Full-Service Wedding Planning",
                "estimated_budget": 18000000,
                "preferred_theme": "Royal Heritage Rajputana & Rose Gold Elegance",
                "additional_requirements": "Requires private charter transfers from Delhi/Mumbai and 4-tier gourmet dining.",
                "status": "Confirmed",
                "assigned_executive": "Vikram Sen",
                "converted_wedding_id": "wed-001",
                "created_at": "2026-09-15T10:00:00Z",
                "notes": [
                    {"date": "2026-09-16", "author": "Vikram Sen", "content": "Initial introductory phone call completed. Highly enthusiastic couple."},
                    {"date": "2026-09-22", "author": "Priya Sharma", "content": "Consultation presentation delivered. Package contract locked."}
                ]
            },
            {
                "id": "enq-002",
                "client_names": "Kabir Oberoi & Ananya Roy",
                "email": "kabir.ananya@gmail.com",
                "phone": "+91 98112 44556",
                "wedding_date": "2027-02-14",
                "destination": "Udaipur",
                "expected_guests": 250,
                "package_type": "Full-Service Wedding Planning",
                "estimated_budget": 12000000,
                "preferred_theme": "Floating Palace Romance & Ivory Pearls",
                "additional_requirements": "Lake Pichola boat arrival for baraat.",
                "status": "Consultation Scheduled",
                "assigned_executive": "Vikram Sen",
                "converted_wedding_id": None,
                "created_at": "2026-10-12T14:30:00Z",
                "notes": [
                    {"date": "2026-10-14", "author": "Vikram Sen", "content": "Scheduled formal presentation for November 5th."}
                ]
            },
            {
                "id": "enq-003",
                "client_names": "Rohan Malhotra & Simran Kaur",
                "email": "rohan.simran@outlook.com",
                "phone": "+91 98765 88990",
                "wedding_date": "2027-03-25",
                "destination": "Kerala",
                "expected_guests": 180,
                "package_type": "Partial / Day-of Coordination",
                "estimated_budget": 6500000,
                "preferred_theme": "Backwater Sunset & Coconut Grove Chic",
                "additional_requirements": "Traditional sadhya feast and sunset cruise.",
                "status": "New",
                "assigned_executive": "Vikram Sen",
                "converted_wedding_id": None,
                "created_at": "2026-10-28T09:15:00Z",
                "notes": []
            }
        ]

        # 4. Tasks (Seed 27 comprehensive tasks for Aarav & Meera)
        self.tasks = []
        wedding_date_obj = date(2026, 12, 18)
        for i, item in enumerate(DEFAULT_TASKS_TEMPLATE):
            task_due = wedding_date_obj - timedelta(days=item["days_before"])
            # Set first few as Done, middle as In Progress, remaining as To Plan
            if item["days_before"] >= 140:
                t_status = "Done"
            elif item["days_before"] >= 60:
                t_status = "In Progress"
            else:
                t_status = "To Plan"

            self.tasks.append({
                "id": f"task-{i+1:03d}",
                "wedding_id": "wed-001",
                "title": item["title"],
                "category": item["category"],
                "assigned_member": item["assigned"],
                "due_date": task_due.strftime("%Y-%m-%d"),
                "priority": item["priority"],
                "status": t_status,
                "notes": f"Standard workflow item for {item['category']}."
            })

        # 5. Vendors (Catering focus + Decor & Photography)
        self.vendors = [
            {
                "id": "ven-001",
                "name": "Royal Feast Catering",
                "category": "Catering",
                "contact_person": "Chef Ranveer Brar",
                "phone": "+91 98200 44332",
                "email": "proposals@royalfeastcatering.com",
                "services": "Royal Awadhi, Marwari Royal Thali, Pan-Asian & Molecular Gastronomy",
                "location": "Jaipur & Mumbai",
                "rating": 4.9,
                "status": "Active",
                "vendor_user_id": "user-vendor-catering"
            },
            {
                "id": "ven-002",
                "name": "Maharaja Culinary Arts",
                "category": "Catering",
                "contact_person": "Vikramaditya Rathore",
                "phone": "+91 98290 88776",
                "email": "sales@maharajaculinary.com",
                "services": "Traditional Rajput Banquet, Live Woodfire Roasts & Silver Service",
                "location": "Jaipur",
                "rating": 4.8,
                "status": "Active",
                "vendor_user_id": None
            },
            {
                "id": "ven-003",
                "name": "Shahi Dastarkhwan",
                "category": "Catering",
                "contact_person": "Begum Fatima Farooqi",
                "phone": "+91 98110 55443",
                "email": "events@shahidastarkhwan.in",
                "services": "Authentic Dum Pukht, Biryanis, Halwas & Heritage Confectionery",
                "location": "Lucknow & Jaipur",
                "rating": 4.7,
                "status": "Active",
                "vendor_user_id": None
            },
            {
                "id": "ven-004",
                "name": "Vogue Wedding Tales",
                "category": "Photography",
                "contact_person": "Tarun Khiwal",
                "phone": "+91 98330 11223",
                "email": "bookings@voguetales.com",
                "services": "Editorial Fashion Photography & 4K Cinematic Films",
                "location": "New Delhi",
                "rating": 5.0,
                "status": "Active",
                "vendor_user_id": None
            }
        ]

        # 6. Quotation Requests
        self.quotation_requests = [
            {
                "id": "rfp-001",
                "wedding_id": "wed-001",
                "category": "Catering",
                "title": "3-Day Royal Festivity Catering for 400 Guests",
                "description": "Welcome Hi-Tea, Mehendi Carnival Buffet, Sangeet Global Gala Dinner, Royal Mandap Dinner, and Grand Reception Silver-Thali Banquet.",
                "status": "Comparison Complete",
                "created_at": "2026-09-25T11:00:00Z"
            }
        ]

        # 7. Quotations (3 competing proposals for RFP-001)
        self.quotations = [
            {
                "id": "quote-001",
                "request_id": "rfp-001",
                "wedding_id": "wed-001",
                "vendor_id": "ven-001",
                "vendor_name": "Royal Feast Catering",
                "price_per_plate_or_service": 6200,
                "total_quoted_amount": 4200000,
                "service_inclusions": "5-Star Butler Service, 12 Live Cooking Counters, Imported Artisan Cheeses, Signature Molecular Dessert Lab, Silver Crockery.",
                "additional_charges": 250000,
                "notes": "Includes Chef Ranveer Brar live presence during Grand Reception.",
                "proposal_pdf_url": "/documents/royal_feast_jaipur_proposal.pdf",
                "status": "Client Approved",
                "shared_with_client": True,
                "client_feedback": "Approved by Aarav & Meera. Proceed with tasting and agreement lock.",
                "created_at": "2026-10-02T10:00:00Z"
            },
            {
                "id": "quote-002",
                "request_id": "rfp-001",
                "wedding_id": "wed-001",
                "vendor_id": "ven-002",
                "vendor_name": "Maharaja Culinary Arts",
                "price_per_plate_or_service": 5800,
                "total_quoted_amount": 3950000,
                "service_inclusions": "Traditional Royal Rajput Thali with pure silver service, 8 Live Regional Stalls, Heritage Sweets & Kesar Milk fountain.",
                "additional_charges": 180000,
                "notes": "Heritage copper and brass chaffing displays included.",
                "proposal_pdf_url": "/documents/maharaja_culinary_proposal.pdf",
                "status": "Shared with Client",
                "shared_with_client": True,
                "client_feedback": None,
                "created_at": "2026-10-04T12:00:00Z"
            },
            {
                "id": "quote-003",
                "request_id": "rfp-001",
                "wedding_id": "wed-001",
                "vendor_id": "ven-003",
                "vendor_name": "Shahi Dastarkhwan",
                "price_per_plate_or_service": 5400,
                "total_quoted_amount": 3650000,
                "service_inclusions": "Authentic Dum Pukht handis, 6 live tandoors, Royal Awadhi Shahi Dastarkhwan seating arrangement for VIP family.",
                "additional_charges": 150000,
                "notes": "Internal review marked high quality but couple prefers broader pan-Asian options.",
                "proposal_pdf_url": "/documents/shahi_dastarkhwan_quote.pdf",
                "status": "Submitted",
                "shared_with_client": False, # Kept internal, not shared with client
                "client_feedback": None,
                "created_at": "2026-10-05T15:00:00Z"
            }
        ]

        # 8. Wedding Vendors (Confirmed)
        self.wedding_vendors = [
            {
                "id": "wv-001",
                "wedding_id": "wed-001",
                "vendor_id": "ven-001",
                "category": "Catering",
                "vendor_name": "Royal Feast Catering",
                "agreed_amount": 4200000,
                "contract_status": "Confirmed"
            }
        ]

        # 9. Events (3-Day Schedule)
        self.events = [
            {"id": "evt-001", "wedding_id": "wed-001", "event_name": "Mehendi & Floral Carnival", "date": "2026-12-18", "start_time": "14:00", "end_time": "18:00", "location": "Poolside Mughal Gardens", "dress_code": "Vibrant Pastel Indian"},
            {"id": "evt-002", "wedding_id": "wed-001", "event_name": "Sangeet Extravaganza & Cocktail Gala", "date": "2026-12-18", "start_time": "19:30", "end_time": "01:00", "location": "Grand Ballroom & Terraces", "dress_code": "Glittering Glamour & Tuxedos"},
            {"id": "evt-003", "wedding_id": "wed-001", "event_name": "Haldi & Chooda Ceremony", "date": "2026-12-19", "start_time": "10:30", "end_time": "13:00", "location": "Sunlit Courtyard", "dress_code": "Shades of Mustard & Sunshine Yellow"},
            {"id": "evt-004", "wedding_id": "wed-001", "event_name": "Royal Baraat & Mandap Pheras", "date": "2026-12-19", "start_time": "16:30", "end_time": "20:30", "location": "Heritage Palace Amphitheatre", "dress_code": "Regal Rajputana & Ivory Sherwanis"},
            {"id": "evt-005", "wedding_id": "wed-001", "event_name": "Grand Evening Reception & Gala Dinner", "date": "2026-12-20", "start_time": "20:00", "end_time": "02:00", "location": "Palace Front Lawns", "dress_code": "High-Formal Black Tie / Regal Silk"}
        ]

        # 10. Vendor Arrivals
        self.vendor_arrivals = [
            {"id": "va-001", "event_id": "evt-002", "wedding_id": "wed-001", "vendor_id": "ven-001", "vendor_name": "Royal Feast Catering", "expected_time": "16:00", "arrival_status": "Arrived", "actual_arrival_time": "15:45", "coordinator_notes": "Main prep vans arrived on time. Kitchen staging active."},
            {"id": "va-002", "event_id": "evt-002", "wedding_id": "wed-001", "vendor_id": "ven-004", "vendor_name": "Vogue Wedding Tales", "expected_time": "18:00", "arrival_status": "Expected", "actual_arrival_time": None, "coordinator_notes": "Lead shooter on site; 4K drone crew in transit from airport."}
        ]

        # 11. Guests (Aarav & Meera)
        self.guests = [
            {"id": "gst-001", "wedding_id": "wed-001", "name": "Rajesh & Sunita Singhania", "family_group": "Groom Immediate", "plus_ones": 2, "invitation_category": "VVIP Family", "functions_attending": ["All"], "rsvp_status": "Attending", "checked_in": True, "checked_in_at": "2026-12-18T13:30:00Z", "qr_code": "VIVAAH-WED001-GST001", "table_assigned": "Palace Suite Table 1"},
            {"id": "gst-002", "wedding_id": "wed-001", "name": "Vikramaditya Kapoor", "family_group": "Bride Immediate", "plus_ones": 1, "invitation_category": "VVIP Family", "functions_attending": ["All"], "rsvp_status": "Attending", "checked_in": True, "checked_in_at": "2026-12-18T13:45:00Z", "qr_code": "VIVAAH-WED001-GST002", "table_assigned": "Palace Suite Table 1"},
            {"id": "gst-003", "wedding_id": "wed-001", "name": "Aditya & Natasha Birla", "family_group": "Dignitaries", "plus_ones": 1, "invitation_category": "VIP", "functions_attending": ["Sangeet", "Pheras", "Reception"], "rsvp_status": "Attending", "checked_in": False, "checked_in_at": None, "qr_code": "VIVAAH-WED001-GST003", "table_assigned": "Table Royal 4"},
            {"id": "gst-004", "wedding_id": "wed-001", "name": "Rohan & Tara Oberoi", "family_group": "Friends of Couple", "plus_ones": 0, "invitation_category": "Standard", "functions_attending": ["Sangeet", "Reception"], "rsvp_status": "Attending", "checked_in": False, "checked_in_at": None, "qr_code": "VIVAAH-WED001-GST004", "table_assigned": "Table Heritage 7"},
            {"id": "gst-005", "wedding_id": "wed-001", "name": "Sameer & Neha Gupta", "family_group": "Friends of Couple", "plus_ones": 1, "invitation_category": "Standard", "functions_attending": ["All"], "rsvp_status": "Declined", "checked_in": False, "checked_in_at": None, "qr_code": "VIVAAH-WED001-GST005", "table_assigned": None}
        ]

        # 12. Client Payments
        self.client_payments = [
            {"id": "cp-001", "wedding_id": "wed-001", "milestone_name": "Booking Deposit (20%)", "amount": 3600000, "due_date": "2026-09-25", "paid_date": "2026-09-24", "status": "Paid", "payment_method": "Wire Transfer", "reference_no": "HDFC-RTGS-99021"},
            {"id": "cp-002", "wedding_id": "wed-001", "milestone_name": "Venue & Decor Lock Milestone (40%)", "amount": 7200000, "due_date": "2026-10-30", "paid_date": "2026-10-28", "status": "Paid", "payment_method": "Wire Transfer", "reference_no": "ICICI-RTGS-88102"},
            {"id": "cp-003", "wedding_id": "wed-001", "milestone_name": "Vendor Production Advances (25%)", "amount": 4500000, "due_date": "2026-11-25", "paid_date": None, "status": "Pending", "payment_method": None, "reference_no": None},
            {"id": "cp-004", "wedding_id": "wed-001", "milestone_name": "Final Handover Settlement (15%)", "amount": 2700000, "due_date": "2026-12-15", "paid_date": None, "status": "Pending", "payment_method": None, "reference_no": None}
        ]

        # 13. Vendor Payments
        self.vendor_payments = [
            {"id": "vp-001", "wedding_id": "wed-001", "vendor_id": "ven-001", "vendor_name": "Royal Feast Catering", "milestone_name": "Advance Kitchen & Raw Ingredient Lock", "agreed_amount": 4200000, "amount_paid": 2000000, "additional_charges": 0, "balance_due": 2200000, "status": "Partial Paid", "due_date": "2026-11-15"},
            {"id": "vp-002", "wedding_id": "wed-001", "vendor_id": "ven-004", "vendor_name": "Vogue Wedding Tales", "milestone_name": "Crew & Equipment Advance", "agreed_amount": 1200000, "amount_paid": 600000, "additional_charges": 0, "balance_due": 600000, "status": "Partial Paid", "due_date": "2026-11-20"}
        ]

        # 14. Expenses
        self.expenses = [
            {"id": "exp-001", "wedding_id": "wed-001", "category": "Logistics", "description": "Charter luggage transport vans Delhi to Jaipur", "amount": 145000, "recorded_by": "Arjun Verma", "created_at": "2026-10-15"},
            {"id": "exp-002", "wedding_id": "wed-001", "category": "Licensing", "description": "Royal Palace late-night acoustic music compliance permit", "amount": 85000, "recorded_by": "Siddharth Goenka", "created_at": "2026-10-20"}
        ]

        # 15. Documents
        self.documents = [
            {"id": "doc-001", "wedding_id": "wed-001", "file_name": "Aarav_Meera_Master_Service_Agreement.pdf", "file_url": "/documents/Aarav_Meera_Master_Agreement.pdf", "category": "Client Agreement", "file_size": "2.4 MB", "uploaded_by": "Priya Sharma", "created_at": "2026-09-25"},
            {"id": "doc-002", "wedding_id": "wed-001", "file_name": "Royal_Feast_Catering_Confirmed_Quote.pdf", "file_url": "/documents/Royal_Feast_Proposal.pdf", "category": "Vendor Quotation", "file_size": "1.8 MB", "uploaded_by": "Chef Ranveer Brar", "created_at": "2026-10-02"},
            {"id": "doc-003", "wedding_id": "wed-001", "file_name": "Palace_Rambagh_Event_Permit.pdf", "file_url": "/documents/Rambagh_Permit.pdf", "category": "Permits & Licenses", "file_size": "850 KB", "uploaded_by": "Arjun Verma", "created_at": "2026-10-22"}
        ]

        # 16. Activity Logs
        self.activity_logs = [
            {"id": "act-001", "wedding_id": "wed-001", "action": "Enquiry Converted", "actor_name": "Priya Sharma", "details": "Enquiry enq-001 successfully converted into wedding project wed-001.", "created_at": "2026-09-22T12:00:00Z"},
            {"id": "act-002", "wedding_id": "wed-001", "action": "Tasks Generated", "actor_name": "System", "details": "27 standard full-service tasks scheduled automatically.", "created_at": "2026-09-22T12:00:05Z"},
            {"id": "act-003", "wedding_id": "wed-001", "action": "Proposal Approved", "actor_name": "Aarav & Meera", "details": "Client approved Royal Feast Catering quotation of ₹42,00,000.", "created_at": "2026-10-06T14:20:00Z"}
        ]

# Instantiate singleton in-memory database
db_store = DatabaseStore()
