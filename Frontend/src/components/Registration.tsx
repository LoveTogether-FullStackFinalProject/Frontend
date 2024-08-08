import { ChangeEvent, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { uploadPhoto } from '../services/uploadProductService';
import { registerUser, googleSignIn } from '../services/registrationService';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { useNavigate } from 'react-router-dom';
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

const Registration = () => {
    const navigate = useNavigate();
    const [registerError, setRegisterError] = useState<string | null>(null);
    const [imgSrc, setImgSrc] = useState<File | null>(null);
    const { register, handleSubmit, formState: { errors }, setValue, trigger } = useForm<FormData>({ resolver: zodResolver(schema) });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const imgSelected = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImgSrc(e.target.files[0]);
            setValue("image", e.target.files[0]); // Set the file itself, not the URL
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

            navigate('/mainPage');
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
            navigate('/mainPage');
        } catch (e) {
            console.log(e);
        }
    };

    const onGoogleLoginFailure = () => {
        console.log("ההתחברות דרך חשבון Google נכשלה");
    };

    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
        return (
            <div className="registration-container">
                <div className="registration-body">
                    <p className="error-message">שגיאה: כבר מחוברים למערכת.</p>
                    <button className="submit-button" onClick={() => navigate('/mainPage')}>חזור לדף הבית</button>
                </div>
            </div>
        );
    }

    return (
        <div className="registration-container" style={{ background: 'linear-gradient(90deg, rgba(241, 241, 241, 0.753) 5%, rgba(249, 219, 120, 0.728) 62%, rgba(249, 219, 120, 0.695) 100%)' }}>
            <h3 className='registration-title'>הרשמה</h3>
            <form onSubmit={handleSubmit(registerUserHandler)} style={{ width: '100%' }}>
                <div className="form-group">
                    <input
                        {...register("firstName")}
                        type="text"
                        placeholder="שם פרטי"
                        className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                    />
                    {errors.firstName && <div className="invalid-feedback">{errors.firstName.message}</div>}
                </div>
                <div className="form-group">
                    <input
                        {...register("lastName")}
                        type="text"
                        placeholder="שם משפחה"
                        className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                    />
                    {errors.lastName && <div className="invalid-feedback">{errors.lastName.message}</div>}
                </div>
                <div className="form-group">
                    <input
                        {...register("email")}
                        type="email"
                        placeholder="כתובת דואר אלקטרוני"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                </div>
                <div className="form-group">
                    <input
                        {...register("password")}
                        type="password"
                        placeholder="סיסמה"
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    />
                    {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                </div>
                <div className="form-group">
                    <input
                        {...register("phoneNumber")}
                        type="tel"
                        placeholder="מספר טלפון"
                        className={`form-control ${errors.phoneNumber ? 'is-invalid' : ''}`}
                    />
                    {errors.phoneNumber && <div className="invalid-feedback">{errors.phoneNumber.message}</div>}
                </div>
                <div className="form-group">
                    <input
                        {...register("mainAddress")}
                        type="text"
                        placeholder="כתובת ראשית"
                        className={`form-control ${errors.mainAddress ? 'is-invalid' : ''}`}
                    />
                    {errors.mainAddress && <div className="invalid-feedback">{errors.mainAddress.message}</div>}
                </div>
                <div className="form-group">
                    <button type="button" onClick={selectImg} className="upload-image-button" style={{ backgroundColor: '#F9DA78' }}>
                        <FontAwesomeIcon icon={faImage} />
                        {imgSrc ? 'החלפת תמונה' : 'העלאת תמונה'}
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={imgSelected}
                        style={{ display: 'none' }}
                    />
                    {imgSrc && (
                        <div className="img-preview-container">
                            <img
                                src={URL.createObjectURL(imgSrc)}
                                alt="תמונה נבחרת"
                                className="img-preview"
                            />
                        </div>
                    )}
                    {errors.image && <div className="invalid-feedback">{errors.image.message}</div>}
                </div>
                <button type="submit" className="submit-button">
                    הרשמה
                </button>
            </form>
            {registerError && (
                <p className="error-message">{registerError}</p>
            )}
            <div className="google-login">
                <GoogleLogin
                    onSuccess={onGoogleLoginSuccess}
                    onError={onGoogleLoginFailure}
                />
            </div>
            <button
                className="login-link"
                onClick={() => navigate('/login')}
            >
                כבר רשום? התחבר כאן
            </button>
        </div>
    );
}

export default Registration;
