import React, {useState, useEffect} from 'react'  
import BackButton from '../components/BackButton.jsx'
import Spinner from '../components/Spinner.jsx'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import backgroundHome from '../assets/images/backgroundHome.jpeg'

const EditCharacter = () => {
    const [name, setName] = useState('');
    const [raceType, setRaceType] = useState('Human');
    const [classType, setClassType] = useState('Warrior');
    const [level, setLevel] = useState(1);
    const [proficiencyBonus, setProficiencyBonus] = useState(2);
    const [healthPoints, setHealthPoints] = useState(10);
    const [speed, setSpeed] = useState(30);
    const [armourClass, setArmourClass] = useState(10);
    const [alignment, setAlignment] = useState('True Neutral');
    const [background, setBackground] = useState('Acolyte');
    const [languages, setLanguages] = useState(['Common']);
    const [abilityScores, setAbilityScores] = useState({
        strength: 10,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10
    });
    const [skillScores, setSkillScores] = useState({
        Athletics: 0,
        Acrobatics: 0,
        SleightofHand: 0,
        Stealth: 0,
        Perception: 0,
        Insight: 0,
        Investigation: 0,
        Medicine: 0,
        AnimalHandling: 0,
        Deception: 0,
        Intimidation: 0,
        Performance: 0,
        Persuasion: 0,
        History: 0,
        Arcana: 0,
        Religion: 0,
        Survival: 0,
        Nature: 0
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    const {id} = useParams()
        useEffect(() => {
            if (!id) return;
            setLoading(true);
            axios.get(`http://localhost:5555/characters/${id}`)
                .then((response) => {
                    const data = response.data;
                    setName(data.name || '');
                    setRaceType(data.raceType || 'Human');
                    setClassType(data.classType || 'Warrior');
                    setLevel(data.level || 1);
                    setProficiencyBonus(data.proficiencyBonus || 2);
                    setHealthPoints(data.healthPoints || 10);
                    setSpeed(data.speed || 30);
                    setArmourClass(data.armourClass || 10);
                    setAlignment(data.alignment || 'True Neutral');
                    setBackground(data.background || 'Acolyte');
                    setLanguages(data.languages || ['Common']);
                    setAbilityScores(data.abilityScores || {
                        strength: 10,
                        dexterity: 10,
                        constitution: 10,
                        intelligence: 10,
                        wisdom: 10,
                        charisma: 10
                    });
                    setSkillScores(data.skillScores || {
                        Athletics: 0,
                        Acrobatics: 0,
                        SleightofHand: 0,
                        Stealth: 0,
                        Perception: 0,
                        Insight: 0,
                        Investigation: 0,
                        Medicine: 0,
                        AnimalHandling: 0,
                        Deception: 0,
                        Intimidation: 0,
                        Performance: 0,
                        Persuasion: 0,
                        History: 0,
                        Arcana: 0,
                        Religion: 0,
                        Survival: 0,
                        Nature: 0
                    });
                    setLoading(false);
                })
                .catch((error) => {
                    console.error('Error fetching character details:', error);
                    setLoading(false);
                });
        }, [id]);
    const handleAbilityChange = (key, value) => {
        setAbilityScores({ ...abilityScores, [key]: value });
    };
    const handleSkillChange = (key, value) => {
        setSkillScores({ ...skillScores, [key]: value });
    };
    const handleSaveCharacter = () => {
        const data = {
            name,
            raceType,
            classType,
            level,
            proficiencyBonus,
            healthPoints,
            speed,
            armourClass,
            alignment,
            background,
            languages,
            abilityScores,
            skillScores,
        };
        setLoading(true);
        axios.put(`http://localhost:5555/characters/${id}`, data)
            .then((response) => {
                console.log('Character updated successfully:', response.data);
                setLoading(false);
                navigate('/');
            })
            .catch((error) => {
                console.error('Error updating character:', error);
                setLoading(false);
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
            <h1 className='text-3xl my-4 text-center'> Edit Character</h1>
            {loading ? <Spinner /> : ''}
            <div className='bg-white flex flex-col border-2 border-yellow-400 rounded-xl w-[600px] p-4 mx-auto'>
                <div className='my-4'>
                    <label className='text-xl mr-4 text-gray-500'> Name </label>
                    <input
                        type='text'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className='border-2 border-gray-300 p-2 rounded-md w-full'
                    />
                </div>
                <div className='my-4'>
                    <label className='text-xl mr-4 text-gray-500'> Race </label>
                    <input
                        type='text'
                        value={raceType}
                        onChange={(e) => setRaceType(e.target.value)}
                        className='border-2 border-gray-300 p-2 rounded-md w-full'
                    />
                </div>
                <div className='my-4'>
                    <label className='text-xl mr-4 text-gray-500'> Class </label>
                    <input
                        type='text'
                        value={classType}
                        onChange={(e) => setClassType(e.target.value)}
                        className='border-2 border-gray-300 p-2 rounded-md w-full'
                    />
                </div>
                <div className='my-4'>
                    <label className='text-xl mr-4 text-gray-500'> Level </label>
                    <input
                        type='number'
                        value={level}
                        onChange={(e) => setLevel(Number(e.target.value))}
                        className='border-2 border-gray-300 p-2 rounded-md w-full'
                    />
                </div>
                <div className='my-4'>
                    <label className='text-xl mr-4 text-gray-500'> Proficiency Bonus </label>
                    <input
                        type='number'
                        value={proficiencyBonus}
                        onChange={(e) => setProficiencyBonus(Number(e.target.value))}
                        className='border-2 border-gray-300 p-2 rounded-md w-full'
                    />
                </div>
                <div className='my-4'>
                    <label className='text-xl mr-4 text-gray-500'> Health Points </label>
                    <input
                        type='number'
                        value={healthPoints}
                        onChange={(e) => setHealthPoints(Number(e.target.value))}
                        className='border-2 border-gray-300 p-2 rounded-md w-full'
                    />
                </div>
                <div className='my-4'>
                    <label className='text-xl mr-4 text-gray-500'> Speed </label>
                    <input
                        type='number'
                        value={speed}
                        onChange={(e) => setSpeed(Number(e.target.value))}
                        className='border-2 border-gray-300 p-2 rounded-md w-full'
                    />
                </div>
                <div className='my-4'>
                    <label className='text-xl mr-4 text-gray-500'> Armour Class </label>
                    <input
                        type='number'
                        value={armourClass}
                        onChange={(e) => setArmourClass(Number(e.target.value))}
                        className='border-2 border-gray-300 p-2 rounded-md w-full'
                    />
                </div>
                <div className='my-4'>
                    <label className='text-xl mr-4 text-gray-500'> Alignment </label>
                    <input
                        type='text'
                        value={alignment}
                        onChange={(e) => setAlignment(e.target.value)}
                        className='border-2 border-gray-300 p-2 rounded-md w-full'
                    />
                </div>
                <div className='my-4'>
                    <label className='text-xl mr-4 text-gray-500'> Background </label>
                    <input
                        type='text'
                        value={background}
                        onChange={(e) => setBackground(e.target.value)}
                        className='border-2 border-gray-300 p-2 rounded-md w-full'
                    />
                </div>
                <div className='my-4'>
                    <label className='text-xl mr-4 text-gray-500'> Languages </label>
                    <input
                        type='text'
                        value={languages.join(', ')}
                        onChange={e => setLanguages(e.target.value.split(',').map(lang => lang.trim()).filter(Boolean))}
                        className='border-2 border-gray-300 p-2 rounded-md w-full'
                        placeholder='e.g. Common, Elvish, Dwarvish'
                    />
                </div>
                <label className='text-xl mr-4 text-gray-500 block mb-2'>Ability Scores</label>
                <div className='grid grid-cols-3 gap-2'>
                    {Object.keys(abilityScores).map((score) => (
                        <div key={score}>
                            <label className="block text-xs">{score}</label>
                            <input
                                type='number'
                                value={abilityScores[score]}
                                onChange={e => handleAbilityChange(score, Number(e.target.value))}
                                className='border-2 border-gray-300 p-2 rounded-md w-full text-xs'
                            />
                        </div>
                    ))}
                </div>
                <label className='text-xl mr-4 text-gray-500 block mb-2 mt-4'>Skill Scores</label>
                <div className='grid grid-cols-3 gap-2'>
                    {Object.keys(skillScores).map((skill) => (
                        <div key={skill}>
                            <label className="block text-xs">{skill}</label>
                            <input
                                type='number'
                                value={skillScores[skill]}
                                onChange={e => handleSkillChange(skill, Number(e.target.value))}
                                className='border-2 border-gray-300 p-2 rounded-md w-full text-xs'
                            />
                        </div>
                    ))}
                </div>
                <button
                    className='p-2 bg-gray-600 text-white rounded-md mt-4'
                    onClick={handleSaveCharacter}
                >
                    Save Character
                </button>
            </div>
        </div>
    </div>
    );
}

export default EditCharacter;