import React from 'react';
import { Box, Typography, Grid, Link, Container } from '@mui/material';

import logo from '../assets/logoorg.jpg';
import img1 from '../assets/organizationImages/img1.jpg';
import img2 from '../assets/organizationImages/img2.jpg';
import img3 from '../assets/organizationImages/img3.jpg';
import img4 from '../assets/organizationImages/img4.jpg';
import img5 from '../assets/organizationImages/img5.jpg';
import img6 from '../assets/organizationImages/img6.jpg';
import img7 from '../assets/organizationImages/img7.jpg';
import img8 from '../assets/organizationImages/img8.jpg';
import img9 from '../assets/organizationImages/img9.jpg';
import img10 from '../assets/organizationImages/img10.jpg';
import img11 from '../assets/organizationImages/img11.jpg';
import img12 from '../assets/organizationImages/img12.jpg';
import img13 from '../assets/organizationImages/img13.jpg';
import img14 from '../assets/organizationImages/img14.jpg';
import img15 from '../assets/organizationImages/img15.jpg';
import img16 from '../assets/organizationImages/img16.jpg';
import img17 from '../assets/organizationImages/img17.jpg';

const images = [
  img1, img2, img3, img4, img5, img6, img7,
  img8, img9, img10, img11, img12, img13, img14,
  img15, img16, img17
];

function InstagramSection() {
  return (
    <Container sx={{ marginTop: '50px', textAlign: 'center' }}>
      <style>
        {`
          @keyframes rotate {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }

          .rotating-ring {
            position: absolute;
            top: -5px;
            left: -5px;
            width: 160px;
            height: 160px;
            border-radius: 50%;
            border: 5px solid transparent;
            border-top: 5px solid #f09433;
            border-right: 5px solid #e6683c;
            border-bottom: 5px solid #dc2743;
            border-left: 5px solid #cc2366;
            animation: rotate 2s linear infinite;
            cursor: pointer; /* Ensure cursor is a pointer */
          }
        `}
      </style>
      <Link href="https://www.instagram.com/veahavtem_beyahad/?igshid=MzMyNGUyNmU2YQ%3D%3D&utm_source=qr" target="_blank">
        <Box 
          sx={{ position: 'relative', display: 'inline-block' }}
        >
          <Box className="rotating-ring" />
          <Box 
            component="img"
            src={logo} 
            alt="Organization Logo"
            sx={{
              width: '150px',
              height: '150px',
              borderRadius: '50%', 
              marginBottom: '20px',
              cursor: 'pointer',
            }}
          />
        </Box>
      </Link>

      <Typography variant="h4" sx={{ fontFamily: 'Assistant', padding: '15px', textAlign: 'center' }}>
        <Link 
          href="https://www.instagram.com/veahavtem_beyahad/?igshid=MzMyNGUyNmU2YQ%3D%3D&utm_source=qr" 
          target="_blank"
          sx={{
            color: 'inherit', 
            textDecoration: 'none',
          }}
        >
          עקבו אחרינו
        </Link>
      </Typography>
      <Typography variant="h4" sx={{ fontFamily: 'Assistant' }}>
        <Link 
          href="https://www.instagram.com/veahavtem_beyahad/?igshid=MzMyNGUyNmU2YQ%3D%3D&utm_source=qr" 
          target="_blank"
          sx={{
            color: 'inherit', 
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
            }
          }}
        >
          veahavtem_beyahad@
        </Link>
      </Typography>



      <Grid 
        container 
        spacing={2} 
        sx={{ 
          marginTop: '30px', 
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {images.map((image, index) => (
          <Grid item xs={6} sm={4} md={3} key={index}>
            <Box 
              component="img"
              src={image}
              alt={`Instagram Image ${index + 1}`}
              sx={{
                width: '100%', 
                height: '200px',
                borderRadius: '10px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                objectFit: 'cover'
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default InstagramSection;
