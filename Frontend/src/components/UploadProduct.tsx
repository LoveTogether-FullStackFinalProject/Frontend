
import React, { ChangeEvent, useRef, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { uploadPhoto, uploadProduct } from '../services/uploadProductService';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  itemName: z.string().min(2, 'שם הפריט חייב להכיל לפחות 2 תווים'),
  quantity: z.number().gt(0, 'כמות הפריט חייבת להיות יותר מ-0'),
  category: z.string().min(1, 'יש לבחור קטגוריה'),
  customCategory: z
    .string()
    .min(2, 'קטגוריה מותאמת אישית חייבת להכיל לפחות 2 תווים')
    .optional(),
  condition: z.string().min(2, 'מצב הפריט חייב להכיל לפחות 2 תווים'),
  expirationDate: z
    .string()
    .refine((dateString) => {
      const selectedDate = new Date(dateString);
      const currentDate = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(currentDate.getDate() + 7);
      return (
        selectedDate > currentDate && selectedDate > nextWeek
      );
    }, 'תאריך התפוגה חייב להיות לפחות שבוע מהיום.')
    .optional(),
  description: z.string().min(1, 'תיאור חייב להיות מוגדר'),
  pickupAddress: z
    .string()
    // .min(1, 'כתובת איסוף חייבת להיות מוגדרת')
    .optional(),
  image: z.any().refine((file) => file instanceof File, 'יש להעלות תמונה'),
});

type FormData = z.infer<typeof schema>;

