
import { postLogIn,googleSignin } from "../services/login-service"
import { CredentialResponse, GoogleLogin } from '@react-oauth/google'
//import { useNavigate } from 'react-router-dom'
import {  useRef, useState } from 'react'


function Login() {
const [loginError, setLoginError] = useState<string | null>(null);
const emailInputRef = useRef<HTMLInputElement>(null)
const passwordInputRef = useRef<HTMLInputElement>(null)

const login= () => {
  
  //const navigate = useNavigate();
 
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
    //navigate('/registration');
};


return (
    <>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '5vh' }}>
            <div>
                <h1 className="text-center fw-bold" style={{ color: 'brown' }}>התחברות</h1>
            </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '95vh', width: '100vw' }}>
            <div style={{ width: '300px', textAlign: 'center' }}>

            <div className="form-floating">
                <input ref={emailInputRef} type="text" className="form-control" id="floatingInput" placeholder="הקלד/י  אימייל..." />
                <label htmlFor="floatingInput">אימייל</label>
            </div>
            <div className="form-floating">
                <input ref={passwordInputRef} type="password" className="form-control" id="floatingPassword" placeholder="הקלד/י סיסמה..." />
                <label htmlFor="floatingPassword">סיסמה</label>
            </div>
            <button type="button" className="btn btn-primary" onClick={login}>התחבר/י</button>


                {loginError && <p style={{ color: 'red' }}>{loginError}</p>}

                <GoogleLogin onSuccess={onGoogleLoginSuccess} onError={onGoogleLoginFailure} />
                <button onClick={handleButtonClick} className="btn btn-primary">
                עדיין לא יצרת משתמש? לחצ/י כאן
                </button>
            </div>
        </div>
    </>
)
  
    
}

export default Login;
