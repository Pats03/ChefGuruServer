import React from 'react';
import { Link, useRouteError } from 'react-router-dom';

const Error = () => {
  const error = useRouteError();
  console.log(error);
  
  if(error.status === 404){
    return (
      <div>
        <h3>Oh! Page Not Found</h3>
        <p>How did you land here?</p>
        <Link to='/'>Back to Main</Link>
      </div>)
  }
  return (
      <div>
        <h3>Something Went Wrong</h3>
      </div>
  )
}

export default Error