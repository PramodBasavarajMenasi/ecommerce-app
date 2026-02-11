import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        background: "white",
        color: "black",
        borderBottom: "1px solid #eee",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ShoppingBag size={22} color="#7c3aed" />
          <Typography fontWeight="bold">
            ShopSaaS
          </Typography>
        </Box>

        <Box>
          <Button
            component={Link}
            to="/"
            sx={{ color: "#7c3aed", fontWeight: 600 }}
          >
            Login
          </Button>
          <Button
            component={Link}
            to="/register"
            variant="contained"
            sx={{
              ml: 1,
              borderRadius: 2,
              background:
                "linear-gradient(90deg, #6366f1, #7c3aed)",
            }}
          >
            Register
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
