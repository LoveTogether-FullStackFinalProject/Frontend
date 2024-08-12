import React, { ChangeEvent, useRef, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { uploadPhoto, uploadProduct } from '../services/uploadProductService';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
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
    if (value === 'ממתין לאיסוף') {
      setShowPickupAddress(true);
      setShowBranch(false);
      setStatus('ממתין לאיסוף');
      setValue('pickupAddress', '');
    } else {
      setShowPickupAddress(false);
      setShowBranch(true);
      setStatus('לא נמסר לעמותה');
      setValue('pickupAddress', 'default');
    }
  };

  if (!isLoggedIn) {
    navigate('/login');
  }

  return (
    <Container className="upload-product-container">
      <h1 className="upload-product-title">תרמו כאן:</h1>
      <Form onSubmit={handleSubmit(onSubmit)} className="upload-product-form">
        <div className="form-section">
          <Form.Group className="mb-3">
            <Form.Control
              {...register('itemName')}
              type="text"
              placeholder="שם הפריט"
              isInvalid={!!errors.itemName}
            />
            <Form.Control.Feedback type="invalid">
              {errors.itemName?.message}
            </Form.Control.Feedback>
          </Form.Group>
  
          <Form.Group className="mb-3">
            <Form.Control
              {...register('quantity', { valueAsNumber: true })}
              type="number"
              placeholder="כמות"
              isInvalid={!!errors.quantity || !!amountError}
            />
            <Form.Control.Feedback type="invalid">
              {errors.quantity?.message || amountError}
            </Form.Control.Feedback>
          </Form.Group>
  
          <Form.Group className="mb-3">
            <Form.Select {...register('category')} isInvalid={!!errors.category}>
              <option value="">בחר קטגוריה</option>
              <option value="מזון ושתייה">מזון ושתייה</option>
              <option value="ביגוד והנעלה">ביגוד והנעלה</option>
              <option value="ריהוט">ריהוט</option>
              <option value="מכשירי חשמל">מכשירי חשמל</option>
              <option value="צעצועים">צעצועים</option>
              <option value="אחר">אחר</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.category?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </div>
  
        <div className="form-section">
          {watch('category') === 'אחר' && (
            <Form.Group className="mb-3">
              <Form.Control
                {...register('customCategory')}
                type="text"
                placeholder="קטגוריה מותאמת אישית"
                isInvalid={!!errors.customCategory}
              />
              <Form.Control.Feedback type="invalid">
                {errors.customCategory?.message}
              </Form.Control.Feedback>
            </Form.Group>
          )}
  
          <Form.Group className="mb-3">
            <Form.Control
              {...register('condition')}
              type="text"
              placeholder="מצב הפריט"
              isInvalid={!!errors.condition}
            />
            <Form.Control.Feedback type="invalid">
              {errors.condition?.message}
            </Form.Control.Feedback>
          </Form.Group>
  
          {watch('category') === 'מזון ושתייה' && (
            <Form.Group className="mb-3">
              <Form.Control
                {...register('expirationDate')}
                type="date"
                isInvalid={!!errors.expirationDate}
              />
              <Form.Control.Feedback type="invalid">
                {errors.expirationDate?.message}
              </Form.Control.Feedback>
            </Form.Group>
          )}
        </div>
  
        <div className="form-section">
          <Form.Group className="mb-3">
            <Form.Control
              as="textarea"
              rows={4}
              {...register('description')}
              placeholder="תיאור"
              isInvalid={!!errors.description}
            />
            <Form.Control.Feedback type="invalid">
              {errors.description?.message}
            </Form.Control.Feedback>
          </Form.Group>
  
          <Form.Group className="mb-3">
            <Form.Label>אפשרות מסירה</Form.Label>
            <div>
              <Form.Check
                type="radio"
                id="pickup"
                label="ממתין לאיסוף"
                name="deliveryOption"
                value="ממתין לאיסוף"
                checked={selectedDeliveryOption === 'ממתין לאיסוף'}
                onChange={handleDeliveryOptionChange}
                className="mb-2"
              />
              <Form.Check
                type="radio"
                id="notDelivered"
                label="לא נמסר לעמותה"
                name="deliveryOption"
                value="לא נמסר לעמותה"
                checked={selectedDeliveryOption === 'לא נמסר לעמותה'}
                onChange={handleDeliveryOptionChange}
              />
            </div>
            {showError && <Alert variant="danger" className="mt-2">יש לבחור אפשרות מסירה</Alert>}
          </Form.Group>
        </div>
  
        <div className="form-section">
          {showPickupAddress && (
            <Form.Group className="mb-3">
              <Form.Control
                {...register('pickupAddress')}
                type="text"
                placeholder="כתובת לאיסוף"
                isInvalid={!!errors.pickupAddress || showPickUpError}
              />
              <Form.Control.Feedback type="invalid">
                {errors.pickupAddress?.message || (showPickUpError && 'יש למלא את כתובת האיסוף')}
              </Form.Control.Feedback>
            </Form.Group>
          )}
  
          {showBranch && (
            <Form.Group className="mb-3">
              <Form.Select
                {...register('branch')}
                isInvalid={showBranchError}
              >
                <option value="">בחר סניף</option>
                <option value="סניף 1">סניף 1</option>
                <option value="סניף 2">סניף 2</option>
                <option value="סניף 3">סניף 3</option>
              </Form.Select>
              {showBranchError && <Form.Control.Feedback type="invalid">יש לבחור סניף</Form.Control.Feedback>}
            </Form.Group>
          )}
  
  <Form.Group className="mb-3">
    <Button variant="secondary" onClick={selectImg} className="w-100 mb-2">
    <FontAwesomeIcon icon={faImage} className="ms-2" />
      {imgPreview ? 'החלפת תמונה' : 'העלאת תמונה'}
      
    </Button>
    <Form.Control
      ref={fileInputRef}
      type="file"
      accept="image/*"
      onChange={imgSelected}
      style={{ display: 'none' }}
    />
    {imgPreview && <img src={imgPreview} alt="תמונה נבחרת" className="img-preview" />}
  </Form.Group>

  <div className="text-center">
    <Button type="submit" variant="primary" className="w-100">
      שלח
    </Button>
  </div>
</div>
      </Form>
    </Container>
  );
};

export default UploadProduct;