import React from 'react'
import {Link} from 'react-router-dom';
import{BsArrowLeft} from 'react-icons/bs';

const BackButton = ({destination = '/'}) => {
  return (
    <div className = 'flex'>
      <Link to={destination} className = 'flex items-center'>
        <BsArrowLeft className = 'mr-2' />
        Back
      </Link>
    </div>
  )
}

export default BackButton