"use strict"
/*
Build all of your functions for displaying and gathering information below (GUI).
*/

// app is the function called to start the entire application
function app(people){
  let searchType = promptFor("Do you know the name of the person you are looking for? Enter 'yes' or 'no'", yesNo).toLowerCase();
  let searchResults;
  switch(searchType){
    case 'yes':
      searchResults = searchByName(people);
      break;
    case 'no':
      searchResults = searchByMultipleCriteria(people);
      break;
      default:
    app(people); // restart app
      break;
  }
  
  // Call the mainMenu function ONLY after you find the SINGLE person you are looking for
  searchResults = searchResults[0];
  mainMenu(searchResults, people);
}
// Menu function to call once you find who you are looking for
function mainMenu(person, people){

  /* Here we pass in the entire person object that we found in our search, as well as the entire original dataset of people. We need people in order to find descendants and other information that the user may want. */

  if(!person){
    alert("Could not find that individual.");
    return app(people); // restart
  }

  let displayOption = prompt("Found " + person.firstName + " " + person.lastName + " . Do you want to know their 'info', 'family', or 'descendants'? Type the option you want or 'restart' or 'quit'");

  switch(displayOption.toLowerCase()){
    case "info":
    displayPerson(person);
    mainMenu(person, people);
    break;
    case "family":
    displayImmediateFamilyOf(person, people);
    mainMenu(person, people);
    break;
    case "descendants":
    displayDescendants(person, people);
    mainMenu(person, people);
    break;
    case "restart":
    app(people); // restart
    break;
    case "quit":
    return; // stop execution
    default:
    return mainMenu(person, people); // ask again
  }
}

function searchByName(people){
  let firstName = promptFor("What is the person's first name?", chars);
  let lastName = promptFor("What is the person's last name?", chars);

  let foundPerson = people.filter(function(person){
    if(person.firstName.toLowerCase() === firstName.toLowerCase() && person.lastName.toLowerCase() === lastName.toLowerCase()){
      return true;
    }
    else{
      return false;
    }
  })
  // TODO: find the person using the name they entered
  return foundPerson;
}

function searchBySingleCriteria(people){
  let criteria = window.promptFor("Enter criteria to search for: gender, height, weight, eyeColor, or occupation.", validCriteria).toLowerCase().split(" ").join("");
  let searchValue = window.promptFor("What " + criteria + " would you like to search for?", chars);
  if(isNaN(searchValue)){
    searchValue = searchValue.toLowerCase();
  }

  if(criteria === "eyecolor"){
    return people.filter(function(el){
      if(el.eyeColor == searchValue){
        return true;
      }
    })
  }

  return people.filter(function(el){
     if (el[criteria] == searchValue){
      return true;
    }
    else{
      return false;
    }
  });
}

function searchByMultipleCriteria(people){
  let keepSearching;
  do{
    people = searchBySingleCriteria(people);
    displayPeople(people);
    keepSearching = window.promptFor("Would you like to narrow down your search with additional criteria?", yesNo)

  }while(keepSearching === "yes" && people.length > 1);
  return people;
}

// alerts a list of people
function displayPeople(people){
  alert(people.map(function(person){
    return person.firstName + " " + person.lastName;
  }).join("\n"));
}

function displayPerson(person){
  // print all of the information about a person:
  // height, weight, age, name, occupation, eye color.
  let personInfo = "First Name: " + person.firstName + "\n";
  personInfo += "Last Name: " + person.lastName + "\n";
  // TODO: finish getting the rest of the information to display
  personInfo += "Gender: " + person.gender + "\n";
  personInfo += "DOB: " + person.dob + "\n";
  personInfo += "Height: " + person.height + "\n";
  personInfo += "Weight: " + person.weight + "\n";
  personInfo += "Eye Color: " + person.eyeColor + "\n";
  personInfo += "Occupation: " + person.occupation + "\n";
  alert(personInfo);
}
function displayDescendants(person, people){
  //Display children of person, and children of children.
  let children = people.filter(function(el){
    return(el["parents"].includes(person["id"]));
  });
  if (children.length > 0)
  {
    alert(person.firstName + " " + person.lastName + "'s Children: " + children.map(c => " " + c.firstName + " " + c.lastName));
  }
  else{
    alert(person.firstName + " " + person.lastName + " does not have any children in the database.");
  }
  for (let i = 0; i < children.length; i++){
    displayDescendants(children[i], people);
  }
}
function displayImmediateFamilyOf(person, people){
  //Display parents and siblings of person.
  let immediateFamily = "Immediate family of " + person.firstName + " " + person.lastName + ":";
  let parents = people.filter(function(el){
    if (person.parents.includes(el.id)){
      return true;
    }
    else{
      return false;
    }
  });
  let siblings = people.filter(function(el){
    if (el.id === person.id){
      return false;
    }
    return checkIfTwoArraysHaveAnElementInCommon(person.parents, el.parents);
  });
  let spouse = people.filter(function(el){
    return person.currentSpouse === el.id;
  });
  if (parents.length > 0){
    immediateFamily += "\nParent(s): " + parents.map(p => "\n" + p.firstName + " " + p.lastName);
  }
  if (siblings.length > 0){
    immediateFamily += "\nSibling(s): " + siblings.map(s => "\n" + s.firstName + " " + s.lastName);
  }
  if (spouse.length > 0){
    immediateFamily += "\nSpouse: " + spouse.map(s => "\n" + s.firstName + " " + s.lastName);
  }
  alert(immediateFamily);
}
function checkIfTwoArraysHaveAnElementInCommon(arrayOne, arrayTwo){
  for (let i = 0; i < arrayOne.length; i++){
    for (let j = 0; j < arrayTwo.length; j++){
      if (arrayOne[i] === arrayTwo[j]){
        return true;
      }
    }
  }
  return false;
}

// function that prompts and validates user input
function promptFor(question, valid){
  do{
    var response = prompt(question).trim();
  } while(!response || !valid(response));
  return response;
}
// helper function to check if user enters a valid criteria
function validCriteria(input){
  input = input.toLowerCase().split(" ").join("");
  return (input === "firstname" || input === "lastname" || input === "gender" || input === "dob" || input === "height" || input === "weight" || input === "eyecolor" || input === "occupation");
}

// helper function to pass into promptFor to validate yes/no answers
function yesNo(input){
  return input.toLowerCase() == "yes" || input.toLowerCase() == "no";
}

// helper function to pass in as default promptFor validation
function chars(input){
  return true; // default validation only
}
