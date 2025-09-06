import React from 'react'

function Popup(props) {
  return (props.trigger) ? (
    <div className="fixed inset-0 bg-white bg-opacity-70 border-black flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 relative border border-black">
        <button className="absolute top-2 right-2 text-gray-700" onClick={props.onClose}>Close</button>
        {props.children}
      </div>
    </div>
  ) : "";
}

export default Popup