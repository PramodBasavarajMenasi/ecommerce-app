import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        navigate("/");
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userData.user.id)
        .single();

      setProfile(data);
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <Box sx={{ p: 6 }}>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Dashboard
      </Typography>

      <Card sx={{ maxWidth: 400, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6">
            Welcome, {profile?.full_name || "User"} 👋
          </Typography>


          <Typography variant="body2">
            Location: {profile?.city}, {profile?.country}
          </Typography>

          <Button
            variant="contained"
            color="error"
            sx={{ mt: 3 }}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
