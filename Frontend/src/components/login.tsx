import { postLogIn, googleSignin } from "../services/login-service";
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import emailIcon from './../assets/email.png';
import passwordIcon from './../assets/password.png';
import logo from './../assets/logo.png'; 
import './login.css';
import dataService from "../services/data-service.ts";

function Login() {
    const navigate = useNavigate();
    const [loginError, setLoginError] = useState<string | null>(null);
    const emailInputRef = useRef<HTMLInputElement>(null);
    const passwordInputRef = useRef<HTMLInputElement>(null);

    const login = async () => {
        if (emailInputRef.current?.value && passwordInputRef.current?.value) {
            try {
                console.log("email: " + emailInputRef.current?.value);
                console.log("password: " + passwordInputRef.current?.value);
                const res = await postLogIn(emailInputRef.current?.value, passwordInputRef.current?.value);
                if (res._id) {
                    console.log("res: " + res._id);
                    localStorage.setItem('userID', res._id);
                    localStorage.setItem('accessToken', res.accessToken!);
                    localStorage.setItem('refreshToken', res.refreshToken!);
                    window.dispatchEvent(new Event('localStorageChanged'));

                    const userId = localStorage.getItem('userID');
                    if (userId) {
                    dataService.getUser(userId).req.then((res) => {
                    if(res.data.isAdmin){
                        navigate('/adminDashboard');
                    }
                    })}
                    else {
                    navigate('/mainPage');
                    }
                }
            } catch (err) {
                console.log("err: " + err);
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
                navigate('/mainPage');
            }
        } catch (e) {
            console.log(e);
        }
    };

    const onGoogleLoginFailure = () => {
        console.log("Google login failed");
    };

    const handleButtonClick = () => {
        navigate('/registration');
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
        <div className="main-content">
        <div className="login-page">
            <div className="login-header">
                <img src={logo} alt="Logo" className="logo" />
                <h1 className="title">ואהבתם ביחד</h1>
            </div>

            <div className="login-form">
                <div className="form-group">
                    <label htmlFor="floatingInput" className="form-label">:אימייל</label>
                    <div className="form-input-group">
                        <input ref={emailInputRef} type="text" className="form-control form-input" id="floatingInput" placeholder="הקלד/י אימייל..." />
                        <img src={emailIcon} className="icon" alt="Email icon" />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="floatingPassword" className="form-label">:סיסמה</label>
                    <div className="form-input-group">
                        <input ref={passwordInputRef} type="password" className="form-control form-input" id="floatingPassword" placeholder="הקלד/י סיסמה..." />
                        <img src={passwordIcon} className="icon" alt="Password icon" />
                    </div>
                </div>

                <button type="button" className="btn btn-primary login-button" onClick={login}>התחבר/י</button>

                <button onClick={handleButtonClick} className="btn btn-secondary register-link">
                    עדיין לא יצרת משתמש? לחצ/י כאן
                </button>

                <div className="google-login">
                    <GoogleLogin
                        onSuccess={onGoogleLoginSuccess}
                        onError={onGoogleLoginFailure}
                    />
                </div>

                {loginError && <p className="error-message">{loginError}</p>}
            </div>
        </div>
        </div>
    );
}

export default Login;