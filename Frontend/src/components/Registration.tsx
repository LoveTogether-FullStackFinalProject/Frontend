// import { ChangeEvent, useRef, useState } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faImage } from '@fortawesome/free-solid-svg-icons';
// import { uploadPhoto } from '../services/uploadProductService';
// import { registerUser, googleSignIn } from '../services/registrationService';
// import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import z from "zod";
// import { useNavigate } from 'react-router-dom';
// import './Registration.css';

// export let userID: string;

// const schema = z.object({
//     firstName: z.string().min(2, "שם פרטי חייב להכיל לפחות 2 תווים"),
//     lastName: z.string().min(2, "שם משפחה חייב להכיל לפחות 2 תווים"),
//     email: z.string().email("כתובת דואר אלקטרוני לא חוקית"),
//     password: z.string().min(8, "הסיסמה חייבת להכיל לפחות 8 תווים"),
//     phoneNumber: z.string().length(10, "מספר הטלפון חייב להכיל 10 ספרות"),
//     mainAddress: z.string().min(5, "כתובת ראשית חייבת להכיל לפחות 5 תווים"),
//     image: z.any().refine((file) => file instanceof File, 'יש להעלות תמונה').optional()
// });

// type FormData = z.infer<typeof schema>;

// const Registration = () => {
//     const navigate = useNavigate();
//     const [registerError, setRegisterError] = useState<string | null>(null);
//     const [imgSrc, setImgSrc] = useState<File | null>(null);
//     const { register, handleSubmit, formState: { errors }, setValue, trigger } = useForm<FormData>({ resolver: zodResolver(schema) });
//     const fileInputRef = useRef<HTMLInputElement>(null);

//     const imgSelected = (e: ChangeEvent<HTMLInputElement>) => {
//         if (e.target.files && e.target.files.length > 0) {
//             setImgSrc(e.target.files[0]);
//             setValue("image", e.target.files[0]); // Set the file itself, not the URL
//             trigger("image");
//         }
//     };

//     const selectImg = () => {
//         fileInputRef.current?.click();
//     };

//     const registerUserHandler = async (data: FormData) => {
//         try {
//             let imageUrl = '';
//             if (imgSrc) {
//                 imageUrl = await uploadPhoto(imgSrc);
//             }
//             const user = {
//                 ...data,
//                 isAdmin: false,
//                 rating: 0,
//                 image: imageUrl
//             };
//             const res = await registerUser(user);
//             userID = res._id ?? '';

//             if (res.accessToken) {
//                 localStorage.setItem('accessToken', res.accessToken);
//             }
//             if (res.refreshToken) {
//                 localStorage.setItem('refreshToken', res.refreshToken);
//             }
//             localStorage.setItem('userID', userID);

//             // Notify other components about the authentication change
//             window.dispatchEvent(new Event('authChange'));

//             navigate('/mainPage');
//         // eslint-disable-next-line @typescript-eslint/no-explicit-any
//         } catch (err: any) {
//             console.log("err: ", err);
//             const errorMessage = err.response?.data;

//             if (errorMessage) {
//                 if (errorMessage.includes("email already exists")) {
//                     setRegisterError("כתובת דואר אלקטרוני כבר קיימת במערכת");
//                 } else if (errorMessage.includes("missing email or password")) {
//                     setRegisterError("כתובת דואר אלקטרוני או סיסמה חסרים");
//                 } else {
//                     setRegisterError("שגיאה בהרשמה. נסו שוב מאוחר יותר.");
//                 }
//             } else {
//                 setRegisterError("שגיאה בהרשמה. נסו שוב מאוחר יותר.");
//             }
//         }
//     };

//     const onGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
//         try {
//             const res = await googleSignIn(credentialResponse);
//             userID = res._id ?? '';
//             if (res.accessToken) {
//                 localStorage.setItem('accessToken', res.accessToken);
//             }
//             if (res.refreshToken) {
//                 localStorage.setItem('refreshToken', res.refreshToken);
//             }
//             localStorage.setItem('userID', userID);

//             // Notify other components about the authentication change
//             window.dispatchEvent(new Event('authChange'));

//             navigate('/mainPage');
//         } catch (e) {
//             console.log(e);
//         }
//     };

//     // const onGoogleLoginFailure = () => {
//     //     console.log("ההתחברות דרך חשבון Google נכשלה");
//     // };

