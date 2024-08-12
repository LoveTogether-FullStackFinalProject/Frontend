import React, { ChangeEvent, useRef, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { uploadPhoto, uploadProduct } from '../services/uploadProductService';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import './newLiveDonation.css';
import dataService from '../services/data-service';

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
  donorName: z.string().min(2, 'שם התורם חייב להכיל לפחות 2 תווים'),
  donorPhone: z.string().min(9, 'מספר טלפון חייב להכיל לפחות 9 ספרות'),
  image: z.any().refine((file) => file instanceof File, 'יש להעלות תמונה'),
});

type FormData = z.infer<typeof schema>;

const NewLiveDonation: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [imgPreview, setImgPreview] = useState<string | null>(null);
  const [amountError, setAmountError] = useState('');
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
    const userId = localStorage.getItem('userID');
    if (userId) {
      dataService.getUser(userId).req.then((res) => {
        setIsAdmin(res.data.isAdmin);
      });
    }
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
    if (data.quantity < 1) {
      setAmountError('כמות חייבת להיות גדולה מ-0');
      return;
    } else {
      setAmountError('');
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
      const productData = {
        ...data,
        image: imageUrl,
        donor: localStorage.getItem('userID') || '',
        approvedByAdmin: true,
        status: 'נמסר בעמותה',
        category: data.category === 'אחר' ? data.customCategory : data.category,
      };
      await uploadProduct(productData);
      alert('התרומה נוספה בהצלחה');
      navigate('/manageDonations');
    } catch (error) {
      console.error('Error uploading product:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    }
  };

  if (!isAdmin) {
    return (
      <Container className="error-container">
        <p className="error-title">שגיאה: אינך מחובר בתור מנהל</p>
        <Button onClick={() => navigate('/adminDashboard')} variant="warning">התחבר בתור מנהל</Button>
      </Container>
    );
  }

  return (
    <Container className="new-live-donation-container">
      <h1 className="new-live-donation-title">הוספת תרומה חדשה</h1>
      <Form onSubmit={handleSubmit(onSubmit)} className="donation-form">
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
              <option value="ביגוד">ביגוד</option>
              <option value="הנעלה">הנעלה</option>
              <option value="ציוד לתינוקות">ציוד לתינוקות</option>
              <option value="כלי בית">כלי בית</option>
              <option value="ריהוט">ריהוט</option>
              <option value="מזון ושתייה">מזון ושתייה</option>
              <option value="ספרים">ספרים</option>
              <option value="צעצועים">צעצועים</option>
              <option value="אחר">אחר</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.category?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </div>

        <div className="form-section">
          {selectedCategory === 'אחר' && (
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

          {selectedCategory === 'מזון ושתייה' && (
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
            <Form.Control
              {...register('donorName')}
              type="text"
              placeholder="שם התורם"
              isInvalid={!!errors.donorName}
            />
            <Form.Control.Feedback type="invalid">
              {errors.donorName?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              {...register('donorPhone')}
              type="text"
              placeholder="טלפון התורם"
              isInvalid={!!errors.donorPhone}
            />
            <Form.Control.Feedback type="invalid">
              {errors.donorPhone?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </div>

        <div className="form-section">
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
              שמור תרומה
            </Button>
          </div>
        </div>
      </Form>
    </Container>
  );
};

export default NewLiveDonation;