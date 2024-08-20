import { ChangeEvent, useEffect, useState, useRef } from 'react';
import {useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Avatar, Button, CssBaseline, TextField, Grid, Box, Typography, Container, createTheme, ThemeProvider, MenuItem, Alert
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import dataService from '../services/data-service.ts';
import requestedProduectService from '../services/upload-requested-product-service';
import './upload-requested-product.css';

const theme = createTheme();

const RequestedProductSchema = z.object({
  category: z.string().min(1, { message: 'חובה להכניס קטגוריה' }),
  itemName: z.string().min(1, { message: 'חובה להכניס שם מוצר' }),
  amount: z.string().min(1, { message: 'חובה להכניס כמות' }).transform(parseFloat),
  itemCondition: z.string().min(1, { message: 'חובה להכניס מצב מוצר' }),
  description: z.string().min(1, { message: 'חובה להכניס תיאור מוצר' }),
  image: z.string().url({ message: 'חובה לצרף תמונה' }),
  customCategory: z.string().min(1, { message: 'חובה להכניס קטגוריה' }).optional()
});

type FormData = z.infer<typeof RequestedProductSchema>;

function UploadRequestedProduct() {
  const { register, clearErrors, handleSubmit, formState: { errors }, setValue, trigger } = useForm<FormData>({
    resolver: zodResolver(RequestedProductSchema)
  });
  const navigate = useNavigate();
  const [imgSrc, setImgSrc] = useState<File>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [category, setCategory] = useState('');
  const [amountError, setAmountError] = useState('');

  useEffect(() => {
    if (imgSrc) {
      setValue("image", URL.createObjectURL(imgSrc));
      console.log("imgSrc:", imgSrc);
    }
  }, [imgSrc, setValue]);

  const imgSelected = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImgSrc(e.target.files[0]);
      setValue("image", URL.createObjectURL(e.target.files[0]));
      //clearErrors("image");
      //setValue("image", URL.createObjectURL(e.target.files[0]));

      trigger("image");
    }
  };

  const selectImg = () => {
    fileInputRef.current?.click();
    // setErrorImg(false);
  };

  const addNewProduct = async (data: FormData) => {
    if (data.amount < 1) {
      setAmountError('כמות חייבת להיות גדולה מ-0');
      return;
    } else {
      setAmountError('');
    }


    const url = await requestedProduectService.uploadPhoto(imgSrc!);
    const product = {
      ...data,
      image: url
    };
    const res = await requestedProduectService.addRequestedProduct(product);
    console.log(res);
    navigate('/mainPage');
  };

  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    const userId = localStorage.getItem('userID');
    if (userId) {
      dataService.getUser(userId).req.then((res) => {
        setIsAdmin(res.data.isAdmin);
        console.log("isAdmin:", res.data.isAdmin);
      });
    }
  }, []);

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
            textAlign: 'center'
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
            marginBottom: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <CloudUploadIcon />
          </Avatar>
          <Typography component="h1" variant="h5" className= "form-title">
            העלאת מוצר המבוקש לתרומה
          </Typography>
          <Box component="form" onSubmit={handleSubmit(addNewProduct)} noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  {...register("itemName")}
                  variant="outlined"
                  required
                  fullWidth
                  id="itemName"
                  label="שם המוצר"
                  autoFocus
                  error={!!errors.itemName}
                  helperText={errors.itemName?.message}
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
                      '& .MuiFormHelperText-root': {
        textAlign: 'right', // Align error messages to the right
        direction: 'rtl', // Ensure text direction is RTL
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
                  {...register("category")}
                  select
                  variant="outlined"
                  required
                  fullWidth
                  id="category"
                  label="קטגוריה"
                  onChange={(e) => {
                    setCategory(e.target.value);
                    clearErrors("category");
                  }}
                  error={!!errors.category}
                  helperText={errors.category?.message}
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
                      '& .MuiSelect-icon': {
                        left: 0, // Move the arrow to the left
                        right: 'auto',
                      },
                      '& .MuiInputBase-input': {
                        paddingRight: 4, // Adjust padding to make space for the arrow
                      }
                    }
                  }}
                >
                <MenuItem sx={{ textAlign: 'right', direction: 'rtl' }} value="">בחר קטגוריה</MenuItem>
              <MenuItem sx={{ textAlign: 'right', direction: 'rtl' }} value="ציוד לתינוקות">ציוד לתינוקות</MenuItem>
              <MenuItem sx={{ textAlign: 'right', direction: 'rtl' }} value="ריהוט">ריהוט</MenuItem>
              <MenuItem sx={{ textAlign: 'right', direction: 'rtl' }} value="מזון ושתייה">מזון ושתייה</MenuItem>
              <MenuItem sx={{ textAlign: 'right', direction: 'rtl' }} value="ספרים">ספרים</MenuItem>
              <MenuItem sx={{ textAlign: 'right', direction: 'rtl' }} value="צעצועים">צעצועים</MenuItem>
              <MenuItem sx={{ textAlign: 'right', direction: 'rtl' }} value="אחר">אחר</MenuItem>
                </TextField>
                {category === "אחר" && (
                  <TextField
                    {...register("customCategory")}
                    variant="outlined"
                    fullWidth
                    label="הזן קטגוריה"
                    error={!!errors.customCategory}
                    helperText={errors.customCategory?.message}
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
                          textAlign: 'right', // Align error messages to the right
                          direction: 'rtl', // Ensure text direction is RTL
                        },
                      }
                    }}
                    InputProps={{
                      sx: {
                        textAlign: 'right',
                        direction: 'rtl',
                        '& .MuiOutlinedInput-notchedOutline': {
                          textAlign: 'right', // Align error messages to the right
                          direction: 'rtl', // Ensure text direction is RTL
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
                  required
                  fullWidth
                  id="amount"
                  label="כמות"
                  error={!!errors.amount || !!amountError}
                  helperText={errors.amount?.message || amountError}
                  type="number"
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
                  {...register("itemCondition")}
                  variant="outlined"
                  required
                  fullWidth
                  id="itemCondition"
                  label="מצב המוצר"
                  error={!!errors.itemCondition}
                  helperText={errors.itemCondition?.message}
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
                  required
                  fullWidth
                  id="description"
                  label="תיאור"
                  error={!!errors.description}
                  helperText={errors.description?.message}
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
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  startIcon={<CloudUploadIcon />}
                  onClick={selectImg}
                >
                  בחר תמונה
                </Button>
                {errors.image && (
                  <Alert severity="error" sx={{ mt: 2 , direction: "rtl"}}>
                   יש להעלות תמונה של המוצר המבוקש
                  </Alert>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={imgSelected}
               
                />
                {imgSrc && (
                  <Box
                    component="img"
                    sx={{
                      mt: 2,
                      maxWidth: '100%',
                      height: 'auto',
                      display: 'block',
                      marginLeft: 'auto',
                      marginRight: 'auto',
                      transform: 'translateX(10px)'
                    }}
                    src={URL.createObjectURL(imgSrc)}
                    alt="Preview"
                  />
                )}
              </Grid>
            </Grid>
            <Box sx={{ mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                שלח מוצר
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default UploadRequestedProduct;
