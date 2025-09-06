import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import backgroundHome from '../assets/images/backgroundHome.jpeg'

const ShowCharacter = () => {
  const [character, setCharacter] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [abilityScores, setAbilityScores] = useState({
          strength: '',
          dexterity: '',
          constitution: '',
          intelligence: '',
          wisdom: '',
          charisma: ''
      });

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5555/characters/${id}`)
      .then((response) => {
        setCharacter(response.data);
        setAbilityScores(response.data.abilityScores || {
          strength: '',
          dexterity: '',
          constitution: '',
          intelligence: '',
          wisdom: '',
          charisma: ''
        });
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
        minHeight: '100vh',
      }}
    >
      <div className='p-4'>
        <BackButton />
        <h1 className='text-center text-3xl my-4'>Show Character</h1>
        {loading ? (
          <Spinner />
        ) : (
          <div className='flex flex-col border-2 border-yellow-400 bg-white rounded-xl w-fit p-4'>
            <div className='my-4'>
              <span className='text-xl mr-4 text-gray-500'>Id</span>
              <span>{character._id}</span>
            </div>
            <div className='my-4'>
              <span className='text-xl mr-4 text-gray-500'>Name</span>
              <span>{character.name}</span>
            </div>
            <div className='my-4'>
              <span className='text-xl mr-4 text-gray-500'>Race Type</span>
              <span>{character.raceType}</span>
            </div>
            <div className='my-4'>
              <span className='text-xl mr-4 text-gray-500'>Class Type</span>
              <span>{character.classType}</span>
            </div>
            <div className='my-4'>
              <span className='text-xl mr-4 text-gray-500'>Level</span>
              <span>{character.level}</span>
            </div>
            <div className='my-4'>
              <label className='text-x1 mr-4 text-gray-500 block mb-2'>Ability Scores</label>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label>Strength</label>
                  <input
                    type='number'
                    value={abilityScores.strength}
                    onChange={e => setAbilityScores({ ...abilityScores, strength: Number(e.target.value) })}
                    className='border-2 border-gray-300 p-2 rounded-md w-full'
                  />
                </div>
                <div>
                  <label>Dexterity</label>
                  <input
                    type='number'
                    value={abilityScores.dexterity}
                    onChange={e => setAbilityScores({ ...abilityScores, dexterity: Number(e.target.value) })}
                    className='border-2 border-gray-300 p-2 rounded-md w-full'
                  />
                </div>
                <div>
                  <label>Constitution</label>
                  <input
                    type='number'
                    value={abilityScores.constitution}
                    onChange={e => setAbilityScores({ ...abilityScores, constitution: Number(e.target.value) })}
                    className='border-2 border-gray-300 p-2 rounded-md w-full'
                  />
                </div>
                <div>
                  <label>Intelligence</label>
                  <input
                    type='number'
                    value={abilityScores.intelligence}
                    onChange={e => setAbilityScores({ ...abilityScores, intelligence: Number(e.target.value) })}
                    className='border-2 border-gray-300 p-2 rounded-md w-full'
                  />
                </div>
                <div>
                  <label>Wisdom</label>
                  <input
                    type='number'
                    value={abilityScores.wisdom}
                    onChange={e => setAbilityScores({ ...abilityScores, wisdom: Number(e.target.value) })}
                    className='border-2 border-gray-300 p-2 rounded-md w-full'
                  />
                </div>
                <div>
                  <label>Charisma</label>
                  <input
                    type='number'
                    value={abilityScores.charisma}
                    onChange={e => setAbilityScores({ ...abilityScores, charisma: Number(e.target.value) })}
                    className='border-2 border-gray-300 p-2 rounded-md w-full'
                  />
                </div>
              </div>
            </div>
            {/* Speed */}
            {character.speed !== undefined && (
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Speed</span>
                <span>{character.speed}</span>
              </div>
            )}
            {/* Proficiency Bonus */}
            {character.proficiencyBonus !== undefined && (
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Proficiency Bonus</span>
                <span>+{character.proficiencyBonus}</span>
              </div>
            )}
            {/* Languages */}
            {character.languages && character.languages.length > 0 && (
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Languages</span>
                <span>{character.languages.join(', ')}</span>
              </div>
            )}
            {/* Skill Scores */}
            {character.skillScores && (
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Skill Scores</span>
                <div className='text-sm mt-1 flex flex-wrap gap-2'>
                  {Object.entries(character.skillScores).map(([skill, value]) => (
                    <span key={skill} className='bg-gray-100 rounded px-2'>{skill}: {value}</span>
                  ))}
                </div>
              </div>
            )}
            <div className='my-4'>
              <span className='text-xl mr-4 text-gray-500'>Create Time</span>
              <span>{new Date(character.createdAt).toString()}</span>
            </div>
            <div className='my-4'>
              <span className='text-xl mr-4 text-gray-500'>Last Update Time</span>
              <span>{new Date(character.updatedAt).toString()}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowCharacter;