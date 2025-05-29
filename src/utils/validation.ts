import * as yup from 'yup';

const schema = yup.object().shape({
    email: yup
        .string()
        .required('Email is required')
        .email('Invalid email'),
    password: yup
        .string()
        .required('Password is required')
        .min(8, 'Password must contain at least 8 characters'),
});