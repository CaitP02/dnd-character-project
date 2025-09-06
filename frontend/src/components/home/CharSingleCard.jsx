import { Link } from 'react-router-dom';
import { PiBookOpenTextLight } from 'react-icons/pi';
import { BiUserCircle, BiShow } from 'react-icons/bi';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineDelete } from 'react-icons/md';
import { useState } from 'react';
import CharModal from './charModal.jsx';

const CharSingleCard = ({ char }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className='border-2 border-gray-500 rounded-lg px-4 py-2 m-4 relative hover:shadow-xl'>
      <h2 className='absolute top-1 right-2 px-4 py-1 bg-red-300 rounded-lg'>
        {char?.publishedDate || 'No date'}
      </h2> 
      <h4 className='my-2 text-gray-500'>{char?._id}</h4>
      <div className='flex justify-start items-center gap-x-2'>
        <PiBookOpenTextLight className='text-red-300 text-2xl' />
        <h2 className='my-1'>{char?.name}</h2>
      </div>
 <div className='flex justify-start items-center gap-x-2'>
        <BiUserCircle className='text-red-300 text-2xl' />
        <h2 className='my-1'>{char?.raceType}</h2>
      </div>
      <div className='flex justify-start items-center gap-x-2'>
        <BiUserCircle className='text-red-300 text-2xl' />
        <h2 className='my-1'>{char?.classType}</h2>
      </div>
      <div className='flex justify-between items-center gap-x-2 mt-4 p-4'>
        <BiShow
          className='text-3xl text-blue-800 hover:text-black cursor-pointer'
          onClick={() => setShowModal(true)}
        />
        {char.abilityScores && (
  <div className="mt-2 text-sm text-gray-700">
    <div>STR: {char.abilityScores.strength} | DEX: {char.abilityScores.dexterity} | CON: {char.abilityScores.constitution}</div>
    <div>INT: {char.abilityScores.intelligence} | WIS: {char.abilityScores.wisdom} | CHA: {char.abilityScores.charisma}</div>
  </div>
)}
        <Link to={`/characters/details/${char?._id}`}>
          <BsInfoCircle className='text-2xl text-green-800 hover:text-black' />
        </Link>
        <Link to={`/characters/${char?._id}/edit`}>
          <AiOutlineEdit className='text-2xl text-yellow-600 hover:text-black' />
        </Link>
        <Link to={`/characters/delete/${char?._id}`}>
          <MdOutlineDelete className='text-2xl text-red-600 hover:text-black' />
        </Link>
      </div>
      {showModal && char && (
        <CharModal char={char} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default CharSingleCard;