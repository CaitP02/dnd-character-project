import React, { useState } from 'react';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import backgroundHome from '../assets/images/backgroundHome.jpeg'

const DeleteCharacter = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const handleDeleteCharacter = () => {
    setLoading(true);
    axios
      .delete(`http://localhost:5555/characters/${id}`)
      .then(() => {
        setLoading(false);
        enqueueSnackbar('Character Deleted successfully', { variant: 'success' });
        navigate('/');
      })
      .catch((error) => {
        setLoading(false);
        // alert('An error happened. Please Chack console');
        enqueueSnackbar('Error', { variant: 'error' });
        console.log(error);
      });
  };
  
  return (
    <div
      style={{
        backgroundImage: `url(${backgroundHome})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh', // or your desired height
      }}
    >
      <div className='p-4'>
        <BackButton />
        <h1 className='text-center text-3xl my-4'>Delete Character</h1>
        {loading ? <Spinner /> : ''}
        <div className=' flex flex-col bg-white items-center border-2 border-yellow-500 rounded-xl w-[600px] p-8 mx-auto'>
          <h3 className='text-2xl'>Are You Sure You want to delete this character?</h3>

        <button
          className='p-4 bg-red-600 text-white m-8 w-full'
          onClick={handleDeleteCharacter}
        >
          Yes, Delete it
        </button>
      </div>
    </div>
    </div>
  )
}

export default DeleteCharacter;