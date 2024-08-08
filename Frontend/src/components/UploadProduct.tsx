import React, { ChangeEvent, useRef, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { uploadPhoto, uploadProduct } from '../services/uploadProductService';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import './UploadProduct.css';

const schema = z.object({
  itemName: z.string().min(2, 'שם הפריט חייב להכיל לפחות 2 תווים'),
  quantity: z.number().gt(0, 'כמות הפריט חייבת להיות יותר מ-0'),
  category: z.string().min(1, 'יש לבחור קטגוריה'),
  customCategory: z.string().min(2, 'קטגוריה מותאמת אישית חייבת להכיל לפחות 2 תווים').optional(),
  condition: z.string().min(2, 'מצב הפריט חייב להכיל לפחות 2 תווים'),
  expirationDate: z.string().refine((dateString) => {
    const selectedDate = new Date(dateString);
    const currentDate = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(currentDate.getDate() + 7);
    return selectedDate > currentDate && selectedDate > nextWeek;
  }, 'תאריך התפוגה חייב להיות לפחות שבוע מהיום.').optional(),
  description: z.string().min(1, 'תיאור חייב להיות מוגדר'),
  pickupAddress: z.string().optional(),
  branch: z.string().optional(),
  image: z.any().refine((file) => file instanceof File, 'יש להעלות תמונה'),
});

type FormData = z.infer<typeof schema>;

const UploadProduct: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [imgPreview, setImgPreview] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const [showPickupAddress, setShowPickupAddress] = useState(false);
  const [showBranch, setShowBranch] = useState(false);
  const [amountError, setamountError] = useState('');
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState('');
  const [showError, setShowError] = useState(false);
  const [showPickUpError, setPickUpShowError] = useState(false);
  const [showBranchError, setBranchShowError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const productName = queryParams.get('productName') || '';
  const category = queryParams.get('category') || '';
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

  useEffect(() => {
    setValue('itemName', productName);
    setValue('category', category);
    console.log('productName:', productName);
    console.log('category:', category);
  }, [productName, category, setValue]);

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
    if (showPickupAddress && data.pickupAddress === "") {
      setPickUpShowError(true);
      return;
    }
    if (showBranch && data.branch === "") {
      setBranchShowError(true);
      return;
    }
    if (data.quantity < 1) {
      setamountError('כמות חייבת להיות גדולה מ-0');
      return;
    } else {
      setamountError('');
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
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    }
  };

  const handleDeliveryOptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    if (showError) setShowError(false);

    setSelectedDeliveryOption(value);
    if (value === 'ממתין לאיסוף מבית התורם') {
      setShowPickupAddress(true);
      setShowBranch(false);
      setStatus('ממתין לאיסוף מבית התורם');
      setValue('pickupAddress', '');
    } else {
      setShowPickupAddress(false);
      setShowBranch(true);
      setStatus('טרם הגיע לעמותה');
      setValue('pickupAddress', 'default');
    }
  };

  if (!isLoggedIn) {
    navigate('/login');
  }

  return (
    <div className="upload-product-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'linear-gradient(90deg, rgba(241, 241, 241, 0.753) 5%, rgba(249, 219, 120, 0.728) 62%, rgba(249, 219, 120, 0.695) 100%)' }}>
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
            {errors.itemName && <div className="invalid-feedback">{errors.itemName.message}</div>}
          </div>

          <div style={{ flex: '1', minWidth: '200px', margin: '10px', textAlign: 'right' }}>
            <input
              {...register('quantity', { valueAsNumber: true })}
              type="number"
              placeholder="כמות"
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid black', fontSize: '16px' }}
              className={`${errors.quantity ? 'is-invalid' : ''}`}
            />
            {errors.quantity && <div className="invalid-feedback">חובה להכניס כמות</div>}
            {amountError && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '1px' }}>{amountError}</p>}
          </div>

          <div style={{ flex: '1', minWidth: '200px', margin: '10px', textAlign: 'right' }}>
            <select {...register('category')} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid black', fontSize: '16px' }}>
              <option value="">בחר קטגוריה</option>
              <option value="מזון ושתייה">מזון ושתייה</option>
              <option value="ביגוד והנעלה">ביגוד והנעלה</option>
              <option value="ריהוט">ריהוט</option>
              <option value="מכשירי חשמל">מכשירי חשמל</option>
              <option value="ספרים">ספרים</option>
              <option value="אחר">אחר</option>
            </select>
            {errors.category && <div className="invalid-feedback">{errors.category.message}</div>}
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
              {errors.customCategory && <div className="invalid-feedback">{errors.customCategory.message}</div>}
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
            {errors.condition && <div className="invalid-feedback">{errors.condition.message}</div>}
          </div>

          {selectedCategory === 'מזון ושתייה' && (
            <div style={{ flex: '1', minWidth: '200px', margin: '10px', textAlign: 'right' }}>
              <input
                {...register('expirationDate')}
                type="date"
                placeholder="תאריך תפוגה"
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid black', fontSize: '16px' }}
                className={`${errors.expirationDate ? 'is-invalid' : ''}`}
              />
              {errors.expirationDate && <div className="invalid-feedback">{errors.expirationDate.message}</div>}
            </div>
          )}

          <div style={{ flex: '1', minWidth: '200px', margin: '10px', textAlign: 'right' }}>
            <textarea
              {...register('description')}
              placeholder="תיאור"
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid black', fontSize: '16px', height: '100px' }}
            />
            {errors.description && <div className="invalid-feedback">{errors.description.message}</div>}
          </div>

          <div style={{ flex: '1', minWidth: '200px', margin: '10px', textAlign: 'right' }}>
            <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }} onClick={selectImg}>
              <FontAwesomeIcon icon={faImage} style={{ fontSize: '24px', color: '#333' }} />
              <span>בחר תמונה</span>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={imgSelected}
                style={{ display: 'none' }}
              />
            </label>
            {imgPreview && <img src={imgPreview} alt="Preview" style={{ marginTop: '10px', maxWidth: '100%', height: 'auto' }} />}
            {errors.image && <div className="invalid-feedback">{errors.image.message}</div>}
          </div>

          {showPickupAddress && (
            <div style={{ flex: '1', minWidth: '200px', margin: '10px', textAlign: 'right' }}>
              <input
                {...register('pickupAddress')}
                type="text"
                placeholder="כתובת לאיסוף"
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid black', fontSize: '16px' }}
                className={`${showPickUpError ? 'is-invalid' : ''}`}
              />
              {showPickUpError && <p style={{ color: 'red', fontSize: '0.8rem' }}>יש להכניס כתובת לאיסוף</p>}
            </div>
          )}

          {showBranch && (
            <div style={{ flex: '1', minWidth: '200px', margin: '10px', textAlign: 'right' }}>
              <select {...register('branch')} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid black', fontSize: '16px' }}>
                <option value="">בחר סניף</option>
                <option value="סניף 1">סניף 1</option>
                <option value="סניף 2">סניף 2</option>
                <option value="סניף 3">סניף 3</option>
              </select>
              {showBranchError && <p style={{ color: 'red', fontSize: '0.8rem' }}>יש לבחור סניף</p>}
            </div>
          )}

          <div style={{ flex: '1', minWidth: '200px', margin: '10px', textAlign: 'right' }}>
            <label>
              <input
                type="radio"
                value="ממתין לאיסוף מבית התורם"
                checked={selectedDeliveryOption === 'ממתין לאיסוף מבית התורם'}
                onChange={handleDeliveryOptionChange}
              />
              ממתין לאיסוף מבית התורם
            </label>
            <label>
              <input
                type="radio"
                value="טרם הגיע לעמותה"
                checked={selectedDeliveryOption === 'טרם הגיע לעמותה'}
                onChange={handleDeliveryOptionChange}
              />
              טרם הגיע לעמותה
            </label>
          </div>
        </div>
        <button type="submit" style={{ padding: '10px 20px', borderRadius: '4px', backgroundColor: '#f8c00a', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '16px' }}>
          שלח
        </button>
      </form>
    </div>
  );
};

export default UploadProduct;
