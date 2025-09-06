import { AiOutlineClose } from 'react-icons/ai';

const CLASS_OPTIONS = [
  'Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk',
  'Paladin', 'Ranger', 'Rogue', 'Sorcerer', 'Warlock', 'Wizard'
];

const ClassModal = ({ onSelect, onClose }) => {
  return (
    <div
      className='fixed bg-black bg-opacity-60 top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center'
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        className='w-[350px] max-w-full bg-white rounded-xl p-6 flex flex-col relative shadow-lg'
      >
        <AiOutlineClose
          className='absolute right-4 top-4 text-2xl text-red-600 cursor-pointer'
          onClick={onClose}
        />
        <h2 className='text-xl font-bold mb-4 text-center'>Select a Class</h2>
        <div className='grid grid-cols-2 gap-3'>
          {CLASS_OPTIONS.map((className) => (
            <button
              key={className}
              className='p-2 bg-yellow-200 hover:bg-yellow-400 rounded text-lg font-serif transition'
              onClick={() => { onSelect(className); onClose(); }}
            >
              {className}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClassModal;