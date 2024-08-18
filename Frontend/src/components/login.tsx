// import { postLogIn, googleSignin } from "../services/login-service";
// import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
// import { useNavigate } from 'react-router-dom';
// import { useRef, useState } from 'react';
// import emailIcon from './../assets/email.png';
// import passwordIcon from './../assets/password.png';
// //import logo from './../assets/logo.png'; 
// import './login.css';
// import dataService from "../services/data-service.ts";

// function Login() {
//     const navigate = useNavigate();
//     const [loginError, setLoginError] = useState<string | null>(null);
//     const emailInputRef = useRef<HTMLInputElement>(null);
//     const passwordInputRef = useRef<HTMLInputElement>(null);
//     const [passwordVisible, setPasswordVisible] = useState(false);

//     const login = async () => {
//         console.log("password:",passwordInputRef.current?.value)
//         if (emailInputRef.current?.value && passwordInputRef.current?.value) {
//             try {
//                 const res = await postLogIn(emailInputRef.current?.value, passwordInputRef.current?.value);
//                 if (res._id) {
//                     localStorage.setItem('userID', res._id);
//                     localStorage.setItem('accessToken', res.accessToken!);
//                     localStorage.setItem('refreshToken', res.refreshToken!);
//                     console.log("accessToken:",res.accessToken!)
//                     console.log("refreshToken:",res.refreshToken!)
//                     window.dispatchEvent(new Event('authChange'));

//                     const userId = localStorage.getItem('userID');
//                     if (userId) {
//                         const { data } = await dataService.getUser(userId).req;
//                         if (data.isAdmin) {
//                             navigate('/adminDashboard');
//                         } else {
//                             navigate('/mainPage');
//                         }
//                     }
//                 }
//             } catch (err) {
//                 setLoginError('שם משתמש או סיסמה לא נכונים');
//             }
//         } else {
//             setLoginError('אנא הכנס/י שם משתמש וסיסמה');
//         }
//     };

//     const onGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
//         try {
//             const res = await googleSignin(credentialResponse);
//             if (res._id) {
//                 localStorage.setItem('userID', res._id);
//                 localStorage.setItem('accessToken', res.accessToken!);
//                 localStorage.setItem('refreshToken', res.refreshToken!);
//                 console.log("accessToken:",res.accessToken!)
//                 console.log("refreshToken:",res.refreshToken!)
//                 window.dispatchEvent(new Event('authChange'));

//                 navigate('/mainPage');
//             }
//         } catch (e) {
//             console.log(e);
//         }
//     };

//     const onGoogleLoginFailure = () => {
//         console.log("Google login failed");
//     };

//     const handleButtonClick = () => {
//         navigate('/registration');
//     };

//     const togglePasswordVisibility = () => {
//         setPasswordVisible(!passwordVisible);
//     };

//     const accessToken = localStorage.getItem('accessToken');
//     if (accessToken) {
//         return (
//             <div className="already-logged-in">
//                 <p>שגיאה: הינך כבר מחובר/ת לאתר</p>
//                 <button onClick={() => navigate('/mainPage')} className="btn btn-primary">עברו לעמוד הראשי</button>
//             </div>
//         );
//     }

//     return (
//         <div className="main-content">
//         <div className="login-page">
//             <div className="login-header">
//                 {/* <img src={logo} alt="Logo" className="logo" /> */}
//                 <h1 className="title">התחברות לתורמים</h1>
//             </div>
            

//             <div className="login-form">
//             <div className="form-group">
//             <label htmlFor="floatingInput" className="form-label">:אימייל</label>
//             <div className="form-input-group">
//             <input
//                 ref={emailInputRef}
//                 type="text"
//                 className="form-control form-input"
//                 id="floatingInput"
//                 placeholder="הקלד/י אימייל..."
//                 style={{ borderRadius: '15px' }} /* Added border-radius for rounded corners */
//             />
//             <img src={emailIcon} className="icon" alt="Email icon" />
//             </div>
//         </div>



//                 <div className="form-group">
//                 <label htmlFor="floatingPassword" className="form-label">:סיסמה</label>
//                 <div className="form-input-group" style={{ position: 'relative' }}>
//                     <input
//                     ref={passwordInputRef}
//                     type={passwordVisible ? 'text' : 'password'}
//                     className="form-control form-input"
//                     id="floatingPassword"
//                     placeholder="הקלד/י סיסמה..."
//                     style={{ borderRadius: '15px' }} /* Added border-radius for rounded corners */
//                     />
//                     <img src={passwordIcon} className="icon" alt="Password icon" />
//                     <i
//                     className={`bi ${passwordVisible ? 'bi-eye' : 'bi-eye-slash'} icon`}
//                     onClick={togglePasswordVisibility}
//                     style={{ cursor: 'pointer', position: 'absolute', right: '250px', top: '40%', transform: 'translateY(-50%)', fontSize: '1.5em' }}
//                     ></i>
//                 </div>
//                 </div>


