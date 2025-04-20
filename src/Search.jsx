import React, { useEffect, useState } from 'react';
import DataList from './PersonForm';

const Search = () => {

  const [search, setSearchTerm] = useState("")
  const [searchResult, setSearchResult] = useState([])

  
  
  useEffect(() => {
    if(search == "") {setSearchResult([]); return}
    const storedData = JSON.parse(localStorage.getItem('familyTree'));
    
    const filteredPeople = storedData.filter(
      (person) =>
        person.firstName.toLowerCase().includes(search.toLowerCase()) ||
        person.lastName.toLowerCase().includes(search.toLowerCase())
    );

    const trueArr = []

    for (let i = 0; i < filteredPeople.length; i++)
      {
        trueArr.push(filteredPeople[i].id)
      }

    setSearchResult(trueArr)

  }, [search]);

   return (
    <div style={{border: "1px solid"}}>
     <input
       type="text"
       placeholder="Поиск по имени или фамилии"
       value={search}
       onChange={(e) => setSearchTerm(e.target.value)}
     />
     {searchResult.length != 0 ? <DataList data={searchResult} toggle={null}></DataList> : null}
     </div>
   );
};

export default Search;