//     const accessToken = localStorage.getItem('accessToken');
//     if (accessToken) {
//         return (
//             <div className="registration-container">
//                 <div className="registration-body">
//                     <p className="error-message">שגיאה: כבר מחוברים למערכת.</p>
//                     <button className="submit-button" onClick={() => navigate('/mainPage')}>חזור לדף הבית</button>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="registration-container">
//             <div className="registration-body">
//                 <form onSubmit={handleSubmit(registerUserHandler)}>
//                     <div>
//                         <input type="text" placeholder="שם פרטי" {...register('firstName')} className="form-control" />
//                         {errors.firstName && <p className="error-message">{errors.firstName.message}</p>}
//                     </div>
//                     <div>
//                         <input type="text" placeholder="שם משפחה" {...register('lastName')} className="form-control" />
//                         {errors.lastName && <p className="error-message">{errors.lastName.message}</p>}
//                     </div>
//                     <div>
//                         <input type="email" placeholder="דואר אלקטרוני" {...register('email')} className="form-control" />
//                         {errors.email && <p className="error-message">{errors.email.message}</p>}
//                     </div>
//                     <div>
//                         <input type="password" placeholder="סיסמה" {...register('password')} className="form-control" />
//                         {errors.password && <p className="error-message">{errors.password.message}</p>}
//                     </div>
//                     <div>
//                         <input type="text" placeholder="מספר טלפון" {...register('phoneNumber')} className="form-control" />
//                         {errors.phoneNumber && <p className="error-message">{errors.phoneNumber.message}</p>}
//                     </div>
//                     <div>
//                         <input type="text" placeholder="כתובת ראשית" {...register('mainAddress')} className="form-control" />
//                         {errors.mainAddress && <p className="error-message">{errors.mainAddress.message}</p>}
//                     </div>
//                     <div>
//                         <input type="file" ref={fileInputRef} onChange={imgSelected} style={{ display: 'none' }} />
//                         <button type="button" className="upload-button" onClick={selectImg}>
//                             <FontAwesomeIcon icon={faImage} /> בחר תמונה
//                         </button>
//                         {imgSrc && <img src={URL.createObjectURL(imgSrc)} alt="Selected" className="preview-image" />}
//                         {/* {errors.image && <p className="error-message">{errors.image.message}</p>} */}
//                         {errors.image && typeof errors.image.message === 'string' && <p className="error-message">{errors.image.message}</p>}
//                     </div>
//                     <button type="submit" className="submit-button">הרשם</button>
//                 </form>
//                 {registerError && <p className="error-message">{registerError}</p>}
//                 <div className="google-login">
//                     <GoogleLogin
//                         onSuccess={onGoogleLoginSuccess}
//                         text="continue_with"
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Registration;


// 

// import import * as React from 'react';
import { useState, useRef, ChangeEvent } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useNavigate } from 'react-router-dom';
import { uploadPhoto } from '../services/uploadProductService';
import { registerUser, googleSignIn } from '../services/registrationService';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import './Registration.css';


export let userID: string;

const schema = z.object({
  firstName: z.string().min(2, "שם פרטי חייב להכיל לפחות 2 תווים"),
  lastName: z.string().min(2, "שם משפחה חייב להכיל לפחות 2 תווים"),
  email: z.string().email("כתובת דואר אלקטרוני לא חוקית"),
  password: z.string().min(8, "הסיסמה חייבת להכיל לפחות 8 תווים"),
  phoneNumber: z.string().length(10, "מספר הטלפון חייב להכיל 10 ספרות"),
  mainAddress: z.string().min(5, "כתובת ראשית חייבת להכיל לפחות 5 תווים"),
  image: z.any().refine((file) => file instanceof File, 'יש להעלות תמונה').optional()
});

type FormData = z.infer<typeof schema>;

const defaultTheme = createTheme();

