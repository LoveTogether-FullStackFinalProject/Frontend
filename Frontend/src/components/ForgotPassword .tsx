import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { newPassword } from "../services/login-service";
import dataService from '../services/data-service';


const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email || !password) {
      setMessage('אנא הכנס/י מייל וסיסמה');
      return;
    }
    if (password.length < 8) {
      setMessage('הסיסמה חייבת להיות לפחות 8 תווים');
      return;
    }
    try {
      const res = await newPassword(email, password);
      if (res._id) {
      localStorage.setItem('userID', res._id);
      localStorage.setItem('accessToken', res.accessToken!);
      localStorage.setItem('refreshToken', res.refreshToken!);
      console.log("accessToken:",res.accessToken!)
      console.log("refreshToken:",res.refreshToken!)
      const userId = localStorage.getItem('userID');
      if (userId) {
        const { data } = await dataService.getUser(userId).req;
        if (data.isAdmin) {
          navigate('/adminDashboard');
        } else {
          navigate('/mainPage');
        }
    }
  }
    } catch (error) {
      setMessage('אנא הכנס/י מייל תקין');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 15,
          marginBottom: 55,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          יצירת סיסמה חדשה
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="אימייל"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputLabelProps={{
              sx: {
                right: 19,
                left: 'auto',
                transformOrigin: 'top right',
                '&.MuiInputLabel-shrink': {
                  transform: 'translate(0, -10px) scale(0.85)',
                  transformOrigin: 'top right',
                },
                '& .MuiFormLabel-asterisk': {
                display: 'none',
              },
              }
            }}
            InputProps={{
              sx: { 
                textAlign: 'right', 
                direction: 'rtl',
                '& .MuiOutlinedInput-notchedOutline': {
                  textAlign: 'right',
                },
              }
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="סיסמה חדשה"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputLabelProps={{
              sx: {
                right: 16,
                left: 'auto',
                transformOrigin: 'top right',
                '&.MuiInputLabel-shrink': {
                  transform: 'translate(0, -10px) scale(0.85)',
                  transformOrigin: 'top right',
                },
                '& .MuiFormLabel-asterisk': {
                display: 'none',
              },
              }
            }}
            InputProps={{
              sx: { 
                textAlign: 'right', 
                direction: 'rtl',
                '& .MuiOutlinedInput-notchedOutline': {
                  textAlign: 'right',
                },
              }
            }}
          />
          {message && (
          <Typography color="error" sx={{ textAlign: 'right', marginLeft: 'auto' }}>
            {message}
          </Typography>
        )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            שינוי הסיסמה
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => navigate('/login')}
          >
           בחזרה להתחברות
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ForgotPassword;