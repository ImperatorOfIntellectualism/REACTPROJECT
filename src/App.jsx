import React, { useState, useEffect } from 'react';
import Person from './Person';
import Search from './Search';

const initialData = {
  id: 1,
  firstName: 'Иван',
  lastName: 'Иванов',
  gender: 'Мужской',
  birthDate: '1990-01-01',
  children: [],
};

const App = () => {
  let [people, setPeople] = useState([]);

  function findObjectById(arr, id) {
    return arr.find(item => item.id === id);
}

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('familyTree'));
    if (storedData.length != 0) {
      setPeople(storedData)
    } else {
      setPeople([initialData]);
    }
  }, []);

  useEffect(() => {
    if(people.length != 0){
    localStorage.setItem('familyTree', JSON.stringify(people))
    }
  }, [people]);

  const updatePerson = (id, ADDINGfirstName, ADDINGlastName, ADDINGbirthDate, ADDINGgender) => {
    const storedData = JSON.parse(localStorage.getItem('familyTree'));
    const edited = findObjectById(storedData, id)
    edited.firstName = ADDINGfirstName
    edited.lastName = ADDINGlastName
    edited.birthDate = ADDINGbirthDate
    edited.gender = ADDINGgender
    localStorage.setItem('familyTree', JSON.stringify(storedData))
    setPeople(storedData)
  };

  const base = people.filter((_, index) => index === 0);

  return (
    <div>
      <h1>Генеалогическое древо</h1>
      <Search />
      <div>
        {base.map((person) => (
          <Person
            key={person.id}
            person={person}
          />
        ))}
      </div>
    </div>
  );
};

export default App;