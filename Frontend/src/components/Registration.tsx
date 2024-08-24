
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
//import { faImage } from '@fortawesome/free-solid-svg-icons';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useNavigate } from 'react-router-dom';
import { uploadPhoto } from '../services/uploadProductService';
import { registerUser, googleSignIn } from '../services/registrationService';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import './Registration.css';


// eslint-disable-next-line react-refresh/only-export-components
export let userID: string;

const schema = z.object({
  firstName: z.string().min(2, "שם פרטי חייב להכיל לפחות 2 תווים"),
  lastName: z.string().min(2, "שם משפחה חייב להכיל לפחות 2 תווים"),
  //email: z.string().email("כתובת דואר אלקטרוני לא חוקית"),
  email: z.string()
  .refine((email) => email.includes("@"), "'@' כתובת דואר אלקטרוני חייבת להכיל את התו"),
  password: z.string().min(8, "הסיסמה חייבת להכיל לפחות 8 תווים"),
  //phoneNumber: z.string().length(10, "מספר הטלפון חייב להכיל 10 ספרות"),
  phoneNumber: z.string()
  .length(10, "מספר הטלפון חייב להכיל 10 ספרות")
  .refine((phone) => phone.startsWith("0"), "'מספר הטלפון חייב להתחיל ב-'0"),
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
      setRegisterError("כתובת דואר אלקטרוני כבר קיימת במערכת");
      if (errorMessage) {
        setRegisterError("כתובת דואר אלקטרוני כבר קיימת במערכת");
        // if (errorMessage.includes("email already exists")) {
        //   setRegisterError("כתובת דואר אלקטרוני כבר קיימת במערכת");
        //   console.log("email already exists");
        // } else if (errorMessage.includes("missing email or password")) {
        //   setRegisterError("כתובת דואר אלקטרוני או סיסמה חסרים");
        // }
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
            marginTop: 10,
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
            <Grid item xs={12}> 
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="firstName"
                  label="שם פרטי"
                  autoComplete="given-name"
                  autoFocus
                  {...register('firstName')}
                  error={!!errors.firstName}
                  helperText={errors.firstName ? errors.firstName.message : ""}
                  FormHelperTextProps={{
                    sx: {
                      marginLeft: '210px', 
                      width: '100%',
                    },
                  }}
                  InputLabelProps={{
                    sx: {
                      right: 19,
                      left: 'auto',
                      transformOrigin: 'top right',
                      '&.MuiInputLabel-shrink': {
                        transform: 'translate(0, -10px) scale(0.75)',
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
              </Grid>
              <Grid item xs={12}>
              <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="שם משפחה"
                  autoComplete="family-name"
                  {...register('lastName')}
                  error={!!errors.lastName}
                  helperText={errors.lastName ? errors.lastName.message : ""}
                  FormHelperTextProps={{
                    sx: {
                      marginLeft: '200px', 
                      width: '100%',
                    },
                  }}
                  InputLabelProps={{
                    sx: {
                      right: 19,
                      left: 'auto',
                      transformOrigin: 'top right',
                      '&.MuiInputLabel-shrink': {
                        transform: 'translate(0, -10px) scale(0.75)',
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
                </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="אימייל"
                  autoComplete="email"
                  {...register('email')}
                  error={!!errors.email}
                  helperText={errors.email ? errors.email.message : ""}
                  FormHelperTextProps={{
                    sx: {
                      marginLeft: '150px', 
                      width: '100%',
                    },
                  }}
                  InputLabelProps={{
                    sx: {
                      right: 19,
                      left: 'auto',
                      transformOrigin: 'top right',
                      '&.MuiInputLabel-shrink': {
                        transform: 'translate(0, -10px) scale(0.75)',
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
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="סיסמא"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  {...register('password')}
                  error={!!errors.password}
                  helperText={errors.password ? errors.password.message : ""}
                  FormHelperTextProps={{
                    sx: {
                      marginLeft: '210px',
                      width: '100%', 
                    },
                  }}
                  InputLabelProps={{
                    sx: {
                      right: 19,
                      left: 'auto',
                      transformOrigin: 'top right',
                      '&.MuiInputLabel-shrink': {
                        transform: 'translate(0, -10px) scale(0.75)',
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
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="מספר טלפון"
                  id="phoneNumber"
                  autoComplete="phone-number"
                  {...register('phoneNumber')}
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber ? errors.phoneNumber.message : ""}
                  FormHelperTextProps={{
                    sx: {
                      marginLeft: '210px', 
                      width: '100%',
                    },
                  }}
                  InputLabelProps={{
                    sx: {
                      right: 19,
                      left: 'auto',
                      transformOrigin: 'top right',
                      '&.MuiInputLabel-shrink': {
                        transform: 'translate(0, -10px) scale(0.75)',
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
              </Grid>
            <Grid item xs={12}>
            <TextField
            required
            fullWidth
            label="כתובת"
            id="mainAddress"
            autoComplete="address"
            {...register('mainAddress')}
            error={!!errors.mainAddress}
            helperText={errors.mainAddress ? errors.mainAddress.message : ""}
            FormHelperTextProps={{
              sx: {
                marginLeft: '180px', 
                width: '100%',
              },
            }}
            InputLabelProps={{
              sx: {
                right: 19,
                left: 'auto',
                transformOrigin: 'top right',
                '&.MuiInputLabel-shrink': {
                  transform: 'translate(0, -10px) scale(0.75)',
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
            </Grid>
             {imgSrc && <img src={URL.createObjectURL(imgSrc)} alt="Selected" style={{ width: '100%', marginTop: 8 ,direction:"ltr"}} />}
                {errors.image && typeof errors.image.message === 'string' && (
                  <Typography color="error" variant="body2">
                    {errors.image.message}
                  </Typography>
                )}
              <Grid item xs={12}>
                <input type="file" ref={fileInputRef} onChange={imgSelected} style={{ display: 'none' }} />
                <Button
                  variant="contained"
                  fullWidth
                  onClick={selectImg}
                  sx={{ mt: 1, mb: 2 }}
                >
                  <FontAwesomeIcon icon={['fas', 'image']}  style={{direction:"rtl"}}/> בחר תמונה
                </Button>
               
              </Grid>
            </Grid>
            {registerError && (
              <Typography color="error" variant="body2" sx={{ mt: 1, marginLeft: "170px" }}>
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

            <div className="separator">
              <hr />
              <p>או</p>
              <hr />
            </div>
            <Grid container justifyContent="flex-end" style={{direction:"rtl"}}>
              <Grid item style={{direction:"rtl", marginLeft: "120px"}}>
                <Link href="/login" variant="body2" style={{ direction: "rtl"}}>
                  כבר יש לך חשבון? התחבר/י כאן
                </Link>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ mt: 3 }}>
         
            <Box sx={{ mt: 1, textAlign: 'center', mb: 4 }}>
              <GoogleLogin 
              width={"100%"}
                onSuccess={onGoogleLoginSuccess}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                // onError={(error: any) => console.log('Google login error:', error)}
              />
            </Box>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
