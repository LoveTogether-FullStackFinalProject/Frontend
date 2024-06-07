import { ChangeEvent, useRef, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { uploadPhoto } from '../services/uploadProductService';
import { registerUser, googleSignIn } from '../services/registrationService';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

import { useNavigate } from 'react-router-dom';

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

            navigate('/feed');
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
            navigate('/feed');
        } catch (e) {
            console.log(e);
        }
    };

    const onGoogleLoginFailure = () => {
        console.log("ההתחברות דרך חשבון Google נכשלה");
    };

    const handleButtonClick = () => {
        navigate('/login');
    };

    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
        return (
            <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "100vh", backgroundColor: "#f8d7da" }}>
                <p className="mb-4 text-danger">שגיאה: כבר מחוברים למערכת.</p>
                <button onClick={() => navigate('/feed')} className="btn btn-primary">חזור לדף הבית</button>
            </div>
        );
    }

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh", backgroundColor: "#FFF8DC" }}>
            <div className="card shadow-lg p-4" style={{ maxWidth: "600px", width: "100%" }}>
                <div className="card-header text-center fw-bold" style={{ fontSize: "2.5rem", color: "burlywood" }}>ברוכים הבאים!</div>
                <div className="text-center fw-bold mb-4" style={{ fontSize: "1.5rem", color: "brown" }}>♥ואהבתם ביחד♥ </div>
                <h1 className="text-center fw-bold mb-4">הרשמה</h1>
                <div className="d-flex justify-content-center position-relative mb-3">
                    {imgSrc && <img src={URL.createObjectURL(imgSrc)} alt="Profile" className="img-thumbnail mb-2" style={{ maxWidth: '150px', borderRadius: '50%' }} />}
                    <button type="button" className="btn position-absolute bottom-0 end-0" onClick={selectImg}>
                        <FontAwesomeIcon icon={faImage} className="fa-2x" style={{ color: 'burlywood' }} />
                    </button>
                </div>
                <input style={{ display: "none" }} {...register("image")} type="file" onChange={imgSelected} ref={fileInputRef}></input>
                {errors.image && <p className="text-danger">{errors.image.message}</p>}
                <div className="card-body">
                    <form onSubmit={handleSubmit(registerUserHandler)}>
                        <div className="form-floating mb-3">
                            <input {...register("firstName")} type="text" className="form-control" id="floatingFirstName" placeholder="שם פרטי" />
                            <label htmlFor="floatingFirstName">שם פרטי</label>
                            {errors.firstName && <p className="text-danger">{errors.firstName.message}</p>}
                        </div>
                        <div className="form-floating mb-3">
                            <input {...register("lastName")} type="text" className="form-control" id="floatingLastName" placeholder="שם משפחה" />
                            <label htmlFor="floatingLastName">שם משפחה</label>
                            {errors.lastName && <p className="text-danger">{errors.lastName.message}</p>}
                        </div>
                        <div className="form-floating mb-3">
                            <input {...register("email")} type="text" className="form-control" id="floatingEmail" placeholder="כתובת דואר אלקטרוני" />
                            <label htmlFor="floatingEmail">כתובת דואר אלקטרוני</label>
                            {errors.email && <p className="text-danger">{errors.email.message}</p>}
                        </div>
                        <div className="form-floating mb-3">
                            <input {...register("password")} type="password" className="form-control" id="floatingPassword" placeholder="סיסמה" />
                            <label htmlFor="floatingPassword">סיסמה</label>
                            {errors.password && <p className="text-danger">{errors.password.message}</p>}
                        </div>
                        <div className="form-floating mb-3">
                            <input {...register("phoneNumber")} type="text" className="form-control" id="floatingPhoneNumber" placeholder="מספר טלפון" />
                            <label htmlFor="floatingPhoneNumber">מספר טלפון</label>
                            {errors.phoneNumber && <p className="text-danger">{errors.phoneNumber.message}</p>}
                        </div>
                        <div className="form-floating mb-3">
                            <input {...register("mainAddress")} type="text" className="form-control" id="floatingMainAddress" placeholder="כתובת ראשית" />
                            <label htmlFor="floatingMainAddress">כתובת ראשית</label>
                            {errors.mainAddress && <p className="text-danger">{errors.mainAddress.message}</p>}
                        </div>
                        <div className="d-flex justify-content-center">
                            <button type="submit" className="btn btn-success mt-3 w-100">הרשמה</button>
                        </div>
                    </form>
                </div>
                {registerError && <p className="text-danger text-center mt-3">{registerError}</p>}
                <div className="d-flex justify-content-center my-3">
                    <GoogleLogin onSuccess={onGoogleLoginSuccess} onError={onGoogleLoginFailure} />
                </div>
                <button onClick={handleButtonClick} className="btn btn-primary w-100">
                    כבר רשום? התחבר כאן
                </button>
            </div>
        </div>
    );
}

export default Registration;
