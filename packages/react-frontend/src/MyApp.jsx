// import Table from "./Table";
// import Form from "./Form";
// import React, {useState, useEffect} from 'react';

// function MyApp() {
    
//     const [characters, setCharacters] = useState([]);

//   function removeOneCharacter(index) {
//     const updated = characters.filter((character, i) => {
//       return i !== index;
//     });
//     setCharacters(updated);
//   }

//   function updateList(person) {
//     setCharacters([...characters, person]);
//   }
//   function fetchUsers() {
//     const promise = fetch("http://localhost:8000/users");
//     return promise;
//   }
//   useEffect(() => {
//     fetchUsers()
//       .then((res) => res.json())
//       .then((json) => setCharacters(json["users_list"]))
//       .catch((error) => { console.log(error); });
//   }, [] );
//   function postUser(person) {
//     const promise = fetch("Http://localhost:8000/users", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(person),
//     });

//     return promise;
//   }
//   function updateList(person) { 
//     postUser(person)
//       .then(() => setCharacters([...characters, person]))
//       .catch((error) => {
//         console.log(error);
//       })
// }
//   return (
//     <div className="container">
//       <Table
//         characterData={characters}
//         removeCharacter={removeOneCharacter}
//       />
//       <Form handleSubmit={updateList} />
//     </div>
//   );
// }

// export default MyApp;
import Table from "./Table";
import Form from "./Form";
import React, { useState, useEffect } from 'react';

function MyApp() {

    const [characters, setCharacters] = useState([]);

    useEffect(() => {
        fetchUsers()
            .then((res) => res.json())
            .then((json) => setCharacters(json["users_list"]))
            .catch((error) => { console.log(error); });
    }, []);

    function fetchUsers() {
        return fetch("http://localhost:8000/users");
    }

    function postUser(person) {
        return fetch("http://localhost:8000/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(person),
        });
    }

    function removeUser(id) {
        fetch(`http://localhost:8000/users/${id}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.status === 204) {
                // Successful deletion on the backend, now update frontend
                setCharacters(characters.filter(character => character.id !== id));
            } else if (response.status === 404) {
                // Resource not found on the backend
                console.error('Resource not found.');
            } else {
                // Handle other status codes if needed
                console.error('Error:', response.status);
            }
        })
        .catch(error => {
            // Handle error
            console.error('Error:', error);
        });
    }

    function handleSubmit(person) {
        postUser(person)
            .then(() => {
                // After successful POST, fetch updated list of users
                fetchUsers()
                    .then((res) => res.json())
                    .then((json) => setCharacters(json["users_list"]))
                    .catch((error) => { console.log(error); });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    return (
        <div className="container">
            <Table
                characterData={characters}
                removeCharacter={removeUser}
            />
            <Form handleSubmit={handleSubmit} />
        </div>
    );
}

export default MyApp;
