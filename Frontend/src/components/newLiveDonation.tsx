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
import successGif from '../assets/success.gif';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import SearchIcon from '@mui/icons-material/Search';
import { DonorData } from './donorData';

const theme = createTheme();

const schema = z.object({
  itemName: z.string().min(2, 'שם הפריט חייב להכיל לפחות 2 תווים'),
  quantity: z.number().gt(0, 'כמות הפריט חייבת להיות יותר מ-0'),
  category: z.string().min(1, 'יש לבחור קטגוריה'),
  customCategory: z.string().min(2, 'קטגוריה מותאמת אישית חייבת להכיל לפחות 2 תווים').optional(),
  condition: z.string().min(1, { message: 'יש לבחור מצב לפריט' }),
  expirationDate: z.string().refine((dateString) => {
    const selectedDate = new Date(dateString);
    const currentDate = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(currentDate.getDate() + 7);
    return selectedDate > currentDate && selectedDate > nextWeek;
  }, 'תאריך התפוגה חייב להיות לפחות שבוע מהיום').optional(),
  description: z.string().min(1, 'תיאור חייב להיות מוגדר'),
  donorName: z.string().min(2, 'שם התורם חייב להכיל לפחות 2 תווים'),
  donorPhone: z.string()
  .length(10, "מספר הטלפון חייב להכיל 10 ספרות")
  .refine((phone) => phone.startsWith("0"), "'מספר הטלפון חייב להתחיל ב-'0"),
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
  // const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [imgPreview, setImgPreview] = useState<string | null>(null);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { register, handleSubmit, control, formState: { errors }, watch, setValue,trigger } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
    defaultValues: {
      quantity: 1, // Initialize quantity with 1
    },
  });

const [users, setUsers] = useState<DonorData[]>([]);
const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
const [isLoading, setIsLoading] = useState(true);
const [dialogOpen, setDialogOpen] = useState(false);

const fetchData = async () => {
  const userId = localStorage.getItem('userID');
  if (!userId) {
    setIsAdmin(false);
    setIsLoading(false);
    return;
  }

  try {
    const [userRes, usersRes] = await Promise.all([
      dataService.getUser(userId).req,
      dataService.getUsers().req
    ]);
    setIsAdmin(userRes.data.isAdmin);
    setUsers(usersRes.data);
  } catch (error) {
    console.error("Error fetching data:", error);
    setIsAdmin(false);
    //setError("Error fetching data. Please try again.");
  } finally {
    setIsLoading(false);
  }
};

useEffect(() => {
  fetchData();
}, []);

  const selectedCategory = watch('category');

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setValue('image', file);
      trigger("image");
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
    console.log('data:', data);
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
      console.log('productData:', productData);
      alert('התרומה נוספה בהצלחה');
      navigate('/manageDonations');
    } catch (error) {
      console.error('Error uploading product:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    }
  };

  if (isLoading) {
    return <div>טוען...</div>; 
  }
  
  if (isAdmin === false) {
    return (
      <div className="error-container">
        <p>שגיאה: אינך מחובר בתור מנהל</p>
      </div>
    );
  }
  
  if (users.length === 0) {
    return <div>No users found.</div>;
  }
  
if(isAdmin){
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
              FormHelperTextProps={{
                sx: {
                  marginLeft: '210px',
                  width: '100%',
                },
              }}
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
              FormHelperTextProps={{
                sx: {
                  marginLeft: '210px',
                  width: '100%',
                },
              }}
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
                  FormHelperTextProps={{
                    sx: {
                      marginLeft: '340px',
                      width: '100%',
                    },
                  }}
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
              <MenuItem sx={{ textAlign: 'right', direction: 'rtl' }} value="ציוד לתינוקות">ציוד לתינוקות</MenuItem>
              <MenuItem sx={{ textAlign: 'right', direction: 'rtl' }} value="ריהוט">ריהוט</MenuItem>
              <MenuItem sx={{ textAlign: 'right', direction: 'rtl' }} value="מזון ושתייה">מזון ושתייה</MenuItem>
              <MenuItem sx={{ textAlign: 'right', direction: 'rtl' }} value="ספרים">ספרים</MenuItem>
              <MenuItem sx={{ textAlign: 'right', direction: 'rtl' }} value="צעצועים">צעצועים</MenuItem>
              <MenuItem sx={{ textAlign: 'right', direction: 'rtl' }} value="אחר">אחר</MenuItem>
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
                FormHelperTextProps={{
                  sx: {
                    marginLeft: '130px',
                    width: '100%',
                  },
                }}
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
                FormHelperTextProps={{
                  sx: {
                    marginLeft: '160px',
                    width: '100%',
                  },
                }}
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
                    <Controller
          
          name="condition"
          control={control}
          render={({ field }) => (
            <TextField
            margin="normal"
            label="מצב הפריט"
              select
              fullWidth
              {...field}
              error={!!errors.condition}
              helperText={errors.condition?.message}
              FormHelperTextProps={{
                sx: {
                  marginLeft: '350px', 
                  width: '100%',
                },
              }}
              InputLabelProps={{
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
                }
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
                  '& .MuiInputBase-input': {
                  textAlign: 'right', 
                  paddingRight: 0,   
                  marginRight: 0,     
                  },
                }
              }}
            >
              <MenuItem sx={{ textAlign: 'right', direction: 'rtl' }} value="חדש">חדש</MenuItem>
              <MenuItem sx={{ textAlign: 'right', direction: 'rtl' }} value="משומש במצב טוב">משומש במצב טוב</MenuItem>
            </TextField>
          )}
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
              FormHelperTextProps={{
                sx: {
                  marginLeft: '290px',
                  width: '100%',
                },
              }}
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
              FormHelperTextProps={{
                sx: {
                  marginLeft: '210px',
                  width: '100%',
                },
              }}
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
              FormHelperTextProps={{
                sx: {
                  marginLeft: '190px',
                  width: '100%',
                },
              }}
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
            <Alert severity="error" sx={{ mt: 2 ,direction:"rtl"}}>
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

}else{
  return (
    <div className="error-container">
      <p style={{fontFamily: 'Assistant'}}>שגיאה: אינך מחובר בתור מנהל</p>
      {/* <button style={{fontFamily: 'Assistant'}} onClick={() => navigate('/mainPage')} className="error-button">התחבר בתור מנהל</button> */}
    </div>
  );

}
}