//                 {loginError && <p style={{ color: 'red', fontSize: '14px', marginLeft: '150px' }}>{loginError}</p>}



//                 <button type="button" className="btn-primary-login-button" onClick={login}>התחבר/י</button>

//                 <div>
//                 <button onClick={handleButtonClick} className="btn-secondary register-link">
//                     עדיין לא יצרת משתמש? לחצ/י כאן
//                 </button>
//                 </div>
//                 <div className="separator">
//                     <hr />
//                     <p>או</p>
//                     <hr />
//                 </div>
//                 <div className="google-login">
//                     <GoogleLogin
//                         onSuccess={onGoogleLoginSuccess}
//                         onError={onGoogleLoginFailure}
//                     />
//                 </div>

               
//             </div>
//         </div>
//         </div>
//     );
// }

// export default Login;


import * as React from 'react';
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

import { postLogIn, googleSignin } from "../services/login-service";
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import {  useState } from 'react';

//import logo from './../assets/logo.png'; 
import './login.css';
import dataService from "../services/data-service.ts";



// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {/* {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'} */}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();


export default function SignIn() {
const [loginError, setLoginError] = useState<string | null>(null);
const navigate = useNavigate();
  const  handleSubmit =  async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email: string = data.get('email') as string;
    const password: string = data.get('password') as string;
    console.log("email:",email)
    console.log("password,",password)
     if (email && password) {
            try {
                const res = await postLogIn(email,password);
                if (res._id) {
                    localStorage.setItem('userID', res._id);
                    localStorage.setItem('accessToken', res.accessToken!);
                    localStorage.setItem('refreshToken', res.refreshToken!);
                    console.log("accessToken:",res.accessToken!)
                    console.log("refreshToken:",res.refreshToken!)
                    window.dispatchEvent(new Event('authChange'));

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
            } catch (err) {
                setLoginError('שם משתמש או סיסמה לא נכונים');
            }
        } else {
            setLoginError('אנא הכנס/י שם משתמש וסיסמה');
        }    
  };

    const onGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
        try {
            const res = await googleSignin(credentialResponse);
            if (res._id) {
                localStorage.setItem('userID', res._id);
                localStorage.setItem('accessToken', res.accessToken!);
                localStorage.setItem('refreshToken', res.refreshToken!);
                console.log("accessToken:",res.accessToken!)
                console.log("refreshToken:",res.refreshToken!)
                window.dispatchEvent(new Event('authChange'));

                navigate('/mainPage');
            }
        } catch (e) {
            console.log(e);
        }

    
    };
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
        return (
            <div className="already-logged-in">
                <p>שגיאה: הינך כבר מחובר/ת לאתר</p>
                <button onClick={() => navigate('/mainPage')} className="btn btn-primary">עברו לעמוד הראשי</button>
            </div>
        );
    }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 15,
            marginBottom:55,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            התחברות
          </Typography>
          <Box component="form" style={{direction:"rtl"}} onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
  margin="normal"
  required
  fullWidth
  id="email"
  label="אימייל"
  name="email"
  autoComplete="email"
  autoFocus
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
  label="סיסמא"
  type="password"
  id="password"
  autoComplete="current-password"
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
            
             {loginError && <p style={{ color: 'red', fontSize: '14px', marginLeft: '150px' }}>{loginError}</p>}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              התחבר/י
            </Button>
            <div className="separator">
                     <hr />
                     <p>או</p>
                     <hr />
                 </div>
            <div className="google-login">
                     <GoogleLogin
                       onSuccess={onGoogleLoginSuccess}
                     />
            </div>
            <Grid container>
      
            <Grid item>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: 130 }}>
            <Link
              href="#"
              variant="body2"
              onClick={(e) => {
                e.preventDefault();
                navigate('/registration');
              }}
            >
        {"אין לך משתמש? הירשמ/י כאן"}
      </Link>
      </div>
    </Grid>
              
            </Grid>
            <Grid item xs>
            <div style={{ display: 'flex', justifyContent: 'right', alignItems: 'center', marginRight: 130 , marginTop:"20px"}}>
      <Link
        href="#"
        variant="body2"
        onClick={(e) => {
          e.preventDefault();
          navigate('/forgotPassword'); 
        }}
      >
        שכחת את הסיסמא?
      </Link>
    </div>
  </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}