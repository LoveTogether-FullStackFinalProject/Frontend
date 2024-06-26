import { ChangeEvent, useEffect, useRef, useState } from 'react';
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
    mainAddress: z.string().min(5, "כתובת ראשית חייבת להכיל לפחות 5 תווים")
});

type FormData = z.infer<typeof schema>;

const Registration = () => {
    const navigate = useNavigate();
    const [registerError, setRegisterError] = useState<string | null>(null);
    const [imgSrc, setImgSrc] = useState<File | null>(null);
    const { register, handleSubmit, formState: { errors }, setValue, trigger } = useForm<FormData>({ resolver: zodResolver(schema) });
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (imgSrc) {
            setValue("image", URL.createObjectURL(imgSrc));
        }
    }, [imgSrc, setValue]);

    const imgSelected = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImgSrc(e.target.files[0]);
            setValue("image", URL.createObjectURL(e.target.files[0]));
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
                <div className="registration-card">
                    <div className="registration-body">
                        <p className="error-message">שגיאה: כבר מחוברים למערכת.</p>
                        <button className="submit-button" onClick={() => navigate('/feed')}>חזור לדף הבית</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="registration-container">
            <div className="registration-card">
                <div className="registration-header">
                    <h2>ברוכים הבאים!</h2>
                    <p>♥ואהבתם ביחד♥</p>
                </div>
                <div className="registration-body">
                    <h3>הרשמה</h3>
                    <div className="profile-image-container">
                        {imgSrc && (
                            <img
                                src={URL.createObjectURL(imgSrc)}
                                alt="Profile"
                                className="profile-image"
                            />
                        )}
                        <button className="image-upload-button" onClick={selectImg}>
                            <FontAwesomeIcon icon={faImage} />
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={imgSelected}
                            accept="image/*"
                        />
                    </div>
                    <form onSubmit={handleSubmit(registerUserHandler)}>
                        <div className="form-group">
                            <input
                                {...register("firstName")}
                                type="text"
                                placeholder="שם פרטי"
                                className={errors.firstName ? 'error' : ''}
                            />
                            {errors.firstName && <span className="error-message">{errors.firstName.message}</span>}
                        </div>
                        <div className="form-group">
                            <input
                                {...register("lastName")}
                                type="text"
                                placeholder="שם משפחה"
                                className={errors.lastName ? 'error' : ''}
                            />
                            {errors.lastName && <span className="error-message">{errors.lastName.message}</span>}
                        </div>
                        <div className="form-group">
                            <input
                                {...register("email")}
                                type="email"
                                placeholder="כתובת דואר אלקטרוני"
                                className={errors.email ? 'error' : ''}
                            />
                            {errors.email && <span className="error-message">{errors.email.message}</span>}
                        </div>
                        <div className="form-group">
                            <input
                                {...register("password")}
                                type="password"
                                placeholder="סיסמה"
                                className={errors.password ? 'error' : ''}
                            />
                            {errors.password && <span className="error-message">{errors.password.message}</span>}
                        </div>
                        <div className="form-group">
                            <input
                                {...register("phoneNumber")}
                                type="tel"
                                placeholder="מספר טלפון"
                                className={errors.phoneNumber ? 'error' : ''}
                            />
                            {errors.phoneNumber && <span className="error-message">{errors.phoneNumber.message}</span>}
                        </div>
                        <div className="form-group">
                            <input
                                {...register("mainAddress")}
                                type="text"
                                placeholder="כתובת ראשית"
                                className={errors.mainAddress ? 'error' : ''}
                            />
                            {errors.mainAddress && <span className="error-message">{errors.mainAddress.message}</span>}
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
            </div>
        </div>
    );
}

export default Registration;