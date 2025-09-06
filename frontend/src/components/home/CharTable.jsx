import React from 'react'
import {Link} from 'react-router-dom';
import {AiOutlineEdit} from 'react-icons/ai';
import {BsInfoCircle} from 'react-icons/bs';
import {MdOutlineAddBox} from 'react-icons/md';

const CharTable = ({ chars }) => {
  return (
     <table className= ' font-serif w-full border-separate border-spacing-2'>
          <thead>
            <tr>
              <th className='border px-4 py-2 bg-white'>No</th>
              <th className='border px-4 py-2 bg-white'>Name</th>
              <th className='border px-4 py-2 bg-white'>Class</th>
              <th className='border px-4 py-2 bg-white'>Level</th>
              <th className='border px-4 py-2 bg-white'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {chars.map((char, index) => (
              <tr key={char._id}>
                <td className='border px-4 py-2 bg-white'>{index + 1}</td>
                <td className='border px-4 py-2 bg-white'>{char.name}</td>
                <td className='border px-4 py-2 bg-white'>{char.classType}</td>
                <td className='border px-4 py-2 bg-white'>{char.level}</td>
                <td className='flex justify-center gap-x-4 border px-4 py-2 bg-white'>
                  <Link to={`/characters/details/${char._id}`}>
                    <BsInfoCircle />
                  </Link>
                  <Link to={`/characters/${char._id}/edit`}>
                    <AiOutlineEdit />
                  </Link>
                  <Link to={`/characters/delete/${char._id}`}>
                    <MdOutlineAddBox />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
  )
}

export default CharTable