import  { ChangeEvent, useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
 import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import {requestedDonation} from "../services/upload-requested-product-service";
import  requestedProduectService,{ CanceledError } from "../services/upload-requested-product-service";

const RequestedProductSchema = z.object({
  category: z.string().min(1, { message: 'חובה להכניס קטגוריה' }),
   itemName: z.string().min(1, { message: 'חובה להכניס שם מוצר' }),
  amount: z.string().min(1, { message: 'חובה להכניס כמות' }).transform(parseFloat),
  itemCondition: z.string().min(1, { message: 'חובה להכניס מצב מוצר' }),
  description: z.string().min(1, { message: 'חובה להכניס תיאור מוצר' }),
  image: z.string().url({ message: 'חובה לצרף תמונה' }),
  customCategory: z.string().min(1, { message: 'חובה להכניס קטגוריה' }).optional()
});
type FormData = z.infer<typeof RequestedProductSchema>;

function UploadRequestedProduct() {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormData>({ resolver: zodResolver(RequestedProductSchema) });
  const navigate = useNavigate();
  const [imgSrc, setImgSrc] = useState<File>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [category, setCategory] = useState('');

  useEffect(() => {
    if (imgSrc) {
      setValue("image", URL.createObjectURL(imgSrc));
    }
  }, [imgSrc, setValue]);


  const imgSelected = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImgSrc(e.target.files[0]);
    }
  };

  const selectImg = () => {
    fileInputRef.current?.click();
  };

  console.log(errors);

  const addNewProduct = async (data: FormData) => {
    if (!imgSrc) {
      alert("Please select an image");
      return;
    }
    const url = await requestedProduectService.uploadPhoto(imgSrc!);
    const product: requestedDonation = {
      ...data,
      image: url
    };
    await requestedProduectService.addRequestedProduct(product);
    navigate('/mainPage'); 
  };



  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
      return (
          <div style={{ backgroundColor: 'white', width: '100%', height: '50vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px', border: '1px solid black' }}>
          <p style={{ color: 'red' }}>שגיאה: אינך מחובר בתור מנהל</p>
          <button onClick={() => navigate('/adminDashboard')} className="btn btn-primary" style={{ backgroundColor: 'red', marginTop: '20px' }}>התחבר בתור מנהל</button>
        </div>
      );
    }

  return (
    <>

<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '20px' }}>
  <div style={{ width: '100%', maxWidth: '600px', border: '1px solid lightgray', padding: '20px', backgroundColor: '#f9f9f9' }}>
    <h1 className="text-center fw-bold" style={{ color: 'brown', fontSize: '2.5rem', marginTop: '20px', marginBottom: '20px' }}>העלאת מוצר המבוקש לתרומה</h1>

    <form onSubmit={handleSubmit(addNewProduct)}>
      <div className="form-group" style={{ marginBottom: '20px' }}>
      </div>

      <div className="mb-3" style={{ position: 'relative' }}>
        <input {...register("itemName")} type="text" className="form-control" id="floatingCategory" placeholder="" style={{ direction: 'rtl', width: '100%', padding: '10px', fontSize: '1.2rem' }} />
        <label htmlFor="floatingItemName" style={{ fontSize: '0.75rem', fontWeight: 'bold', position: 'absolute', top: 0, right: '10px' }}>שם המוצר</label>
        {errors.itemName && <p style={{ position: 'absolute', right: 0, color: 'red', fontSize: '0.8rem', marginTop: '1px' }}>{errors.itemName.message}</p>}
      </div>

