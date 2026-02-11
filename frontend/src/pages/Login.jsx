import { useState } from "react";
import { supabase } from "../lib/supabase";
import { Link, useNavigate } from "react-router-dom";

import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";

import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShoppingBag,
} from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMessage(error.message);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 140px)",
        display: "flex",
      }}
    >
      {/* LEFT SIDE - Branding */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background:
            "linear-gradient(135deg, #6366f1 0%, #7c3aed 50%, #9333ea 100%)",
          color: "white",
          px: 6,
        }}
      >
        <ShoppingBag size={48} />
        <Typography variant="h3" fontWeight="bold" mt={3}>
          Welcome Back @ ShopSaaS
        </Typography>
        <Typography variant="body1" mt={2} sx={{ opacity: 0.85 }}>
          Sign in to continue your shopping experience
        </Typography>
      </Box>

      {/* RIGHT SIDE - Login Form */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f9fafb",
          px: 2,
        }}
      >
        <Box
          sx={{
            animation: "fadeIn 0.5s ease",
            "@keyframes fadeIn": {
              from: { opacity: 0, transform: "translateY(20px)" },
              to: { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          <Card
            sx={{
              width: { xs: "100%", sm: 380 },
              borderRadius: 4,
              boxShadow: "0 20px 50px rgba(0,0,0,0.1)",
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography
                variant="h4"
                fontWeight="bold"
                gutterBottom
              >
                Login
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                mb={3}
              >
                Enter your credentials to continue
              </Typography>

              <form onSubmit={handleLogin}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Email"
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Mail size={18} />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  margin="normal"
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock size={18} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowPassword(!showPassword)
                          }
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {errorMessage && (
                  <Typography
                    color="error"
                    variant="body2"
                    mt={2}
                  >
                    {errorMessage}
                  </Typography>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    mt: 3,
                    py: 1.3,
                    fontWeight: "bold",
                    borderRadius: 3,
                    background:
                      "linear-gradient(90deg, #6366f1, #7c3aed)",
                    boxShadow:
                      "0 8px 20px rgba(99,102,241,0.4)",
                    "&:hover": {
                      background:
                        "linear-gradient(90deg, #4f46e5, #6d28d9)",
                    },
                  }}
                >
                  Login
                </Button>
              </form>

              <Typography
                variant="body2"
                mt={3}
                textAlign="center"
              >
                Don't have an account?{" "}
                <Link
                  to="/register"
                  style={{
                    color: "#7c3aed",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  Register
                </Link>
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
