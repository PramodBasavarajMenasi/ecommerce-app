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
  MenuItem,
  InputAdornment,
  IconButton,
  Divider,
} from "@mui/material";

import {
  Mail,
  Lock,
  User,
  MapPin,
  Eye,
  EyeOff,
} from "lucide-react";

export default function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
    age: "",
    gender: "",
    city: "",
    state: "",
    country: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    return regex.test(password);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!validatePassword(formData.password)) {
      setErrorMessage(
        "Password must be 8+ characters, include uppercase, lowercase, number and special character."
      );
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .insert([
        {
          id: data.user.id,
          full_name: formData.full_name,
          age: formData.age,
          gender: formData.gender,
          city: formData.city,
          state: formData.state,
          country: formData.country,
        },
      ]);

    if (profileError) {
      setErrorMessage(profileError.message);
      return;
    }

    navigate("/dashboard");
  };

  return (

        <Box
  sx={{
    minHeight: "calc(100vh - 140px)", // leaves space for navbar + footer
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background:
      "linear-gradient(135deg, #6366f1 0%, #7c3aed 50%, #9333ea 100%)",
    py: 6,
    px: 2,
  }}
>

      <Box
        sx={{
          animation: "fadeIn 0.6s ease",
          "@keyframes fadeIn": {
            from: { opacity: 0, transform: "translateY(20px)" },
            to: { opacity: 1, transform: "translateY(0)" },
          },
        }}
      >
        <Card
  sx={{
    width: { xs: "100%", sm: 400 },
    borderRadius: 4,
    background: "rgba(255,255,255,0.98)",
    boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
  }}
>
          <CardContent sx={{ p: 4 }}>
            {/* Header */}
            <Typography
              variant="h4"
              fontWeight="bold"
              align="center"
              gutterBottom
            >
              Create Account
            </Typography>

            <Typography
              variant="body2"
              align="center"
              color="text.secondary"
              mb={3}
            >
              Start your journey with us
            </Typography>

            <form onSubmit={handleRegister}>
              <TextField
                fullWidth
                margin="normal"
                label="Email"
                name="email"
                onChange={handleChange}
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
                name="password"
                onChange={handleChange}
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

              <Divider sx={{ my: 3 }} />

              <TextField
                fullWidth
                margin="normal"
                label="Full Name"
                name="full_name"
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <User size={18} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                margin="normal"
                type="number"
                label="Age"
                name="age"
                onChange={handleChange}
              />

              <TextField
                select
                fullWidth
                margin="normal"
                label="Gender"
                name="gender"
                onChange={handleChange}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </TextField>

              <TextField
                fullWidth
                margin="normal"
                label="City"
                name="city"
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MapPin size={18} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                margin="normal"
                label="State"
                name="state"
                onChange={handleChange}
              />

              <TextField
                fullWidth
                margin="normal"
                label="Country"
                name="country"
                onChange={handleChange}
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
                  py: 1.4,
                  fontWeight: "bold",
                  borderRadius: 3,
                  fontSize: "15px",
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
                Create Account
              </Button>

              <Typography
                align="center"
                variant="body2"
                mt={3}
              >
                Already have an account?{" "}
                <Link
                  to="/"
                  style={{
                    color: "#7c3aed",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  Login
                </Link>
              </Typography>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
