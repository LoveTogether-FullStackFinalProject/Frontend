import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import successGif from '../assets/success.gif';
import arrowDownGif from '../assets/arrowDown.gif';
arrowDownGif
import * as z from 'zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { uploadPhoto, uploadProduct, uploadProductAnonymously } from '../services/uploadProductService';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';
import SearchIcon from '@mui/icons-material/Search';

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
  pickupAddress: z.string().optional(),
  image: z.any().refine((file) => file instanceof File, 'יש להעלות תמונה'),
  deliveryOption: z.string().min(1, 'יש לבחור אפשרות מסירה'),
});

type FormData = z.infer<typeof schema>;

export default function UploadProduct() {
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false);
  const [imgPreview, setImgPreview] = React.useState<string | null>(null);
  const [pickupAddress, setPickupAddress] = React.useState<string>('');
  const [showPickupAddressInput, setShowPickupAddressInput] = React.useState<boolean>(false);
  const [dialogOpen, setDialogOpen] =React.useState(false);
  const [dialogMessage, setDialogMessage] = React.useState<string>('');

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const productName = queryParams.get('productName') || '';
  const category = queryParams.get('category') || '';
  const amount = queryParams.get('amount') || '';

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
    defaultValues: {
      itemName: productName,
      category: category,
      quantity: amount ? parseInt(amount, 10) : 1,
    },
  });

  const { request } = location.state || {};

  useEffect(() => {
    if (request) {
      setValue('customCategory', request.customCategory);
      setValue('category', request.category);
      setValue('itemName', request.itemName);
      setValue('quantity', request.amount.toString());
      setValue('condition', request.itemCondition);
      setValue('description', request.description);
    }
  }, [request, setValue]);

  useEffect(() => {
    const checkLoginStatus = () => {
      const accessToken = localStorage.getItem('accessToken');
      setIsLoggedIn(!!accessToken);
    };

    const fetchUserAddress = () => {
      const address = localStorage.getItem('userAddress');
      if (address) {
        setPickupAddress(address);
      }
    };

    checkLoginStatus();
    fetchUserAddress();
    window.addEventListener('storage', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  const selectedDeliveryOption = watch('deliveryOption');
  const selectedCategory = watch('category');

  useEffect(() => {
    if (selectedDeliveryOption === 'ממתין לאיסוף') {
      setShowPickupAddressInput(true);
      const address = localStorage.getItem('userAddress') || ''; // Use an empty string as a fallback
      setValue('pickupAddress', address);
      trigger('pickupAddress');
    } else {
      setShowPickupAddressInput(false);
      setValue('pickupAddress', ''); // Reset the pickupAddress when the option is not selected
      trigger('pickupAddress');
    }
  }, [selectedDeliveryOption, setValue, trigger]);
  

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setValue('image', file);
      trigger('image');
      const reader = new FileReader();
      reader.onloadend = () => {
        setImgPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      let imageUrl = '';
      if (data.image) {
        imageUrl = await uploadPhoto(data.image);
      }

      const userId = localStorage.getItem('userID');
      const productData = {
        ...data,
        image: imageUrl,
        donor: userId ? userId : null,
        approvedByAdmin: false,
        status: data.deliveryOption,
        category: data.category === 'אחר' ? data.customCategory : data.category,
      };

      if (isLoggedIn) {
        await uploadProduct(productData);
      } else {
        await uploadProductAnonymously(productData);
      }

      setDialogMessage('תודה על התרומה! התרומה שלך תעבור לאישור ותוצג בפרופיל שלך.');
      setDialogOpen(true);
    } catch (error) {
      console.error('Error uploading product:', error);
      setDialogMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
      setDialogOpen(true);
    }
};

const handleDialogClose = () => {
  setDialogOpen(false);
  navigate(isLoggedIn ? '/profile' : '/mainPage');
};


  return (
    <ThemeProvider theme={defaultTheme}>
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
          <Typography 
            variant="h3" 
            sx={{ 
                mb: 2, 
                fontFamily: 'Assistant', 
                borderBottom: '3px solid #f9db78',  
                display: 'inline-block'
            }}
          >
            !אני רוצה לתרום
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
                },
              }}
              InputProps={{
                sx: { 
                  textAlign: 'right', 
                  direction: 'rtl',
                  '& .MuiOutlinedInput-notchedOutline': {
                    textAlign: 'right',
                  },
                },
              }}
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
                }
              }}
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
                        left: 0,
                        right: 'auto',
                      },
                      '& .MuiInputBase-input': {
                        paddingRight: 4,
                      }
                    }
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
            {selectedDeliveryOption === 'אחר' && (
              <TextField
                margin="normal"
                required
                fullWidth
                id="customCategory"
                label="קטגוריה מותאמת אישית"
                {...register('customCategory')}
                error={!!errors.customCategory}
                helperText={errors.customCategory?.message}
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
                        left: 0,
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
            {selectedCategory === 'מזון ושתייה' && (
              <TextField
                margin="normal"
                required
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
                  }
                }}
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
                }
              }}
            />
            <Typography component="legend" sx={{ textAlign: 'right' }}>
              :אפשרות מסירה
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <Controller
                name="deliveryOption"
                control={control}
                render={({ field }) => (
                  <RadioGroup {...field} sx={{ textAlign: 'right' }}>
                    <FormControlLabel
                      value="ממתין לאיסוף"
                      control={<Radio />}
                      label="אשמח שיאספו ממני את התרומה"
                      labelPlacement="start"
                    />
                    {showPickupAddressInput && (
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="pickupAddress"
                        label="כתובת לאיסוף"
                        value={pickupAddress} // Set the initial value from user's address
                        {...register('pickupAddress')}
                        error={!!errors.pickupAddress}
                        helperText={errors.pickupAddress?.message}
                        InputLabelProps={{
                          sx: {
                            right: 16,
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
                        }}
                        InputProps={{
                          sx: { 
                            textAlign: 'right', 
                            direction: 'rtl',
                            '& .MuiOutlinedInput-notchedOutline': {
                              textAlign: 'right',
                            },
                          },
                        }}
                      />
                    )}
                    <FormControlLabel
                      value="טרם הגיע לעמותה"
                      control={<Radio />}
                      label="אמסור את התרומה לעמותה בעצמי לכתובת: קיבוץ גלויות 1, אשדוד"
                      labelPlacement="start"
                      sx={{ justifyContent: 'flex-end' }}
                    />
                  </RadioGroup>
                )}
              />
            </Box>

            {errors.deliveryOption && (
              <Alert severity="error" style={{direction :"rtl"}}>יש לבחור אפשרות מסירה</Alert>
            )}

            <Button
              variant="contained"
              component="label"
              fullWidth
              sx={{
                mt: 3,
                mb: 2,
                backgroundColor: '#f9db78',
                color: '#000',
                borderRadius: '25px',
                padding: '10px 20px',
                textTransform: 'none',
                fontWeight: 'bold',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                    backgroundColor: '#f7d062',
                },
              }}
            >
              <SearchIcon sx={{ mr: 1 }} />
              העלאת תמונה
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                  mt: 3,
                  mb: 2,
                  backgroundColor: '#f9db78',
                  color: '#000',
                  borderRadius: '30px',
                  padding: '12px 24px',
                  textTransform: 'none',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  boxShadow: '0 3px 7px rgba(0, 0, 0, 0.15)',
                  '&:hover': {
                      backgroundColor: '#f7d062',
                  },
              }}
            >
              שלח
            </Button>
          </Box>
          <Dialog
  open={dialogOpen}
  onClose={handleDialogClose}
  aria-labelledby="alert-dialog-title"
  aria-describedby="alert-dialog-description"
  sx={{ direction: 'rtl' }} // RTL formatting for Hebrew
>
  <DialogTitle id="alert-dialog-title" sx={{ textAlign: 'center' }}>
    <Typography
      variant="h4"
      component="div"
      sx={{
        color: '#f9db78', // Matching button color from UploadProduct page
        fontWeight: 'bold',
        mb: 1,
      }}
    >
      תודה!
    </Typography>
    <Typography variant="h6" component="div" sx={{ color: '#000', mb: 2 }}>
      תרומתך התקבלה בהצלחה
    </Typography>
  </DialogTitle>
  <DialogContent>
    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
      <img src={successGif} alt="Arrow Down" style={{ width: '50px' }} />
    </Box>
    <Typography  variant="h6" sx={{ textAlign: 'center', color: '#666', mt: 2 }}>
      התרומה תעבור לאישור מנהל ותוצג בעמוד החשבון שלך
    </Typography>
  </DialogContent>
  <DialogActions sx={{ justifyContent: 'center', color: '#f9db78' }}>
    <Button onClick={handleDialogClose} variant="contained" color="primary" autoFocus>
      סגור
    </Button>
  </DialogActions>
</Dialog>



        </Box>
      </Container>
    </ThemeProvider>
  );
}
