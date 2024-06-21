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
  productType: z.string().min(1, { message: 'חובה להכניס סוג מוצר' }),
  amount: z.string().min(1, { message: 'חובה להכניס כמות' }).transform(parseFloat),
  itemCondition: z.string().min(1, { message: 'חובה להכניס מצב מוצר' }),
  description: z.string().min(1, { message: 'חובה להכניס תיאור מוצר' }),
  image: z.string().url({ message: 'חובה לצרף תמונה' }),
});
type FormData = z.infer<typeof RequestedProductSchema>;

function UploadRequestedProduct() {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormData>({ resolver: zodResolver(RequestedProductSchema) });
  const navigate = useNavigate();
  const [imgSrc, setImgSrc] = useState<File>();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '5vh' }}>
  <div>
    <h1 className="text-center fw-bold" style={{ color: 'brown', fontSize: '3rem', marginTop: '20px', marginBottom: '60px' }}>העלאת מוצר המבוקש לתרומה</h1>
  </div>
</div>

<div className="d-flex justify-content-center position-relative" style={{ marginTop: '50px' }}>
            {imgSrc && <img src={URL.createObjectURL(imgSrc)} alt="Post" className="img-thumbnail mb-2" style={{ maxWidth: '200px' }} />}
            <button type="button" className="btn position-absolute bottom-0 end-0" onClick={selectImg} style={{ backgroundColor: 'brown', color: 'white' }}>
  <FontAwesomeIcon icon={faImage} className="me-2" />
  העלאת תמונה
</button>
          </div>

          <input style={{ display: "none" }} {...register("image")} type="file" onChange={imgSelected} ref={fileInputRef}></input>
          {errors.image && <p>{errors.image.message}</p>}

<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '95vh', width: '50vw', border: '1px solid lightgray', padding: '20px', backgroundColor: '#f9f9f9' }}>
  <div style={{ width: '300px', textAlign: 'center' }}>
    <form onSubmit={handleSubmit(addNewProduct)}>
      <div className="form-group" style={{ marginTop: '-50px', marginRight: '-10px', marginBottom: '20px' }}>
        
      </div>

      <div className="form-floating mb-3 d-flex justify-content-center">
  <input {...register("category")} type="text" className="form-control" id="floatingName" placeholder="" style={{ direction: 'rtl' }} />
  <div style={{ direction: 'rtl', marginRight: '20px' }}>
    <label htmlFor="floatingName" style={{ fontSize: '1.5rem', fontWeight: 'bold', marginLeft: '10px' }}>קטגוריה</label>
  </div>
  {errors.category && <p>{errors.category.message}</p>}
</div>
<div className="form-floating mb-3 d-flex justify-content-center">
  <input {...register("productType")} type="text" className="form-control" id="floatingName" placeholder="" style={{ direction: 'rtl' }}/>
  <div style={{ direction: 'rtl', marginRight: '20px' }}>
    <label htmlFor="floatingName" style={{ fontSize: '1.5rem', fontWeight: 'bold', marginLeft: '10px' }}>סוג מוצר</label>
  </div>
  {errors.productType && <p>{errors.productType.message}</p>}
</div>
<div className="form-floating mb-3 d-flex justify-content-center">
  <input {...register("amount")} type="text" className="form-control" id="floatingName" placeholder="" style={{ direction: 'rtl' }}/>
  <div style={{ direction: 'rtl', marginRight: '20px' }}>
    <label htmlFor="floatingName" style={{ fontSize: '1.5rem', fontWeight: 'bold', marginLeft: '10px' }}>כמות</label>
  </div>
  {errors.amount && <p>{errors.amount.message}</p>}
</div>
<div className="form-floating mb-3 d-flex justify-content-center">
  <input {...register("itemCondition")} type="text" className="form-control" id="floatingName" placeholder="" style={{ direction: 'rtl' }}/>
  <div style={{ direction: 'rtl', marginRight: '20px' }}>
    <label htmlFor="floatingName" style={{ fontSize: '1.5rem', fontWeight: 'bold', marginLeft: '10px' }}>מצב</label>
  </div>
  {errors.itemCondition && <p>{errors.itemCondition.message}</p>}
</div>
<div className="form-floating mb-3 d-flex justify-content-center">
  <input {...register("description")} type="text" className="form-control" id="floatingDescription" placeholder="" style={{ direction: 'rtl' }}/>
  <div style={{ direction: 'rtl', marginRight: '20px' }}>
    <label htmlFor="floatingDescription" style={{ fontSize: '1.5rem', fontWeight: 'bold', marginLeft: '10px' }}>תיאור המוצר</label>
  </div>
  {errors.description && <p>{errors.description.message}</p>}
</div>

      <div className="d-flex justify-content-center">
        <button type="submit" className="btn btn-primary mt-3" style={{ color: 'white', backgroundColor: 'brown',padding: '10px 10px',  fontSize: '20px'  }}>העלאה</button>
      </div>
    </form>
  </div>
</div>
              
</>  



  
  );
}

export default UploadRequestedProduct;





