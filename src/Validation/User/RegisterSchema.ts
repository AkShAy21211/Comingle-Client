import * as yup from "yup";

export const signUpScheema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .min(3, "Name must be more than 2 characters long")
    .matches(/^[A-Za-z]+$/, "Name must contain only alphabets"), // Only alphabets allowed
  username: yup
    .string()
    .required("Username is required")
    .min(3, "Username must be more than 3 characters long")
    .matches(/^\S*$/, "Username cannot contain spaces") // No spaces allowed
    .matches(/^(?=.*[A-Za-z]{4})(?=.*[A-Za-z])[A-Za-z0-9]+$/, "Username must contain at least 4 alphabetic characters and may include numbers"), // At least 4 alphabetic characters, may include numbers

  email: yup
    .string()
    .required("email is required")
    .email("Invalid email format"),
  password: yup
    .string()
    .required("Password is required")
    .min(5, "Password must be greater 5 character long")
    .matches(/[0-9]/, "Password requires a number")
    .matches(/[a-z]/, "Password requires a lowercase letter")
    .matches(/[A-Z]/, "Password requires an uppercase letter")
    .matches(/[^\w]/, "Password requires a symbol"),
  confirmpassword: yup
    .string()
    .oneOf([yup.ref("password")], "Password should be match")
    .required("Confirm password is required"),
});
export const passwordSchema = yup.object().shape({
  password: yup
    .string()
    .required("Password is required")
    .min(5, "Password must be greater 5 character long")
    .matches(/[0-9]/, "Password requires a number")
    .matches(/[a-z]/, "Password requires a lowercase letter")
    .matches(/[A-Z]/, "Password requires an uppercase letter")
    .matches(/[^\w]/, "Password requires a symbol"),
  confirmpassword: yup
    .string()
    .oneOf([yup.ref("password")], "Password should be match")
    .required("Confirm password is required"),
});
