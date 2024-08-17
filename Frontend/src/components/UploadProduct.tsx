// import * as React from 'react';
// import Avatar from '@mui/material/Avatar';
// import Button from '@mui/material/Button';
// import CssBaseline from '@mui/material/CssBaseline';
// import TextField from '@mui/material/TextField';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import RadioGroup from '@mui/material/RadioGroup';
// import Radio from '@mui/material/Radio';
// import Link from '@mui/material/Link';
// //import Grid from '@mui/material/Grid';
// import Box from '@mui/material/Box';
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// import Typography from '@mui/material/Typography';
// import Container from '@mui/material/Container';
// import { createTheme, ThemeProvider } from '@mui/material/styles';
// import { useForm, Controller } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';
// import { useNavigate, useLocation } from 'react-router-dom';
// import {useEffect } from 'react';
// import { uploadPhoto, uploadProduct } from '../services/uploadProductService';
// import MenuItem from '@mui/material/MenuItem';
// import Alert from '@mui/material/Alert';

// function Copyright(props: any) {
//   return (
//     <Typography variant="body2" color="text.secondary" align="center" {...props}>
//       {'Copyright © '}
//       <Link color="inherit" href="https://your-website.com/">
//         Your Website
//       </Link>{' '}
//       {new Date().getFullYear()}
//       {'.'}
//     </Typography>
//   );
// }

// const defaultTheme = createTheme();

// const schema = z.object({
//   itemName: z.string().min(2, 'שם הפריט חייב להכיל לפחות 2 תווים'),
//   quantity: z.number().gt(0, 'כמות הפריט חייבת להיות יותר מ-0'),
//   category: z.string().min(1, 'יש לבחור קטגוריה'),
//   customCategory: z.string().min(2, 'קטגוריה מותאמת אישית חייבת להכיל לפחות 2 תווים').optional(),
//   condition: z.string().min(2, 'מצב הפריט חייב להכיל לפחות 2 תווים'),
//   expirationDate: z.string().refine((dateString) => {
//     const selectedDate = new Date(dateString);
//     const currentDate = new Date();
//     const nextWeek = new Date();
//     nextWeek.setDate(currentDate.getDate() + 7);
//     return selectedDate > currentDate && selectedDate > nextWeek;
//   }, 'תאריך התפוגה חייב להיות לפחות שבוע מהיום.').optional(),
//   description: z.string().min(1, 'תיאור חייב להיות מוגדר'),
//   pickupAddress: z.string().optional(),
//    branch: z.string().optional(),
//   image: z.any().refine((file) => file instanceof File, 'יש להעלות תמונה'),
//   deliveryOption: z.string().min(1, 'יש לבחור אפשרות מסירה'),
// });

// type FormData = z.infer<typeof schema>;

// export default function UploadProduct() {
//   const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false);
//   const [imgPreview, setImgPreview] = React.useState<string | null>(null);
//   //const [showError, setShowError] = React.useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const productName = queryParams.get('productName') || '';
//   const category = queryParams.get('category') || '';
//   const quantity = parseInt(queryParams.get('quantity') || '', 10);
//   const description = queryParams.get('description') || '';
//   const itemCondition = queryParams.get('itemCondition') || '';
//   const customCategory = queryParams.get('customCategory') || '';


//   const {
//     register,
//     handleSubmit,
//     control,
//     formState: { errors },
//     watch,
//     setValue,
//   } = useForm<FormData>({
//     resolver: zodResolver(schema),
//     mode: 'onSubmit',
//     defaultValues: {
//       itemName: productName,
//       category: category,
//       quantity: quantity,
//       description: description,
//       condition: itemCondition,
//       customCategory: customCategory,
//     },
//   });

//   const { request } = location.state || {};
//   useEffect(() => {
//     console.log("requestedDonation", request);
//     if (request) {
//       setValue('customCategory', request.customCategory);
//       setValue('category', request.category);
//       setValue('itemName', request.itemName);
//       setValue('quantity', request.amount.toString());
//       setValue('condition', request.itemCondition);
//       setValue('description', request.description);
//     }
//   }, [request, setValue]);


//   React.useEffect(() => {
//     const checkLoginStatus = () => {
//       const accessToken = localStorage.getItem('accessToken');
//       setIsLoggedIn(!!accessToken);
//     };

//     checkLoginStatus();
//     window.addEventListener('storage', checkLoginStatus);

//     return () => {
//       window.removeEventListener('storage', checkLoginStatus);
//     };
//   }, []);

//   const selectedCategory = watch('category');
//   const selectedDeliveryOption = watch('deliveryOption');

