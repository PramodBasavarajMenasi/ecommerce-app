import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box
      sx={{
        textAlign: "center",
        py: 3,
        background: "#f9fafb",
        borderTop: "1px solid #eee",
      }}
    >
      <Typography variant="body2" color="text.secondary">
        © {new Date().getFullYear()} ShopSaaS. All rights reserved.
      </Typography>
    </Box>
  );
}
