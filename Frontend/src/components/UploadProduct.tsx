import { ChangeEvent, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { uploadPhoto, uploadProduct } from '../services/uploadProductService';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import './UploadProduct.css';

const schema = z.object({
    itemName: z.string().min(2, "שם הפריט חייב להכיל לפחות 2 תווים"),
    quantity: z.number().min(1, "כמות הפריט חייבת להיות חיובית"),
    category: z.string().min(1, "יש לבחור קטגוריה"),
    condition: z.string().min(2, "מצב הפריט חייב להכיל לפחות 2 תווים"),
    expirationDate: z.string().optional()
});

type FormData = z.infer<typeof schema>;

const UploadProduct = () => {
    const [imgSrc, setImgSrc] = useState<File>();
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const imgSelected = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImgSrc(e.target.files[0]);
        }
    };

    const selectImg = () => {
        fileInputRef.current?.click();
    };

    const onSubmit = async (data: FormData) => {
        try {
            let imageUrl = '';
            if (imgSrc) {
                imageUrl = await uploadPhoto(imgSrc);
            }

            const productData = { ...data, imageUrl };
            await uploadProduct(productData);

            console.log("Form data:", data);
            console.log("Image URL:", imageUrl);
        } catch (error) {
            console.error("Error uploading product:", error);
        }
    };

    return (
        <div className="upload-product-container">
            <h1 className="text-center fw-bold">ואהבתם ביחד - עמוד תרומת מוצרים</h1>
            <h2 className="text-center fw-bold">הוספת מוצר</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="vstack gap-3 col-md-7 mx-auto">
                <div className="form-floating mb-3">
                    <input {...register("itemName")} type="text" className="form-control" id="itemName" placeholder="שם הפריט" />
                    <label htmlFor="itemName">שם הפריט</label>
                    {errors.itemName && <p className="text-danger">{errors.itemName.message}</p>}
                </div>
                <div className="form-floating mb-3">
                    <input {...register("quantity")} type="number" className="form-control" id="quantity" placeholder="כמות" />
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
                    <input {...register("expirationDate")} type="text" className="form-control" id="expirationDate" placeholder="תוקף שימוש" />
                    <label htmlFor="expirationDate">תוקף שימוש</label>
                    {errors.expirationDate && <p className="text-danger">{errors.expirationDate.message}</p>}
                </div>
                <div className="form-floating mb-3">
                    <textarea {...register("description")} className="form-control" id="description" placeholder="תיאור" />
                    <label htmlFor="description">תיאור</label>
                </div>
                <div className="form-floating mb-3">
                    <input type="text" className="form-control" id="pickupAddress" placeholder="כתובת לאיסוף" />
                    <label htmlFor="pickupAddress">כתובת לאיסוף</label>
                </div>
                <div className="d-flex justify-content-center">
                    <div className="position-relative upload-image-container">
                        <input style={{ display: "none" }} {...register("image")} type="file" onChange={imgSelected} ref={fileInputRef} />
                        <button type="button" className="btn btn-outline-secondary" onClick={selectImg}>
                            <FontAwesomeIcon icon={faImage} className="fa-xl" />
                            <span>העלאת תמונה</span>
                        </button>
                    </div>
                </div>
                {errors.image && <p className="text-danger">{errors.image.message}</p>}
                <div className="d-flex justify-content-center">
                    <button type="submit" className="btn btn-primary mt-3">הוסף/י</button>
                </div>
            </form>
        </div>
    );
};

export default UploadProduct;
