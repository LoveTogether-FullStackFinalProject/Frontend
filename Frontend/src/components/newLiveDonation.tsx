import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { uploadPhoto, uploadProduct } from '../services/uploadProductService';
import dataService from '../services/data-service';
import MenuItem from '@mui/material/MenuItem';

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://your-website.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme();

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

export default function NewLiveDonation() {
  const [isAdmin, setIsAdmin] = React.useState<boolean>(false);
  const [imgPreview, setImgPreview] = React.useState<string | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
  });

  React.useEffect(() => {
    const userId = localStorage.getItem('userID');
    if (userId) {
      dataService.getUser(userId).req.then((res) => {
        setIsAdmin(res.data.isAdmin);
      });
    }
  }, []);

  const selectedCategory = watch('category');

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
          {/* <Button
            onClick={() => navigate('/adminDashboard')}
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            התחבר בתור מנהל
          </Button> */}
        </Box>
      </Container>
    );
  }

  return (
    <ThemeProvider theme={defaultTheme}>
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
          <Box component="form" onSubmit={handleSubmit(handleSubmitForm)} noValidate sx={{ mt: 1 }}>
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
                  {...field}
                >
                  <MenuItem value="">בחר קטגוריה</MenuItem>
                  <MenuItem value="ביגוד">ביגוד</MenuItem>
                  <MenuItem value="הנעלה">הנעלה</MenuItem>
                  <MenuItem value="ציוד לתינוקות">ציוד לתינוקות</MenuItem>
                  <MenuItem value="כלי בית">כלי בית</MenuItem>
                  <MenuItem value="ריהוט">ריהוט</MenuItem>
                  <MenuItem value="מזון ושתייה">מזון ושתייה</MenuItem>
                  <MenuItem value="ספרים">ספרים</MenuItem>
                  <MenuItem value="צעצועים">צעצועים</MenuItem>
                  <MenuItem value="אחר">אחר</MenuItem>
                </TextField>
              )}
            />
            {selectedCategory === 'אחר' && (
              <TextField
                margin="normal"
                required
                fullWidth
                id="customCategory"
                label="קטגוריה מותאמת אישית"
                {...register('customCategory')}
                error={!!errors.customCategory}
                helperText={errors.customCategory?.message}
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
            />
            {selectedCategory === 'מזון ושתייה' && (
              <TextField
                margin="normal"
                required
                fullWidth
                id="expirationDate"
                label="תאריך תפוגה"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                {...register('expirationDate')}
                error={!!errors.expirationDate}
                helperText={errors.expirationDate?.message}
              />
            )}
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
            />
            <Button
              variant="contained"
              component="label"
              fullWidth
              sx={{ mt: 3, mb: 2 }}
            >
              העלאת תמונה
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>
            {imgPreview && (
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <img src={imgPreview} alt="תמונה נבחרת" style={{ maxWidth: '100%', maxHeight: '200px' }} />
              </Box>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              שמור תרומה
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}