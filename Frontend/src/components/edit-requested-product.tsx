// import  { ChangeEvent, useEffect, useState, useRef } from 'react';
// import { useForm } from 'react-hook-form';
// import { useLocation, useNavigate } from 'react-router-dom';
//  import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faImage } from '@fortawesome/free-solid-svg-icons';
// import  dataService from "../services/data-service.ts";
// import {requestedDonation} from "../services/upload-requested-product-service";
// import  requestedProduectService from "../services/upload-requested-product-service";
//  import './upload-requested-product.css';

// const RequestedProductSchema = z.object({
//   category: z.string().min(1, { message: 'חובה להכניס קטגוריה' }),
//   itemName: z.string().min(1, { message: 'חובה להכניס שם מוצר' }),
//   amount: z.string().min(1, { message: 'חובה להכניס כמות' }).transform(parseFloat),
//   itemCondition: z.string().min(1, { message: 'חובה להכניס מצב מוצר' }),
//   description: z.string().min(1, { message: 'חובה להכניס תיאור מוצר' }),
//   image: z.string().url({ message: 'חובה לצרף תמונה' }).optional(),
//   customCategory: z.string().min(1, { message: 'חובה להכניס קטגוריה' }).optional()
// });
// type FormData = z.infer<typeof RequestedProductSchema>;

// function EditRequestedProduct() {
//   const { register,clearErrors, handleSubmit, formState: { errors }, setValue} = useForm<FormData>({ resolver: zodResolver(RequestedProductSchema) });
//   const navigate = useNavigate();
//   const [imgSrc, setImgSrc] = useState<File>();
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [category, setCategory] = useState('');
//   const [amountError, setamountError] = useState('');
//   //const [errorMessage, setErrorMessage] = useState('');
//   const location = useLocation();
//   const { donation } = location.state || {}; 

//   useEffect(() => {
//     if (donation) {
//       setValue('category', donation.category);
//       setValue('itemName', donation.itemName);
//       setValue('amount', donation.amount.toString());
//       setValue('itemCondition', donation.itemCondition);
//       setValue('description', donation.description);
//       setValue('image', donation.image);
//       setCategory(donation.category);
//     }
//   }, [donation, setValue]);

//   useEffect(() => {
//     if (imgSrc) {
//       setValue("image", URL.createObjectURL(imgSrc));
//     }
//   }, [imgSrc, setValue]);


//   const imgSelected = (e: ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       setImgSrc(e.target.files[0]);
//     }
//   };

//   const selectImg = () => {
//     fileInputRef.current?.click();
//   };

//   console.log(errors);

//   const editProduct = async (data: FormData) => {
//     console.log(errors);
//     if(data.amount < 1){    
//         setamountError('כמות חייבת להיות גדולה מ-0');
//         return;
//     }
//     else{
//         setamountError('');
//     }

//     // if (!imgSrc) {
//     //   alert("Please select an image");
//     //   return;
//     // }
//     let url;
//     if(imgSrc){
//      url = await requestedProduectService.uploadPhoto(imgSrc!);
//     }
//     else{
//      url = donation.image;
//     }
//     const product: requestedDonation = {
//       ...data,
//       image: url
//     };

//     const res=await requestedProduectService.editRequestedProduct(donation._id,product);
//     console.log("editRequestedProduct",res);
//     navigate('/mainPage'); 
//   };

//      const [isAdmin, setIsAdmin] = useState(false);
//      useEffect(() => {
//        const userId = localStorage.getItem('userID');
//        if (userId) {
//          dataService.getUser(userId).req.then((res) => {
//            setIsAdmin(res.data.isAdmin);
//            console.log("isAdmin:", res.data.isAdmin);
//          });
//        }
//      }, []);


//      if (!isAdmin) {
//       return (
//           <div style={{ backgroundColor: 'white', width: '100%', height: '50vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '100px',padding: '20px', border: '1px solid black' }}>
//           <p style={{ color: 'black', fontFamily: 'Assistant' }}>שגיאה: אינך מחובר בתור מנהל</p>
//           <button onClick={() => navigate('/adminDashboard')} style={{ backgroundColor: '#F9DA78', marginTop: '20px', fontFamily: 'Assistant' }}>התחבר בתור מנהל</button>
//         </div>
//       );
//     }

