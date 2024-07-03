import React, { ChangeEvent, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { uploadPhoto, uploadProduct } from '../services/uploadProductService';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import './UploadProduct.css';

const schema = z.object({
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
    pickupAddress: z.string().min(1, "כתובת איסוף חייבת להיות מוגדרת"),
    image: z.any().refine((file) => file instanceof File, "יש להעלות תמונה"),
});

type FormData = z.infer<typeof schema>;

const UploadProduct: React.FC = () => {
    const [imgPreview, setImgPreview] = useState<string | null>(null);
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, watch, setValue, trigger } = useForm<FormData>({ 
        resolver: zodResolver(schema),
        mode: "onSubmit"
    });
    const fileInputRef = useRef<HTMLInputElement>(null);

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
        // ... (keep the onSubmit logic as it was)
    };

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
        return (
            <div className="upload-product-container">
                <div className="upload-product-card">
                    <div className="upload-product-body">
                        <p className="error-message">שגיאה: עליך לבצע התחברות על מנת לתרום</p>
                        <button onClick={() => navigate('/login')} className="submit-button">התחבר</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="upload-product-container">
            <div className="upload-product-card">
                <div className="upload-product-header">
                    <h2>ואהבתם ביחד - תרומת מוצר</h2>
                    <p>הוספת מוצר חדש</p>
                </div>
                <div className="upload-product-body">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group">
                            <input {...register("itemName")} type="text" placeholder="שם הפריט" className={errors.itemName ? 'error' : ''} />
                            {errors.itemName && <span className="error-message">{errors.itemName.message}</span>}
                        </div>
                        <div className="form-group">
                            <input {...register("quantity", { valueAsNumber: true })} type="number" placeholder="כמות" className={errors.quantity ? 'error' : ''} />
                            {errors.quantity && <span className="error-message">{errors.quantity.message}</span>}
                        </div>
                        <div className="form-group">
                            <select {...register("category")} className={errors.category ? 'error' : ''}>
                                <option value="">בחר קטגוריה</option>
                                <option value="מזון ושתייה">מזון ושתייה</option>
                                <option value="אביזרים">אביזרים</option>
                                <option value="אלקטרוניקה">אלקטרוניקה</option>
                                <option value="ביגוד">ביגוד</option>
                                <option value="הנעלה">הנעלה</option>
                                <option value="אחר">אחר</option>
                            </select>
                            {errors.category && <span className="error-message">{errors.category.message}</span>}
                        </div>
                        {selectedCategory === "אחר" && (
                            <div className="form-group">
                                <input {...register("customCategory")} type="text" placeholder="הכנס קטגוריה מותאמת אישית" className={errors.customCategory ? 'error' : ''} />
                                {errors.customCategory && <span className="error-message">{errors.customCategory.message}</span>}
                            </div>
                        )}
                        {selectedCategory === "מזון ושתייה" && (
                            <div className="form-group">
                                <input 
                                    {...register("expirationDate", { required: selectedCategory === "מזון ושתייה" ? "יש להזין תאריך תפוגה" : false })} 
                                    type="date" 
                                    id="expirationDate"
                                    className={errors.expirationDate ? 'error' : ''}
                                    min={new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0]}
                                />
                                {errors.expirationDate && <span className="error-message">{errors.expirationDate.message}</span>}
                            </div>
                        )}
                        <div className="form-group">
                            <input {...register("condition")} type="text" placeholder="מצב הפריט" className={errors.condition ? 'error' : ''} />
                            {errors.condition && <span className="error-message">{errors.condition.message}</span>}
                        </div>
                        <div className="form-group">
                            <input {...register("description")} type="text" placeholder="תיאור" className={errors.description ? 'error' : ''} />
                            {errors.description && <span className="error-message">{errors.description.message}</span>}
                        </div>
                        <div className="form-group">
                            <input {...register("pickupAddress")} type="text" placeholder="כתובת איסוף" className={errors.pickupAddress ? 'error' : ''} />
                            {errors.pickupAddress && <span className="error-message">{errors.pickupAddress.message}</span>}
                        </div>
                        <div className="profile-image-container">
                            {imgPreview && (
                                <img
                                    src={imgPreview}
                                    alt="Product Preview"
                                    className="profile-image"
                                />
                            )}
                            <button type="button" className="image-upload-button" onClick={selectImg}>
                                <FontAwesomeIcon icon={faImage} />
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
                        {errors.image && <span className="error-message">{errors.image.message}</span>}
                        <button type="submit" className="submit-button">
                            שלח
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UploadProduct;