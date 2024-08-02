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
    const [passwordVisible, setPasswordVisible] = useState(false);

    const login = async () => {
        console.log("password:",passwordInputRef.current?.value)
        if (emailInputRef.current?.value && passwordInputRef.current?.value) {
            try {
                const res = await postLogIn(emailInputRef.current?.value, passwordInputRef.current?.value);
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

    const onGoogleLoginFailure = () => {
        console.log("Google login failed");
    };

    const handleButtonClick = () => {
        navigate('/registration');
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
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
                {/* <img src={logo} alt="Logo" className="logo" /> */}
                <h1 className="title">התחברות</h1>
            </div>
            

            <div className="login-form">
                <div className="form-group">
                    <label htmlFor="floatingInput" className="form-label">:אימייל</label>
                    <div className="form-input-group">
                        <input ref={emailInputRef} type="text" className="form-control form-input" id="floatingInput" placeholder="הקלד/י אימייל..." />
                        <img src={emailIcon} className="icon" alt="Email icon" />
                    </div>
                </div>

                {/* <div className="form-group">
                    <label htmlFor="floatingPassword" className="form-label">:סיסמה</label>
                    <div className="form-input-group">
                        <input ref={passwordInputRef} type="password" className="form-control form-input" id="floatingPassword" placeholder="הקלד/י סיסמה..." />
                        <img src={passwordIcon} className="icon" alt="Password icon" />
                    </div>
                    {loginError && <p style={{ color: 'red', fontSize: '14px', marginLeft: '150px' }}>{loginError}</p>}
                </div> */}


                <div className="form-group">
                    <label htmlFor="floatingPassword" className="form-label">:סיסמה</label>
                    <div className="form-input-group">
                        <input ref={passwordInputRef} type={passwordVisible ? 'text' : 'password'} className="form-control form-input" id="floatingPassword" placeholder="הקלד/י סיסמה..." />
                        <img src={passwordIcon} className="icon" alt="Password icon" />
                        <i
                        className={`bi ${passwordVisible ?'bi-eye' :'bi-eye-slash'} icon`}
                        onClick={togglePasswordVisibility}
                        style={{ cursor: 'pointer', position: 'absolute', right: '230px', top: '60%', transform: 'translateY(-50%)',fontSize: '1.5em' }}
                    ></i>
                    </div>
                    
                </div>
                {loginError && <p style={{ color: 'red', fontSize: '14px', marginLeft: '150px' }}>{loginError}</p>}



                <button type="button" className="btn-primary-login-button" onClick={login}>התחבר/י</button>

                <div>
                <button onClick={handleButtonClick} className="btn-secondary register-link">
                    עדיין לא יצרת משתמש? לחצ/י כאן
                </button>
                </div>
                <div className="google-login">
                    <GoogleLogin
                        onSuccess={onGoogleLoginSuccess}
                        onError={onGoogleLoginFailure}
                    />
                </div>

               
            </div>
        </div>
        </div>
    );
}

export default Login;
