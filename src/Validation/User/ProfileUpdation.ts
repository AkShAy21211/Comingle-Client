import * as yup from 'yup';

const ProfileUpdation = yup.object().shape({
    name: yup
        .string()
        .required("Name is required")
        .min(3, 'Name must be more than 2 characters long'),
    email: yup
        .string()
        .required("Email is required")
        .email("Invalid email format"),
    bio: yup
        .string()
        .min(0, 'Bio must be more than 2 characters long'),
    age: yup
        .number()
        .required("Age is required")
        .min(0, 'Age must be a positive number'),
    phone: yup
        .string()
        .required("Phone number is required")
        .min(10, 'Phone number must be at least 10 characters long'),
    country: yup
        .string()
        .required("Country is required")
        .min(2, 'Country must be more than 1 character long'),
    gender: yup
        .string()
        .required("Gender is required")
        .oneOf(['male', 'female', 'other'], 'Gender must be either male, female, or other'),
});

export default ProfileUpdation;


