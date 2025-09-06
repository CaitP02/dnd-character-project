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
  if (!char) return null;
  return (
    <div className='border-1 border-yellow-500 px-4 py-2 m-4 outline-solid outline-yellow-500 relative hover:shadow-xl bg-white font-serif'>

      <h2 className='absolute top-1 right-2 px-4 py-1 bg-yellow-300 rounded-lg'>
        {char.level || 'No level'}
      </h2>
      <h4 className='my-2 text-black'>{char.name}</h4>
      <div className='flex justify-start items-center gap-x-2'>
        <PiBookOpenTextLight className='text-red-300 text-2xl' />
        <h2 className='my-1'>{char.raceType}</h2>
      </div>
      <div className='flex justify-start items-center gap-x-2'>
        <BiUserCircle className='text-red-300 text-2xl' />
        <h2 className='my-1'>{char.classType}</h2>
      </div>
      <div className='flex justify-between items-center gap-x-2 mt-4 p-4'>
        <Link to={`/characters/details/${char._id}`}>
          <BsInfoCircle className='text-2xl text-green-800 hover:text-black' />
        </Link>
        <Link to={`/characters/${char._id}/edit`}>
          <AiOutlineEdit className='text-2xl text-yellow-600 hover:text-black' />
        </Link>
        <Link to={`/characters/delete/${char._id}`}>
          <MdOutlineDelete className='text-2xl text-red-600 hover:text-black' />
        </Link>
      </div>
      {showModal && (
        <CharModal char={char} onClose={() => setShowModal(false)} />
      )}
       { char.abilityScores && (
  <div className="mt-2 text-sm text-gray-700 text-right">
    <div>STR: {char.abilityScores.strength} | DEX: {char.abilityScores.dexterity} | CON: {char.abilityScores.constitution}</div>
    <div>INT: {char.abilityScores.intelligence} | WIS: {char.abilityScores.wisdom} | CHA: {char.abilityScores.charisma}</div>
  </div> )}
    </div>
  );
  
};



const CharCard = ({ chars }) => {
  if (!chars || chars.length === 0) return <p>No characters found.</p>;
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {chars.map((char) => (
        <CharSingleCard key={char._id} char={char} />
      ))}
    </div>
  );
};


export default CharCard;