const UploadProduct: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [imgPreview, setImgPreview] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const [showPickupAddress, setShowPickupAddress] = useState(false);
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState('');
  const [deliveryOption, setDeliveryOption] = useState('');
  const [showError, setShowError] = useState(false);
  const [showPickUpError, setPickUpShowError] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
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

    if (!status) {
      setShowError(true);
      return;
    }
    if(showPickupAddress && data.pickupAddress=="") {
      setPickUpShowError(true);
      console.log("showPickUpError",showPickUpError);
      return;
    }

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
        status,
        category: data.category === 'אחר' ? data.customCategory : data.category,
      };
      await uploadProduct(productData);
      navigate('/profile');
    } catch (error) {
      console.error('Error uploading product:', error);
      alert(
        `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`
      );
    }
  };

  // const handleDeliveryOptionChange = (event: ChangeEvent<HTMLInputElement>) => {
  //   const { value } = event.target;
  //   setSelectedDeliveryOption(value);
  //   if (value === 'מבקש שיאספו ממני את הפריט') {
  //     // Show the pickup address field
  //     setValue('pickupAddress', ''); // Clear the pickup address field if needed
  //     trigger('pickupAddress'); // Trigger validation if necessary
  //     setShowPickupAddress(true);
  //   } else {
  //     // Hide or clear the pickup address field
  //     setValue('pickupAddress', ''); // Clear the pickup address field if needed
  //     trigger('pickupAddress'); // Trigger validation if necessary
  //     setShowPickupAddress(false);
  //   }
  // };

  const handleDeliveryOptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    // setDeliveryOption(value);
    if (showError) setShowError(false);

    setSelectedDeliveryOption(value);
    if (value === 'ממתין לאיסוף מבית התורם') {
      setShowPickupAddress(true);
      setStatus('ממתין לאיסוף מבית התורם');
      setValue("pickupAddress", "");
    } else {
      setShowPickupAddress(false);
      setStatus('טרם הגיע לעמותה');
      setValue("pickupAddress", "default");
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
    <div className="upload-product-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2 className="upload-product-title">♥עמותת ואהבתם ביחד - אני מעוניינ/ת לתרום♥</h2>
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%', maxWidth: '800px', direction: 'rtl' }}>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '200px', margin: '10px', textAlign: 'right' }}>
            <input
              {...register('itemName')}
              type="text"
              placeholder="שם הפריט"
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid black', fontSize: '16px' }}
              className={`${errors.itemName ? 'is-invalid' : ''}`}
            />
            {errors.itemName && (
              <div className="invalid-feedback">{errors.itemName.message}</div>
            )}
          </div>

          <div style={{ flex: '1', minWidth: '200px', margin: '10px', textAlign: 'right' }}>
            <input
              {...register('quantity', { valueAsNumber: true })}
              type="number"
              placeholder="כמות"
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid black', fontSize: '16px' }}
              className={`${errors.quantity ? 'is-invalid' : ''}`}
            />
            {errors.quantity && (
              <div className="invalid-feedback">{errors.quantity.message}</div>
            )}
          </div>

          <div style={{ flex: '1', minWidth: '200px', margin: '10px', textAlign: 'right' }}>
            <select
              {...register('category')}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid black', fontSize: '16px' }}
              className={`${errors.category ? 'is-invalid' : ''}`}
            >
              <option value="">בחר קטגוריה</option>
              <option value="מזון ושתייה">מזון ושתייה</option>
              <option value="ציוד בית וגן">ציוד בית וגן</option>
              <option value="אלקטרוניקה">אלקטרוניקה</option>
              <option value="תקשורת">תקשורת</option>
              <option value="בגדים ואקססוריז">בגדים ואקססוריז</option>
              <option value="אחר">אחר</option>
            </select>
            {errors.category && (
              <div className="invalid-feedback">{errors.category.message}</div>
            )}
          </div>

          {selectedCategory === 'אחר' && (
            <div style={{ flex: '1', minWidth: '200px', margin: '10px', textAlign: 'right' }}>
              <input
                {...register('customCategory')}
                type="text"
                placeholder="קטגוריה מותאמת אישית"
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid black', fontSize: '16px' }}
                className={`${errors.customCategory ? 'is-invalid' : ''}`}
              />
              {errors.customCategory && (
                <div className="invalid-feedback">{errors.customCategory.message}</div>
              )}
            </div>
          )}

          <div style={{ flex: '1', minWidth: '200px', margin: '10px', textAlign: 'right' }}>
            <input
              {...register('condition')}
              type="text"
              placeholder="מצב הפריט"
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid black', fontSize: '16px' }}
              className={`${errors.condition ? 'is-invalid' : ''}`}
            />
            {errors.condition && (
              <div className="invalid-feedback">{errors.condition.message}</div>
            )}
          </div>

          {selectedCategory === 'מזון ושתייה' && (
            <div style={{ flex: '1', minWidth: '200px', margin: '10px', textAlign: 'right' }}>
              <input
                {...register('expirationDate')}
                type="date"
                min={new Date().toISOString().split('T')[0]} 
                placeholder="תאריך תפוגה"
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid black', fontSize: '16px' }}
                className={`${errors.expirationDate ? 'is-invalid' : ''}`}
              />
              {errors.expirationDate && (
                <div className="invalid-feedback">{errors.expirationDate.message}</div>
              )}
            </div>
          )}

<div style={{ flex: '1', minWidth: '200px', margin: '10px', textAlign: 'right' }}>
  <textarea
    {...register('description')}
    placeholder="תיאור הפריט"
    style={{ width: '100%', height: '100px', padding: '8px', borderRadius: '4px', border: '1px solid black', fontSize: '16px' }}
    className={`${errors.description ? 'is-invalid' : ''}`}
  />
  {errors.description && (
    <div className="invalid-feedback">{errors.description.message}</div>
  )}
</div>



          <div style={{ flex: '1', minWidth: '200px', margin: '10px', textAlign: 'right' }}>
            <input
              {...register('image')}
              type="file"
              accept="image/*"
              onChange={imgSelected}
              ref={fileInputRef}
              style={{ display: 'none' }}
            />
            <button
              type="button"
              onClick={selectImg}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid black', fontSize: '16px' }}
              className={`${errors.image ? 'is-invalid' : ''}`}
            >
              <FontAwesomeIcon icon={faImage} style={{ marginRight: '8px' }} />
              העלאת תמונה
            </button>
            {imgPreview && (
              <div style={{ marginTop: '10px', maxWidth: '100%' }}>
                <img src={imgPreview} alt="Preview" style={{ maxWidth: '100%', height: 'auto' }} />
              </div>
            )}
            {errors.image && (
              <div className="invalid-feedback">{errors.image.message}</div>
            )}
          </div>

          {/* <div style={{ flex: '1', minWidth: '200px', margin: '10px', textAlign: 'right' }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <label style={{ marginBottom: '10px' }}>בחרו את אפשרות המשלוח:</label>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
                <label>
                  <input
                    type="radio"
                    {...register('deliveryOption')}
                    value="מבקש שיאספו ממני את הפריט"
                    onChange={handleDeliveryOptionChange}
                    checked={selectedDeliveryOption === 'מבקש שיאספו ממני את הפריט'}
                  />
                  מבקש שיאספו ממני את הפריט
                </label>
                <label>
                  <input
                    type="radio"
                    {...register('deliveryOption')}
                    value="אשמח להביא את הפריט אליך"
                    onChange={handleDeliveryOptionChange}
                    checked={selectedDeliveryOption === 'אשמח להביא את הפריט אליך'}
                  />
                  אשמח להביא את הפריט אליך
                </label>
              </div>
            </div>
          </div>

          {showPickupAddress && (
            <div style={{ flex: '1', minWidth: '200px', margin: '10px', textAlign: 'right' }}>
              <input
                {...register('pickupAddress')}
                type="text"
                placeholder="כתובת איסוף"
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid black', fontSize: '16px' }}
                className={`${errors.pickupAddress ? 'is-invalid' : ''}`}
              />
              {errors.pickupAddress && (
                <div className="invalid-feedback">{errors.pickupAddress.message}</div>
              )}
            </div>
                {showError && (
          <div className="error-message" style={{ marginLeft: '20px' }}>אנא בחר דרך שליחת פריט</div>
        )}            className="form-check-input"
            type="radio"
            name="deliveryOption"
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
            className="form-check-input"
            type="radio"
            name="deliveryOption"
            id="deliveryOption2"
            value="ממתין לאיסוף מבית התורם"
            onChange={handleDeliveryOptionChange}
          />
          <label className="form-check-label" htmlFor="deliveryOption2">
            מבקש שיאספו ממני את הפריט
          </label>
        </div>
     
        {showError && (
          <div className="error-message">אנא בחר דרך שליחת פריט</div>
        )}
     
      </div> */}

<style>
        {`
.form-check-input {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  position: absolute;
  opacity: 0;
}

.form-check-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.form-check-label .custom-square {
  width: 16px; /* Small square size */
  height: 16px; /* Small square size */
  border: 2px solid black; /* Change square border to black */
  margin-right: 8px; /* Space between square and label text */
  display: inline-block;
  border-radius: 50%; /* Change to round corners */
}

.form-check-input:checked + label .custom-square {
  background-color: black; /* Change color when checked to black */
}
          .error-message{
           color: #dc3545;
            font-size: 14px;
           margin-top: 20px; 
           margin-right: 95px
          }
        `}
      </style>
      <div className="form-group">
      <label style={{ marginBottom: '10px' }}>בחרו את אפשרות המשלוח:</label>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="deliveryOption"
            id="deliveryOption1"
            value="טרם הגיע לעמותה"
            onChange={handleDeliveryOptionChange}
          />
          <label className="form-check-label" htmlFor="deliveryOption1">
            <span className="custom-square"></span>
            אביא את התרומה בעצמי למרכז האיסוף
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="deliveryOption"
            id="deliveryOption2"
            value="ממתין לאיסוף מבית התורם"
            onChange={handleDeliveryOptionChange}
          />
          <label className="form-check-label" htmlFor="deliveryOption2">
            <span className="custom-square"></span> 
            מבקש שיאספו ממני את הפריט
          </label>
        </div>

        {showError && (
      <div className="error-message" >אנא בחר דרך שליחת פריט</div>
      )}
      </div>
      
      {showPickupAddress && (
        <div className="form-group">
          <input
            {...register("pickupAddress")}
            type="text"
             placeholder="כתובת איסוף"
            //  className={`form-control ${errors.pickupAddress ? 'is-invalid' : ''}`}
          />
            {showPickUpError && (
          <div className="error-message" style={{ marginRight: '680px' }}>כתובת האיסוף חייבת להיות מוגדרת</div>
          )}
        </div>
      )}

        </div>
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
          <button type="submit" style={{ padding: '10px 20px', borderRadius: '4px', border: 'none', background: '#007bff', color: 'white', fontSize: '16px' }}>
            העלאת פריט לתרומה
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadProduct;