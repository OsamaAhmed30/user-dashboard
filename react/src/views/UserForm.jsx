import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router';
import axiosClient from '../axios-client';
import { useStateContext } from '../contexts/ContextProvider';

export default function UserForm() {
    const navigate = useNavigate();
    const [user,setUser]=useState({
        name:'',
        email:'',
        password:'',
        password_confirmation:''
    });
    const [errors,setErrors] = useState(null);
    const [loading,setLoading] = useState(false);
    const { notification,setNotification} = useStateContext();
    const {id} = useParams();
    
    if (id) {
        useEffect(()=>{
        setLoading(true)
      
            axiosClient.get(`/users/${id}`).then(({data})=>{
                setLoading(false);
                setUser(data);
            }).catch(()=>{
                setLoading(false);
  
            })
        }
        ,[])}
    const onSubmit=(e)=>{
        e.preventDefault();        
        if (user.id) {
            axiosClient.put(`/users/${user.id}`,user).then(() => {
                setNotification('User was successfully updated')
                console.log(notification);
                console.log('fff');
                navigate('/users')
              }).catch(err=>{

                const response = err.response;
                if (response && response.status===422) {
                 console.log(response.data.errors);
                 setErrors(response.data.errors)
                console.log(errors);
              }
            })
        }
        else{
        
            axiosClient.post(`/users`,user).then(()=>{
                setNotification('user was Successfully Created');
                navigate("/users");
            }).catch(err=>{

                const response = err.response;
                if (response && response.status===422) {
                 console.log(response.data.errors);
                 setErrors(response.data.errors)
                console.log(errors);
              }
        });
          
        }
        
    }
  return (
    <div>
           {user.id && <h2>Update User: {user.name}</h2>}
            {!user.id && <h2>Create New User</h2>}
            
           
            {!loading&&<form style={{marginTop:'5px'}} onSubmit={onSubmit}>
            <input value={user.name} onChange={ev =>setUser({...user, name: ev.target.value})} placeholder="Name"/>
            {errors &&errors.name ?<div className='alert m-0'>{errors.name[0]}</div>:''}
            <input value={user.email} onChange={ev => setUser({...user, email: ev.target.value})} placeholder="Email"/>
            {errors &&<div className='alert m-0'>{errors.email[0]}</div>}
            <input type="password" onChange={ev => setUser({...user, password: ev.target.value})} placeholder="Password"/>
            <input type="password" onChange={ev => setUser({...user, password_confirmation: ev.target.value})} placeholder="Password Confirmation"/>
            <button className="btn">Save</button>
          </form>}
    </div>
  )
}
