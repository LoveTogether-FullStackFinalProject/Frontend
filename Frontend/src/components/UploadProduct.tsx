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
  expirationDate: z.string().optional(),
  description: z.string().min(1, 'תיאור חייב להיות מוגדר'),
  pickupAddress: z
    .string()
    .min(1, 'כתובת איסוף חייבת להיות מוגדרת')
    .default(''),
  image: z.any().refine((file) => file instanceof File, 'יש להעלות תמונה'),
});

type FormData = z.infer<typeof schema>;

const UploadProduct: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [imgPreview, setImgPreview] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const [showPickupAddress, setShowPickupAddress] = useState(false);
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState('');
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

  const handleDeliveryOptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSelectedDeliveryOption(value);
    if (value === 'מבקש שיאספו ממני את הפריט') {
      // Show the pickup address field
      setValue('pickupAddress', ''); // Clear the pickup address field if needed
      trigger('pickupAddress'); // Trigger validation if necessary
      setShowPickupAddress(true);
    } else {
      // Hide or clear the pickup address field
      setValue('pickupAddress', ''); // Clear the pickup address field if needed
      trigger('pickupAddress'); // Trigger validation if necessary
      setShowPickupAddress(false);
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
              <option value="אביזרים">אביזרים</option>
              <option value="אלקטרוניקה">אלקטרוניקה</option>
              <option value="ביגוד">ביגוד</option>
              <option value="הנעלה">הנעלה</option>
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

          <div style={{ flex: '1', minWidth: '200px', margin: '10px', textAlign: 'right' }}>
            <input
              {...register('expirationDate')}
              type="date"
              placeholder="תאריך תפוגה"
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid black', fontSize: '16px' }}
              className={`${errors.expirationDate ? 'is-invalid' : ''}`}
            />
            {errors.expirationDate && (
              <div className="invalid-feedback">
                {errors.expirationDate.message}
              </div>
            )}
          </div>
        </div>

        <div style={{ margin: '10px', textAlign: 'right', width: '100%' }}>
          <textarea
            {...register('description')}
            placeholder="תיאור הפריט"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid black', fontSize: '16px' }}
            className={`${errors.description ? 'is-invalid' : ''}`}
          />
          {errors.description && (
            <div className="invalid-feedback">{errors.description.message}</div>
          )}
        </div>

        <div style={{ margin: '10px', textAlign: 'right', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={imgSelected}
              accept="image/*"
            />
            <button type="button" className="image-upload-button" onClick={selectImg} style={{ padding: '10px 20px', borderRadius: '4px', backgroundColor: '#007bff', color: '#fff', border: 'none', fontSize: '16px', cursor: 'pointer' }}>
              <FontAwesomeIcon icon={faImage} style={{ marginRight: '10px' }} />
              העלאת תמונה
            </button>
            {imgPreview && (
              <img src={imgPreview} alt="תצלום פריט" className="profile-image" style={{ maxWidth: '200px', maxHeight: '200px', marginBottom: '10px' }} />
            )}
          </div>
        </div>

        <div style={{ margin: '10px', textAlign: 'right', width: '100%' }}>
          <div className="form-check">
            <input
              type="radio"
              id="pickup"
              {...register('deliveryOption')}
              value="מבקש שיאספו ממני את הפריט"
              className="form-check-input"
              onChange={handleDeliveryOptionChange}
            />
            <label htmlFor="pickup" className="form-check-label">
              מבקש שיאספו ממני את הפריט
            </label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              id="bring"
              {...register('deliveryOption')}
              value="אביא את התרומה בעצמי למרכז האיסוף"
              className="form-check-input"
              onChange={handleDeliveryOptionChange}
            />
            <label htmlFor="bring" className="form-check-label">
              אביא את התרומה בעצמי למרכז האיסוף
            </label>
          </div>
        </div>

        {showPickupAddress && (
          <div style={{ margin: '10px', textAlign: 'right', width: '100%' }}>
            <input
              {...register('pickupAddress')}
              type="text"
              placeholder="כתובת לאיסוף"
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid black', fontSize: '16px' }}
              className={`${errors.pickupAddress ? 'is-invalid' : ''}`}
            />
            {errors.pickupAddress && (
              <div className="invalid-feedback">
                {errors.pickupAddress.message}
              </div>
            )}
          </div>
        )}

        <div style={{ margin: '10px', textAlign: 'center', width: '100%' }}>
          <button type="submit" className="submit-button" style={{ width: '200px', backgroundColor: '#28a745', color: '#fff', border: 'none', padding: '12px', borderRadius: '4px', cursor: 'pointer', fontSize: '18px' }}>
            שליחה
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadProduct;