//   return (
//     <>
// <div className="container">
//   <h1 className="form-title">עריכת מוצר המבוקש לתרומה</h1>
//   <div className="form-wrapper">  
//     <form onSubmit={handleSubmit(editProduct)}>
//       <div className="form-group">
//         <div className="input-row">
//           <div className="input-wrapper">
//             <input
//               {...register("itemName")}
//               type="text"
//               className="form-control"
//               id="floatingItemName"
//               placeholder=""
//             />
//             <label htmlFor="floatingItemName" className="floating-label">
//               שם המוצר
//             </label>
//             {errors.itemName && (
//               <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '1px' }}>{errors.itemName.message}</p>
//             )}
//           </div>
//           <div className="input-wrapper">
//             <select
//               {...register("category")}
//               className="form-control"
//               id="floatingCategory"
//               onChange={(e) => {
//                 setCategory(e.target.value);
//                 clearErrors("category"); 
//               }}
//             >
//               <option value="">בחר קטגוריה</option>
//               <option value="ביגוד">ביגוד</option>
//               <option value="הנעלה">הנעלה</option>
//               <option value="ציוד לתינוקות">ציוד לתינוקות</option>
//               <option value="כלי בית">כלי בית</option>
//               <option value="ריהוט">ריהוט</option>
//               <option value="מזון ושתייה">מזון ושתייה</option>
//               <option value="ספרים">ספרים</option>
//               <option value="צעצועים">צעצועים</option>
//               <option value="אחר">אחר...</option>
//             </select>
//             <label htmlFor="floatingCategory" className="floating-label">
//               קטגוריה
//             </label>
//             {category === "אחר" && (
//               <input
//                 type="text"
//                 {...register("category")}
//                 className="form-control"
//                 placeholder="הזן קטגוריה"
//               />
//             )}
//             {errors.category && (
//               <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '1px' }}>{errors.category.message}</p>
//             )}
//           </div>
//         </div>
//         <div className="input-row">
//           <div className="input-wrapper">
//             <input
//               {...register("amount")}
//               type="number"
//               className="form-control"
//               id="floatingAmount"
//               placeholder=""
//               //min="1" 
//             />
//             <label htmlFor="floatingAmount" className="floating-label">
//               כמות
//             </label>
//             {errors.amount && (
//               <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '1px' }}>{errors.amount.message}</p>
//             )}
//             {amountError && (
//               <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '1px' }}>{amountError}</p>
//             )}
//           </div>
//           <div className="input-wrapper">
//             <input
//               {...register("itemCondition")}
//               type="text"
//               className="form-control"
//               id="floatingItemCondition"
//               placeholder=""
//             />
//             <label htmlFor="floatingItemCondition" className="floating-label">
//               מצב
//             </label>
//             {errors.itemCondition && (
//               <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '1px' }}>{errors.itemCondition.message}</p>
//             )}
//           </div>
//         </div>
//         <div className="input-wrapper">
//           <textarea
//             {...register("description")}
//             className="form-control"
//             id="floatingDescription"
//             placeholder=""
//           ></textarea>
//           <label htmlFor="floatingDescription" className="floating-label">
//             תיאור המוצר
//           </label>
//           {errors.description && (
//             <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '1px' }}>{errors.description.message}</p>
//           )}
//         </div>
//       </div>
//       <div className="img-upload-wrapper">
//         {imgSrc && (
//           <img
//             src={URL.createObjectURL(imgSrc)}
//             alt="Product Preview"
//             className="img-thumbnail mb-2"
//           />
//         )}
//             <div className="d-flex justify-content-center">
//             <p className="img-upload-text" style={{ marginLeft: '50px' }}>
//                 תמונת המוצר
//             </p>
//             <img 
//                 src={donation.image} 
//                 alt="Donation" 
//                 className="img-fluid" 
//                 style={{
//                 maxWidth: '200px',
//                 border: '2px solid #ccc', 
//                 borderRadius: '8px',
//                 padding: '5px', 
//                 boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
//                 }} 
//             />
//             </div>
   
