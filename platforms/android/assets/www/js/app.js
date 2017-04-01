//  Christine Tamkican
//  MAD9022 : GIFTR APP
//  Due: March 31st 2017 @11:59pm
//  Date Last Modified: March 31st 2017
//  version 3.0
//  To be Installed on Phone

'use strict';

if (document.deviceready) {
    document.addEventlistener('deviceready', onDeviceReady);
} else {
    document.addEventListener('DOMContentLoaded', onDeviceReady)
}

//var key = "tamk0002";
var people = [];
var currentPerson = 0;
var currentIdea = 0;

window.addEventListener('push', function (ev){
   
    var contentDiv = ev.currentTarget.document.querySelector(".content")
    var id = contentDiv.id;
    switch (id) {
        case "index": 
            document.getElementById("savePerson").addEventListener("touchend", function(){ addPerson(); });
            document.getElementById("cancelPerson").addEventListener("touchend", function(){ displayPersonForm(); });
            document.getElementById("addPerson").addEventListener("touchstart", function(){ addingPerson(); });
            
            displayContacts();
            
            break;
            
        case "gifts":  
            
            displayGiftList();
            document.getElementById("saveGift").addEventListener("touchend", function(){ addIdea(); });
            document.getElementById("cancelGift").addEventListener("touchend", function(){ displayGiftForm(); });
            document.getElementById("addidea").addEventListener("touchstart", function(){ addingIdea(); });
            
            break;
            
        default:
            
            displayContacts();
    }
    
});

function onDeviceReady() {
    if (!localStorage.getItem("tamk0002")) {
        localStorage.setItem("tamk0002", JSON.stringify(people));
    } else {
        people = JSON.parse(localStorage.getItem("tamk0002"));
        console.log(people);
    }
    
    document.getElementById("savePerson").addEventListener("click", function(){ addPerson(); });
    document.getElementById("cancelPerson").addEventListener("click", function(){ displayPersonForm(); });
    document.getElementById("addPerson").addEventListener("touchstart", function(){ addingPerson(); });
    
    displayContacts(); 
}

function displayContacts(){
    var ul = document.getElementById("contact-list");
    ul.innerHTML = "";
    
    people.sort(compare);
    
    people.forEach(function (value) {
        
        var li = document.createElement("li");
            li.classList.add("table-view-cell");
        
        var span = document.createElement("span");
            span.classList.add("name");
        
        var a = document.createElement("a");
            a.href = "#personModal";
            a.classList.add("name");
            a.setAttribute("id", name);
            a.setAttribute("person-id", value.id);
            a.innerHTML = value.name;
        
        var g = document.createElement("a");
            g.className = "navigate-right pull-right";
            g.href = "gifts.html";
        
        var spanDob = document.createElement("span");
            spanDob.classList.add("dob");
            spanDob.innerHTML = moment(value.dob).format("MMMM DD");
        
            g.appendChild(spanDob);
            span.appendChild(a);
            li.appendChild(span);
            li.appendChild(g);
            ul.appendChild(li);
        
        li.addEventListener("touchstart", function(ev){
                currentPerson = a.getAttribute("person-id");
                console.log(currentPerson);
                editContact(currentPerson);
        })
    })                    
}

function addPerson(){
    if (currentPerson == 0){
        
        var newContact = {
            id: Date.now(),
            name: document.getElementById("name").value,
            dob: document.getElementById("dob").value,
            ideas: [],
        };
        
        people.push(newContact);
        localStorage.setItem("tamk0002", JSON.stringify(people));
        
    } else {
        
        people.forEach(function(value){
            if(value.id == currentPerson){
                value.name = document.getElementById("name").value;
                value.dob = document.getElementById("dob").value;
            }
        });
        
        localStorage.setItem("tamk0002", JSON.stringify(people));
    }
  
    displayPersonForm();
    displayContacts();  
}

function addingPerson() {
    currentPerson = 0;
    document.getElementById("name").value = "";
    document.getElementById("dob").value = "";
}

function editContact(current){
    people.forEach(function (value) {
        if(value.id == current){
            document.getElementById("name").value = value.name,
            document.getElementById("dob").value = value.dob;
        }
    })
}

