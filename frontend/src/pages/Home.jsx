import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';
import CharTable from '../components/home/CharTable';
import CharCard from '../components/home/charCard';
import background from '../assets/images/background.png'
import backgroundHome from '../assets/images/backgroundHome.jpeg'


const Home = () => {
  const [chars, setChars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showType, setShowType] = useState('card');

  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:5555/characters')
      .then((response) => {
        setChars(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

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
         <h1 className='text-center font-serif text-4xl my-8 '>Your Characters</h1>
        <div className='flex justify-between items-center'>
          <Link to='/characters/create'>
            <MdOutlineAddBox className=' bg-white border-2 border-yellow-300 text-black text-6xl' />
          </Link>
        </div>
        {loading ? (
          <Spinner />
        ) : showType === 'table' ? (
          <CharTable chars={chars} />
        ) : (
          <CharCard chars={chars} />
        )}
      </div>
    </div>
);
}

export default Home;