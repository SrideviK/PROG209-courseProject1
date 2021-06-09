let sportsArray = [];
let selectedType = "";
let subSetType="";
let subList=[];

// define a constructor to create sport objects
let SportObject = function (pTeamName, pPlayerName, pSport, pYear, pUrl) {
    //this.ID = sportsArray.length; // auto assign id
    this.ID = Math.random().toString(16).slice(5)  // tiny chance could get duplicates!
    this.team = pTeamName;
    this.player = pPlayerName;
    this.sport=pSport;
    this.year = pYear;
    this.url = pUrl;
}

//test data
 //sportsArray.push(new SportObject("Seahawks", "Russel Wilson", "Football", 2020, "https://www.youtube.com/watch?v=-0-2as8ugrI"));
 //sportsArray.push(new SportObject("Lakers", "LeBron James", "Basketball", 2021, "https://www.youtube.com/watch?v=AA94L3ut0Ng"));
 //sportsArray.push(new SportObject("Bucaneers", "Tom Brady", "Football", 2021, "https://www.youtube.com/watch?v=O7Di8ZpJnm8"));

document.addEventListener("DOMContentLoaded", function (event) {

    document.getElementById("buttonSave").addEventListener("click", function () {

        let playername=document.getElementById("playername").value;
        let teamname=document.getElementById("teamname").value;
        let year=document.getElementById("year").value;
        let video=document.getElementById("url").value;

        console.log("current url == " + video);

        // prepend "https://" to a url to avoid error when clicking highlights
        let chechkStr = video.substring(0,8);
        console.log("website prefix = " + chechkStr);
        console.log("check lowercase = " + chechkStr.toLowerCase());
        if(chechkStr.toLowerCase() != "https://"){
            video = "https://" + video;
        }
        console.log("current video string = " + video);

        if (playername != "" && teamname != "" && year != "" && selectedType != "" && video != ""){
            let newSport= new SportObject( teamname,playername,selectedType,year,video) ;
 
            $.ajax({
                url : "/AddSport",
                type: "POST",
                data: JSON.stringify(newSport),
                contentType: "application/json; charset=utf-8",
                dataType   : "json",
                success: function (result) {
                    console.log(result);
                }
            });
           // sportsArray.push ( new SportObject(teamname,playername,selectedType,year,video) );
        }
        else{
            alert("Please enter all the details to save")
        }
        document.getElementById("playername").value="";
        document.getElementById("teamname").value="";
        document.getElementById("year").value = "";    
        document.getElementById("url").value = "";  
    });

    $(document).bind("change", "#select-type", function (event, ui) {
        selectedType = document.getElementById("select-type").value;
    });

    $(document).on("pagebeforeshow", "#display", function (event) {  
        document.getElementById("default-text1").style.display="none";
        document.getElementById("select-sport").style.display="flex";
        createList();
    });

    // displays info when li is clicked
    $(document).on("pagebeforeshow", "#displaysubset", function (event) {  
        // $.get("/getAllSports", function(data, status){  // AJAX get
        //     sportsArray = data;  // put the returned server json data into our local array
            //let localID = document.getElementById('IDparmHere').innerHTML;
            let myID=localStorage.getItem('parmKey');
            console.log("localID = " + myID);
            let arrayPointer = GetArrayPointer(myID);
            console.log("arrayPointer = " + arrayPointer);
            sportsArray=JSON.parse(localStorage.getItem('arrayKey'));
            console.log("Test"+localStorage.getItem('arrayKey'));

            document.getElementById('team').innerHTML = "Team: " + sportsArray[arrayPointer].team;
            document.getElementById('player').innerHTML = "Player: " + sportsArray[arrayPointer].player;
            document.getElementById('currentID').innerHTML = "Team Id: " + sportsArray[arrayPointer].ID;
            document.getElementById('yearFound').innerHTML="Year founded: "+sportsArray[arrayPointer].year;
            console.log("current url = " + sportsArray[arrayPointer].url);
            document.getElementById('highlightUrl').innerHTML = sportsArray[arrayPointer].url;
      //  });
    });

    document.getElementById("DeleteItem").addEventListener("click", function () {
        deleteElement(localStorage.getItem('parmKey'));
    });

    $(document).bind("change", "#subSetType", function (event, ui) {
        subSetType = document.getElementById("subSetType").value;
    });

    document.getElementById("Show").addEventListener("click", function () {
        createSubList(subSetType);
    });

    document.getElementById("highlights").addEventListener("click", function () {
        window.open(document.getElementById("highlightUrl").innerHTML);
    });
});

function GetArrayPointer(localID) {
    sportsArray=JSON.parse(localStorage.getItem('arrayKey'));
    for (let i = 0; i < sportsArray.length; i++) {
        console.log("i = " + i + " +++++ " + sportsArray[i].ID);
        if (localID == sportsArray[i].ID) {
            return i;
        }
    }
}

function createList() {
    let myul = document.getElementById("myul");
    myul.innerHTML="";
    console.log("in the createList()...");

    $.get("/getAllSports", function(data, status){  // AJAX get
        sportsArray = data;  // put the returned server json data into our local array
        sportsArray.forEach(function (element,) {
            displayElements(element);
        });
        actiavteElements(sportsArray);
    });
};

function createSubList(sport){
    let myul = document.getElementById("myul");
    myul.innerHTML="";

    sportsArray.forEach(function (element,) { 
        if(element.sport==sport){
            displayElements(element);
        }
        else  if(sport == "All") {
            displayElements(element);
        }
    });

    if(myul.childElementCount==0){
        let p = document.createElement('p');
            p.innerHTML="No details have been added for this sport";
            myul.appendChild(p);
    }
    else{
        actiavteElements();
    }  
};

function actiavteElements(sportsArray){
    let liArray = document.getElementsByClassName('oneSport');

    let stringData=JSON.stringify(sportsArray);
    localStorage.setItem('arrayKey',stringData);

    Array.from(liArray).forEach(function(element,){

        element.addEventListener('click',function(){
            let parm = this.getAttribute('data-parm');
            console.log("parm Id = " + parm);
            //document.getElementById('IDparmHere').innerHTML = parm;
            localStorage.setItem('parmKey', parm);
           
            document.location.href="index.html#displaysubset";
        });
    });
};

function displayElements(element){
    let li = document.createElement('li');
    li.classList.add('oneSport'); // adding a class name to each one as a way of creating a collection
    li.setAttribute("data-parm",element.ID);
    li.innerHTML = element.sport + ":" 
               // + "<br> &emsp;Your Favourite team is - " + element.team 
                + "<br> &emsp;Player - " + element.player;
                + "<br><br>";
    myul.appendChild(li);
}

function deleteElement(id){
    console.log("id to delete = " + id);

    $.ajax({
        type: "DELETE",
        url: "/DeleteSport/" + id,
        success: function(result){
            console.log(result);
        },
        error: function (xhr, textStatus, errorThrown) {  
            console.log('Error in Operation');  
            alert("Server could not delete Sport with ID " + id)
        }   
    });
    document.location.href = "index.html#display";
}


