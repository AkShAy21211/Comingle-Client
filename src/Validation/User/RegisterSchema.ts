import * as yup from "yup";

export const signUpScheema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .min(3, "Name must be more than 2 character long"),
  username: yup
    .string()
    .required("Username is required")
    .min(3, "Username must be more than 3 characters long")
    .matches(/^\S*$/, "Username cannot contain spaces"), // No spaces allowed    email:yup.string().required("email is required").email("Invalid email format"),
    email:yup.string().required("email is required").email("Invalid email format"),
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

