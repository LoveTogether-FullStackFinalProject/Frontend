import React from "react";
// import facebookLogo from '../assets/facebookLogo.png';
// import instagramLogo from '../assets/instagramLogo.png';
import "./Footer.css";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      {/* <div className="social-media">
        <a href="https://www.facebook.com/veahavtembeyahad/" target="_blank" rel="noopener noreferrer">
          <img src={facebookLogo} alt="Facebook" />
        </a>
        <a href="https://www.instagram.com/veahavtem_beyahad/" target="_blank" rel="noopener noreferrer">
          <img src={instagramLogo} alt="Instagram" />
        </a>
      </div> */}
      <p>עמותת ואהבתם ביחד &copy; {new Date().getFullYear()}</p>
    </footer>
  );
};

export default Footer;

// import React from 'react';
// import { Box, Typography, Link, Container, IconButton } from '@mui/material';
// import { Facebook,  Instagram } from '@mui/icons-material';

// const Footer = () => {
//   return (
//     <Box
//       component="footer"
//       sx={{
//         backgroundColor: '#000000d3',
//         color: 'white',
//         textAlign: 'center',
//         py: 2,
//         position: 'static',
//         bottom: 0,
//         left: 0,
//         width: '100%',
//         boxShadow: '0 -2px 5px rgba(37, 36, 36, 0.421)',
//         zIndex: 1300,  // Ensure it stays above other components
//       }}
//     >
//       <Container maxWidth="lg">

//         <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 1 }}>
//           <IconButton component={Link} href="https://facebook.com" target="_blank" aria-label="Facebook" sx={{ color: 'white' }}>
//             <Facebook />
//           </IconButton>

//           <IconButton component={Link} href="https://instagram.com" target="_blank" aria-label="Instagram" sx={{ color: 'white' }}>
//             <Instagram />
//           </IconButton>
//         </Box>
//         <Typography variant="body2" sx={{ mb: 1 }}>
//           &copy; {new Date().getFullYear()} עמותת ואהבתם ביחד
//         </Typography>
//       </Container>
//     </Box>
//   );
// };

// export default Footer;
