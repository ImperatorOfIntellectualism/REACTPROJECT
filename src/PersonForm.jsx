import React, { useState, useEffect } from 'react';

const DataList = ({ data, toggle }) => {
  const [successors, setSuccessors] = useState([])
  const [ancestors, setAncestors] = useState([])
  const [isAdding, setIsAdding] = useState(false);
  const [ADDINGfirstName, setFirstName] = useState('');
  const [ADDINGlastName, setLastName] = useState('');
  const [ADDINGgender, setGender] = useState('Мужской');
  const [ADDINGbirthDate, setBirthDate] = useState('');

  function findObjectById(arr, id) {
    return arr.find(item => item.id === id);
}

function removeIdAndChildren(array, idToRemove) {
  const itemToRemove = array.find(item => item.id === idToRemove);
    
    // Если объект не найден, просто возвращаем исходный массив
    if (!itemToRemove) {
        return array;
    }

    // Собираем все id из children объекта, который нужно удалить
    const idsToRemove = new Set(itemToRemove.children);

    // Добавляем в idsToRemove все children для каждого элемента в массиве
    itemToRemove.children.forEach(childId => {
        const childItem = array.find(item => item.id === childId);
        if (childItem) {
            // Добавляем всех потомков этого ребенка
            childItem.children.forEach(grandChildId => idsToRemove.add(grandChildId));
        }
    });

    // Удаляем объекты с id в idsToRemove и сам объект с idToRemove
    const updatedArray = array.filter(item => !idsToRemove.has(item.id) && item.id !== idToRemove);

    // Убираем idToRemove из всех children оставшихся объектов
    updatedArray.forEach(item => {
        item.children = item.children.filter(childId => childId !== idToRemove);
    });

    return updatedArray;
}

const handleAdd = (id) => {
  setIsAdding(id);
};

const handleDelete = (id) => {
  const storedData = JSON.parse(localStorage.getItem('familyTree'));
  const newData = removeIdAndChildren(storedData, id)
  console.log(newData)
  localStorage.setItem('familyTree', JSON.stringify(newData))
  document.getElementById(id).remove();
};

const addChild = (id) => {
  const storedData = JSON.parse(localStorage.getItem('familyTree'));
  const newId = Date.now()
  storedData.push({id: newId, firstName: ADDINGfirstName,
    lastName: ADDINGlastName,
    gender: ADDINGgender,
    birthDate: ADDINGbirthDate,
    children: []})

    findObjectById(storedData, id).children.push(newId)  
    localStorage.setItem('familyTree', JSON.stringify(storedData))
    setIsAdding(0)
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
    const newSuccessors = []
    const storedData = JSON.parse(localStorage.getItem('familyTree'));
    for(let i = 0; i < data.length; i++){
      newSuccessors.push(findObjectById(storedData, data[i]).children)
    }
    setSuccessors(newSuccessors)

    const newAncestors = []
    for(let i = 0; i < data.length; i++){
      newAncestors.push(findAncestors(storedData, data[i]))
    }
    setAncestors(newAncestors)
  }, [data, isAdding]);

  const storedData = JSON.parse(localStorage.getItem('familyTree'));

  const list = data.map((value, index) => (
    <div id={findObjectById(storedData, value).id}>
    <p>{`${findObjectById(storedData, value).lastName} ${findObjectById(storedData, value).firstName}, ${findObjectById(storedData, value).gender}, ${findObjectById(storedData, value).birthDate}`} <button onClick={() => {handleAdd(findObjectById(storedData, value).id)}}>+</button> <button onClick={() => {handleDelete(findObjectById(storedData, value).id)}}>-</button></p>
    {isAdding == findObjectById(storedData, value).id ? (
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
      <button type="submit" onClick={() => {addChild(findObjectById(storedData, value).id)}}>Добавить потомка</button>
          </div>
          ) : null}
          {toggle == null ? null : <p><div className='listOfSuccesors' style={{marginLeft: "50px"}}>
        <h5 id={findObjectById(storedData, value).id + "target"} style={{cursor: "pointer", width: "100px"}} onClick={toggle}>Список Потомков</h5>
        <ul id={findObjectById(storedData, value).id + "list"} style={{display: "none"}}>
        {successors[index] != undefined && successors[index].length != 0 ? <DataList data={successors[index]} toggle={toggle}></DataList> : null}
        </ul>
        </div></p>}
    </div>
  ));

  return (list)
}

export default DataList;