import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

// Public Pages
import HomePage from './pages/public/HomePage';
import EnquiryPage from './pages/public/EnquiryPage';

// Authenticated Login Pages (Dedicated Role Routes)
import AgencyLoginPage from './pages/auth/AgencyLoginPage';
import ClientLoginPage from './pages/auth/ClientLoginPage';
import VendorLoginPage from './pages/auth/VendorLoginPage';

// Protected Route Guards
import { AgencyRoute, ClientRoute, VendorRoute } from './components/auth/ProtectedRoutes';

// Workspace Layout & 9 Simplified Modules
import WorkspaceLayout from './components/layout/WorkspaceLayout';
import AgencyOverview from './pages/workspace/AgencyOverview';
import EnquiriesClients from './pages/workspace/EnquiriesClients';
import WeddingProjects from './pages/workspace/WeddingProjects';
import TasksCalendar from './pages/workspace/TasksCalendar';
import VendorsQuotations from './pages/workspace/VendorsQuotations';
import GuestEventOperations from './pages/workspace/GuestEventOperations';
import FinancePayments from './pages/workspace/FinancePayments';
import DocumentsAgreements from './pages/workspace/DocumentsAgreements';
import ReportsAnalytics from './pages/workspace/ReportsAnalytics';

// Dedicated Portals
import ClientPortal from './pages/client/ClientPortal';
import VendorPortal from './pages/vendor/VendorPortal';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <Routes>
            {/* 1. Public Marketing Website */}
            <Route path="/" element={<HomePage />} />
            <Route path="/enquire" element={<EnquiryPage />} />

            {/* 2. Dedicated Authenticated Role Logins */}
            <Route path="/agency/login" element={<AgencyLoginPage />} />
            <Route path="/client/login" element={<ClientLoginPage />} />
            <Route path="/vendor/login" element={<VendorLoginPage />} />
            {/* Fallback login route defaults to agency login */}
            <Route path="/login" element={<Navigate to="/agency/login" replace />} />

            {/* 3. Protected Client Portal (Couples only) */}
            <Route element={<ClientRoute />}>
              <Route path="/client" element={<ClientPortal />} />
            </Route>

            {/* 4. Protected Vendor Portal (Partners only) */}
            <Route element={<VendorRoute />}>
              <Route path="/vendor" element={<VendorPortal />} />
            </Route>

            {/* 5. Protected Agency Workspace (9 Approved Modules) */}
            <Route element={<AgencyRoute />}>
              <Route path="/workspace" element={<WorkspaceLayout />}>
                <Route index element={<AgencyOverview />} />
                <Route path="enquiries" element={<EnquiriesClients />} />
                <Route path="weddings" element={<WeddingProjects />} />
                <Route path="tasks" element={<TasksCalendar />} />
                <Route path="vendors" element={<VendorsQuotations />} />
                <Route path="guests-events" element={<GuestEventOperations />} />
                <Route path="finance" element={<FinancePayments />} />
                <Route path="documents" element={<DocumentsAgreements />} />
                <Route path="reports" element={<ReportsAnalytics />} />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
