
import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStateContext } from '../contexts/ContextProvider';
import axiosClient from '../axios-client';

export default function SignUp() {

  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmationRef = useRef();

  const {setUser , setToken} = useStateContext();

  const [errors,setErrors] = useState(null);
  const onSubmit = (e)=>{
    e.preventDefault();
    const payload = {
      name:nameRef.current.value,
      email:emailRef.current.value,
      password:passwordRef.current.value,
      password_confirmation:passwordConfirmationRef.current.value,
    }

    axiosClient.post('signup',payload).then(({data})=>{
      setUser(data.user);
      setToken(data.token);
    }).catch(err=>{
      const response = err.response;
      if (response && response.status===422) {
        setErrors(response.data.errors)
        console.log(errors);
}

    })

  }

  return (
   
      <form onSubmit={onSubmit}>
        <h1 className="title">Signup for Free</h1>
        <input ref={nameRef} type="text" placeholder="Full Name"/>
        {errors &&<div className='alert m-0'>{errors.name[0]}</div>}
        <input ref={emailRef} type="email" placeholder="Email Address"/>
        {errors &&<div className='alert m-0'>{errors.email[0]}</div>}
        <input ref={passwordRef} type="password" placeholder="Password"/>
        {errors &&<div className='alert m-0'>{errors.password[0]}</div>}
        <input ref={passwordConfirmationRef} type="password" placeholder="Repeat Password"/>
        <button className="btn btn-block">Signup</button>
        <p className="message">Already registered? <Link to="/login">Sign In</Link></p>
      </form>
  
  )
}
