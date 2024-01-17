"use client";
import Image from 'next/image'
import { data } from './constants/data';
import react, {useState, useRef, useEffect} from 'react';
import './styles.css';

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [selectedNames, setSelectedNames] = useState([]);
  const [suggestions, setSuggestions] = useState(data.slice(0,5));
  const [show, setShow] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ top: 0, left: 0 });
  const inputRef = useRef(null);
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
  }; 

  const handleInputClick = ()=>{
    setShow(true);
  }
  
  const handleRemove = (index) => {
    const updatedNames = [...selectedNames];
    updatedNames.splice(index, 1);
    setSelectedNames(updatedNames);

    // If there are no selected names, focus on the input field
    if (updatedNames.length === 0 && inputRef.current) {
      inputRef.current.focus();
    }
  };
  const handleObjectSelect = (name) => {
    setSelectedNames([...selectedNames, name]);
    setInputValue("");
    inputRef.current.focus();
  };

  const handleBackspace = (e) => {
    if (e.keyCode === 8 && inputValue === "" && selectedNames.length > 0) {
      const updatedNames = [...selectedNames];
      updatedNames.pop();
      setSelectedNames(updatedNames);
    }
  };


  useEffect(() => {
    document.addEventListener("keydown", handleBackspace);
    return () => {
      document.removeEventListener("keydown", handleBackspace);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNames]);

  const handleInputChangePosition = () => {
    if (inputRef.current) {
      const inputRect = inputRef.current.getBoundingClientRect();
      setCursorPosition({
        top: inputRect.top + inputRect.height,
        left: inputRect.left,
      });
    }
  };

  useEffect(() => {
    handleInputChangePosition();
  }, [inputValue, selectedNames]);

  let filteredNames = data.filter((person) =>
      person.name.toLowerCase().includes(inputValue.toLowerCase())
    );
    filteredNames = filteredNames.filter((person) =>
      !selectedNames.some((selectedPerson) => selectedPerson.name === person.name)
    );
    filteredNames = filteredNames.slice(0,5);

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
     <h2>Zepto Assignment - Chips container</h2>
     <div className="flex flex-col">
     <div className="chips-container flex flex-wrap gap-2 bg-white border-b-2 w-full p-2">
        {selectedNames.map((person, index) => (
          <div key={index} className="chip bg-gray-400 text-white p-2 rounded-full flex items-center">
            <img src={person.image} alt={person?.name} className="rounded-full h-6 w-6 mr-2" />
            <p className='text-black'>{person?.name}</p>
          <span className="m-2 cursor-pointer text-black bg-white rounded-full w-6 h-6 text-center" onClick={() => handleRemove(index)}>x</span>
          </div>
        ))}
     
      <input
        type="text"
        value={inputValue}
        onClick={handleInputClick}
        onChange={handleInputChange}
        ref={inputRef}
        placeholder="Enter a name"
        className="chip input p-2 pl-10 relative z-10 border-0 outline-0"
      />
       </div>
      {
        show && (
          <div className="bg-white border border-gray-300 rounded mt-1"
          style={{ top: cursorPosition.top, left: cursorPosition.left, position: "absolute", zIndex: 1 }}>
          {filteredNames.map((person, index) => (
            <div
              key={index}
              className="p-4 cursor-pointer hover:bg-gray-100 flex"
              onClick={() => handleObjectSelect(person)}
            >
            <img src={person.image} alt={person?.name} className="rounded-full h-6 w-6 mr-2" />
            <p className='text-black'>{person?.name}</p>
            </div>
          ))}
          </div>
        )
      }
       </div>
        
    </main>
  )
}
