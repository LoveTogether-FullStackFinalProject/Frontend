
import { postLogIn,googleSignin } from "../services/login-service"
import { CredentialResponse, GoogleLogin } from '@react-oauth/google'
import { useNavigate } from 'react-router-dom'
import {  useRef, useState } from 'react'
import emailIcon from './../assets/email.png';
import passwordIcon from './../assets/password.png';



function Login() {
    const navigate = useNavigate();
const [loginError, setLoginError] = useState<string | null>(null);
const emailInputRef = useRef<HTMLInputElement>(null)
const passwordInputRef = useRef<HTMLInputElement>(null)

const login= () => {
  
 
 
  if (emailInputRef.current?.value && passwordInputRef.current?.value) {
    try {
        postLogIn(emailInputRef.current?.value, passwordInputRef.current?.value);

    } catch (err) {
      console.log("err: " +err);
      setLoginError('שם משתמש או סיסמה לא נכונים');
      }
    }
    else {
        setLoginError('אנא הכנס/י שם משתמש וסיסמה');
        }
}

 const onGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    console.log(credentialResponse)
    try {
        const res = await googleSignin(credentialResponse)
        console.log(res)
    } catch (e) {
        console.log(e)
    }
 }


const onGoogleLoginFailure = () => {
    console.log("Google login failed")
}

const handleButtonClick = () => {
    navigate('/registration');
};


return (
    <>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '5vh' }}>
            <div>
            <h1 className="text-center fw-bold" style={{ color: 'brown', fontSize: '3rem', marginTop: '20px' , marginBottom: '60px'}}>התחברות</h1>
            </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '85vh', width: '100vw' }}>
    <div style={{ width: '300px', textAlign: 'center' }}>

    <div className="form-group" style={{ marginTop: '-50px', marginRight: '-10px', marginBottom: '20px' }}>
    <label htmlFor="floatingInput" style={{ fontWeight: 'bold', marginRight: '-200px' }}>:אימייל</label>
    <div style={{ display: 'flex', alignItems: 'center', marginLeft: '80px' }}>
        <input ref={emailInputRef} type="text" className="form-control" id="floatingInput"  placeholder="הקלד/י  אימייל..."style={{ direction: 'rtl', backgroundColor: '#F0F0F0'}} />
        <img src={emailIcon} style={{ marginLeft: '10px', width: '20px', height: '20px' }} />
    </div>
</div>

<div className="form-group" style={{ marginBottom: '20px', marginRight: '-10px' }}>
    <label htmlFor="floatingPassword" style={{ fontWeight: 'bold' , marginRight: '-200px' }}>:סיסמה</label>
    <div style={{ display: 'flex', alignItems: 'center', marginLeft: '80px' }}>
        <input ref={passwordInputRef} type="password" className="form-control" id="floatingPassword" placeholder="הקלד/י סיסמה..." style={{ direction: 'rtl', backgroundColor: '#F0F0F0'}}/>
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
</div>
    </>
)
  
    
}

export default Login;
