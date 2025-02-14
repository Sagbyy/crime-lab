import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./home/Home";
import CaseDetails from "./cases/CaseDetails";
import IndividuDetails from "./individus/IndividuDetails";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary fallback={<div>Erreur</div>}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/case/:id" element={<CaseDetails />} />
          <Route path="/individu/:id" element={<IndividuDetails />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);
