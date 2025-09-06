import React from 'react'  
import BackButton from '../components/BackButton.jsx'
import Spinner from '../components/Spinner.jsx'
import axios from 'axios'
import { useNavigate } from 'react-router-dom' 
import { useState } from 'react';
import Popup from '../components/Popup.jsx'
import backgroundHome from '../assets/images/backgroundHome.jpeg'

const CreateCharacter = () => {
    const [name, setName] = useState('New Character');
    const [raceType, setRaceType] = useState('Human');
    const [classType, setClassType] = useState('Warrior');
    const [level, setLevel] = useState(1);
    const [healthPoints, setHealthPoints] = useState(10);
    const [proficiencyBonus, setProficiencyBonus] = useState(2);
    const [speed, setSpeed] = useState(30);
    const [armourClass, setArmourClass] = useState(10);
    const [alignment, setAlignment] = useState('True Neutral');
    const [background, setBackground] = useState('Acolyte');
    const [languages, setLanguages] = useState(['Common']);
    const [error, setError] = useState('');
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

    // Popup state for Race selection
    const [showRacePopup, setShowRacePopup] = useState(false);

    const handleLevelChange = (e) => {
        const value = Number(e.target.value);
        if (value > 20) {
            setError('No value can be greater than 20.');
        } else {
            setError('');
            setLevel(value);
        }
    };
    const handleAbilityChange = (key, value) => {
        if (value > 20) {
            setError('No value can be greater than 20.');
        } else {
            setError('');
            setAbilityScores({ ...abilityScores, [key]: value });
        }
    };
    const handleSkillChange = (key, value) => {
        if (value > 20) {
            setError('No value can be greater than 20.');
        } else {
            setError('');
            setSkillScores({ ...skillScores, [key]: value });
        }
    };
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
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
        axios.post('http://localhost:5555/characters', data)
            .then((response) => {
                console.log('Character created successfully:', response.data);
                setLoading(false);
                navigate('/');
            })
            .catch((error) => {
                console.error('Error creating character:', error);
                setLoading(false);
            });
    }

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
            <h1 className='text-3xl my-4 text-center'> Create Character</h1>
            {error && <div className="text-red-600 mb-2">{error}</div>}
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
                    <select  className='border-2 border-gray-300 p-2 rounded-md w-full bg-white text-black'
            value={raceType}
            onChange={e => {
                setRaceType(e.target.value);
                setShowRacePopup(false);
            }}>
                        <option value="Human" title = "The most common face in Faerûn, humans are known for their tenacity, creativity, and endless capacity for growth">Human</option>
                        <option value="Dragonborn" title="A proud race that values clan and skills above all else. Once enslaved by dragons, they strive to be self-sufficient, not wanting to be beholden to anyone, not even the gods">Dragonborn</option>
                        <option value="Half-Elf" title = "With ethereal countenances and long lifespans, elves are at home with nature's power, flourishing in light and dark alike">Half-Elf</option>
                        <option value="Elf" title = "With ethereal countenances and long lifespans, elves are at home with nature's power, flourishing in light and dark alike">Elf</option>
                        <option value="Dwarf" title = "As durable and unyielding as their homes of stone, dwarves are some of the finest warriors, miners, and smiths of Faerûn.">Dwarf</option>
                        <option value="Tiefling" title = "Descended from devils of the Nine Hells, tieflings face constant suspicion in Faerûn. Thankfully, their arcane abilities make them natural survivors.">Tiefling</option>
                        <option value="Githyanki" title = "With a ruthlessness borne from mind flayer enslavement, githyanki ride the Astral Sea atop red dragons, bringing their silver swords and psionic might to bear against any trace of the illithid menace.">Githyanki</option>
                        <option value="Drow" title = "Driven to the Underdark, most drow have adopted a ruthless pragmatism. While the Lolth-sworn delight in the goddess' evil tenets, the Seldarine reject Her attempt to overthrow the leader of the elven pantheon.">Drow</option>
                        <option value="Halfling" title = "Small yet capable, halflings prefer the comforts of home and hearth - but their natural luck and dexterity makes them fine adventurers">Halfling</option>
                    </select>
                </div>
                 <div className='my-4'>
                    <label className='text-xl mr-4 text-gray-500'> Class </label>
                    <select  className='border-2 border-gray-300 p-2 rounded-md w-full bg-white text-black'
            value={classType}
            onChange={e => {
                setClassType(e.target.value);
                setShowClassPopup(false);
            }}>
                        <option value="Warrior" title = "placeholder">Warrior</option>
                        <option value="Wizard" title="placeholder">Wizard</option>
                        <option value="Sorceror" title = "placeholder">Sorceror</option>
                        <option value="Warlock" title = "placeholder">Warlock</option>
                        <option value="Cleric" title = "placeholder">Cleric</option>
                        <option value="Barbarian" title = "placeholder">Barbarian</option>
                        <option value="Bard" title = "placeholder">Bard</option>
                        <option value="Rogue" title = "placeholder">Rogue</option>
                        <option value="Monk" title = "placeholder">Monk</option>
                        <option value="Ranger" title = "placeholder">Ranger</option>
                        <option value="Druid" title = "placeholder">Druid</option>
                        <option value="Paladin" title = "placeholder">Paladin</option>
                    </select>
                </div>
                <label className='text-xl mr-4 text-gray-500 block mb-2'>Attributes</label>
                <div className='grid grid-cols-3u gap-2'>
                    <div className='my-2 flex items-center'>
                        <input
                            type='number'
                            value={level}
                            onChange={handleLevelChange}
                            className='border-2 border-gray-300 p-2 rounded-md w-24 mr-2'
                        />
                        <label className='text-lg text-gray-500'>Level</label>
                    </div>
                    <div className='my-2 flex items-center'>
                        <input
                            type='number'
                            value={healthPoints}
                            onChange={e => setHealthPoints(e.target.value)}
                            className='border-2 border-gray-300 p-2 rounded-md w-24 mr-2'
                        />
                        <label className='text-lg text-gray-500'>Health Points</label>
                    </div>
                    <div className='my-2 flex items-center'>
                        <input
                            type='number'
                            value={proficiencyBonus}
                            onChange={e => setProficiencyBonus(Number(e.target.value))}
                            className='border-2 border-gray-300 p-2 rounded-md w-24 mr-2'
                        />
                        <label className='text-lg text-gray-500'>Proficiency Bonus</label>
                    </div>
                    <div className='my-2 flex items-center'>
                        <input
                            type='number'
                            value={speed}
                            onChange={e => setSpeed(e.target.value)}
                            className='border-2 border-gray-300 p-2 rounded-md w-24 mr-2'
                        />
                        <label className='text-lg text-gray-500'>Speed</label>
                    </div>
                    <div className='my-2 flex items-center'>
                        <input
                            type='number'
                            value={armourClass}
                            onChange={e => setArmourClass(e.target.value)}
                            className='border-2 border-gray-300 p-2 rounded-md w-24 mr-2'
                        />
                         <label className='text-lg text-gray-500'>Health Points</label>
                    </div>
                    <div className='my-2 flex items-center'>
                        <input
                            type='number'
                            value={armourClass}
                            onChange={e => setArmourClass(e.target.value)}
                            className='border-2 border-gray-300 p-2 rounded-md w-24 mr-2'
                        />
                        <label className='text-lg text-gray-500'>Armour Class</label>
                    </div>
                    <div className='my-4'>
                    <label className='text-xl mr-4 text-gray-500'> Allignment </label>
                    <select  className='border-2 border-gray-300 p-2 rounded-md w-full bg-white text-black'
            value={alignment}
            onChange={e => {
                setAlignment(e.target.value);
                setShowClassPopup(false);
            }}>
                        <option value="Lawful Good" title = "placeholder">Lawful Good</option>
                        <option value="Neutral Good" title="placeholder">Neutral Good</option>
                        <option value="Chaotic Good" title = "placeholder">Chaotic Good</option>
                        <option value="Lawful Neutral" title = "placeholder">Lawful Neutral</option>
                        <option value="True Neutral" title = "placeholder">True Neutral</option>
                        <option value="Chaotic Neutral" title = "placeholder">Chaotic Neutral</option>
                        <option value="Lawful Evil" title = "placeholder">Lawful Evil</option>
                        <option value="Neutral Evil" title = "placeholder">Neutral Evil</option>
                        <option value="Chaotic Evil" title = "placeholder">Chaotic Evil</option>
                    </select>
                </div>
                    <div className='my-2 flex items-center'>
                        <input
                            type='text'
                            value={background}
                            onChange={e => setBackground(e.target.value)}
                            className='border-2 border-gray-300 p-2 rounded-md w-24 mr-2'
                        />
                        <label className='text-lg text-gray-500'>Background</label>
                    </div>
                    <div className='my-2 flex items-center'>
                        <input
                            type='text'
                            value={languages.join(', ')}
                            onChange={e => setLanguages(e.target.value.split(',').map(lang => lang.trim()).filter(Boolean))}
                            className='border-2 border-gray-300 p-2 rounded-md w-24 mr-2'
                            placeholder='e.g. Common, Elvish, Dwarvish'
                        />
                        <label className='text-lg text-gray-500'>Languages <span className="text-xs text-gray-400">(comma separated)</span></label>
                    </div>
                </div>
                <label className='text-xl mr-4 text-gray-500 block mb-2'>Ability Scores</label>
                <div className='grid grid-cols-3 gap-2'>
                    <div>
                        <label className="block text-xs">Strength</label>
                        <input
                            type='number'
                            value={abilityScores.strength}
                            onChange={e => handleAbilityChange('strength', Number(e.target.value))}
                            className='border-2 border-gray-300 p-2 rounded-md w-full text-xs'
                        />
                    </div>
                    <div>
                        <label className="block text-xs">Dexterity</label>
                        <input
                            type='number'
                            value={abilityScores.dexterity}
                            onChange={e => handleAbilityChange('dexterity', Number(e.target.value))}
                            className='border-2 border-gray-300 p-2 rounded-md w-full text-xs'
                        />
                    </div>
                    <div>
                        <label className="block text-xs">Constitution</label>
                        <input
                            type='number'
                            value={abilityScores.constitution}
                            onChange={e => handleAbilityChange('constitution', Number(e.target.value))}
                            className='border-2 border-gray-300 p-2 rounded-md w-full text-xs'
                        />
                    </div>
                    <div>
                        <label className="block text-xs">Intelligence</label>
                        <input
                            type='number'
                            value={abilityScores.intelligence}
                            onChange={e => handleAbilityChange('intelligence', Number(e.target.value))}
                            className='border-2 border-gray-300 p-2 rounded-md w-full text-xs'
                        />
                    </div>
                    <div>
                        <label className="block text-xs">Wisdom</label>
                        <input
                            type='number'
                            value={abilityScores.wisdom}
                            onChange={e => handleAbilityChange('wisdom', Number(e.target.value))}
                            className='border-2 border-gray-300 p-2 rounded-md w-full text-xs'
                        />
                    </div>
                    <div>
                        <label className="block text-xs">Charisma</label>
                        <input
                            type='number'
                            value={abilityScores.charisma}
                            onChange={e => handleAbilityChange('charisma', Number(e.target.value))}
                            className='border-2 border-gray-300 p-2 rounded-md w-full text-xs'
                        />
                    </div>
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
            {/* Race selection popup */}
            <Popup trigger={showRacePopup} onClose={() => setShowRacePopup(false)}>
            
                <div className="text-3xl my-4 text-center border-black">
                    <h2 className="text-2xl mb-4 border-black">Select a Race</h2>
                    <select  className="text-black"
            value={raceType}
            onChange={e => {
                setRaceType(e.target.value);
                setShowRacePopup(false);
            }}>
                        <option value="Human" title = "The most common face in Faerûn, humans are known for their tenacity, creativity, and endless capacity for growth">Human</option>
                        <option value="Dragonborn" title="A proud race that values clan and skills above all else. Once enslaved by dragons, they strive to be self-sufficient, not wanting to be beholden to anyone, not even the gods">Dragonborn</option>
                        <option value="Half-Elf" title = "With ethereal countenances and long lifespans, elves are at home with nature's power, flourishing in light and dark alike">Half-Elf</option>
                        <option value="Elf" title = "With ethereal countenances and long lifespans, elves are at home with nature's power, flourishing in light and dark alike">Elf</option>
                        <option value="Dwarf" title = "As durable and unyielding as their homes of stone, dwarves are some of the finest warriors, miners, and smiths of Faerûn.">Dwarf</option>
                        <option value="Tiefling" title = "Descended from devils of the Nine Hells, tieflings face constant suspicion in Faerûn. Thankfully, their arcane abilities make them natural survivors.">Tiefling</option>
                        <option value="Githyanki" title = "With a ruthlessness borne from mind flayer enslavement, githyanki ride the Astral Sea atop red dragons, bringing their silver swords and psionic might to bear against any trace of the illithid menace.">Githyanki</option>
                        <option value="Drow" title = "Driven to the Underdark, most drow have adopted a ruthless pragmatism. While the Lolth-sworn delight in the goddess' evil tenets, the Seldarine reject Her attempt to overthrow the leader of the elven pantheon.">Drow</option>
                        <option value="Halfling" title = "Small yet capable, halflings prefer the comforts of home and hearth - but their natural luck and dexterity makes them fine adventurers">Halfling</option>
                    </select>
                    <button
                        className="mt-4 p-2 bg-white border-black rounded"
                        onClick={() => setShowRacePopup(false)}
                    >
                        Close
                    </button>
                </div>
            </Popup>
        </div>
        </div>
    );
}

export default CreateCharacter;