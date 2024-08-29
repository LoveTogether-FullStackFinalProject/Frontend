import React from "react";
import { Box, Typography, Link, IconButton } from "@mui/material";
import { WhatsApp, Email } from "@mui/icons-material";
import "./Footer.css";

const Footer: React.FC = () => {
  return (
    <Box component="footer" className="footer">
      {/* Copyright Information */}
      <Typography variant="body2">
        &copy; {new Date().getFullYear()} עמותת ואהבתם ביחד
      </Typography>

      {/* Contact Section */}
      {/* WhatsApp Contact */}
      <Box className="contact-item">
        <IconButton
          component={Link}
          href="https://wa.me/0556842412"
          target="_blank"
          aria-label="WhatsApp"
        >
          <WhatsApp />
        </IconButton>
        <Typography variant="body2">055-6842412</Typography>
      </Box>

      {/* Email Contact */}
      <Box className="contact-item">
        <IconButton
          component={Link}
          href="mailto:info@ve-be.org"
          aria-label="Email"
        >
          <Email />
        </IconButton>
        <Typography variant="body2">info@ve-be.org</Typography>
      </Box>
      <Typography variant="body2" sx={{ padding: "0 10px" }}>
        :ליצירת קשר
      </Typography>
    </Box>
  );
};

export default Footer;
