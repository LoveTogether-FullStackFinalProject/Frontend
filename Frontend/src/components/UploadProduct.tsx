import * as React from "react";
//import Avatar from '@mui/material/Avatar';
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import SearchIcon from "@mui/icons-material/Search";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import successGif from "../assets/success.gif";
// import Link from '@mui/material/Link';
//import Grid from '@mui/material/Grid';
import Box from "@mui/material/Box";
//import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import {
  uploadPhoto,
  uploadProduct,
  uploadProductAnonymously,
} from "../services/uploadProductService";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
// import { IconButton, Snackbar } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';
import dataService from "../services/data-service";

const defaultTheme = createTheme();

const schema = z.object({
  itemName: z.string().min(2, "שם הפריט חייב להכיל לפחות 2 תווים"),
  quantity: z.number().gt(0, "כמות הפריט חייבת להיות יותר מ-0"),
  category: z.string().min(1, "יש לבחור קטגוריה"),
  customCategory: z
    .string()
    .min(2, "קטגוריה מותאמת אישית חייבת להכיל לפחות 2 תווים")
    .optional(),
  condition: z.string().min(1, { message: "יש לבחור מצב לפריט" }),
  expirationDate: z
    .string()
    .refine((dateString) => {
      const selectedDate = new Date(dateString);
      const currentDate = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(currentDate.getDate() + 6);
      return selectedDate > currentDate && selectedDate > nextWeek;
    }, "תאריך התפוגה חייב להיות לפחות שבוע מהיום")
    .optional(),
  description: z.string().min(1, "תיאור חייב להיות מוגדר"),
  pickupAddress: z
    .string()
    .min(1, "הכתובת חייבת להכיל לפחות תו אחד")
    .optional(),
  //branch: z.string().optional(),
  image: z.any().refine((file) => file instanceof File, "יש להעלות תמונה"),
  deliveryOption: z.string().min(1, "יש לבחור אפשרות מסירה"),
  phoneNumber: z
    .string()
    .length(10, "מספר הטלפון חייב להכיל 10 ספרות")
    .regex(/^\d+$/, "מספר הטלפון חייב להכיל רק ספרות")
    .refine((phone) => phone.startsWith("0"), "'מספר הטלפון חייב להתחיל ב-'0")
    .optional(), 
});

type FormData = z.infer<typeof schema>;

