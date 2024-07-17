import React, { ChangeEvent, useRef, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { uploadPhoto, uploadProduct } from '../services/uploadProductService';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import './UploadProduct.css';

// Define the schema without the pickupAddress validation
const baseSchema = z.object({
    itemName: z.string().min(2, "שם הפריט חייב להכיל לפחות 2 תווים"),
    quantity: z.number().gt(0, "כמות הפריט חייבת להיות יותר מ-0"),
    category: z.string().min(1, "יש לבחור קטגוריה"),
    customCategory: z.string().min(2, "קטגוריה מותאמת אישית חייבת להכיל לפחות 2 תווים").optional(),
    condition: z.string().min(2, "מצב הפריט חייב להכיל לפחות 2 תווים"),
    expirationDate: z.string().refine((date) => {
        if (!date) return true; // Allow empty if not required
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const oneWeekFromNow = new Date(today);
        oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
        return selectedDate >= oneWeekFromNow;
    }, {
        message: "תאריך התפוגה חייב להיות לפחות שבוע מהיום",
    }).optional(),
    description: z.string().min(1, "תיאור חייב להיות מוגדר"),
    image: z.any().refine((file) => file instanceof File, "יש להעלות תמונה"),
    deliveryOption: z.string().min(1, "יש לבחור אפשרות משלוח"),
});

type FormData = z.infer<typeof baseSchema> & {
    pickupAddress?: string; // Add pickupAddress as optional here
};

const UploadProduct: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [imgPreview, setImgPreview] = useState<string | null>(null);
    const [status, setStatus] = useState('');
    const [showPickupAddress, setShowPickupAddress] = useState(false);
    const [selectedDeliveryOption, setSelectedDeliveryOption] = useState('');
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, watch, setValue, trigger, getValues } = useForm<FormData>({ 
        resolver: zodResolver(baseSchema),
        mode: "onSubmit"
    });
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const checkLoginStatus = () => {
            const accessToken = localStorage.getItem('accessToken');
            setIsLoggedIn(!!accessToken);
        };

        checkLoginStatus();
        window.addEventListener('storage', checkLoginStatus);

        return () => {
            window.removeEventListener('storage', checkLoginStatus);
        };
    }, []);

    const selectedCategory = watch("category");

    const imgSelected = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setValue("image", file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImgPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const selectImg = () => {
        fileInputRef.current?.click();
    };

    const onSubmit = async (data: FormData) => {
        if (selectedCategory === "מזון ושתייה" && !data.expirationDate) {
            trigger("expirationDate");
            return;
        }

        // Re-validate the form with pickupAddress required based on the selected delivery option
        const validationSchema = baseSchema.extend({
            pickupAddress: selectedDeliveryOption === 'ממתין לאיסוף מבית התורם' ? z.string().min(1, "כתובת איסוף חייבת להיות מוגדרת") : z.string().optional()
        });

        const validation = validationSchema.safeParse(data);
        if (!validation.success) {
            alert("Validation failed: " + JSON.stringify(validation.error.format()));
            return;
        }

        try {
            let imageUrl = '';
            if (data.image) {
                imageUrl = await uploadPhoto(data.image);
            }
            const userId = localStorage.getItem('userID');
            if (!userId) {
                alert('User not logged in');
                return;
            }
            const productData = { 
                ...data, 
                image: imageUrl, 
                donor: userId,
                approvedByAdmin: false,
                status,
                category: data.category === 'אחר' ? data.customCategory : data.category
            };
            await uploadProduct(productData);
            navigate('/profile');
        } catch (error) {
            console.error('Error uploading product:', error);
            alert(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
        }
    };

    const handleDeliveryOptionChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setSelectedDeliveryOption(value);
        if (value === 'ממתין לאיסוף מבית התורם') {
            setShowPickupAddress(true);
            setStatus('ממתין לאיסוף מבית התורם');
        } else {
            setShowPickupAddress(false);
            setStatus('טרם הגיע לעמותה');
            setValue("pickupAddress", ""); // Clear the pickup address
        }
    };

    if (!isLoggedIn) {
        return (
            <div className="error-container">
                <div className="error-title">תרומת מוצר - עמותת ואהבתם ביחד</div>
                <div className="error-message">
                    על מנת להעלות פריט לתרומה, יש לבצע הרשמה לאתר
                </div>
                <button className="login-button" onClick={() => navigate('/login')}>
                    Login
                </button>
            </div>
        );
    }

    return (
        <div className="upload-product-body">
            <h2 className="upload-product-title">ואהבתם ביחד - תרומת מוצר</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <input {...register("itemName")} type="text" placeholder="שם הפריט" className={`form-control ${errors.itemName ? 'is-invalid' : ''}`} />
                </div>
                {errors.itemName && <div className="invalid-feedback">{errors.itemName.message}</div>}
                
                <div className="form-group">
                    <input {...register("quantity", { valueAsNumber: true })} type="number" placeholder="כמות" className={`form-control ${errors.quantity ? 'is-invalid' : ''}`} />
                </div>
                {errors.quantity && <div className="invalid-feedback">{errors.quantity.message}</div>}
                
                <div className="form-group">
                    <select {...register("category")} className={`form-control ${errors.category ? 'is-invalid' : ''}`}>
                        <option value="">בחר קטגוריה</option>
                        <option value="מזון ושתייה">מזון ושתייה</option>
                        <option value="אביזרים">אביזרים</option>
                        <option value="אלקטרוניקה">אלקטרוניקה</option>
                        <option value="ביגוד">ביגוד</option>
                        <option value="הנעלה">הנעלה</option>
                        <option value="אחר">אחר</option>
                    </select>
                </div>
                {errors.category && <div className="invalid-feedback">{errors.category.message}</div>}
                
                {selectedCategory === "אחר" && (
                    <div className="form-group">
                        <input {...register("customCategory")} type="text" placeholder="הכנס קטגוריה מותאמת אישית" className={`form-control ${errors.customCategory ? 'is-invalid' : ''}`} />
                    </div>
                )}
                {errors.customCategory && <div className="invalid-feedback">{errors.customCategory.message}</div>}
                
                {selectedCategory === "מזון ושתייה" && (
                    <div className="form-group">
                        <input 
                            {...register("expirationDate")} 
                            type="date" 
                            className={`form-control ${errors.expirationDate ? 'is-invalid' : ''}`}
                            min={new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0]}
                        />
                    </div>
                )}
                {errors.expirationDate && <div className="invalid-feedback">{errors.expirationDate.message}</div>}
                
                <div className="form-group">
                    <input {...register("condition")} type="text" placeholder="מצב הפריט" className={`form-control ${errors.condition ? 'is-invalid' : ''}`} />
                </div>
                {errors.condition && <div className="invalid-feedback">{errors.condition.message}</div>}
                
                <div className="form-group">
                    <textarea {...register("description")} placeholder="תיאור" className={`form-control ${errors.description ? 'is-invalid' : ''}`} />
                </div>
                {errors.description && <div className="invalid-feedback">{errors.description.message}</div>}
                
                <div className="form-group">
                    <div className="form-check">
                        <input
                            {...register("deliveryOption")}
                            className="form-check-input"
                            type="radio"
                            id="deliveryOption1"
                            value="טרם הגיע לעמותה"
                            onChange={handleDeliveryOptionChange}
                        />
                        <label className="form-check-label" htmlFor="deliveryOption1">
                            אביא את התרומה בעצמי למרכז האיסוף
                        </label>
                    </div>
                    <div className="form-check">
                        <input
                            {...register("deliveryOption")}
                            className="form-check-input"
                            type="radio"
                            id="deliveryOption2"
                            value="ממתין לאיסוף מבית התורם"
                            onChange={handleDeliveryOptionChange}
                        />
                        <label className="form-check-label" htmlFor="deliveryOption2">
                            מבקש שיאספו ממני את הפריט
                        </label>
                    </div>
                </div>
                
                {showPickupAddress && (
                    <div className="form-group">
                        <input
                            {...register("pickupAddress")}
                            type="text"
                            placeholder="כתובת איסוף"
                            className={`form-control ${errors.pickupAddress ? 'is-invalid' : ''}`}
                        />
                    </div>
                )}
                {errors.pickupAddress && <div className="invalid-feedback">{errors.pickupAddress.message}</div>}
                
                <div className="profile-image-container">
                    {imgPreview && (
                        <img
                            src={imgPreview}
                            alt="Product Preview"
                            className="profile-image"
                        />
                    )}
                    <button type="button" className="image-upload-button" onClick={selectImg}>
                        <FontAwesomeIcon icon={faImage} /> העלאת תמונה
                    </button>
                    <input
                        {...register("image")}
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={imgSelected}
                        accept="image/*"
                    />
                </div>
                {errors.image && <div className="invalid-feedback">{errors.image.message}</div>}
                
                <button type="submit" className="submit-button">
                    שלח
                </button>
            </form>
        </div>
    );
};

export default UploadProduct;
