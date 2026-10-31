# VIVAAH — UNIFIED LUXURY WEDDING AGENCY PLATFORM

> **Luxury Wedding Planning Agency & Operations Suite**  
> Faithfully refined from approved Google Stitch visual designs while implementing a production-grade FastAPI backend, Supabase database, and role-based client and vendor experiences.

---

## 🏛️ Executive Summary

**Vivaah** is an end-to-end web platform engineered for luxury destination wedding planning agencies, ultra-high-net-worth couples, and elite wedding vendors.

The platform embodies **"One Wedding — One Connected Workspace"**, uniting public client acquisition, lead nurturing, 25+ automated task orchestration, multi-vendor quotations and bidding, guest attendance with digital QR check-in, escrow finance management, and dedicated authenticated portals for couples and vendors into one cohesive system.

---

## 🎨 Visual Identity & Design System

The visual design system strictly preserves the approved Stitch palette:
- **Deep Plum**: `#241820` — Main brand anchor and rich dark surfaces
- **Warm Ivory**: `#F5EFE7` — Luxurious background canvas
- **Champagne Gold**: `#B99A72` — Accent borders, badges, and icons
- **Dusty Rose**: `#A77D83` — Soft status tags and feedback chips
- **Olive Charcoal**: `#343A35` — Structural borders and table headers
- **Typography Pairing**:
  - **Headlines & Mastheads**: `EB Garamond` (Classical editorial serif)
  - **Interface & Operational Data**: `Manrope` with tabular numbers (`tnum`)

---

## 🛠️ Technology Stack

- **Frontend**:
  - React 18, Vite 6, Tailwind CSS 3, React Router 6
  - `@supabase/supabase-js`, `recharts`, `qrcode.react`, `jspdf`, `canvas-confetti`
- **Backend**:
  - Python 3, FastAPI, Uvicorn, Pydantic v2
  - Official Supabase Python SDK (`supabase`)
- **Database & Services**:
  - Supabase hosted PostgreSQL database
  - Supabase Auth & Storage
  - 16 Relational Tables with Row Level Security (RLS) policies

---

## 🚀 Quick Start Guide

### 1. Frontend Setup (React + Vite)

The frontend is already configured and running locally:
```bash
# In the project root:
npm install
npm run dev
```
Available at: **`http://localhost:5173/`**

### 2. Backend Setup (FastAPI + Python)

The FastAPI backend runs on port 8000:
```bash
# In the project root:
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
Available at:
- API Base: **`http://127.0.0.1:8000/api`**
- Interactive Swagger Docs: **`http://127.0.0.1:8000/docs`**
- Health Status: **`http://127.0.0.1:8000/api/health`**

### 3. Supabase Configuration (Optional for Live DB)

Vivaah runs **100% out of the box** in standby mode pre-seeded with the **Aarav & Meera — Royal Jaipur Wedding** demo data. Every single API endpoint and workflow is fully functional.

To connect your live Supabase project:
1. **Frontend**: Create `.env` in the root directory:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
   VITE_API_BASE_URL=http://localhost:8000/api
   ```
2. **Backend**: Create `backend/.env`:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_PUBLISHABLE_KEY=your-publishable-key
   SUPABASE_SECRET_KEY=your-service-role-secret-key
   ```
3. **Database Migration**: Run [`supabase_schema.sql`](file:///c:/Users/vishv/Music/SHARNITHA/Vivaah_odoo/supabase_schema.sql) in your **Supabase Dashboard SQL Editor**.

---

## 🔐 Dedicated Role Logins & Authentication

Per security and privacy requirements, public portal-switching elements have been removed. Portals are authenticated through their dedicated URLs:

| Role | Dedicated Login Route | Demo Persona | Email | Password |
| :--- | :--- | :--- | :--- | :--- |
| **Agency Planner** | `/agency/login` | Priya Sharma | `priya@vivaahateliers.com` | `vivaah2026` |
| **Agency Director** | `/agency/login` | Pooja Singhania | `pooja@vivaahateliers.com` | `vivaah2026` |
| **Enquiry Executive** | `/agency/login` | Vikram Sen | `vikram@vivaahateliers.com` | `vivaah2026` |
| **Event Coordinator**| `/agency/login` | Arjun Verma | `arjun@vivaahateliers.com` | `vivaah2026` |
| **Finance Director** | `/agency/login` | Siddharth Goenka | `siddharth@vivaahateliers.com` | `vivaah2026` |
| **Client (Couple)** | `/client/login` | Aarav & Meera | `aarav.meera@client.vivaah.com` | `vivaah2026` |
| **Vendor Partner** | `/vendor/login` | Chef Ranveer Brar | `proposals@royalfeastcatering.com` | `vivaah2026` |

*Note: Role-based route guards (`ProtectedRoutes.jsx`) strictly prevent clients or vendors from accessing internal agency files, and prevent clients from seeing competitors' private bids.*

---

## 📊 The 9 Simplified Agency Modules

The Agency Workspace sidebar contains exactly nine approved modules:

1. **Overview** (`/workspace`): Active weddings, enquiry counts, tasks due, upcoming milestones, financial summary, and recent activity feed.
2. **Enquiries** (`/workspace/enquiries`): Lead pipeline, couple details, call notes, status transitions, and 1-click **Convert to Wedding**.
3. **Wedding Projects** (`/workspace/weddings`): Comprehensive project dossier for confirmed weddings.
4. **Planning & Tasks** (`/workspace/tasks`): 27+ auto-generated tasks organized by category, priority, due date, and status.
5. **Vendors & Quotations** (`/workspace/vendors`): RFP creation, 3-way quotation comparison, proposal sharing with couples, and vendor confirmation.
6. **Guests & Events** (`/workspace/guests-events`): Guest attendance, digital QR / manual check-in, duplicate detection, run-of-show schedule, and vendor arrival tracking.
7. **Finance & Payments** (`/workspace/finance`): Client payment milestones, vendor advances, operational expenses, and profit margin calculation.
8. **Documents** (`/workspace/documents`): Client agreements, signed contracts, vendor proposals, and invoices.
9. **Reports** (`/workspace/reports`): Real-time metrics on agency revenue, vendor expenditures, net profits, and destination distributions.

---

## 🔄 Real Functional Workflows

1. **Enquiry Conversion**: Public form (`/enquire`) submits an enquiry. The planner reviews it in `/workspace/enquiries` and clicks **Convert to Wedding**. The system creates the wedding record, links it, auto-generates 27 planning tasks, and locks against repeated clicks.
2. **Planning Checklist**: Automatically creates tasks for Full-Service weddings (venue inspections, tastings, mandap mockups, permits, run-of-show cues).
3. **Quotation Workflow**: Planners issue an RFP. Vendors submit proposals. The planner shares shortlisted quotes with the couple. The couple logs in to `/client` and approves their choice. The planner marks the vendor confirmed, generating a payment milestone.
4. **Guest QR Check-in**: Concierge team uses QR scanner or manual search. Duplicate check-ins are detected and blocked. Additional guests beyond expected capacity are flagged.
5. **Escrow Finance**:
   - `Total Revenue = Contract Amount + Approved Additional Charges`
   - `Total Expenses = Vendor Costs + Additional Operational Expenses`
   - `Estimated Profit = Total Revenue - Total Expenses`
