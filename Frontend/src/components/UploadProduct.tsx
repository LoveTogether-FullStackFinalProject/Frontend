import React, { ChangeEvent, useRef, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { uploadPhoto, uploadProduct } from '../services/uploadProductService';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import './UploadProduct.css';

const schema = z.object({
    itemName: z.string().min(2, 'שם הפריט חייב להכיל לפחות 2 תווים'),
    quantity: z.number().min(1, 'כמות הפריט חייבת להיות יותר מ-0'),
    category: z.string().min(1, 'יש לבחור קטגוריה'),
    customCategory: z.string().min(2, 'קטגוריה מותאמת אישית חייבת להכיל לפחות 2 תווים').optional(),
    condition: z.string().min(2, 'מצב הפריט חייב להכיל לפחות 2 תווים'),
    expirationDate: z.string().refine((date) => {
        if (!date) return true; // Allow empty if not required
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const oneWeekFromNow = new Date(today);
        oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
        return selectedDate >= oneWeekFromNow;
    }, {
        message: 'תאריך התפוגה חייב להיות לפחות שבוע מהיום',
    }).optional(),
    description: z.string().min(1, 'תיאור חייב להיות מוגדר'),
    pickupAddress: z.string().min(1, 'כתובת איסוף חייבת להיות מוגדרת').default(''),
    image: z.any().refine((file) => file instanceof File, 'יש להעלות תמונה'),
});

type FormData = z.infer<typeof schema>;

const UploadProduct: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [imgPreview, setImgPreview] = useState<string | null>(null);
    const [selectedDeliveryOption, setSelectedDeliveryOption] = useState('');
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, watch, setValue, trigger } = useForm<FormData>({ 
        resolver: zodResolver(schema),
        mode: 'onSubmit'
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

    const selectedCategory = watch('category');

    const imgSelected = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setValue('image', file);
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
        if (selectedCategory === 'מזון ושתייה' && !data.expirationDate) {
            trigger('expirationDate');
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
                category: data.category === 'אחר' ? data.customCategory : data.category
            };
            await uploadProduct(productData);
            navigate('/profile');
        } catch (error) {
            console.error('Error uploading product:', error);
            alert(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
        }
    };

    const handleDeliveryOptionChange = (event) => {
        const { value } = event.target;
        setSelectedDeliveryOption(value);
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
        <div className="upload-product-container">
        <div className="upload-product-body">
            <h2 className="upload-product-title">מתי בפעם האחרונה עשיתם משהו בשביל מישהו? ♥</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <input {...register("itemName")} type="text" placeholder="שם הפריט" className={`form-control ${errors.itemName ? 'is-invalid' : ''}`} />
                    {errors.itemName && <div className="invalid-feedback">{errors.itemName.message}</div>}
                </div>
                
                <div className="form-group">
                    <input {...register("quantity", { valueAsNumber: true })} type="number" placeholder="כמות" className={`form-control ${errors.quantity ? 'is-invalid' : ''}`} />
                    {errors.quantity && <div className="invalid-feedback">{errors.quantity.message}</div>}
                </div>
                
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
                    {errors.category && <div className="invalid-feedback">{errors.category.message}</div>}
                </div>
                
                {selectedCategory === "אחר" && (
                    <div className="form-group">
                        <input {...register("customCategory")} type="text" placeholder="הכנס קטגוריה מותאמת אישית" className={`form-control ${errors.customCategory ? 'is-invalid' : ''}`} />
                        {errors.customCategory && <div className="invalid-feedback">{errors.customCategory.message}</div>}
                    </div>
                )}
                
                {selectedCategory === "מזון ושתייה" && (
                    <div className="form-group">
                        <input 
                            {...register("expirationDate")} 
                            type="date" 
                            className={`form-control ${errors.expirationDate ? 'is-invalid' : ''}`}
                            min={new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0]}
                        />
                        {errors.expirationDate && <div className="invalid-feedback">{errors.expirationDate.message}</div>}
                    </div>
                )}
                
                <div className="form-group">
                    <input {...register("condition")} type="text" placeholder="מצב הפריט" className={`form-control ${errors.condition ? 'is-invalid' : ''}`} />
                    {errors.condition && <div className="invalid-feedback">{errors.condition.message}</div>}
                </div>
                
                <div className="form-group">
                    <textarea {...register("description")} placeholder="תיאור" className={`form-control ${errors.description ? 'is-invalid' : ''}`} />
                    {errors.description && <div className="invalid-feedback">{errors.description.message}</div>}
                </div>
                
                <div className="form-group">
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="radio"
                            id="pickupRadio"
                            value="ממתין לאיסוף מבית התורם"
                            checked={selectedDeliveryOption === 'ממתין לאיסוף מבית התורם'}
                            onChange={handleDeliveryOptionChange}
                            {...register('pickupAddress', { required: selectedDeliveryOption === 'מבקש שיאספו ממני את הפריט' })}
                        />
                        <label className="form-check-label" htmlFor="pickupRadio">ממתין לאיסוף מבית התורם</label>
                    </div>
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="radio"
                            id="bringRadio"
                            value="אביא את התרומה בעצמי למרכז האיסוף"
                            checked={selectedDeliveryOption === 'אביא את התרומה בעצמי למרכז האיסוף'}
                            onChange={handleDeliveryOptionChange}
                        />
                        <label className="form-check-label" htmlFor="bringRadio">אביא את התרומה בעצמי למרכז האיסוף</label>
                    </div>
                    {selectedDeliveryOption === 'מבקש שיאספו ממני את הפריט' && (
                        <input
                            {...register('pickupAddress', { required: true })}
                            type="text"
                            placeholder="כתובת לאיסוף"
                            className={`form-control ${errors.pickupAddress ? 'is-invalid' : ''}`}
                        />
                    )}
                    {errors.pickupAddress && <div className="invalid-feedback">{errors.pickupAddress.message}</div>}
                </div>
                
                <div className="form-group">
                    <div className="profile-image-container">
                        <div className="profile-image">
                            {imgPreview ? (
                                <img src={imgPreview} alt="תמונה מצורפת" />
                            ) : (
                                <div className="no-image">ללא תמונה</div>
                            )}
                        </div>
                        <button
                            type="button"
                            className="image-upload-button"
                            onClick={selectImg}
                        >
                            <FontAwesomeIcon icon={faImage} style={{ marginRight: '5px' }} />
                            הוסף תמונה
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            onChange={imgSelected}
                            style={{ display: 'none' }}
                            accept="image/*"
                        />
                    </div>
                </div>
                
                <button type="submit" className="submit-button">שלח תרומה</button>
            </form>
        </div>
    </div>
    );
};

export default UploadProduct;
