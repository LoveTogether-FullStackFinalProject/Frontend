import { postLogIn, googleSignin } from "../services/login-service";
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import emailIcon from './../assets/email.png';
import passwordIcon from './../assets/password.png';
import './login.css';

function Login() {
    const navigate = useNavigate();
    const [loginError, setLoginError] = useState<string | null>(null);
    const emailInputRef = useRef<HTMLInputElement>(null);
    const passwordInputRef = useRef<HTMLInputElement>(null);

    const login = async () => {
        if (emailInputRef.current?.value && passwordInputRef.current?.value) {
            try {
                const res = await postLogIn(emailInputRef.current?.value, passwordInputRef.current?.value);
                if (res._id) {
                    localStorage.setItem('userID', res._id);
                    localStorage.setItem('accessToken', res.accessToken!);
                    localStorage.setItem('refreshToken', res.refreshToken!);
                    window.dispatchEvent(new Event('localStorageChanged'));
                    navigate('/mainPage');
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
            <div style={{ backgroundColor: 'white', width: '100%', height: '50vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px', border: '1px solid black' }}>
            <p style={{ color: 'red' }}>שגיאה: הינך כבר מחובר/ת לאתר</p>
            <button onClick={() => navigate('/mainPage')} className="btn btn-primary" style={{ backgroundColor: 'red', marginTop: '20px' }}>עברו לעמוד הראשי</button>
          </div>
        );
      }

    return (
        <>
            {/* <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '5vh' }}>
                <div>
                    <h1 className="text-center fw-bold" style={{ color: 'brown', fontSize: '3rem', marginTop: '20px', marginBottom: '60px' }}>התחברות</h1>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '85vh', width: '50vw', border: '1px solid lightgray', padding: '20px', backgroundColor: '#f9f9f9' }}>
                <div style={{ width: '300px', textAlign: 'center' }}>

                    <div className="form-group" style={{ marginTop: '-50px', marginRight: '-10px', marginBottom: '20px' }}>
                        <label htmlFor="floatingInput" style={{ fontWeight: 'bold', marginRight: '-200px' }}>:אימייל</label>
                        <div style={{ display: 'flex', alignItems: 'center', marginLeft: '80px' }}>
                            <input ref={emailInputRef} type="text" className="form-control" id="floatingInput" placeholder="הקלד/י  אימייל..." style={{ direction: 'rtl', backgroundColor: '#F0F0F0' }} />
                            <img src={emailIcon} style={{ marginLeft: '10px', width: '20px', height: '20px' }} />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '20px', marginRight: '-10px' }}>
                        <label htmlFor="floatingPassword" style={{ fontWeight: 'bold', marginRight: '-200px' }}>:סיסמה</label>
                        <div style={{ display: 'flex', alignItems: 'center', marginLeft: '80px' }}>
                            <input ref={passwordInputRef} type="password" className="form-control" id="floatingPassword" placeholder="הקלד/י סיסמה..." style={{ direction: 'rtl', backgroundColor: '#F0F0F0' }} />
                            <img src={passwordIcon} style={{ marginLeft: '10px', width: '20px', height: '20px' }} />
                        </div>
                    </div>

                    <button onClick={handleButtonClick} className="btn btn-primary" style={{ marginBottom: '20px', color: 'blue', backgroundColor: 'white' }}>
                        עדיין לא יצרת משתמש? לחצ/י כאן
                    </button>

                    <div style={{ marginBottom: '20px', marginLeft: '60px' }}>
                        <GoogleLogin
                            onSuccess={onGoogleLoginSuccess}
                            onError={onGoogleLoginFailure}
                        />
                    </div>

                    <button type="button" className="btn btn-primary" style={{ marginBottom: '20px', color: 'white', backgroundColor: 'brown' }} onClick={login}>התחבר/י</button>

                    {loginError && <p style={{ color: 'red', marginBottom: '20px' }}>{loginError}</p>}
                </div>
            </div> */}

<div className="login-page">
<div className="login-container">
  <div>
    <h1 className="login-title">התחברות</h1>
  </div>
</div>

<div className="main-content">
  <div className="content-box">

    <div className="form-group">
      <label htmlFor="floatingInput" className="form-label">:אימייל</label>
      <div className="form-input-group">
        <input ref={emailInputRef} type="text" className="form-control form-input" id="floatingInput" placeholder="הקלד/י  אימייל..." />
        <img src={emailIcon} className="icon" />
      </div>
    </div>

    <div className="form-group password-group">
      <label htmlFor="floatingPassword" className="form-label">:סיסמה</label>
      <div className="form-input-group">
        <input ref={passwordInputRef} type="password" className="form-control form-input" id="floatingPassword" placeholder="הקלד/י סיסמה..." />
        <img src={passwordIcon} className="icon" />
      </div>
    </div>

    <button onClick={handleButtonClick} className="btn btn-primary primary-btn">
      עדיין לא יצרת משתמש? לחצ/י כאן
    </button>

    <div className="google-login">
      <GoogleLogin
        onSuccess={onGoogleLoginSuccess}
        onError={onGoogleLoginFailure}
      />
    </div>

    <button type="button" className="btn btn-primary secondary-btn" onClick={login}>התחבר/י</button>

    {loginError && <p className="error-message">{loginError}</p>}
  </div>
</div>
</div>


            
        </>
    );
}

export default Login;
