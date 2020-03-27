"use strict"

var currentFunction;
var valid;
var currentQuestion;
var people;
var searchResults;
var firstName;
var currentPerson;
var descendants;
var criteria;
var keepSearching;

document.getElementById("exampleTextarea").addEventListener("keypress", function(key){
  if (key.keyCode === 13){
    getInputFromTextBox();
  }
})

function app(database){
  document.querySelector("div.form-group").style.display = "block";
  document.getElementById("mostwanted").style.display = "block";
  document.getElementById("startsearching").innerHTML = "Start Searching";
  document.getElementById("mostwanted").innerHTML = "";
  people = database;
  currentFunction = appPartTwo;
  promptFor("Do you know the name of the person you are looking for? Enter 'yes' or 'no'", yesNo);
}

function appPartTwo(searchType){
  document.getElementById("startsearching").innerHTML = "Start Over";
  currentFunction = appPartThree;
  switch(searchType){
    case 'yes':
      searchByName();
      break;
    case 'no':
      searchResults = people;
      searchByMultipleCriteria();
      break;
    default:
      app(people);
      break;
  }
}
 
function appPartThree(){
  searchResults = searchResults[0];
  mainMenu(searchResults, people);
}

function mainMenu(person, people){
  if(!person){
    printToPage("Could not find that individual.");
    return app(people);
  }

  currentPerson = person;
  currentFunction = mainMenuPartTwo;
  promptFor("Found " + person.firstName + " " + person.lastName + ". Do you want to know their 'info', 'family', or 'descendants'? Type the option you want.", chars);
}

function mainMenuPartTwo(displayOption){
  switch(displayOption.toLowerCase()){
    case "info":
      displayPerson(currentPerson);
      mainMenu(currentPerson, people);
      break;
    case "family":
      displayImmediateFamilyOf(currentPerson, people);
      mainMenu(currentPerson, people);
      break;
    case "descendants":
      descendants = "";
      displayDescendants(currentPerson, people);
      mainMenu(currentPerson, people);
      break;
    case "restart":
      app(people);
      break;
    case "quit":
      return;
    default:
      return mainMenu(currentPerson, people);
  }
}

function searchByName(){
  searchResults = people;
  currentFunction = getLastName;
  promptFor("What is the person's first name?", chars);
}

function getLastName(firstName){
  searchResults = searchResults.filter(p => p.firstName.toLowerCase() === firstName.toLowerCase());
  currentFunction = getPersonBasedOnName;
  promptFor("What is the person's last name?", chars);
}

function getPersonBasedOnName(lastName){
  let foundPerson = searchResults.filter(p => p.lastName.toLowerCase() === lastName.toLowerCase())[0];
  mainMenu(foundPerson, people);
}

function searchBySingleCriteria(){
  currentFunction = searchBySingleCriteriaPartTwo;
  window.promptFor("Enter criteria to search for: gender, height, weight, eye color, or occupation.", validCriteria);
}

function searchBySingleCriteriaPartTwo(response){
  criteria = response.split(" ").join("");
  currentFunction = searchBySingleCriteriaPartThree;
  window.promptFor("What " + criteria + " would you like to search for?", chars);
}

function searchBySingleCriteriaPartThree(response){
  let searchValue = response;
  if(isNaN(searchValue)){
    searchValue = searchValue.toLowerCase();
  }

  if(criteria === "eyecolor"){
    searchResults = searchResults.filter(function(el){
      if(el.eyeColor == searchValue){
        return true;
      }
    })
  }
  else{
  searchResults = searchResults.filter(function(el){
     if (el[criteria] == searchValue){
      return true;
    }
    else{
      return false;
    }
  });
  }
  
  displayPeople(searchResults);
  searchByMultipleCriteriaPartTwo();
}

function searchByMultipleCriteria(){
  searchBySingleCriteria();
}

function searchByMultipleCriteriaPartTwo(){
  currentFunction = searchByMultipleCriteriaPartThree;
  window.promptFor("Would you like to narrow down your search with additional criteria? (YES/NO)", yesNo);
}

function searchByMultipleCriteriaPartThree(response){
  if(response === "yes" && searchResults.length > 1){
    searchByMultipleCriteria();
  }
  else{
    appPartThree();
  }
}

function displayPeople(peopleToDisplay){
  if(peopleToDisplay.length > 0){
    printToPage(peopleToDisplay.map(function(person){
      return person.firstName + " " + person.lastName;
    }).join("<hr>"));
  }
  else{
    printToPage("No people found.");
  }
}

function displayPerson(person){
  let personInfo = "First Name: " + person.firstName + "<hr>";
  personInfo += "Last Name: " + person.lastName + "<hr>";
  personInfo += "Gender: " + person.gender + "<hr>";
  personInfo += "DOB: " + person.dob + "<hr>";
  personInfo += "Height: " + person.height + "<hr>";
  personInfo += "Weight: " + person.weight + "<hr>";
  personInfo += "Eye Color: " + person.eyeColor + "<hr>";
  personInfo += "Occupation: " + person.occupation;
  printToPage(personInfo);
}

function displayDescendants(person, people, indentation = ""){
  let children = people.filter(function(el){
    return(el["parents"].includes(person["id"]));
  });
  if (children.length > 0)
  {
    descendants += (indentation + person.firstName + " " + person.lastName + "'s Children: " + children.map(c => " " + c.firstName + " " + c.lastName));
  }
  else{
    descendants += (indentation + person.firstName + " " + person.lastName + " does not have any children in the database.");
  }
  descendants += "<hr>";
  for (let i = 0; i < children.length; i++){
    displayDescendants(children[i], people, indentation + "--");
  }
  printToPage(descendants);
}

function displayImmediateFamilyOf(person, people){
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
  printToPage(immediateFamily);
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

function displayPromptMessage(promptMessage){
  document.getElementById("prompt").innerHTML = promptMessage;
}

function printToPage(textToDisplay){
  document.getElementById("mostwanted").innerHTML = textToDisplay;
}

function getUserInput(textToDisplay){
  displayPromptMessage(textToDisplay);
}

function getInputFromTextBox(){
  var response = document.getElementById("exampleTextarea").value;
  document.getElementById("exampleTextarea").value = "";
  validateResponse(response.trim());
}

function promptFor(question, isValid){
    getUserInput(question);
    valid = isValid;
    currentQuestion = question;
}

function validateResponse(response){
  if (!response || !valid(response)){
    promptFor(currentQuestion, valid);
  }
  else{
    currentFunction(response.toLowerCase());
  }
}

function validCriteria(input){
  input = input.toLowerCase().split(" ").join("");
  return (input === "firstname" || input === "lastname" || input === "gender" || input === "dob" || input === "height" || input === "weight" || input === "eyecolor" || input === "occupation");
}

function yesNo(input){
  return input.toLowerCase() == "yes" || input.toLowerCase() == "no";
}

function chars(input){
  return true;
}