export default function SignUp() {
  const navigate = useNavigate();
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [imgSrc, setImgSrc] = useState<File | null>(null);
  const { register, handleSubmit, formState: { errors }, setValue, trigger } = useForm<FormData>({ resolver: zodResolver(schema) });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const imgSelected = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImgSrc(e.target.files[0]);
      setValue("image", e.target.files[0]);
      trigger("image");
    }
  };

  const selectImg = () => {
    fileInputRef.current?.click();
  };

  const registerUserHandler = async (data: FormData) => {
    try {
      let imageUrl = '';
      if (imgSrc) {
        imageUrl = await uploadPhoto(imgSrc);
      }
      const user = {
        ...data,
        isAdmin: false,
        rating: 0,
        image: imageUrl
      };
      const res = await registerUser(user);
      userID = res._id ?? '';

      if (res.accessToken) {
        localStorage.setItem('accessToken', res.accessToken);
      }
      if (res.refreshToken) {
        localStorage.setItem('refreshToken', res.refreshToken);
      }
      localStorage.setItem('userID', userID);

      window.dispatchEvent(new Event('authChange'));

      navigate('/mainPage');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.log("err: ", err);
      const errorMessage = err.response?.data;
      if (errorMessage) {
        if (errorMessage.includes("email already exists")) {
          setRegisterError("כתובת דואר אלקטרוני כבר קיימת במערכת");
        } else if (errorMessage.includes("missing email or password")) {
          setRegisterError("כתובת דואר אלקטרוני או סיסמה חסרים");
        } else {
          setRegisterError("שגיאה בהרשמה. נסו שוב מאוחר יותר.");
        }
      } else {
        setRegisterError("שגיאה בהרשמה. נסו שוב מאוחר יותר.");
      }
    }
  };

  const onGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      const res = await googleSignIn(credentialResponse);
      userID = res._id ?? '';
      if (res.accessToken) {
        localStorage.setItem('accessToken', res.accessToken);
      }
      if (res.refreshToken) {
        localStorage.setItem('refreshToken', res.refreshToken);
      }
      localStorage.setItem('userID', userID);

      window.dispatchEvent(new Event('authChange'));

      navigate('/mainPage');
    } catch (e) {
      console.log(e);
    }
  };

  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            שגיאה: כבר מחוברים למערכת
          </Typography>
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={() => navigate('/mainPage')}
          >
            חזור לדף הבית
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            הרשמה
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit(registerUserHandler)} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="firstName"
                  id="firstName"
                  label="שם פרטי"
                  autoComplete="given-name"
                  autoFocus
                  {...register('firstName')}
                  error={!!errors.firstName}
                  helperText={errors.firstName ? errors.firstName.message : ""}
                  InputLabelProps={{
                    sx: { textAlign: 'right', direction: 'rtl' }
                  }}
                  InputProps={{
                    sx: { textAlign: 'right', direction: 'rtl' }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="שם משפחה"
                  name="lastName"
                  autoComplete="family-name"
                  {...register('lastName')}
                  error={!!errors.lastName}
                  helperText={errors.lastName ? errors.lastName.message : ""}
                  InputLabelProps={{
                    sx: { textAlign: 'right', direction: 'rtl' }
                  }}
                  InputProps={{
                    sx: { textAlign: 'right', direction: 'rtl' }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="אימייל"
                  name="email"
                  autoComplete="email"
                  {...register('email')}
                  error={!!errors.email}
                  helperText={errors.email ? errors.email.message : ""}
                  InputProps={{
                    sx: { textAlign: 'right', direction: 'ltr' }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="סיסמא"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  {...register('password')}
                  error={!!errors.password}
                  helperText={errors.password ? errors.password.message : ""}
                  InputProps={{
                    sx: { textAlign: 'right', direction: 'ltr' }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="phoneNumber"
                  label="מספר טלפון"
                  id="phoneNumber"
                  autoComplete="phone-number"
                  {...register('phoneNumber')}
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber ? errors.phoneNumber.message : ""}
                  InputProps={{
                    sx: { textAlign: 'right', direction: 'ltr' }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="mainAddress"
                  label="כתובת"
                  id="mainAddress"
                  autoComplete="address"
                  {...register('mainAddress')}
                  error={!!errors.mainAddress}
                  helperText={errors.mainAddress ? errors.mainAddress.message : ""}
                  InputLabelProps={{
                    sx: { textAlign: 'right', direction: 'rtl' }
                  }}
                  InputProps={{
                    sx: { textAlign: 'right', direction: 'rtl' }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <input type="file" ref={fileInputRef} onChange={imgSelected} style={{ display: 'none' }} />
                <Button
                  variant="contained"
                  fullWidth
                  onClick={selectImg}
                  sx={{ mt: 1, mb: 2 }}
                >
                  <FontAwesomeIcon icon={faImage}  style={{direction:"rtl"}}/> בחר תמונה
                </Button>
                {imgSrc && <img src={URL.createObjectURL(imgSrc)} alt="Selected" style={{ width: '100%', marginTop: 8 ,direction:"rtl"}} />}
                {errors.image && typeof errors.image.message === 'string' && (
                  <Typography color="error" variant="body2">
                    {errors.image.message}
                  </Typography>
                )}
              </Grid>
            </Grid>
            {registerError && (
              <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                {registerError}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              הרשמה
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  כבר יש לך חשבון? התחבר
                </Link>
              </Grid>
            </Grid>
          </Box>
          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" align="center" style={{direction:"rtl"}}>
              או התחבר עם :
            </Typography>
            <Box sx={{ mt: 1, textAlign: 'center' }}>
              <GoogleLogin
                onSuccess={onGoogleLoginSuccess}
                onError={(error) => console.log('Google login error:', error)}
              />
            </Box>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