<div className="mb-3" style={{ position: 'relative' }}>
      <select {...register("category")} className="form-control" id="floatingCategory" style={{ direction: 'rtl', width: '100%', padding: '10px', fontSize: '1.2rem' }}
        onChange={(e) => setCategory(e.target.value)}>
        <option value="">בחר קטגוריה</option>
        <option value="מזון ושתייה">מזון ושתייה</option>
        <option value="אביזרים">אביזרים</option>
        <option value="אלקטרוניקה">אלקטרוניקה</option>
        <option value="ביגוד">ביגוד</option>
        <option value="הנעלה">הנעלה</option>
        <option value="אחר">אחר...</option>
      </select>
      <label htmlFor="floatingCategory" style={{ fontSize: '0.75rem', fontWeight: 'bold', position: 'absolute', top: 0, right: '10px' }}>קטגוריה</label>
      {category === 'אחר' && (
        <input type="text" {...register("category")} className="form-control" placeholder="הזן קטגוריה" style={{ direction: 'rtl', width: '100%', padding: '10px', fontSize: '1.2rem', marginTop: '10px' }} />
      )}
      {errors.category && <p style={{ position: 'absolute', right: 0, color: 'red', fontSize: '0.8rem', marginTop: '1px' }}>{errors.category.message}</p>}
    </div>


      <div className="mb-3" style={{ position: 'relative' }}>
        <input {...register("amount")} type="number" className="form-control" id="floatingAmount" placeholder="" style={{ direction: 'rtl', width: '100%', padding: '10px', fontSize: '1.2rem' }} />
        <label htmlFor="floatingAmount" style={{ fontSize: '0.75rem', fontWeight: 'bold', position: 'absolute', top: 0, right: '10px' }}>כמות</label>
        {errors.amount && <p style={{ position: 'absolute', right: 0, color: 'red', fontSize: '0.8rem', marginTop: '1px' }}>{errors.amount.message}</p>}
      </div>

      <div className="mb-3" style={{ position: 'relative' }}>
        <input {...register("itemCondition")} type="text" className="form-control" id="floatingItemCondition" placeholder="" style={{ direction: 'rtl', width: '100%', padding: '10px', fontSize: '1.2rem' }} />
        <label htmlFor="floatingItemCondition" style={{ fontSize: '0.75rem', fontWeight: 'bold', position: 'absolute', top: 0, right: '10px' }}>מצב</label>
        {errors.itemCondition && <p style={{ position: 'absolute', right: 0, color: 'red', fontSize: '0.8rem', marginTop: '1px' }}>{errors.itemCondition.message}</p>}
      </div>

      <div className="mb-3" style={{ position: 'relative' }}>
        <input {...register("description")} type="text" className="form-control" id="floatingDescription" placeholder="" style={{ direction: 'rtl', width: '100%', padding: '10px', fontSize: '1.2rem' }} />
        <label htmlFor="floatingDescription" style={{ fontSize: '0.75rem', fontWeight: 'bold', position: 'absolute', top: 0, right: '10px' }}>תיאור המוצר</label>
        {errors.description && <p style={{ position: 'absolute', right: 0, color: 'red', fontSize: '0.8rem', marginTop: '1px' }}>{errors.description.message}</p>}
      </div>

      <div className="d-flex flex-column justify-content-center align-items-center" style={{ width: '100%', marginTop: '20px' }}>
        {imgSrc && <img src={URL.createObjectURL(imgSrc)} alt="Product Preview" className="img-thumbnail mb-2" style={{ maxWidth: '150px', maxHeight: '150px' }} />}
        <button type="button" className="btn mt-2" onClick={selectImg} style={{ backgroundColor: 'brown', color: 'white', width: '200px', fontSize: '1.2rem' }}>
          <FontAwesomeIcon icon={faImage} className="me-2" />
          העלאת תמונה
        </button>
        <input style={{ display: "none" }} {...register("image")} type="file" onChange={imgSelected} ref={fileInputRef}></input>
        {errors.image && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '1px' }}>{errors.image.message}</p>}
      </div>

      <div className="d-flex justify-content-center">
        <button type="submit" className="btn btn-primary mt-3" style={{ color: 'white', backgroundColor: 'brown', padding: '10px 20px', fontSize: '1.2rem' }}>העלאה</button>
      </div>
    </form>
  </div>
</div>

    </>

  );
}

export default UploadRequestedProduct;
