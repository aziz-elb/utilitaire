import { Toaster } from "sonner";

import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";


import MainLayout from "./components/Layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Members from "./pages/Members";

import Settings from "./pages/Settings";
import Projects from "./pages/Projects";
import NotFound from "./pages/NotFound";

import Login from "./pages/Login";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import PrivateRoute from "./auth/PrivateRoute";
import "./App.css";
import ResetPassword from "./pages/ResetPassword";
import Template from "./pages/Template.js";
import TemplateView from "./pages/TemplateView.js";
import ProjectView from "./pages/ProjectView.js";
import HelpPage from "./pages/Help.js";
import Loading from "./pages/Loading.js";

export default function App() {
  return (
    <TooltipProvider>
      <Toaster position="bottom-right" richColors />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Route publique (login) */}
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
             <Route path="/loading" element={<Loading />} />

            <Route
              path="/"
              element={
                <PrivateRoute>
                  <MainLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:id" element={<ProjectView />} />
              <Route path="/template" element={<Template />} />
               <Route path="/template/:tempid" element={<TemplateView />} />
              <Route path="/members" element={<Members />} />

              <Route path="/settings" element={<Settings />} />
              <Route path="/help" element={<HelpPage />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  );
}
