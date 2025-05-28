import React from 'react';
import CustomInput from '../../components/CustomInput/CustomInput';

const Login = () => {

  return (
    <>
      <CustomInput placeholder={"תז"} keyboardType={"numeric"} />
      <CustomInput placeholder={"סיסמא"} keyboardType={"default"} />
    </>
  );
};

export default Login;
