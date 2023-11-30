import React, { useEffect, useState } from 'react'
import axiosClient from '../axios-client';
import { Link } from 'react-router-dom';
import { Markup } from 'interweave';
import { useStateContext } from '../contexts/ContextProvider';

export default function Users() {

  const [users,setUsers]=useState([]);
  const [pages,setPages]=useState([]);
  const [loading,setLoading] = useState(false);
  const {setNotification} = useStateContext();
  useEffect(()=>{
    getUsers();
  },[])

  const onDeleteClick=(user)=>{
    if (!window.confirm("Are you sure yo want to delete this user ?!")) {
      return 
    }
    axiosClient.delete(`/users/${user.id}`).then(()=>{
      setNotification('user was Successfully Deleted')
      getUsers();
    })
   
  }

  const goToPage = ($url)=>{
    const $newUrl = $url.split("?")[1];
    console.log($newUrl);
    axiosClient.get('/users?'+ $newUrl).then(({data})=>{
      console.log(data);
      setLoading(false);
      setUsers(data.data)
      console.log(data.meta.links);
      setPages(data.meta.links)
    }).catch(()=>{
      setLoading(false);
    })
  }

  const getUsers =()=>{
    
    setLoading(true);
    axiosClient.get('/users').then(({data})=>{
      console.log(data);
      setLoading(false);
      setUsers(data.data)
      console.log(data.meta.links);
      setPages(data.meta.links)
    }).catch(()=>{
      setLoading(false);
    })
  }

  return (
    <div>
    <div style={{display: 'flex', justifyContent: "space-between", alignItems: "center"}}>
      <h1>Users</h1>
      <Link className="btn-add" to="/users/new">Add new</Link>
    </div>
    <div className="card animated fadeInDown" >
      <table>
        <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Create Date</th>
          <th>Actions</th>
        </tr>
        </thead>
        {loading &&
          <tbody>
          <tr>
            <td colSpan="5" className="text-center">
              Loading...
            </td>
          </tr>
          </tbody>
        }
        {!loading &&
          <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.created_at}</td>
              <td>
                <Link className="btn-edit" to={'/users/' + u.id}>Edit</Link>
                &nbsp;
                <button className="btn-delete" onClick={ev => onDeleteClick(u)}>Delete</button>
              </td>
            </tr>
          ))}
          </tbody>
        }
      </table>
     
    </div>
    {pages && <div style={{display: 'flex', justifyContent: "center", alignItems: "center"}}>{pages.map((e,i)=>{
        if ( Number(e.label)>0 &&Number(e.label)) {
          
          return(<a className='btn btn-primary' key={i} onClick={()=>goToPage(e.url)}>{e.label}</a>)
        }
        else  {
          return (<a className='btn btn-primary' key={i} onClick={()=>goToPage(e.url)}><Markup content={e.label} /></a>)
        }
        

        
      })}</div>}
  </div>
  )
}