function displayGiftList() { 
    var ul = document.getElementById("gift-list");
    ul.innerHTML = "";
    
    people.forEach(function (value1, index1) {
        if(value1.id == currentPerson){
            document.querySelector(".title").innerHTML = value1.name;
            value1.ideas.forEach(function (value2, index2){
              
                var li = document.createElement("li");
                    li.className = "table-view-cell media";
                    ul.appendChild(li);
                
                var span = document.createElement("span");
                    span.className = "pull-right icon icon-trash midline trashicon";
                    li.appendChild(span);
                
                var div = document.createElement("div");
                    div.classList.add("media-body");
                
                var a = document.createElement("a");
                    a.href = "#giftModal";
                    a.classList.add("giftIdea");
                    a.innerHTML = value2.idea;
                    div.appendChild(a);
                    div.setAttribute("gift-id", value2.id);
                    li.appendChild(div);
                
                li.addEventListener("touchstart", function(ev){
                    currentIdea = div.getAttribute("gift-id");
                    console.log(currentIdea);
                    editIdea(currentIdea);
                })
                
                if (value2.at != ""){
                    var p1 = document.createElement("p");
                        p1.innerHTML = value2.at;
                        li.appendChild(p1);
                }
                if (value2.url != ""){
                    var p2 = document.createElement("p");
                    var u = document.createElement("a");    
                    u.innerHTML = value2.url;
                    u.href = value2.url;
                    u.classList.add("giftURL")
                    u.setAttribute("target", "_blank");
                        li.appendChild(p2);
                        p2.appendChild(u);
                }
                if (value2.cost != ""){
                    var p3 = document.createElement("p");
                        p3.innerHTML = value2.cost;
                        li.appendChild(p3);
                }
            })
        }
    })
    
    var deleteBtns = document.querySelectorAll(".icon-trash");
    [].forEach.call(deleteBtns, function (value){
        value.addEventListener("click", deleteIdea);
    })
}

function addIdea() {
    
    if (currentIdea == 0){
        var newIdea = {
            id: Date.now(),
            idea: document.getElementById("giftIdea").value, 
            at: document.getElementById("giftStore").value, 
            cost: document.getElementById("giftCost").value, 
            url: document.getElementById("giftURL").value
        };
        people.forEach(function(value){
            if(value.id == currentPerson){
                value.ideas.push(newIdea);
            }
        })
        
        localStorage.setItem("tamk0002", JSON.stringify(people));
    } else {
        people.forEach(function (value1){
            value1.ideas.forEach(function (value2, index){
                if (value2.id == currentIdea){
                    value2.idea = document.getElementById("giftIdea").value, 
                    value2.at = document.getElementById("giftStore").value, 
                    value2.cost = document.getElementById("giftCost").value, 
                    value2.url = document.getElementById("giftURL").value
                } 
            })
        })
        localStorage.setItem("tamk0002", JSON.stringify(people));
    }
    
    displayGiftForm();
    displayGiftList();
}

function addingIdea() {
    currentIdea = 0;
    document.getElementById("giftIdea").value = "";
    document.getElementById("giftStore").value = "";
    document.getElementById("giftCost").value = "";
    document.getElementById("giftURL").value = "";
}

function deleteIdea() {
     
    people.forEach(function (value1){
        value1.ideas.forEach(function (value2, index){
            if(currentIdea == value2.id){
                value1.ideas.splice(index, 1);
                localStorage.setItem("tamk0002", JSON.stringify(people));
                displayGiftList();
            }  
        })
    })
    
}

function displayPersonForm(){
    var contactform = document.querySelector("#personModal");
    contactform.classList.toggle("active");
}

function displayGiftForm(){
    var contactform = document.querySelector("#giftModal");
    contactform.classList.toggle("active");
}

function editIdea(current) {
    people.forEach(function (value1){
        value1.ideas.forEach(function (value2, index){
            if(value2.id == current){
                document.getElementById("giftIdea").value = value2.idea;
                document.getElementById("giftStore").value = value2.at;
                document.getElementById("giftCost").value = value2.cost;
                document.getElementById("giftURL").value = value2.url;
            }
        })
    })
}

function compare(a, b) {
    if (a.dob.substring(5) < b.dob.substring(5)) return -1;
    if (a.dob.substring(5) > b.dob.substring(5)) return 1;
    return 0;
}