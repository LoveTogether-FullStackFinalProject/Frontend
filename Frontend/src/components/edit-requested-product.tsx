import { ChangeEvent, useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Avatar, Button, CssBaseline, TextField, Grid, Box, Typography, Container, MenuItem, Alert, CircularProgress
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import dataService from '../services/data-service.ts';
import requestedProduectService from '../services/upload-requested-product-service';

// Define schema
const RequestedProductSchema = z.object({
  category: z.string().min(1, { message: 'חובה להכניס קטגוריה' }),
  itemName: z.string().min(1, { message: 'חובה להכניס שם מוצר' }),
  amount: z.string().min(1, { message: 'חובה להכניס כמות' }).transform(parseFloat),
  itemCondition: z.string().min(1, { message: 'חובה להכניס מצב מוצר' }),
  description: z.string().min(1, { message: 'חובה להכניס תיאור מוצר' }),
  image: z.string().url({ message: 'חובה לצרף תמונה' }).optional(),
  customCategory: z.string().min(1, { message: 'חובה להכניס קטגוריה' }).optional()
});

type FormData = z.infer<typeof RequestedProductSchema>;

function EditRequestedProduct() {
  const { register, clearErrors, handleSubmit, formState: { errors }, setValue } = useForm<FormData>({
    resolver: zodResolver(RequestedProductSchema)
  });
  const navigate = useNavigate();
  const [imgSrc, setImgSrc] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [category, setCategory] = useState<string>('');
  const [amountError, setAmountError] = useState<string>('');
  const location = useLocation();
  const { donation } = location.state || {};
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const userId = localStorage.getItem('userID');
      if (userId) {
        try {
          const res = await dataService.getUser(userId).req;
          setIsAdmin(res.data.isAdmin);
        } catch (error) {
          console.error('Error checking admin status:', error);
        }
      }
      setLoading(false);
    };

    checkAdminStatus();
  }, []);

  useEffect(() => {
    if (donation) {
      setValue('category', donation.category);
      setValue('itemName', donation.itemName);
      setValue('amount', donation.amount.toString());
      setValue('itemCondition', donation.itemCondition);
      setValue('description', donation.description);
      setValue('image', donation.image);
      setCategory(donation.category);
    }
  }, [donation, setValue]);

  useEffect(() => {
    if (imgSrc) {
      setValue('image', URL.createObjectURL(imgSrc));
    }
  }, [imgSrc, setValue]);

  const imgSelected = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImgSrc(e.target.files[0]);
    }
  };

  const selectImg = () => {
    fileInputRef.current?.click();
  };

  const editProduct = async (data: FormData) => {
    if (data.amount < 1) {
      setAmountError('כמות חייבת להיות גדולה מ-0');
      return;
    } else {
      setAmountError('');
    }

    let url;
    if (imgSrc) {
      url = await requestedProduectService.uploadPhoto(imgSrc);
    } else {
      url = donation.image;
    }

    const product = {
      ...data,
      image: url
    };

    const res = await requestedProduectService.editRequestedProduct(donation._id, product);
    console.log("editRequestedProduct", res);
    navigate('/mainPage');
  };

  if (loading) {
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '50vh',
            mt: 8,
            p: 2,
            border: '1px solid',
            borderColor: 'black',
            bgcolor: 'white'
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!isAdmin) {
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '50vh',
            mt: 8,
            p: 2,
            border: '1px solid',
            borderColor: 'black',
            bgcolor: 'white'
          }}
        >
          <Typography variant="h6" color="textPrimary">
            שגיאה: אינך מחובר בתור מנהל
          </Typography>
          <Button
            variant="contained"
            color="warning"
            onClick={() => navigate('/login')}
            sx={{ mt: 2 }}
          >
            התחבר בתור מנהל
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="sm" sx={{ paddingX: { xs: 1, sm: 2 }, paddingY: { xs: 1, sm: 2 } }}>
      <CssBaseline />
      <Typography variant="h4" align="center" gutterBottom>
        עריכת מוצר המבוקש לתרומה
      </Typography>
      <Box component="form" onSubmit={handleSubmit(editProduct)} sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              {...register("itemName")}
              fullWidth
              label="שם המוצר"
              error={!!errors.itemName}
              helperText={errors.itemName?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              label="קטגוריה"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                clearErrors("category");
              }}
              error={!!errors.category}
              helperText={errors.category?.message}
              {...register("category")}
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
              <MenuItem value="אחר">אחר...</MenuItem>
            </TextField>
            {category === "אחר" && (
              <TextField
                fullWidth
                label="הזן קטגוריה"
                {...register("customCategory")}
                error={!!errors.customCategory}
                helperText={errors.customCategory?.message}
              />
            )}
          </Grid>
          <Grid item xs={12}>
            <TextField
              {...register("amount")}
              fullWidth
              label="כמות"
              type="number"
              error={!!errors.amount || !!amountError}
              helperText={errors.amount?.message || amountError}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              {...register("itemCondition")}
              fullWidth
              label="מצב"
              error={!!errors.itemCondition}
              helperText={errors.itemCondition?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              {...register("description")}
              fullWidth
              label="תיאור המוצר"
              multiline
              rows={4}
              error={!!errors.description}
              helperText={errors.description?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              component="label"
              startIcon={<CloudUploadIcon />}
              fullWidth
            >
              עריכת התמונה
              <input
                type="file"
                hidden
                onChange={(e) => {
                  clearErrors('image');
                  imgSelected(e);
                }}
                ref={fileInputRef}
              />
            </Button>
            {imgSrc && (
              <Box mt={2} display="flex" justifyContent="center">
                <img
                  src={URL.createObjectURL(imgSrc)}
                  alt="Product Preview"
                  style={{ maxWidth: '100%', maxHeight: '200px' }}
                />
              </Box>
            )}
            {errors.image && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {errors.image.message}
              </Alert>
            )}
          </Grid>
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          שמור שינויים
        </Button>
      </Box>
    </Container>
  );
}

export default EditRequestedProduct;