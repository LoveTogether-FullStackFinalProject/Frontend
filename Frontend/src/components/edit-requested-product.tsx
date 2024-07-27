import  { ChangeEvent, useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
 import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import  dataService from "../services/data-service.ts";
import {requestedDonation} from "../services/upload-requested-product-service";
import  requestedProduectService,{ CanceledError } from "../services/upload-requested-product-service";
 import './upload-requested-product.css';

const RequestedProductSchema = z.object({
  category: z.string().min(1, { message: 'חובה להכניס קטגוריה' }),
  itemName: z.string().min(1, { message: 'חובה להכניס שם מוצר' }),
  amount: z.string().min(1, { message: 'חובה להכניס כמות' }).transform(parseFloat),
  itemCondition: z.string().min(1, { message: 'חובה להכניס מצב מוצר' }),
  description: z.string().min(1, { message: 'חובה להכניס תיאור מוצר' }),
  image: z.string().url({ message: 'חובה לצרף תמונה' }).optional(),
  customCategory: z.string().min(1, { message: 'חובה להכניס קטגוריה' }).optional()
});
type FormData = z.infer<typeof RequestedProductSchema>;

function EditRequestedProduct() {
  const { register,clearErrors, handleSubmit, formState: { errors }, setValue , trigger,} = useForm<FormData>({ resolver: zodResolver(RequestedProductSchema) });
  const navigate = useNavigate();
  const [imgSrc, setImgSrc] = useState<File>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [category, setCategory] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const location = useLocation();
  const { donation } = location.state || {}; 

  useEffect(() => {
    if (donation) {
      setValue('category', donation.category);
      setValue('itemName', donation.itemName);
      setValue('amount', donation.amount.toString());
      setValue('itemCondition', donation.itemCondition);
      setValue('description', donation.description);
      setValue('image', donation.image);
      setCategory(donation.category);
    }
  }, [donation, setValue]);

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

  const editProduct = async (data: FormData) => {
    console.log(errors);

    // if (!imgSrc) {
    //   alert("Please select an image");
    //   return;
    // }
    let url;
    if(imgSrc){
     url = await requestedProduectService.uploadPhoto(imgSrc!);
    }
    else{
     url = donation.image;
    }
    const product: requestedDonation = {
      ...data,
      image: url
    };

    const res=await requestedProduectService.editRequestedProduct(donation._id,product);
    console.log("editRequestedProduct",res);
    navigate('/mainPage'); 
  };

     const [isAdmin, setIsAdmin] = useState(false);
     useEffect(() => {
       const userId = localStorage.getItem('userID');
       if (userId) {
         dataService.getUser(userId).req.then((res) => {
           setIsAdmin(res.data.isAdmin);
           console.log("isAdmin:", res.data.isAdmin);
         });
       }
     }, []);


     if (!isAdmin) {
      return (
          <div style={{ backgroundColor: 'white', width: '100%', height: '50vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '100px',padding: '20px', border: '1px solid black' }}>
          <p style={{ color: 'black' }}>שגיאה: אינך מחובר בתור מנהל</p>
          <button onClick={() => navigate('/adminDashboard')} style={{ backgroundColor: '#F9DA78', marginTop: '20px' }}>התחבר בתור מנהל</button>
        </div>
      );
    }

  return (
    <>
<div className="container">
  <h1 className="form-title">עריכת מוצר המבוקש לתרומה</h1>
  <div className="form-wrapper">  
    <form onSubmit={handleSubmit(editProduct)}>
      <div className="form-group">
        <div className="input-row">
          <div className="input-wrapper">
            <input
              {...register("itemName")}
              type="text"
              className="form-control"
              id="floatingItemName"
              placeholder=""
            />
            <label htmlFor="floatingItemName" className="floating-label">
              שם המוצר
            </label>
            {errors.itemName && (
              <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '1px' }}>{errors.itemName.message}</p>
            )}
          </div>
          <div className="input-wrapper">
            <select
              {...register("category")}
              className="form-control"
              id="floatingCategory"
              onChange={(e) => {
                setCategory(e.target.value);
                clearErrors("category"); 
              }}
            >
              <option value="">בחר קטגוריה</option>
              <option value="ביגוד">ביגוד</option>
              <option value="הנעלה">הנעלה</option>
              <option value="ציוד לתינוקות">ציוד לתינוקות</option>
              <option value="כלי בית">כלי בית</option>
              <option value="ריהוט">ריהוט</option>
              <option value="מזון ושתייה">מזון ושתייה</option>
              <option value="ספרים">ספרים</option>
              <option value="צעצועים">צעצועים</option>
              <option value="אחר">אחר...</option>
            </select>
            <label htmlFor="floatingCategory" className="floating-label">
              קטגוריה
            </label>
            {category === "אחר" && (
              <input
                type="text"
                {...register("category")}
                className="form-control"
                placeholder="הזן קטגוריה"
              />
            )}
            {errors.category && (
              <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '1px' }}>{errors.category.message}</p>
            )}
          </div>
        </div>
        <div className="input-row">
          <div className="input-wrapper">
            <input
              {...register("amount")}
              type="number"
              className="form-control"
              id="floatingAmount"
              placeholder=""
            />
            <label htmlFor="floatingAmount" className="floating-label">
              כמות
            </label>
            {errors.amount && (
              <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '1px' }}>{errors.amount.message}</p>
            )}
          </div>
          <div className="input-wrapper">
            <input
              {...register("itemCondition")}
              type="text"
              className="form-control"
              id="floatingItemCondition"
              placeholder=""
            />
            <label htmlFor="floatingItemCondition" className="floating-label">
              מצב
            </label>
            {errors.itemCondition && (
              <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '1px' }}>{errors.itemCondition.message}</p>
            )}
          </div>
        </div>
        <div className="input-wrapper">
          <textarea
            {...register("description")}
            className="form-control"
            id="floatingDescription"
            placeholder=""
          ></textarea>
          <label htmlFor="floatingDescription" className="floating-label">
            תיאור המוצר
          </label>
          {errors.description && (
            <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '1px' }}>{errors.description.message}</p>
          )}
        </div>
      </div>
      <div className="img-upload-wrapper">
        {imgSrc && (
          <img
            src={URL.createObjectURL(imgSrc)}
            alt="Product Preview"
            className="img-thumbnail mb-2"
          />
        )}
            <div className="d-flex justify-content-center">
            <p className="img-upload-text" style={{ marginLeft: '50px' }}>
                תמונת המוצר
            </p>
            <img 
                src={donation.image} 
                alt="Donation" 
                className="img-fluid" 
                style={{
                maxWidth: '200px',
                border: '2px solid #ccc', 
                borderRadius: '8px',
                padding: '5px', 
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
                }} 
            />
            </div>
   
        <button
          type="button"
          className="btn btn-upload mt-2"
          onClick={selectImg}
        >
          <FontAwesomeIcon icon={faImage} className="me-2" />
          עריכת התמונה
        </button>
        <input
          style={{ display: "none" }}
          {...register("image")}
          type="file"
          onChange={(e) => {
            clearErrors('image');
            imgSelected(e);
          }}
          ref={fileInputRef}
        />
        {errors.image && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '1px' }}>יש להעלות תמונה של המוצר</p>}
      </div>
      <div className="d-flex justify-content-center">
        <button type="submit" className="btn btn-submit mt-3">
          שמור שינויים
        </button>
      </div>
    </form>
  </div>
</div>

    </>

  );
}

export default EditRequestedProduct;
