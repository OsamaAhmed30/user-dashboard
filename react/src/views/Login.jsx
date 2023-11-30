import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom';
import { useStateContext } from '../contexts/ContextProvider';
import axiosClient from '../axios-client';

export default function Login() {

   const {setUser,setToken} = useStateContext();
   const [errors,setErrors] = useState(null)
    const emailRef= useRef();
    const passwordRef= useRef();
   
    

  const onSubmit = (e)=>{
    e.preventDefault();
    const payload = {
      email : emailRef.current.value,
      password : passwordRef.current.value
    } 
    axiosClient.post('/login',payload).then((data)=>{
      setUser(data.data.user);
      setToken(data.data.token);
      
    }).catch(err=>{
      //console.log(err);
      const response = err.response;
      console.log(response.data.message);
      if (response && response.status===422) {
        if (response.data.errors) {
          setErrors(response.data.errors)
        }
        else{
          setErrors({
            email : [response.data.message],
            password : [response.data.message],
          })
        }
      }
})

  }
  return (

        <form onSubmit={onSubmit}>
          <h1 className="title">Login into your account</h1>
         
          <input ref={emailRef}  type="email" placeholder="Email"/>
          {errors &&<div className='alert m-0'>{errors.email[0]}</div>}
          <input ref={passwordRef} type="password" placeholder="Password"/>
          {errors &&<div className='alert m-0'>{errors.password[0]}</div>}
          <button className="btn btn-block">Login</button>
          <p className="message">Not registered? <Link to="/signup">Create an account</Link></p>
          {/* {message &&<div className='alert m-0'>{message}</div>} */}
        </form>
      
  )
}
