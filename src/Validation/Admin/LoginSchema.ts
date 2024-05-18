import * as yup from 'yup';


const signinSchema = yup.object().shape({

    email:yup.string().required("email is required").email("Invalid email format"),
    password:yup.string().required("Password is required").min(5,'Password must be greater 5 character long')
    .matches(/[0-9]/, "Password requires a number")
    .matches(/[a-z]/, "Password requires a lowercase letter")
    .matches(/[A-Z]/, "Password requires an uppercase letter")
    .matches(/[^\w]/, "Password requires a symbol"),
    
});


export default signinSchema