//   const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files && event.target.files.length > 0) {
//       const file = event.target.files[0];
//       setValue('image', file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImgPreview(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const onSubmit = async (data: FormData) => {
//     console.log('onSubmit:', data);
//     try {
//       let imageUrl = '';
//       if (data.image) {
//         imageUrl = await uploadPhoto(data.image);
//       }
//       const userId = localStorage.getItem('userID');
//       if (!userId) {
//         alert('User not logged in');
//         return;
//       }
//       console.log('status:', data.deliveryOption);
//       const productData = {
//         ...data,
//         image: imageUrl,
//         donor: userId,
//         approvedByAdmin: false,
//         status: data.deliveryOption,
//         category: data.category === 'אחר' ? data.customCategory : data.category,
//       };
//       await uploadProduct(productData);
//       navigate('/profile');
//     } catch (error) {
//       console.error('Error uploading product:', error);
//       alert(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
//     }
//   };

//   if (!isLoggedIn) {
//     navigate('/login');
//     return null;
//   }

//   return (
//     <ThemeProvider theme={defaultTheme}>
//       <Container component="main" maxWidth="xs">
//         <CssBaseline />
//         <Box
//           sx={{
//             marginTop: 8,
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//           }}
//         >
//           <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
//             <CloudUploadIcon />
//           </Avatar>
//           <Typography component="h1" variant="h5">
//             תרמו כאן
//           </Typography>
//           <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               id="itemName"
//               label="שם הפריט"
//               autoFocus
//               {...register('itemName')}
//               error={!!errors.itemName}
//               helperText={errors.itemName?.message}
//             />
//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               id="quantity"
//               label="כמות"
//               type="number"
//               {...register('quantity', { valueAsNumber: true })}
//               error={!!errors.quantity}
//               helperText={errors.quantity?.message}
//             />
//             <Controller
//               name="category"
//               control={control}
//               render={({ field }) => (
//                 <TextField
//                   select
//                   fullWidth
//                   label="קטגוריה"
//                   error={!!errors.category}
//                   helperText={errors.category?.message}
//                   {...field}
//                 >
//                   <MenuItem value="">בחר קטגוריה</MenuItem>
//                   <MenuItem value="מזון ושתייה">מזון ושתייה</MenuItem>
//                   <MenuItem value="ביגוד והנעלה">ביגוד והנעלה</MenuItem>
//                   <MenuItem value="ריהוט">ריהוט</MenuItem>
//                   <MenuItem value="מכשירי חשמל">מכשירי חשמל</MenuItem>
//                   <MenuItem value="צעצועים">צעצועים</MenuItem>
//                   <MenuItem value="אחר">אחר</MenuItem>
//                 </TextField>
//               )}
//             />
//             {selectedCategory === 'אחר' && (
//               <TextField
//                 margin="normal"
//                 required
//                 fullWidth
//                 id="customCategory"
//                 label="קטגוריה מותאמת אישית"
//                 {...register('customCategory')}
//                 error={!!errors.customCategory}
//                 helperText={errors.customCategory?.message}
//               />
//             )}
//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               id="condition"
//               label="מצב הפריט"
//               {...register('condition')}
//               error={!!errors.condition}
//               helperText={errors.condition?.message}
//             />
//             {selectedCategory === 'מזון ושתייה' && (
//               <TextField
//                 margin="normal"
//                 required
//                 fullWidth
//                 id="expirationDate"
//                 label="תאריך תפוגה"
//                 type="date"
//                 InputLabelProps={{
//                   shrink: true,
//                 }}
//                 {...register('expirationDate')}
//                 error={!!errors.expirationDate}
//                 helperText={errors.expirationDate?.message}
//               />
//             )}
//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               id="description"
//               label="תיאור"
//               multiline
//               rows={4}
//               {...register('description')}
//               error={!!errors.description}
//               helperText={errors.description?.message}
//             />
//             <Typography component="legend">אפשרות מסירה</Typography>
//             <Controller
//               name="deliveryOption"
//               control={control}
//               render={({ field }) => (
//                 <RadioGroup {...field}>
//                   <FormControlLabel value="ממתין לאיסוף" control={<Radio />} label="אשמח שיאספו ממני את התרומה" />
//                   <FormControlLabel value="לא נמסר לעמותה" control={<Radio />} label="אמסור את התרומה לעמותה - כתובת:" />
//                 </RadioGroup>
//               )}
             
