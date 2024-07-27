import React, { ChangeEvent, useRef, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { uploadPhoto, uploadProduct } from '../services/uploadProductService';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import './newLiveDonation.css';
import dataService from '../services/data-service';

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
      return selectedDate > currentDate && selectedDate > nextWeek;
    }, 'תאריך התפוגה חייב להיות לפחות שבוע מהיום.')
    .optional(),
  description: z.string().min(1, 'תיאור חייב להיות מוגדר'),
  donorName: z.string().min(2, 'שם התורם חייב להכיל לפחות 2 תווים'),
  donorPhone: z.string().min(9, 'מספר טלפון חייב להכיל לפחות 9 ספרות'),
  image: z.any().refine((file) => file instanceof File, 'יש להעלות תמונה'),
});

type FormData = z.infer<typeof schema>;

const NewLiveDonation: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [imgPreview, setImgPreview] = useState<string | null>(null);
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
        console.log("isAdmin:", res.data.isAdmin);
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
    if (selectedCategory === 'מזון ושתייה' && !data.expirationDate) {
      trigger('expirationDate');
      return;
    }

    const userId = localStorage.getItem('userID');
      if (!userId) {
        alert('User not logged in');
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
        donor: userId,
        approvedByAdmin: true,
        status: 'הגיע לעמותה',
        category: data.category === 'אחר' ? data.customCategory : data.category,
      };
      console.log('Submitting product data:', productData); // Log data to verify
      await uploadProduct(productData);
      alert('התרומה נוספה בהצלחה');
      navigate('/adminDashboard'); // Adjust this route as needed
    } catch (error) {
      console.error('Error uploading product:', error);
      alert(
        `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`
      );
    }
  };

  if (!isAdmin) {
    return (
      <div className="error-container">
        <div className="error-title">הוספת תרומה חדשה - עמותת ואהבתם ביחד</div>
        <div className="error-message">גישה למנהלים בלבד</div>
      </div>
    );
  }

  return (
    <div className="new-live-donation-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2 className="new-live-donation-title">♥עמותת ואהבתם ביחד - הוספת תרומה חדשה♥</h2>
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%', maxWidth: '800px', direction: 'rtl' }}>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          {/* Existing input fields */}
          <div className="form-group">
            <input
              {...register('itemName')}
              type="text"
              placeholder="שם הפריט"
              className={`form-control ${errors.itemName ? 'is-invalid' : ''}`}
            />
            {errors.itemName && (
              <div className="invalid-feedback">{errors.itemName.message}</div>
            )}
          </div>

          <div className="form-group">
            <input
              {...register('quantity', { valueAsNumber: true })}
              type="number"
              placeholder="כמות"
              className={`form-control ${errors.quantity ? 'is-invalid' : ''}`}
            />
            {errors.quantity && (
              <div className="invalid-feedback">{errors.quantity.message}</div>
            )}
          </div>

          <div className="form-group">
            <select
              {...register('category')}
              className={`form-control ${errors.category ? 'is-invalid' : ''}`}
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
              <option value="אחר">אחר</option>
            </select>
            {errors.category && (
              <div className="invalid-feedback">{errors.category.message}</div>
            )}
          </div>

          {selectedCategory === 'אחר' && (
            <div className="form-group">
              <input
                {...register('customCategory')}
                type="text"
                placeholder="קטגוריה מותאמת אישית"
                className={`form-control ${errors.customCategory ? 'is-invalid' : ''}`}
              />
              {errors.customCategory && (
                <div className="invalid-feedback">{errors.customCategory.message}</div>
              )}
            </div>
          )}

          <div className="form-group">
            <input
              {...register('condition')}
              type="text"
              placeholder="מצב הפריט"
              className={`form-control ${errors.condition ? 'is-invalid' : ''}`}
            />
            {errors.condition && (
              <div className="invalid-feedback">{errors.condition.message}</div>
            )}
          </div>

          {selectedCategory === 'מזון ושתייה' && (
            <div className="form-group">
              <input
                {...register('expirationDate')}
                type="date"
                placeholder="תאריך תפוגה"
                className={`form-control ${errors.expirationDate ? 'is-invalid' : ''}`}
              />
              {errors.expirationDate && (
                <div className="invalid-feedback">{errors.expirationDate.message}</div>
              )}
            </div>
          )}

          <div className="form-group">
            <textarea
              {...register('description')}
              placeholder="תיאור"
              rows={4}
              className={`form-control ${errors.description ? 'is-invalid' : ''}`}
            />
            {errors.description && (
              <div className="invalid-feedback">{errors.description.message}</div>
            )}
          </div>

          <div className="form-group">
            <input
              {...register('donorName')}
              type="text"
              placeholder="שם התורם"
              className={`form-control ${errors.donorName ? 'is-invalid' : ''}`}
            />
            {errors.donorName && (
              <div className="invalid-feedback">{errors.donorName.message}</div>
            )}
          </div>

          <div className="form-group">
            <input
              {...register('donorPhone')}
              type="text"
              placeholder="טלפון התורם"
              className={`form-control ${errors.donorPhone ? 'is-invalid' : ''}`}
            />
            {errors.donorPhone && (
              <div className="invalid-feedback">{errors.donorPhone.message}</div>
            )}
          </div>

          <div className="form-group">
            <button type="button" className="btn btn-secondary" onClick={selectImg}>
              <FontAwesomeIcon icon={faImage} />
              {imgPreview ? 'תמונה נבחרה' : 'בחר תמונה'}
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={imgSelected}
              style={{ display: 'none' }}
            />
          </div>

          {imgPreview && (
            <div className="form-group">
              <img src={imgPreview} alt="תצוגה מקדימה" className="img-preview" />
            </div>
          )}

          <div className="form-group">
            <button type="submit" className="btn btn-primary">שמור תרומה</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewLiveDonation;
