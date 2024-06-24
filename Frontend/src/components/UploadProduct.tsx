// import { ChangeEvent, useRef, useState } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faImage } from '@fortawesome/free-solid-svg-icons';
// import { uploadPhoto, uploadProduct } from '../services/uploadProductService';
import { useForm } from "react-hook-form";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { uploadProduct } from '../services/uploadProductService';
import './UploadProduct.css';


const schema = z.object({
    itemName: z.string().min(2, "שם הפריט חייב להכיל לפחות 2 תווים"),
    quantity: z.number().gt(0, "כמות הפריט חייבת להיות יותר מ-0"),
    category: z.string().min(1, "יש לבחור קטגוריה"),
    condition: z.string().min(2, "מצב הפריט חייב להכיל לפחות 2 תווים"),
    expirationDate: z.string().optional(),
    description: z.string().optional(),
    pickupAddress: z.string().optional()
});

type FormData = z.infer<typeof schema>;

const UploadProduct = () => {
    // const [imgSrc, setImgSrc] = useState<File>();
    // const [imgPreview, setImgPreview] = useState<string>();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });
    // const fileInputRef = useRef<HTMLInputElement>(null);

    // const imgSelected = (e: ChangeEvent<HTMLInputElement>) => {
    //     if (e.target.files && e.target.files.length > 0) {
    //         const file = e.target.files[0];
    //         console.log("Selected file:", file);
    //         setImgSrc(file);
    //         const reader = new FileReader();
    //         reader.onloadend = () => {
    //             setImgPreview(reader.result as string);
    //         };
    //         reader.readAsDataURL(file);
    //     }
    // };

    // const selectImg = () => {
    //     fileInputRef.current?.click();
    // };

    const onSubmit = async (data: FormData) => {
        try {
            // let imageUrl = '';
            // if (imgSrc) {
            //     imageUrl = await uploadPhoto(imgSrc);
            const userId = localStorage.getItem('userID');
            if (!userId) {
                alert('User not logged in');
                return;
            }
            // const productData = { ...data, image: imageUrl };

            const productData = { ...data, donor: userId };
            console.log('Uploading product data...', productData);

            await uploadProduct(productData);
            navigate('/profile');
            console.log('Product uploaded successfully');
        } catch (error) {
            console.error('Error uploading product:', error.message);
            alert(`Error: ${error.message}`);
        }
    };

    return (
        <div className="upload-product-container">
            <h1 className="text-center fw-bold">ואהבתם ביחד - עמוד תרומת מוצרים</h1>
            <h2 className="text-center fw-bold">הוספת מוצר</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="vstack gap-3 mx-auto form-container">
                <div className="form-floating mb-3">
                    <input {...register("itemName")} type="text" className="form-control" id="itemName" placeholder="שם הפריט" />
                    <label htmlFor="itemName">שם הפריט</label>
                    {errors.itemName && <p className="text-danger">{errors.itemName.message}</p>}
                </div>
                <div className="form-floating mb-3">
                    <input {...register("quantity", { valueAsNumber: true })} type="number" className="form-control" id="quantity" placeholder="כמות" />
                    <label htmlFor="quantity">כמות</label>
                    {errors.quantity && <p className="text-danger">{errors.quantity.message}</p>}
                </div>
                <div className="form-floating mb-3">
                    <input {...register("category")} type="text" className="form-control" id="category" placeholder="קטגוריה" />
                    <label htmlFor="category">קטגוריה</label>
                    {errors.category && <p className="text-danger">{errors.category.message}</p>}
                </div>
                <div className="form-floating mb-3">
                    <input {...register("condition")} type="text" className="form-control" id="condition" placeholder="מצב הפריט" />
                    <label htmlFor="condition">מצב הפריט</label>
                    {errors.condition && <p className="text-danger">{errors.condition.message}</p>}
                </div>
                <div className="form-floating mb-3">
                    <input {...register("expirationDate")} type="date" className="form-control" id="expirationDate" placeholder="תאריך תפוגה" />
                    <label htmlFor="expirationDate">תאריך תפוגה</label>
                </div>
                <div className="form-floating mb-3">
                    <input {...register("description")} type="text" className="form-control" id="description" placeholder="תיאור" />
                    <label htmlFor="description">תיאור</label>
                </div>
                <div className="form-floating mb-3">
                    <input {...register("pickupAddress")} type="text" className="form-control" id="pickupAddress" placeholder="כתובת איסוף" />
                    <label htmlFor="pickupAddress">כתובת איסוף</label>
                </div>
                {/* <div className="text-center">
                    <div className="position-relative d-inline-block">
                        <input ref={fileInputRef} className="file-input" type="file" accept="image/*" onChange={imgSelected} style={{ display: 'none' }} />
                        <button type="button" className="btn btn-outline-primary" onClick={selectImg}>
                            <FontAwesomeIcon icon={faImage} className="me-2" />
                            העלאת תמונה
                        </button>
                    </div>
                </div>
                {imgPreview && <div className="text-center">
                    <img src={imgPreview} alt="Selected" className="img-preview" />
                </div>} */}

                <div className="text-center">
                    <button type="submit" className="btn btn-primary">
                        שלח
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UploadProduct;