//             />
//             {errors.deliveryOption && (
//               <Alert severity="error">{errors.deliveryOption.message}</Alert>
//             )}
//             {selectedDeliveryOption === 'ממתין לאיסוף' && (
//               <TextField
//                 margin="normal"
//                 required
//                 fullWidth
//                 id="pickupAddress"
//                 label="כתובת לאיסוף"
//                 {...register('pickupAddress')}
//                 error={!!errors.pickupAddress}
//                 helperText={errors.pickupAddress?.message}
//               />
//             )}
//             {selectedDeliveryOption === 'לא נמסר לעמותה' && (
//               <Controller
//                 name="branch"
//                 control={control}
//                 render={({ field }) => (
//                   <TextField
//                     select
//                     fullWidth
//                     label="בחר סניף"
//                     error={!!errors.branch}
//                     helperText={errors.branch?.message}
//                     {...field}
//                   >
//                     <MenuItem value="">בחר סניף</MenuItem>
//                     <MenuItem value="סניף 1">סניף 1</MenuItem>
//                     <MenuItem value="סניף 2">סניף 2</MenuItem>
//                     <MenuItem value="סניף 3">סניף 3</MenuItem>
//                   </TextField>
//                 )}
//               />
//             )}
//             <Button
//               variant="contained"
//               component="label"
//               fullWidth
//               sx={{ mt: 3, mb: 2 }}
//             >
//               העלאת תמונה
//               <input
//                 type="file"
//                 hidden
//                 accept="image/*"
//                 onChange={handleImageChange}
//               />
//             </Button>
//             {imgPreview && (
//               <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
//                 <img src={imgPreview} alt="תמונה נבחרת" style={{ maxWidth: '100%', maxHeight: '200px' }} />
//               </Box>
//             )}
//             <Button
//               type="submit"
//               fullWidth
//               variant="contained"
//               sx={{ mt: 3, mb: 2 }}
//             >
//               שלח
//             </Button>
//           </Box>
//         </Box>
//         <Copyright sx={{ mt: 8, mb: 4 }} />
//       </Container>
//     </ThemeProvider>
//   );
// }

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import Link from '@mui/material/Link';
//import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, useLocation } from 'react-router-dom';
import {useEffect } from 'react';
import { uploadPhoto, uploadProduct } from '../services/uploadProductService';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';

// function Copyright(props: any) {
//   return (
//     <Typography variant="body2" color="text.secondary" align="center" {...props}>
//       {'Copyright © '}
//       <Link color="inherit" href="https://your-website.com/">
//         Your Website
//       </Link>{' '}
//       {new Date().getFullYear()}
//       {'.'}
//     </Typography>
//   );
// }

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
  pickupAddress: z.string().min(2, 'הכתובת חייבת להכיל לפחות 2 תווים').optional(),
  //branch: z.string().optional(),
  image: z.any().refine((file) => file instanceof File, 'יש להעלות תמונה'),
  deliveryOption: z.string().min(1, 'יש לבחור אפשרות מסירה'),
});

type FormData = z.infer<typeof schema>;

export default function UploadProduct() {
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false);
  const [imgPreview, setImgPreview] = React.useState<string | null>(null);
  //const [showError, setShowError] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  console.log('queryParams', queryParams.get('category'));
  console.log('queryParams', queryParams.get('customCategory'));
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
    //trigger,
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
      setValue('condition', request.itemCondition);
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
      if (!userId) {
        alert('User not logged in');
        return;
      }
      console.log('status:', data.deliveryOption);
      const productData = {
        ...data,
        image: imageUrl,
        donor: userId,
        approvedByAdmin: false,
        status: data.deliveryOption,
        category: data.category === 'אחר' ? data.customCategory : data.category,
      };
      await uploadProduct(productData);
      navigate('/profile');
    } catch (error) {
      console.error('Error uploading product:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    }
  };

  if (!isLoggedIn) {
    navigate('/login');
    return null;
  }

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
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <CloudUploadIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            תרמו כאן
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
            <TextField
              margin="normal"
              required
              fullWidth
              id="condition"
              label="מצב הפריט"
              {...register('condition')}
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
                }
              }}
            />
            {selectedCategory === 'מזון ושתייה' && (
              <TextField
                margin="normal"
                required
                fullWidth
                id="expirationDate"
                label="תאריך תפוגה"
                type="date"
                // InputLabelProps={{
                //   shrink: true,
                // }}
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
                    label="אמסור את התרומה לעמותה בעצמי"
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
            {/* {selectedDeliveryOption === 'לא נמסר לעמותה' && (
              <Controller
                name="branch"
                control={control}
                render={({ field }) => (
                  <TextField
                    select
                    fullWidth
                    label="בחר סניף"
                    error={!!errors.branch}
                    helperText={errors.branch?.message}
                    {...field}
                  >
                    <MenuItem value="">בחר סניף</MenuItem>
                    <MenuItem value="סניף 1">סניף 1</MenuItem>
                    <MenuItem value="סניף 2">סניף 2</MenuItem>
                    <MenuItem value="סניף 3">סניף 3</MenuItem>
                  </TextField>
                )} */}
              {/* />
            )} */}
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
              sx={{ mt: 3, mb: 2 }}
            >
              שלח
            </Button>
          </Box>
        </Box>
        {/* <Copyright sx={{ mt: 8, mb: 4 }} /> */}
      </Container>
    </ThemeProvider>
  );
}
