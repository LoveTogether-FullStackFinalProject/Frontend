import * as React from 'react';
//import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import SearchIcon from '@mui/icons-material/Search';
// import Link from '@mui/material/Link';
//import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
//import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, useLocation } from 'react-router-dom';
import {useEffect,useState} from 'react';
import { uploadPhoto, uploadProduct, uploadProductAnonymously } from '../services/uploadProductService';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';
import { IconButton, Snackbar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const defaultTheme = createTheme();

const schema = z.object({
  itemName: z.string().min(2, 'שם הפריט חייב להכיל לפחות 2 תווים'),
  quantity: z.number().gt(0, 'כמות הפריט חייבת להיות יותר מ-0'),
  category: z.string().min(1, 'יש לבחור קטגוריה'),
  customCategory: z.string().min(2, 'קטגוריה מותאמת אישית חייבת להכיל לפחות 2 תווים').optional(),
  condition: z.string().min(1, { message: 'יש לבחור קטגוריה' }),
  expirationDate: z.string().refine((dateString) => {
    const selectedDate = new Date(dateString);
    const currentDate = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(currentDate.getDate() + 7);
    return selectedDate > currentDate && selectedDate > nextWeek;
  }, 'תאריך התפוגה חייב להיות לפחות שבוע מהיום').optional(),
  description: z.string().min(1, 'תיאור חייב להיות מוגדר'),
  pickupAddress: z.string().min(2, 'הכתובת חייבת להכיל לפחות 2 תווים').optional(),
  //branch: z.string().optional(),
  image: z.any().refine((file) => file instanceof File, 'יש להעלות תמונה'),
  deliveryOption: z.string().min(1, 'יש לבחור אפשרות מסירה'),
});

type FormData = z.infer<typeof schema>;

export default function UploadProduct() {
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false);
  const [imgPreview, setImgPreview] = React.useState<string | null>(null);
  const [showSnackbarMessage, setSnackbarMessage] = useState(false);
  const [open, setOpen] = React.useState(false);
  const snackbarMessage = "!תרומתך נקלטה במערכת. תודה רבה";

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
    if(isLoggedIn){
      navigate('/profile');
    }
    else{
      navigate('/mainPage');
    }
  };
  //const [pickUpAddress, setPickUpAddress] = React.useState<string>("");
  //const [showError, setShowError] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  console.log('queryParams', queryParams.get('category'));
  console.log('queryParams', queryParams.get('customCategory'));
  const productName = queryParams.get('productName') || '';
  const category = queryParams.get('category') || '';
  const amount = queryParams.get('amount') || '';

  // const fetchUserData = async () => {
  //   const userId = localStorage.getItem('userID');
  //   if (userId) {
  //     try {
  //       const { data } = await dataService.getUser(userId).req;
  //       setPickUpAddress(data.mainAddress);
  //     } catch (error) {
  //       console.error('Error fetching user data:', error);
  //     }
  //   }
  // };
  // fetchUserData();

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
      quantity: amount ? parseInt(amount, 10) : 1, // Default to 1 if no amount is passed

    },
  });

  const { request } = location.state || {};
  useEffect(() => {
    console.log("requestedDonation", request);
    if (request) {
      setValue('customCategory', request.customCategory);
      setValue('category', request.category);
      setValue('itemName', request.itemName);
      setValue('quantity', request.amount.toString());
      //setValue('condition', request.itemCondition);
      setValue('description', request.description);
    }
  }, [request, setValue]);


  React.useEffect(() => {
    const checkLoginStatus = () => {
      const accessToken = localStorage.getItem('accessToken');
      setIsLoggedIn(!!accessToken);
    };

    checkLoginStatus();
    window.addEventListener('storage', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  const selectedCategory = watch('category');
  const selectedDeliveryOption = watch('deliveryOption');


  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

  const onSubmit = async (data: FormData) => {

    try {
      //alert('תודה על התרומה! התרומה שלך תעבור לאישור ותוצג בפרופיל שלך.');

      let imageUrl = '';
      if (data.image) {
        imageUrl = await uploadPhoto(data.image);
      }
      const userId = localStorage.getItem('userID');
      // if (!userId) {
      //   alert('User not logged in');
      //   return;
      // }
      console.log('status:', data.deliveryOption);
      const productData = {
        ...data,
        image: imageUrl,
        donor: userId ? userId : null,
        approvedByAdmin: false,
        status: data.deliveryOption,
        category: data.category === 'אחר' ? data.customCategory : data.category,
      };
      if(isLoggedIn){
        await uploadProduct(productData);
        //navigate('/profile');
      }
      else{
        console.log('uploadProductAnonymously');
        await uploadProductAnonymously(productData);
        //navigate('/mainPage');
      }
      setSnackbarMessage(true);
    } catch (error) {
      console.error('Error uploading product:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    }
  };

  // if (!isLoggedIn) {
  //   navigate('/login');
  //   return null;
  // }

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
        //display: 'inline-block'
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
              FormHelperTextProps={{
                sx: {
                  marginLeft: '220px', 
                  width: '100%',
                  //minWidth: '100px',
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
                }
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
              FormHelperTextProps={{
                sx: {
                  marginLeft: '220px', 
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
                  FormHelperTextProps={{
                    sx: {
                      marginLeft: '310px', 
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
                      '& .MuiSelect-icon': {
                        left: 0, // Move the arrow to the left
                        right: 'auto',
                      },
                      '& .MuiInputBase-input': {
                        paddingRight: 4, // Adjust padding to make space for the arrow
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
                FormHelperTextProps={{
                  sx: {
                    marginLeft: '130px', 
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
                FormHelperTextProps={{
                  sx: {
                    marginLeft: '180px',
                    width: '100%', 
                  },
                }}
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
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Controller
              name="deliveryOption"
              control={control}
              render={({ field }) => (
                <RadioGroup {...field} sx={{ textAlign: 'right'}}>
                <FormControlLabel
                  value="ממתין לאיסוף"
                  control={<Radio />}
                  label="אשמח שיאספו ממני את התרומה"
                  labelPlacement="start"
                />
                <FormControlLabel
                  value="טרם הגיע לעמותה"
                  control={<Radio />}
                  label=" אמסור את התרומה לעמותה בעצמי לכתובת: קיבוץ גלויות 1, אשדוד" 
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
            {selectedDeliveryOption === 'ממתין לאיסוף' && (
              <TextField
                margin="normal"
                required
                fullWidth
                id="pickupAddress"
                label="כתובת לאיסוף"
                {...register('pickupAddress')}
                error={!!errors.pickupAddress}
                helperText={errors.pickupAddress?.message}
                FormHelperTextProps={{
                  sx: {
                    marginLeft: '230px', 
                    width: '100%',
                  },
                }}
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
{errors.image && (
                  <Alert severity="error" sx={{ mt: 2 , direction:"rtl"}}>
                   יש להעלות תמונה של המוצר המבוקש
                  </Alert>
 )}
{imgPreview && (
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <img src={imgPreview} alt="תמונה נבחרת" style={{ maxWidth: '100%', maxHeight: '200px' }} />
              </Box>
)}
<Button
    type="submit"
    fullWidth
    variant="contained"
    onClick={handleClick}
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

{showSnackbarMessage && (
  <Snackbar
    open={open}
    autoHideDuration={null}
    message={
      <Typography
        variant="body1"
        component="span"
        sx={{
          width: {
            xs: '80%', // Width for extra small screens
            sm: '70%', // Width for small screens
            md: '60%', // Width for medium screens
            lg: '50%', // Width for large screens
          },
          mx: 'auto', // Center the message horizontally
          fontWeight: 'bold',
          color: 'white',
        }}
      >
        {snackbarMessage}
      </Typography>
    }
    action={
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
        sx={{
          color: 'white',
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    }
    sx={{
      borderRadius: '4px',
      padding: '5px',
      width: {
        xs: '90%',
        sm: '80%', 
        md: '70%',
        lg: '60%', 
      },
      mx: 'auto',
    }}
  />
)}

          </Box>
        </Box>
        {/* <Copyright sx={{ mt: 8, mb: 4 }} /> */}
      </Container>
    </ThemeProvider>
  );
}
