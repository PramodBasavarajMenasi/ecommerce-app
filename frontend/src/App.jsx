import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LandingPage from "./pages/LandingPage";


import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Box } from "@mui/material";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      {/* Page Content Wrapper */}
      <Box sx={{ minHeight: "calc(100vh - 140px)" }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<LandingPage />} />

        </Routes>
      </Box>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
