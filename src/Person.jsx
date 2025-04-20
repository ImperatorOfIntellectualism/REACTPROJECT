import React, { useEffect, useState } from 'react';
import DataList from './PersonForm';

const Person = ({ person, updatePerson }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isAddingAnc, setIsAddingAnc] = useState(false);
  const [ADDINGfirstName, setFirstName] = useState('');
  const [ADDINGlastName, setLastName] = useState('');
  const [ADDINGgender, setGender] = useState('Мужской');
  const [ADDINGbirthDate, setBirthDate] = useState('');
  const [ancestors, setAncestors] = useState([])
  const [successors, setSuccessors] = useState([])
  let storedData = []

  function findObjectById(arr, id) {
    return arr.find(item => item.id === id);
}

function findAncestors(arr, id) {
  const newArr = arr.filter(item => item.children.includes(id));
  const trueArr = []
  for (let i = 0; i < newArr.length; i++)
  {
    trueArr.push(newArr[i].id)
  }
  return trueArr;
}

  useEffect(() => {
    storedData = JSON.parse(localStorage.getItem('familyTree'));
    if(findObjectById(storedData, person.id) == undefined) return
    setSuccessors(findObjectById(storedData, person.id).children)
    setAncestors(findAncestors(storedData, person.id))
  }, [isAdding, isEditing, isAddingAnc]);

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleAdd = (id) => {
    if(id == 1){setIsAdding(!isAdding);}
    else setIsAddingAnc(!isAddingAnc);
  };

  const addChild = () => {
    storedData = JSON.parse(localStorage.getItem('familyTree'));
    const newId = Date.now()
    storedData.push({id: newId, firstName: ADDINGfirstName,
      lastName: ADDINGlastName,
      gender: ADDINGgender,
      birthDate: ADDINGbirthDate,
      children: []})

      findObjectById(storedData, person.id).children.push(newId)  
      localStorage.setItem('familyTree', JSON.stringify(storedData))
      setIsAdding(!isAdding)
  }

  const addAncestor = () => {
    storedData = JSON.parse(localStorage.getItem('familyTree'));
    const newId = Date.now()
    storedData.push({id: newId, firstName: ADDINGfirstName,
      lastName: ADDINGlastName,
      gender: ADDINGgender,
      birthDate: ADDINGbirthDate,
      children: [person.id]})

      localStorage.setItem('familyTree', JSON.stringify(storedData))
      setIsAddingAnc(!isAddingAnc)
  }

  const toggleList = (e) => {
    let result = ''
    for (let char of e.target.id) {
      if (!/[a-zA-Z]/.test(char)) {
          result += char;
      }
  }
    const itemList = document.getElementById(result + 'list');
    if (itemList.style.display === 'none' || itemList.style.display === '') {
      itemList.style.display = 'block'; // Показываем список
  } else {
      itemList.style.display = 'none'; // Скрываем список
  }
  }

  return (
    <div>
      {isEditing ? (
        <div>
          <div>
            <input 
            type="text" 
            onChange={(e) => setFirstName(e.target.value)} 
            required 
          />
          <input 
            type="text" 
            onChange={(e) => setLastName(e.target.value)} 
            required 
          />
          <select value={ADDINGgender} onChange={(e) => setGender(e.target.value)}>
        <option value="Мужской">Мужской</option>
        <option value="Женский">Женский</option>
      </select>
      <input 
        type="date" 
        value={ADDINGbirthDate} 
        onChange={(e) => setBirthDate(e.target.value)} 
        required 
      />
      <button onClick={() => {updatePerson(person.id, ADDINGfirstName, ADDINGlastName, ADDINGbirthDate, ADDINGgender); handleEdit()}}>Сохранить</button>
          </div>
        </div>
      ) : (
        <div>
          <p>{`${person.lastName} ${person.firstName}, ${person.gender}, ${person.birthDate}`}</p>
          {isAdding || isAddingAnc? (
            <div>
            <input 
            type="text" 
            onChange={(e) => setFirstName(e.target.value)} 
            required 
          />
          <input 
            type="text" 
            onChange={(e) => setLastName(e.target.value)} 
            required 
          />
          <select value={ADDINGgender} onChange={(e) => setGender(e.target.value)}>
        <option value="Мужской">Мужской</option>
        <option value="Женский">Женский</option>
      </select>
      <input 
        type="date" 
        value={ADDINGbirthDate} 
        onChange={(e) => setBirthDate(e.target.value)} 
        required 
      />
      {isAdding ? (<button type="submit" onClick={addChild}>Добавить потомка</button>) : (<button type="submit" onClick={addAncestor}>Добавить предка</button>)}
          </div>
          ) : (
            <div>
            <button onClick={() => {handleAdd(1)}}>+ Потомок</button>
            <button onClick={() => {handleAdd(2)}}>+ Предок</button>
          <button onClick={handleEdit}>Редактировать</button>
          </div>
          )}

          <div className='listOfSuccesors' style={{marginLeft: "50px"}}>
          <h5 id="1target" style={{cursor: "pointer", width: "100px"}} onClick={toggleList}>Список Потомков</h5>
          <ul id="1list" style={{display: "none"}}>
            <DataList data={successors} toggle={toggleList} ></DataList>
          </ul>
          <h5 id="2target" style={{cursor: "pointer", width: "100px"}} onClick={toggleList}>Список Предков</h5>
          <ul id="2list" style={{display: "none"}}>
            <DataList data={ancestors} toggle={toggleList} ></DataList>
          </ul>
          </div>
        </div>
      )}
    </div>
  );


};

export default Person;