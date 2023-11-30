import React, { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router'
import { useStateContext } from '../contexts/ContextProvider'
import { Link } from 'react-router-dom';
import axiosClient from '../axios-client';

export default function DefaultLayout() {

    const {user ,token,setUser,setToken,notification} = useStateContext();

    if (!token) {
       return (<Navigate to={'/login'}/>)
    }
    const logOut = (e)=>{
      e.preventDefault();
      axiosClient.post('/logout').then(()=>{
        setUser({});
        setToken(null);
    });
      
    }

    useEffect(()=>{
       axiosClient.get('/user').then(({data})=>{setUser(data)})},[])

  return (
    <div id="defaultLayout">
    <aside>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/users">Users</Link>
    </aside>
    <div className="content">
      <header>
        <div>
          Header
        </div>

        <div>
          {user.name} &nbsp; &nbsp;
          <a onClick={logOut}  className="btn-logout" href="/login">Logout</a>
        </div>
      </header>
      <main>
        <Outlet/>
      </main>
      {notification &&
        <div className="notification">
            {notification}
        </div>
        }
    </div>
  </div>
  )
}