//         <button
//           type="button"
//           className="btn btn-upload mt-2"
//           onClick={selectImg}
//         >
//           <FontAwesomeIcon icon={faImage} className="me-2" />
//           עריכת התמונה
//         </button>
//         <input
//           style={{ display: "none" }}
//           {...register("image")}
//           type="file"
//           onChange={(e) => {
//             clearErrors('image');
//             imgSelected(e);
//           }}
//           ref={fileInputRef}
//         />
//         {errors.image && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '1px' }}>יש להעלות תמונה של המוצר</p>}
//       </div>
//       <div className="d-flex justify-content-center">
//         <button type="submit" className="btn btn-submit mt-3">
//           שמור שינויים
//         </button>
//       </div>
//     </form>
//   </div>
// </div>

//     </>

//   );
// }

// export default EditRequestedProduct;


// import { ChangeEvent, useEffect, useState, useRef } from 'react';
// import { useForm } from 'react-hook-form';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import {
//   Avatar, Button, CssBaseline, TextField, Grid, Box, Typography, Container, MenuItem, Alert
// } from '@mui/material';
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// import dataService from '../services/data-service.ts';
// import requestedProduectService from '../services/upload-requested-product-service';

// // Define schema
// const RequestedProductSchema = z.object({
//   category: z.string().min(1, { message: 'חובה להכניס קטגוריה' }),
//   itemName: z.string().min(1, { message: 'חובה להכניס שם מוצר' }),
//   amount: z.string().min(1, { message: 'חובה להכניס כמות' }).transform(parseFloat),
//   itemCondition: z.string().min(1, { message: 'חובה להכניס מצב מוצר' }),
//   description: z.string().min(1, { message: 'חובה להכניס תיאור מוצר' }),
//   image: z.string().url({ message: 'חובה לצרף תמונה' }).optional(),
//   customCategory: z.string().min(1, { message: 'חובה להכניס קטגוריה' }).optional()
// });

// type FormData = z.infer<typeof RequestedProductSchema>;

// function EditRequestedProduct() {
//   const { register, clearErrors, handleSubmit, formState: { errors }, setValue } = useForm<FormData>({
//     resolver: zodResolver(RequestedProductSchema)
//   });
//   const navigate = useNavigate();
//   const [imgSrc, setImgSrc] = useState<File | null>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [category, setCategory] = useState<string>('');
//   const [amountError, setAmountError] = useState<string>('');
//   const location = useLocation();
//   const { donation } = location.state || {};

//   useEffect(() => {
//     if (donation) {
//       setValue('category', donation.category);
//       setValue('itemName', donation.itemName);
//       setValue('amount', donation.amount.toString());
//       setValue('itemCondition', donation.itemCondition);
//       setValue('description', donation.description);
//       setValue('image', donation.image);
//       setCategory(donation.category);
//     }
//   }, [donation, setValue]);

//   useEffect(() => {
//     if (imgSrc) {
//       setValue('image', URL.createObjectURL(imgSrc));
//     }
//   }, [imgSrc, setValue]);

//   const imgSelected = (e: ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       setImgSrc(e.target.files[0]);
//     }
//   };

//   const selectImg = () => {
//     fileInputRef.current?.click();
//   };

//   const editProduct = async (data: FormData) => {
//     if (data.amount < 1) {
//       setAmountError('כמות חייבת להיות גדולה מ-0');
//       return;
//     } else {
//       setAmountError('');
//     }

//     let url;
//     if (imgSrc) {
//       url = await requestedProduectService.uploadPhoto(imgSrc);
//     } else {
//       url = donation.image;
//     }

//     const product = {
//       ...data,
//       image: url
//     };

//     const res = await requestedProduectService.editRequestedProduct(donation._id, product);
//     console.log("editRequestedProduct", res);
//     navigate('/mainPage');
//   };

