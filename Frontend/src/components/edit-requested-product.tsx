import { ChangeEvent, useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Avatar, Button, CssBaseline, TextField, Grid, Box, Typography, Container, MenuItem, CircularProgress, createTheme, ThemeProvider
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import dataService from '../services/data-service.ts';
import requestedProduectService from '../services/upload-requested-product-service';

// Define schema
const RequestedProductSchema = z.object({
  category: z.string().min(1, { message: 'חובה להכניס קטגוריה' }),
  itemName: z.string().min(1, { message: 'חובה להכניס שם מוצר' }),
  amount: z.string().min(1, { message: 'חובה להכניס כמות' }).transform(parseFloat),
  description: z.string().min(1, { message: 'חובה להכניס תיאור מוצר' }),
  image: z.string().url({ message: 'חובה לצרף תמונה' }).optional(),
  customCategory: z.string().min(1, { message: 'חובה להכניס קטגוריה' }).optional()
});

type FormData = z.infer<typeof RequestedProductSchema>;

// Define the custom theme
const theme = createTheme();

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
      setValue('customCategory', donation.customCategory);
      setValue('category', donation.category);
      setValue('itemName', donation.itemName);
      setValue('amount', donation.amount.toString());
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
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 10,
            marginBottom: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <CloudUploadIcon />
          </Avatar>
          <Typography component="h1" variant="h5" className="form-title">
            עריכת מוצר המבוקש לתרומה
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit(editProduct)}
            noValidate
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  {...register("itemName")}
                  variant="outlined"
                  fullWidth
                  label="שם המוצר"
                  error={Boolean(errors.itemName)}
                  helperText={errors.itemName?.message}
                  FormHelperTextProps={{
                    sx: {
                      marginLeft: '280px', 
                      width: '100%',
                    },
                  }}
                  InputLabelProps={{
                    sx: {
                      right: 19,
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
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  {...register("category")}
                  variant="outlined"
                  fullWidth
                  label="קטגוריה"
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    clearErrors("category");
                  }}
                  error={Boolean(errors.category)}
                  helperText={errors.category?.message}
                  FormHelperTextProps={{
                    sx: {
                      marginLeft: '280px', 
                      width: '100%',
                    },
                  }}
                  InputLabelProps={{
                    sx: {
                      right: 19,
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
                >
                  <MenuItem sx={{ textAlign: 'right', direction: 'rtl' }} value="">בחר קטגוריה</MenuItem>
                  <MenuItem sx={{ textAlign: 'right', direction: 'rtl' }} value="ציוד לתינוקות">ציוד לתינוקות</MenuItem>
                  <MenuItem sx={{ textAlign: 'right', direction: 'rtl' }} value="ריהוט">ריהוט</MenuItem>
                  <MenuItem sx={{ textAlign: 'right', direction: 'rtl' }} value="מזון ושתיה">מזון ושתיה</MenuItem>
                  <MenuItem sx={{ textAlign: 'right', direction: 'rtl' }} value="ספרים">ספרים</MenuItem>
                  <MenuItem sx={{ textAlign: 'right', direction: 'rtl' }} value="צעצועים">צעצועים</MenuItem>
                  <MenuItem sx={{ textAlign: 'right', direction: 'rtl' }} value="אחר">אחר</MenuItem>


                </TextField>
                {category === "אחר" && (
                <TextField
                  variant="outlined"
                  fullWidth
                  label="הזן קטגוריה"
                  {...register("customCategory")}
                  error={!!errors.customCategory}
                    helperText={errors.customCategory?.message}
                    FormHelperTextProps={{
                      sx: {
                        marginLeft: '280px', 
                        width: '100%',
                      },
                    }}
                    sx={{ mt: 2 }}
                    InputLabelProps={{
                      sx: {
                        right: 19,
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
              </Grid>
              <Grid item xs={12}>
                <TextField
                  {...register("amount")}
                  variant="outlined"
                  fullWidth
                  label="כמות"
                  type="number"
                  error={Boolean(errors.amount) || Boolean(amountError)}
                  helperText={errors.amount?.message || amountError}
                  FormHelperTextProps={{
                    sx: {
                      marginLeft: '290px', 
                      width: '100%',
                    },
                  }}
                  InputLabelProps={{
                    sx: {
                      right: 19,
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
              </Grid>
             
              <Grid item xs={12}>
                <TextField
                  {...register("description")}
                  variant="outlined"
                  fullWidth
                  label="תיאור המוצר"
                  multiline
                  rows={4}
                  error={Boolean(errors.description)}
                  helperText={errors.description?.message}
                  FormHelperTextProps={{
                    sx: {
                      marginLeft: '270px', 
                      width: '100%',
                    },
                  }}
                  InputLabelProps={{
                    sx: {
                      right: 19,
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
              </Grid>
              <Grid item xs={12} style={{alignItems:'center'}}>
              {imgSrc && (
  <Avatar
    src={URL.createObjectURL(imgSrc)}
    sx={{ width: 200, height: 200, mb: 2, mx: 'auto' }} // Added mx: 'auto' to center horizontally
  />
)}
{donation.image && !imgSrc && (
  <Avatar
    src={donation.image}
    sx={{ width: 200, height: 200, mb: 2, mx: 'auto' }} // Added mx: 'auto' to center horizontally
  />
)}
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<CloudUploadIcon />}
                  onClick={selectImg}
                  sx={{ mt: 2 }}
                >
                  העלאת תמונה
                </Button>
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={imgSelected}
                />
                {/* {imgSrc && (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: 200,
                      mt: 2,
                    }}
                  >
                    <img
                      src={URL.createObjectURL(imgSrc)}
                      alt="Preview"
                      style={{ maxWidth: '100%', maxHeight: '100%' }}
                    />
                  </Box>
                )} */}
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ mt: 3, mb: 2 }}
                >
                  שמור שינויים
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default EditRequestedProduct;
