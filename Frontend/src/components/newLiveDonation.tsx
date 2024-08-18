import { ChangeEvent, useEffect, useState, useRef } from 'react';
import {
  Avatar, Button, CssBaseline, TextField, Box, Typography, Container, createTheme, ThemeProvider, MenuItem, Alert
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { uploadPhoto, uploadProduct } from '../services/uploadProductService';
import dataService from '../services/data-service';

const theme = createTheme();

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

const rightAlignedInputStyle = {
  InputLabelProps: {
    sx: {
      right: 17,
      left: 'auto',
      transformOrigin: 'top right',
      '&.MuiInputLabel-shrink': {
        transform: 'translate(0, -10px) scale(0.75)',
        transformOrigin: 'top right',
      },
      '& .MuiFormLabel-asterisk': {
        display: 'none',
      },
    },
  },
  InputProps: {
    sx: {
      textAlign: 'right',
      direction: 'rtl',
      '& .MuiOutlinedInput-notchedOutline': {
        textAlign: 'right',
      },
    },
  },
};

export default function NewLiveDonation() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [imgPreview, setImgPreview] = useState<string | null>(null);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { register, handleSubmit, control, formState: { errors }, watch, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
    defaultValues: {
      quantity: 1, // Initialize quantity with 1
    },
  });

  useEffect(() => {
    const userId = localStorage.getItem('userID');
    if (userId) {
      dataService.getUser(userId).req.then((res) => {
        setIsAdmin(res.data.isAdmin);
      });
    }
  }, []);

  const selectedCategory = watch('category');

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
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
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            שגיאה: אינך מחובר בתור מנהל
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <CloudUploadIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            הוסף תרומה חדשה
          </Typography>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="itemName"
              label="שם הפריט"
              autoFocus
              {...register('itemName')}
              error={!!errors.itemName}
              helperText={errors.itemName?.message}
              InputLabelProps={rightAlignedInputStyle.InputLabelProps}
              InputProps={rightAlignedInputStyle.InputProps}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="quantity"
              label="כמות"
              type="number"
              {...register('quantity', { valueAsNumber: true })}
              error={!!errors.quantity}
              helperText={errors.quantity?.message}
              InputLabelProps={rightAlignedInputStyle.InputLabelProps}
              InputProps={rightAlignedInputStyle.InputProps}
            />
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  fullWidth
                  label="קטגוריה"
                  error={!!errors.category}
                  helperText={errors.category?.message}
                  InputLabelProps={{
                    sx: {
                      right: 17,
                      left: 'auto',
                      transformOrigin: 'top right',
                      '&.MuiInputLabel-shrink': {
                        transform: 'translate(0, -10px) scale(0.75)',
                        transformOrigin: 'top right',
                      },
                      '& .MuiFormLabel-asterisk': {
                        display: 'none',
                      },
                    },
                  }}
                  InputProps={{
                    sx: {
                      textAlign: 'right',
                      direction: 'rtl',
                      '& .MuiOutlinedInput-notchedOutline': {
                        textAlign: 'right',
                      },
                      '& .MuiSelect-icon': {
                        left: 0, // Move the arrow to the left
                        right: 'auto',
                      },
                    },
                  }}
                  {...field}
                >
                 <MenuItem sx={{ textAlign: 'right', direction: 'rtl' }} value="">בחר קטגוריה</MenuItem>
              <MenuItem sx={{ textAlign: 'right', direction: 'rtl' }} value="ביגוד">ביגוד</MenuItem>
              <MenuItem sx={{ textAlign: 'right', direction: 'rtl' }} value="הנעלה">הנעלה</MenuItem>
              <MenuItem sx={{ textAlign: 'right', direction: 'rtl' }} value="ציוד לתינוקות">ציוד לתינוקות</MenuItem>
              <MenuItem sx={{ textAlign: 'right', direction: 'rtl' }} value="כלי בית">כלי בית</MenuItem>
              <MenuItem sx={{ textAlign: 'right', direction: 'rtl' }} value="ריהוט">ריהוט</MenuItem>
              <MenuItem sx={{ textAlign: 'right', direction: 'rtl' }} value="מזון ושתייה">מזון ושתייה</MenuItem>
              <MenuItem sx={{ textAlign: 'right', direction: 'rtl' }} value="ספרים">ספרים</MenuItem>
              <MenuItem sx={{ textAlign: 'right', direction: 'rtl' }} value="צעצועים">צעצועים</MenuItem>
              <MenuItem sx={{ textAlign: 'right', direction: 'rtl' }} value="אחר">אחר...</MenuItem>
                </TextField>
              )}
            />
            {selectedCategory === 'אחר' && (
              <TextField
                margin="normal"
                fullWidth
                id="customCategory"
                label="קטגוריה מותאמת אישית"
                {...register('customCategory')}
                error={!!errors.customCategory}
                helperText={errors.customCategory?.message}
                InputLabelProps={rightAlignedInputStyle.InputLabelProps}
                InputProps={rightAlignedInputStyle.InputProps}
              />
            )}
            {selectedCategory === 'מזון ושתייה' && (
              <TextField
                margin="normal"
                fullWidth
                id="expirationDate"
                label="תאריך תפוגה"
                type="date"
                {...register('expirationDate')}
                error={!!errors.expirationDate}
                helperText={errors.expirationDate?.message}
                InputLabelProps={{
                  shrink: true,
                  sx: {
                    right: 17,
                    left: 'auto',
                    transformOrigin: 'top right',
                    '&.MuiInputLabel-shrink': {
                      transform: 'translate(0, -10px) scale(0.75)',
                      transformOrigin: 'top right',
                    },
                    '& .MuiFormLabel-asterisk': {
                    display: 'none',
                  },
                  }
                }}
                InputProps={{
                  sx: { 
                    textAlign: 'right', 
                    direction: 'rtl',
                    '& .MuiOutlinedInput-notchedOutline': {
                      textAlign: 'right',
                    },
                  }
                }}
              />
            )}
            <TextField
              margin="normal"
              required
              fullWidth
              id="condition"
              label="מצב הפריט"
              {...register('condition')}
              error={!!errors.condition}
              helperText={errors.condition?.message}
              InputLabelProps={rightAlignedInputStyle.InputLabelProps}
              InputProps={rightAlignedInputStyle.InputProps}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="description"
              label="תיאור"
              multiline
              rows={4}
              {...register('description')}
              error={!!errors.description}
              helperText={errors.description?.message}
              InputLabelProps={rightAlignedInputStyle.InputLabelProps}
              InputProps={rightAlignedInputStyle.InputProps}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="donorName"
              label="שם התורם"
              {...register('donorName')}
              error={!!errors.donorName}
              helperText={errors.donorName?.message}
              InputLabelProps={rightAlignedInputStyle.InputLabelProps}
              InputProps={rightAlignedInputStyle.InputProps}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="donorPhone"
              label="טלפון התורם"
              {...register('donorPhone')}
              error={!!errors.donorPhone}
              helperText={errors.donorPhone?.message}
              InputLabelProps={rightAlignedInputStyle.InputLabelProps}
              InputProps={rightAlignedInputStyle.InputProps}
            />
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handleImageChange}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={selectImg}
            >
              בחר תמונה
            </Button>
            {errors.image && errors.image.message && (
            <Alert severity="error" sx={{ mt: 2 }}>
            {errors.image.message as string} {/* Explicitly cast to string */}
  </Alert>
            )}
            {imgPreview && (
              <Box sx={{ mt: 2 }}>
                <img src={imgPreview} alt="תצוגה מקדימה" style={{ width: '100%', height: 'auto' }} />
              </Box>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
            >
              הוסף תרומה
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}