//   const [isAdmin, setIsAdmin] = useState(false);
//   useEffect(() => {
//     const userId = localStorage.getItem('userID');
//     if (userId) {
//       dataService.getUser(userId).req.then((res) => {
//         setIsAdmin(res.data.isAdmin);
//       });
//     }
//   }, []);

//   if (!isAdmin) {
//     return (
//       <Container component="main" maxWidth="xs">
//         <CssBaseline />
//         <Box
//           sx={{
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             justifyContent: 'center',
//             height: '50vh',
//             mt: 8,
//             p: 2,
//             border: '1px solid',
//             borderColor: 'black',
//             bgcolor: 'white'
//           }}
//         >
//           <Typography variant="h6" color="textPrimary">
//             שגיאה: אינך מחובר בתור מנהל
//           </Typography>
//           {/* <Button
//             variant="contained"
//             color="warning"
//             onClick={() => navigate('/login')}
//             sx={{ mt: 2 }}
//           >
//             התחבר בתור מנהל
//           </Button> */}
//         </Box>
//       </Container>
//     );
//   }

//   return (
//     <Container component="main" maxWidth="sm" sx={{ paddingX: { xs: 1, sm: 2 }, paddingY: { xs: 1, sm: 2 } }}>
//       <CssBaseline />
//       <Typography variant="h4" align="center" gutterBottom>
//         עריכת מוצר המבוקש לתרומה
//       </Typography>
//       <Box
//         component="form"
//         onSubmit={handleSubmit(editProduct)}
//         sx={{
//           mt: 3,
//           p: 3,
//           border: '1px solid',
//           borderColor: 'black',
//           borderRadius: 1,
//           boxShadow: 3
//         }}
//       >
//         <Grid container spacing={2}>
//           <Grid item xs={12}>
//             <TextField
//               {...register("itemName")}
//               variant="outlined"
//               fullWidth
//               label="שם המוצר"
//               error={Boolean(errors.itemName)}
//               helperText={errors.itemName?.message}
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               select
//               {...register("category")}
//               variant="outlined"
//               fullWidth
//               label="קטגוריה"
//               value={category}
//               onChange={(e) => {
//                 setCategory(e.target.value);
//                 clearErrors("category");
//               }}
//               error={Boolean(errors.category)}
//               helperText={errors.category?.message}
//             >
//               <MenuItem value="">בחר קטגוריה</MenuItem>
//               <MenuItem value="ביגוד">ביגוד</MenuItem>
//               <MenuItem value="הנעלה">הנעלה</MenuItem>
//               <MenuItem value="ציוד לתינוקות">ציוד לתינוקות</MenuItem>
//               <MenuItem value="כלי בית">כלי בית</MenuItem>
//               <MenuItem value="ריהוט">ריהוט</MenuItem>
//               <MenuItem value="מזון ושתייה">מזון ושתייה</MenuItem>
//               <MenuItem value="ספרים">ספרים</MenuItem>
//               <MenuItem value="צעצועים">צעצועים</MenuItem>
//               <MenuItem value="אחר">אחר...</MenuItem>
//             </TextField>
//             {category === "אחר" && (
//               <TextField
//                 variant="outlined"
//                 fullWidth
//                 label="הזן קטגוריה"
//                 {...register("customCategory")}
//               />
//             )}
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               {...register("amount")}
//               variant="outlined"
//               type="number"
//               fullWidth
//               label="כמות"
//               error={Boolean(errors.amount) || Boolean(amountError)}
//               helperText={errors.amount?.message || amountError}
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               {...register("itemCondition")}
//               variant="outlined"
//               fullWidth
//               label="מצב"
//               error={Boolean(errors.itemCondition)}
//               helperText={errors.itemCondition?.message}
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               {...register("description")}
//               variant="outlined"
//               fullWidth
//               multiline
//               rows={4}
//               label="תיאור המוצר"
//               error={Boolean(errors.description)}
//               helperText={errors.description?.message}
//             />
//           </Grid>
//         </Grid>
//         <Box mt={3} display="flex" flexDirection="column" alignItems="center">
//           {imgSrc && (
//             <Avatar
//               src={URL.createObjectURL(imgSrc)}
//               sx={{ width: 200, height: 200, mb: 2 }}
//             />
//           )}
//           {donation.image && (
//             <Avatar
//               src={donation.image}
//               sx={{ width: 200, height: 200, mb: 2 }}
//             />
//           )}
//           <Button
//             variant="outlined"
//             startIcon={<CloudUploadIcon />}
//             onClick={selectImg}
//             sx={{ mb: 2 }}
//           >
//             עריכת התמונה
//           </Button>
//           <input
//             type="file"
//             style={{ display: "none" }}
//             {...register("image")}
//             onChange={imgSelected}
//             ref={fileInputRef}
//           />
//           {errors.image && <Alert severity="error">{errors.image.message}</Alert>}
//         </Box>
//         <Box mt={3} display="flex" justifyContent="center">
//           <Button
//             type="submit"
//             variant="contained"
//             color="primary"
//           >
//             שמור שינויים
//           </Button>
//         </Box>
//       </Box>
//     </Container>
//   );
// }


