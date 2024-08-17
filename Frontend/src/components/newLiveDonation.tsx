import React, { ChangeEvent, useEffect, useState, useRef } from 'react';
import {
  Avatar, Button, CssBaseline, TextField, Box, Typography, Container, createTheme, ThemeProvider, MenuItem,
  Grid
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
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
      right: 19,
      left: 'auto',
      transformOrigin: 'top right',
      '&.MuiInputLabel-shrink': {
        transform: 'translate(0, -10px) scale(0.85)',
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
      '& .MuiInputBase-input': {
        textAlign: 'right',
        paddingRight: '12px',
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

  const handleSubmitForm = async (data: FormData) => {
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
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <AddCircleOutlineIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            הוספת תרומה חדשה
          </Typography>
          <Box component="form" onSubmit={handleSubmit(handleSubmitForm)} noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
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
                  {...rightAlignedInputStyle}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  {...register('quantity', { valueAsNumber: true })}
                  variant="outlined"
                  required
                  fullWidth
                  id="quantity"
                  label="כמות"
                  type="number"
                  error={!!errors.quantity}
                  helperText={errors.quantity?.message}
                  {...rightAlignedInputStyle}
                />
              </Grid>
              <Grid item xs={12}>
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
                      {...field}
                      {...rightAlignedInputStyle}
                    >
                      <MenuItem value="">בחר קטגוריה</MenuItem>
                      <MenuItem value="ביגוד">ביגוד</MenuItem>
                      <MenuItem value="הנעלה">הנעלה</MenuItem>
                      <MenuItem value="ציוד לתינוקות">ציוד לתינוקות</MenuItem>
                      <MenuItem value="כלי בית">כלי בית</MenuItem>
                      <MenuItem value="אחר">אחר</MenuItem>
                    </TextField>
                  )}
                />
              </Grid>
              {selectedCategory === 'אחר' && (
                <Grid item xs={12}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="customCategory"
                    label="קטגוריה מותאמת אישית"
                    {...register('customCategory')}
                    error={!!errors.customCategory}
                    helperText={errors.customCategory?.message}
                    {...rightAlignedInputStyle}
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="condition"
                  label="מצב הפריט"
                  {...register('condition')}
                  error={!!errors.condition}
                  helperText={errors.condition?.message}
                  {...rightAlignedInputStyle}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="normal"
                  fullWidth
                  id="expirationDate"
                  label="תאריך תפוגה"
                  type="date"
                  InputLabelProps={{ 
                    ...rightAlignedInputStyle.InputLabelProps,
                    shrink: true 
                  }}
                  {...register('expirationDate')}
                  error={!!errors.expirationDate}
                  helperText={errors.expirationDate?.message}
                  InputProps={{
                    ...rightAlignedInputStyle.InputProps,
                    sx: {
                      ...rightAlignedInputStyle.InputProps.sx,
                      '& .MuiInputBase-input': {
                        textAlign: 'right',
                        paddingRight: '12px',
                        direction: 'ltr', // Keep the date format left-to-right
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="normal"
                  fullWidth
                  id="description"
                  label="תיאור"
                  {...register('description')}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  {...rightAlignedInputStyle}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="normal"
                  fullWidth
                  id="donorName"
                  label="שם התורם"
                  {...register('donorName')}
                  error={!!errors.donorName}
                  helperText={errors.donorName?.message}
                  {...rightAlignedInputStyle}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="normal"
                  fullWidth
                  id="donorPhone"
                  label="טלפון התורם"
                  {...register('donorPhone')}
                  error={!!errors.donorPhone}
                  helperText={errors.donorPhone?.message}
                  {...rightAlignedInputStyle}
                />
              </Grid>
              <Grid item xs={12}>
                <input
                  ref={fileInputRef}
                  type="file"
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={selectImg}
                >
                  {imgPreview ? <img src={imgPreview} alt="Preview" style={{ width: '100%' }} /> : 'העלה תמונה'}
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                >
                  הוסף תרומה
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}