export default function UploadProduct() {
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false);
  const [imgPreview, setImgPreview] = React.useState<string | null>(null);
  // const [open, setOpen] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  // const [dialogMessage, setDialogMessage] = React.useState<string>('');

  // const handleClick = () => {
  //   setOpen(true);
  // };

  // const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
  //   if (reason === 'clickaway') {
  //     return;
  //   }
  //   setOpen(false);
  //   if(isLoggedIn){
  //     navigate('/profile');
  //   }
  //   else{
  //     navigate('/mainPage');
  //   }
  // };
  //const [pickUpAddress, setPickUpAddress] = React.useState<string>("");
  //const [showError, setShowError] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  console.log("queryParams", queryParams.get("category"));
  console.log("queryParams", queryParams.get("customCategory"));
  const productName = queryParams.get("productName") || "";
  const category = queryParams.get("category") || "";
  const amount = queryParams.get("amount") || "";

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
    mode: "onSubmit",
    defaultValues: {
      itemName: productName,
      category: category,
      quantity: amount ? parseInt(amount, 10) : 1, // Default to 1 if no amount is passed
    },
  });

  const fetchUserData = async () => {
    const userId = localStorage.getItem("userID");
    if (userId) {
      try {
        const { data } = await dataService.getUser(userId).req;
        console.log("data", data);
        //return data;
        setValue("pickupAddress", data.mainAddress);
        setValue("phoneNumber", '0000000000');
        //setValue("phoneNumber", data.phoneNumber);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    } else {
      setValue("pickupAddress", ".");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [setValue]);

  const { request } = location.state || {};
  useEffect(() => {
    console.log("requestedDonation", request);
    if (request) {
      setValue("customCategory", request.customCategory);
      setValue("category", request.category);
      setValue("itemName", request.itemName);
      setValue("quantity", request.amount.toString());
      //setValue('condition', request.itemCondition);
      setValue("description", request.description);
    }
  }, [request, setValue]);

  React.useEffect(() => {
    const checkLoginStatus = () => {
      const accessToken = localStorage.getItem("accessToken");
      setIsLoggedIn(!!accessToken);
    };

    checkLoginStatus();
    window.addEventListener("storage", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  const selectedCategory = watch("category");
  const selectedDeliveryOption = watch("deliveryOption");

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setValue("image", file);
      trigger("image");
      const reader = new FileReader();
      reader.onloadend = () => {
        setImgPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (selectedDeliveryOption != "ממתין לאיסוף") {
      fetchUserData();
    }

    try {
      let imageUrl = "";
      if (data.image) {
        imageUrl = await uploadPhoto(data.image);
      }
      const userId = localStorage.getItem("userID");
      // if (!userId) {
      //   alert('User not logged in');
      //   return;
      // }
      console.log("status:", data.deliveryOption);
      const productData = {
        ...data,
        image: imageUrl,
        donor: userId ? userId : null,
        approvedByAdmin: false,
        status: data.deliveryOption,
        category: data.category === "אחר" ? data.customCategory : data.category,
        donorPhone: data.phoneNumber
      };
      try {
        if (isLoggedIn) {
          await uploadProduct(productData);
          // navigate('/profile');
        } else {
          console.log("Uploading product anonymously...");
          const { req } = await uploadProductAnonymously(productData);
          console.log("Request successful:", req);
          // navigate('/mainPage');
        }
      } catch (error) {
        console.error("Error occurred during upload:", error);
      }

      // setDialogMessage('תודה על התרומה! התרומה שלך תעבור לאישור ותוצג בפרופיל שלך.');
      setDialogOpen(true);
    } catch (error) {
      console.error("Error uploading product:", error);
      // setDialogMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
      setDialogOpen(true);
    }
  };
  const handleDialogClose = () => {
    setDialogOpen(false);
    navigate(isLoggedIn ? "/profile" : "/mainPage");
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
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h3"
            sx={{
              mb: 2,
              fontFamily: "'Assitant' ,sans-serif",
              borderBottom: "3px solid #f9db78",
              //display: 'inline-block'
            }}
          >
            !אני רוצה לתרום
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="itemName"
              label="שם הפריט"
              autoFocus
              {...register("itemName")}
              error={!!errors.itemName}
              helperText={errors.itemName?.message}
              FormHelperTextProps={{
                sx: {
                  marginLeft: "220px",
                  width: "100%",
                  //minWidth: '100px',
                },
              }}
              InputLabelProps={{
                sx: {
                  right: 19,
                  left: "auto",
                  transformOrigin: "top right",
                  "&.MuiInputLabel-shrink": {
                    transform: "translate(0, -10px) scale(0.85)",
                    transformOrigin: "top right",
                  },
                  "& .MuiFormLabel-asterisk": {
                    display: "none",
                  },
                },
              }}
              InputProps={{
                sx: {
                  textAlign: "right",
                  direction: "rtl",
                  "& .MuiOutlinedInput-notchedOutline": {
                    textAlign: "right",
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
              {...register("quantity", { valueAsNumber: true })}
              error={!!errors.quantity}
              helperText={errors.quantity?.message}
              FormHelperTextProps={{
                sx: {
                  marginLeft: "220px",
                  width: "100%",
                },
              }}
              InputLabelProps={{
                sx: {
                  right: 19,
                  left: "auto",
                  transformOrigin: "top right",
                  "&.MuiInputLabel-shrink": {
                    transform: "translate(0, -10px) scale(0.85)",
                    transformOrigin: "top right",
                  },
                  "& .MuiFormLabel-asterisk": {
                    display: "none",
                  },
                },
              }}
              InputProps={{
                sx: {
                  textAlign: "right",
                  direction: "rtl",
                  "& .MuiOutlinedInput-notchedOutline": {
                    textAlign: "right",
                  },
                },
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
                      marginLeft: "310px",
                      width: "100%",
                    },
                  }}
                  InputLabelProps={{
                    sx: {
                      right: 19,
                      left: "auto",
                      transformOrigin: "top right",
                      "&.MuiInputLabel-shrink": {
                        transform: "translate(0, -10px) scale(0.75)",
                        transformOrigin: "top right",
                      },
                      "& .MuiFormLabel-asterisk": {
                        display: "none",
                      },
                    },
                  }}
                  InputProps={{
                    sx: {
                      textAlign: "right",
                      direction: "rtl",
                      "& .MuiOutlinedInput-notchedOutline": {
                        textAlign: "right",
                      },
                      "& .MuiSelect-icon": {
                        left: 0, // Move the arrow to the left
                        right: "auto",
                      },
                      "& .MuiInputBase-input": {
                        paddingRight: 4, // Adjust padding to make space for the arrow
                      },
                    },
                  }}
                  {...field}
                >
                  <MenuItem
                    sx={{ textAlign: "right", direction: "rtl" }}
                    value=""
                  >
                    בחר קטגוריה
                  </MenuItem>
                  <MenuItem
                    sx={{ textAlign: "right", direction: "rtl" }}
                    value="ציוד לתינוקות"
                  >
                    ציוד לתינוקות
                  </MenuItem>
                  <MenuItem
                    sx={{ textAlign: "right", direction: "rtl" }}
                    value="ריהוט"
                  >
                    ריהוט
                  </MenuItem>
                  <MenuItem
                    sx={{ textAlign: "right", direction: "rtl" }}
                    value="מזון ושתייה"
                  >
                    מזון ושתייה
                  </MenuItem>
                  <MenuItem
                    sx={{ textAlign: "right", direction: "rtl" }}
                    value="ספרים"
                  >
                    ספרים
                  </MenuItem>
                  <MenuItem
                    sx={{ textAlign: "right", direction: "rtl" }}
                    value="צעצועים"
                  >
                    צעצועים
                  </MenuItem>
                  <MenuItem
                    sx={{ textAlign: "right", direction: "rtl" }}
                    value="אחר"
                  >
                    אחר
                  </MenuItem>
                </TextField>
              )}
            />
            {selectedCategory === "אחר" && (
              <TextField
                margin="normal"
                required
                fullWidth
                id="customCategory"
                label="קטגוריה מותאמת אישית"
                {...register("customCategory")}
                error={!!errors.customCategory}
                helperText={errors.customCategory?.message}
                FormHelperTextProps={{
                  sx: {
                    marginLeft: "130px",
                    width: "100%",
                  },
                }}
                InputLabelProps={{
                  sx: {
                    right: 19,
                    left: "auto",
                    transformOrigin: "top right",
                    "&.MuiInputLabel-shrink": {
                      transform: "translate(0, -10px) scale(0.85)",
                      transformOrigin: "top right",
                    },
                    "& .MuiFormLabel-asterisk": {
                      display: "none",
                    },
                  },
                }}
                InputProps={{
                  sx: {
                    textAlign: "right",
                    direction: "rtl",
                    "& .MuiOutlinedInput-notchedOutline": {
                      textAlign: "right",
                    },
                  },
                }}
              />
            )}

            {selectedCategory === "מזון ושתייה" && (
              <TextField
                margin="normal"
                required
                fullWidth
                id="expirationDate"
                label="תאריך תפוגה"
                type="date"
                {...register("expirationDate")}
                error={!!errors.expirationDate}
                FormHelperTextProps={{
                  sx: {
                    marginLeft: "180px",
                    width: "100%",
                  },
                }}
                helperText={errors.expirationDate?.message}
                InputLabelProps={{
                  shrink: true,
                  sx: {
                    right: 19,
                    left: "auto",
                    transformOrigin: "top right",
                    "&.MuiInputLabel-shrink": {
                      transform: "translate(0, -10px) scale(0.85)",
                      transformOrigin: "top right",
                    },
                    "& .MuiFormLabel-asterisk": {
                      display: "none",
                    },
                  },
                }}
                InputProps={{
                  sx: {
                    textAlign: "right",
                    direction: "rtl",
                    "& .MuiOutlinedInput-notchedOutline": {
                      textAlign: "right",
                    },
                  },
                }}
                inputProps={{
                  min: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split("T")[0],
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
                      marginLeft: "350px",
                      width: "100%",
                    },
                  }}
                  InputLabelProps={{
                    sx: {
                      right: 19,
                      left: "auto",
                      transformOrigin: "top right",
                      "&.MuiInputLabel-shrink": {
                        transform: "translate(0, -10px) scale(0.85)",
                        transformOrigin: "top right",
                      },
                      "& .MuiFormLabel-asterisk": {
                        display: "none",
                      },
                    },
                  }}
                  InputProps={{
                    sx: {
                      textAlign: "right",
                      direction: "rtl",
                      "& .MuiOutlinedInput-notchedOutline": {
                        textAlign: "right",
                      },
                      "& .MuiSelect-icon": {
                        left: 0, // Move the arrow to the left
                        right: "auto",
                      },
                      "& .MuiInputBase-input": {
                        textAlign: "right",
                        paddingRight: 0,
                        marginRight: 0,
                      },
                    },
                  }}
                >
                  <MenuItem
                    sx={{ textAlign: "right", direction: "rtl" }}
                    value="חדש"
                  >
                    חדש
                  </MenuItem>
                  <MenuItem
                    sx={{ textAlign: "right", direction: "rtl" }}
                    value="משומש במצב טוב"
                  >
                    משומש במצב טוב
                  </MenuItem>
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
              {...register("description")}
              error={!!errors.description}
              helperText={errors.description?.message}
              FormHelperTextProps={{
                sx: {
                  marginLeft: "290px",
                  width: "100%",
                },
              }}
              InputLabelProps={{
                sx: {
                  right: 19,
                  left: "auto",
                  transformOrigin: "top right",
                  "&.MuiInputLabel-shrink": {
                    transform: "translate(0, -10px) scale(0.85)",
                    transformOrigin: "top right",
                  },
                  "& .MuiFormLabel-asterisk": {
                    display: "none",
                  },
                },
              }}
              InputProps={{
                sx: {
                  textAlign: "right",
                  direction: "rtl",
                  "& .MuiOutlinedInput-notchedOutline": {
                    textAlign: "right",
                  },
                },
              }}
            />
            <Typography component="legend" sx={{ textAlign: "right" }}>
              :אפשרות מסירה
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Controller
                name="deliveryOption"
                control={control}
                render={({ field }) => (
                  <RadioGroup {...field} sx={{ textAlign: "right" }}>
                    <Box>
                      <FormControlLabel
                        value="ממתין לאיסוף"
                        control={<Radio />}
                        label="אשמח שיאספו ממני את התרומה"
                        labelPlacement="start"
                      />
                      {selectedDeliveryOption === "ממתין לאיסוף" && (
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          id="pickupAddress"
                          label="כתובת לאיסוף"
                          {...register("pickupAddress")}
                          error={!!errors.pickupAddress}
                          helperText={errors.pickupAddress?.message}
                          FormHelperTextProps={{
                            sx: {
                              marginLeft: "210px",
                              width: "100%",
                            },
                          }}
                          InputLabelProps={{
                            sx: {
                              right: 16,
                              left: "auto",
                              transformOrigin: "top right",
                              "&.MuiInputLabel-shrink": {
                                transform: "translate(0, -10px) scale(0.85)",
                                transformOrigin: "top right",
                              },
                              "& .MuiFormLabel-asterisk": {
                                display: "none",
                              },
                            },
                          }}
                          InputProps={{
                            sx: {
                              textAlign: "right",
                              direction: "rtl",
                              "& .MuiOutlinedInput-notchedOutline": {
                                textAlign: "right",
                              },
                            },
                          }}
                        />
                      )}
                    </Box>
                    <FormControlLabel
                      value="טרם הגיע לעמותה"
                      control={<Radio />}
                      label=" אמסור את התרומה לעמותה בעצמי לכתובת: קיבוץ גלויות 1, אשדוד"
                      labelPlacement="start"
                      sx={{ justifyContent: "flex-end" }}
                    />
                    {selectedDeliveryOption === "טרם הגיע לעמותה" && (
                      <Box sx={{ marginTop: 2, textAlign: "center" }}>
                        <iframe
                          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3353.123891979468!2d34.6526387!3d31.8064274!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1502a31201d2cd61%3A0x80e434de1b2d88f7!2z15HXmdec15DXp9ehINeU15LXnteQ15XXkdeoLCDXldeR16nXldeq15nXldeq15AgMSwg15TXqNeV15XXqiDXqNeo16DXodeV15PXkCA3NzQzMDEy!5e0!3m2!1siw!2sil!4v1693048007753!5m2!1siw!2sil"
                          width="100%"
                          height="200"
                          style={{ border: 0, borderRadius: "10px" }}
                          allowFullScreen
                          loading="lazy"
                        ></iframe>
                      </Box>
                    )}
                  </RadioGroup>
                )}
              />
            </Box>

            {errors.deliveryOption && (
              <Alert severity="error" style={{ direction: "rtl" }}>
                יש לבחור אפשרות מסירה
              </Alert>
            )}

<TextField
                    margin="normal"
                    required
                    fullWidth
                    id="phoneNumber"
                    label="מספר טלפון ליצירת קשר"
                    {...register("phoneNumber")}
                    error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber?.message}
                    FormHelperTextProps={{
                      sx: {
                        marginLeft: "230px",
                        width: "100%",
                      },
                    }}
                    InputLabelProps={{
                      sx: {
                        right: 14,
                        left: "auto",
                        transformOrigin: "top right",
                        "&.MuiInputLabel-shrink": {
                          transform: "translate(0, -10px) scale(0.85)",
                          transformOrigin: "top right",
                        },
                        "& .MuiFormLabel-asterisk": {
                          display: "none",
                        },
                      },
                    }}
                    InputProps={{
                      sx: {
                        textAlign: "right",
                        direction: "rtl",
                        "& .MuiOutlinedInput-notchedOutline": {
                          textAlign: "right",
                        },
                      },
                    }}
                    sx={{
                      display: isLoggedIn ? "none" : "block",
                    }}
                  />


            <Button
              variant="contained"
              component="label"
              fullWidth
              sx={{
                mt: 3,
                mb: 2,
                backgroundColor: "#f9db78",
                color: "#000",
                borderRadius: "25px",
                padding: "10px 20px",
                textTransform: "none",
                fontWeight: "bold",
                fontSize: "1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                "&:hover": {
                  backgroundColor: "#f7d062",
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
              <Alert severity="error" sx={{ mt: 2, direction: "rtl" }}>
                יש להעלות תמונה של המוצר המבוקש
              </Alert>
            )}
            {imgPreview && (
              <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                <img
                  src={imgPreview}
                  alt="תמונה נבחרת"
                  style={{ maxWidth: "100%", maxHeight: "200px" }}
                />
              </Box>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                backgroundColor: "#f9db78",
                color: "#000",
                borderRadius: "30px",
                padding: "12px 24px",
                textTransform: "none",
                fontWeight: "bold",
                fontSize: "1.1rem",
                boxShadow: "0 3px 7px rgba(0, 0, 0, 0.15)",
                "&:hover": {
                  backgroundColor: "#f7d062",
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
            sx={{ direction: "rtl" }} // RTL formatting for Hebrew
          >
            <DialogTitle id="alert-dialog-title" sx={{ textAlign: "center" }}>
              <Typography
                variant="h4"
                component="div"
                sx={{
                  color: "#f9db78", // Matching button color from UploadProduct page
                  fontWeight: "bold",
                  mb: 1,
                }}
              >
                תודה!
              </Typography>
              <Typography
                variant="h6"
                component="div"
                sx={{ color: "#000", mb: 2 }}
              >
                תרומתך התקבלה בהצלחה
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                <img
                  src={successGif}
                  alt="Arrow Down"
                  style={{ width: "50px" }}
                />
              </Box>
              <Typography
                variant="h6"
                sx={{ textAlign: "center", color: "#666", mt: 2 }}
              >
                {isLoggedIn
                  ? "התרומה תעבור לאישור מנהל ותוצג בעמוד החשבון שלך"
                  : "התרומה תעבור לאישור מנהל"}{" "}
              </Typography>
            </DialogContent>
            <DialogActions sx={{ justifyContent: "center", color: "#f9db78" }}>
              <Button
                onClick={handleDialogClose}
                variant="contained"
                color="primary"
                autoFocus
              >
                סגור
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
        {/* <Copyright sx={{ mt: 8, mb: 4 }} /> */}
      </Container>
    </ThemeProvider>
  );
}