// export default EditRequestedProduct;



import { ChangeEvent, useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Avatar, Button, CssBaseline, TextField, Grid, Box, Typography, Container, MenuItem, Alert, createTheme, ThemeProvider
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
 //const [customCategory, setCustomCategory] = useState<string>('');
  const [amountError, setAmountError] = useState<string>('');
  const location = useLocation();
  const { donation } = location.state || {};

  useEffect(() => {
    console.log("donation", donation);
    if (donation) {
      setValue('customCategory', donation.customCategory);
      setValue('category', donation.category);
      setValue('itemName', donation.itemName);
      setValue('amount', donation.amount.toString());
      setValue('itemCondition', donation.itemCondition);
      setValue('description', donation.description);
      setValue('image', donation.image);
      setCategory(donation.category);
      //setCustomCategory(donation.customCategory);
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

  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    const userId = localStorage.getItem('userID');
    if (userId) {
      dataService.getUser(userId).req.then((res) => {
        setIsAdmin(res.data.isAdmin);
      });
    }
  }, []);

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
          {/* <Button
            variant="contained"
            color="warning"
            onClick={() => navigate('/login')}
            sx={{ mt: 2 }}
          >
            התחבר בתור מנהל
          </Button> */}
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
            <CloudUploadIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
          עריכת מוצר המבוקש לתרומה
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(editProduct)}
          noValidate sx={{ mt: 3 }}
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
              {category === "אחר" && (
                <TextField
                  variant="outlined"
                  fullWidth
                  label="הזן קטגוריה"
                  {...register("customCategory")}
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
                type="number"
                fullWidth
                label="כמות"
                error={Boolean(errors.amount) || Boolean(amountError)}
                helperText={errors.amount?.message || amountError}
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
                fullWidth
                label="מצב"
                error={Boolean(errors.itemCondition)}
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
                fullWidth
                multiline
                rows={4}
                label="תיאור המוצר"
                error={Boolean(errors.description)}
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
          </Grid>
          <Box mt={3} display="flex" flexDirection="column" alignItems="center">
            {imgSrc && (
              <Avatar
                src={URL.createObjectURL(imgSrc)}
                sx={{ width: 200, height: 200, mb: 2 }}
              />
            )}
            {donation.image && !imgSrc && (
              <Avatar
                src={donation.image}
                sx={{ width: 200, height: 200, mb: 2 }}
              />
            )}
            <Button
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              onClick={selectImg}
              sx={{ mb: 2 }}
            >
              עריכת התמונה
            </Button>
            <input
              type="file"
              style={{ display: "none" }}
              {...register("image")}
              onChange={imgSelected}
              ref={fileInputRef}
            />
            {errors.image && <Alert severity="error">{errors.image.message}</Alert>}
          </Box>
          <Box mt={3} display="flex" justifyContent="center">
            <Button
              type="submit"
              variant="contained"
              color="primary"
            >
              שמור שינויים
            </Button>
          </Box>
        </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default EditRequestedProduct;
