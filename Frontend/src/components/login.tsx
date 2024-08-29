import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { postLogIn, googleSignin } from "../services/login-service";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import dataService from "../services/data-service.ts";
import "./login.css";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {/* Copyright © Your Website {new Date().getFullYear()} */}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function SignIn() {
  const [loginError, setLoginError] = useState<string | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email: string = data.get("email") as string;
    const password: string = data.get("password") as string;

    if (email && password) {
      try {
        const res = await postLogIn(email, password);
        if (res._id) {
          localStorage.setItem("userID", res._id);
          localStorage.setItem("accessToken", res.accessToken!);
          localStorage.setItem("refreshToken", res.refreshToken!);

          const userId = localStorage.getItem("userID");
          if (userId) {
            const { data } = await dataService.getUser(userId).req;
            localStorage.setItem("userAddress", data.mainAddress); // Store the user's address

            if (data.isAdmin) {
              navigate("/adminDashboard");
            } else {
              navigate("/mainPage");
            }
          }

          window.dispatchEvent(new Event("authChange"));
        }
      } catch (err) {
        setLoginError("שם משתמש או סיסמה לא נכונים");
      }
    } else {
      setLoginError("אנא הכנס/י שם משתמש וסיסמה");
    }
  };

  const onGoogleLoginSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    try {
      const res = await googleSignin(credentialResponse);
      if (res._id) {
        localStorage.setItem("userID", res._id);
        localStorage.setItem("accessToken", res.accessToken!);
        localStorage.setItem("refreshToken", res.refreshToken!);
        window.dispatchEvent(new Event("authChange"));
        navigate("/mainPage");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    return (
      <div className="already-logged-in">
        <p>שגיאה: הינך כבר מחובר/ת לאתר</p>
        <button
          onClick={() => navigate("/mainPage")}
          className="btn btn-primary"
        >
          עברו לעמוד הראשי
        </button>
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
            marginBottom: 55,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            התחברות
          </Typography>
          <Box
            component="form"
            style={{ direction: "rtl" }}
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
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
                  left: "auto",
                  transformOrigin: "top right",
                  "&.MuiInputLabel-shrink": {
                    transform: "translate(0, -10px) scale(0.85)",
                    transformOrigin: "top right",
                  },
                  "& .MuiFormLabel-asterisk": {
                    display: "none",
                  },
                },
              }}
              InputProps={{
                sx: {
                  textAlign: "right",
                  direction: "rtl",
                  "& .MuiOutlinedInput-notchedOutline": {
                    textAlign: "right",
                  },
                },
              }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="סיסמא"
              type={passwordVisible ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              InputLabelProps={{
                sx: {
                  right: 19,
                  left: "auto",
                  transformOrigin: "top right",
                  "&.MuiInputLabel-shrink": {
                    transform: "translate(0, -10px) scale(0.85)",
                    transformOrigin: "top right",
                  },
                  "& .MuiFormLabel-asterisk": {
                    display: "none",
                  },
                },
              }}
              InputProps={{
                sx: {
                  textAlign: "right",
                  direction: "rtl",
                  "& .MuiOutlinedInput-notchedOutline": {
                    textAlign: "right",
                  },
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility} edge="end">
                      {passwordVisible ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {loginError && (
              <p
                style={{ color: "red", fontSize: "14px", marginLeft: "150px" }}
              >
                {loginError}
              </p>
            )}

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
              <GoogleLogin onSuccess={onGoogleLoginSuccess} />
            </div>

            <Grid container>
              <Grid item>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 110,
                  }}
                >
                  <Link
                    href="#"
                    variant="body2"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/uploadProduct");
                    }}
                  >
                    {"המשך כאורח"}
                  </Link>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 110,
                    marginTop: "15px",
                  }}
                >
                  <Link
                    href="#"
                    variant="body2"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/registration");
                    }}
                  >
                    {"אין לך משתמש? הירשמ/י כאן"}
                  </Link>
                </div>
              </Grid>

              {/* <Grid item xs>
                <div style={{ display: 'flex', justifyContent: 'right', alignItems: 'center', marginRight: 150, marginTop: "20px" }}>
                  <Link
                    href="#"
                    variant="body2"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/forgotPassword');
                    }}
                  >
                    שכחת את הסיסמה?
                  </Link>
                </div>
              </Grid> */}
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
