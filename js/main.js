"use strict";
$(document).ready(function() {
    console.log("ready");
    
    // INTERFACE
    //===// Buttons
    $("#btn-energy").click(function() {
        user.refillEnergy(1);
    });
    $("#btn-exp").click(function() {
        user.gainExperience(1);
    });
    $("#btn-walk").click(function(){
        user.goForWalk();
    });
    
    //===// Log
    let pnlLog = document.getElementById("log-box");
    pnlLog.scrollTop = pnlLog.scrollHeight;
    function addToLog(str) {
        $('<li />', {html: str}).appendTo('ul.log');
        pnlLog.scrollTop = pnlLog.scrollHeight;
    }

    function loadingDots(time) {
        let count = 0;
        $('<li id="loading">'+ "." +'</li>').appendTo('ul.log');
        pnlLog.scrollTop = pnlLog.scrollHeight;
        let dots = ".";
        let dotsAnim = setInterval(() => {
            if (count === time) {
                $("#loading").remove();
                clearInterval(dotsAnim);
            } else if (dots === "...") {
                dots = ".";
                $("#loading").text(dots);
            } else {
                dots += ".";
                $("#loading").text(dots);
            }
            count++;
        },1000);   
    }
    
      
    // USER VARIABLES
    let currentXp = 0;
    let nextLevelUp = 20;
    
    let collectedCorn = 0;
    let collectedFeathers = 0;
    let collectedNests = 0;
    let collectedBirds = 0;
    
    // USER CLASS
    class Player {
        constructor(name, level, energy, maxEnergy, experience, totalExperience) {
            this.name = name;
            this.level = level;
            this.energy = energy;
            this.maxEnergy = maxEnergy;
            this.experience = experience;
            this.totalExperience = totalExperience;
        }
        introText() {
            addToLog("You wake up, bright light shines through your window and promises a beautiful day. You go to your window and look outside. The Garden waits for you...");
        }
        
        // refills Energy on click up to maxEnergy
        refillEnergy(i) {
            if (this.energy < this.maxEnergy) {
                this.energy++;
                $("#my-energy").text("Energy: " + this.energy + "/" + this.maxEnergy);
            } else {
                console.log("Max Energy reached");
            }
        }
        
        // refills Energy over time
        refillEnergyOverTime(i) {
            let energyOverTime = setInterval(() => {
                if (this.energy < this.maxEnergy) {
                    this.refillEnergy(i);
                } else {
                    addToLog("You're full of energy")
                    clearInterval(energyOverTime);
                } 
            }, 1000);
        }
        
        // Lose Energy
        loseEnergy(i) {
            this.energy = this.energy - i;
            $("#my-energy").text("Energy: " + this.energy + "/" + this.maxEnergy);
        }
        
        // Gain Experience
        gainExperience(amount) {
            addToLog("You gained " + amount + " EXP!"); 
            this.experience += amount;
            this.totalExperience += amount;
            $("#my-exp").text("EXP: " + this.experience + "/" + nextLevelUp);
            if (this.experience >= nextLevelUp) {
                this.levelUp();
            }
        }
        
        // Level Up
        levelUp() {  
            this.level += 1;
            this.maxEnergy += 5;
            $("#my-level").text("Level: " + this.level);
            $("#my-energy").text("Energy: " + this.energy + "/" + this.maxEnergy);
            
            this.experience = 0;
            nextLevelUp += this.level*5;
            $("#my-exp").text("EXP: " + this.experience + "/" + nextLevelUp);
            addToLog("You reached level " + this.level +"!<br>Max Energy +5.<br>Next Level Up in " + nextLevelUp + "EXP!");
        }
        
        // Player Inventory
        updateInvetory() {
            $("#my-corn").text("Corn: " + collectedCorn);
            $("#my-feathers").text("Feathers: " + collectedFeathers);
            $("#my-nests").text("Nest: " + collectedNests);
            $("#my-birds").text("Birds: " +  collectedBirds);
        }
        
        // Player Actions
        goForWalk() {
            if (this.energy < 10) {
                addToLog("You're too tired to take a walk...");
            } else {
                let walkCounter = 0;
                let walkLength = 10;
                this.loseEnergy(10);
                
                addToLog("You decide to take a walk, maybe you find something...");
                loadingDots(walkLength); // log indicator that stuff is happening
                
                let walking = setInterval(() => {
                    if (walkCounter === walkLength) {
                        this.findCorn();
                        this.findFeather(1);
                        addToLog("You head home again.");
                        this.gainExperience(5);
                        this.refillEnergyOverTime(1);
                        clearInterval(walking);
                    } else { 
                        walkCounter++;
                    }
                }, 1000);
            }
        }
        
        findCorn() {
            let newCorn =  Math.floor((Math.random()*4)+1)
            collectedCorn = collectedCorn + newCorn;
            addToLog("You picked up " + newCorn + "x Corn");
            this.updateInvetory();
        }
        
        findFeather(chance) {
            let newFeathers = Math.floor((Math.random() * chance) +1);
            collectedFeathers = collectedFeathers + newFeathers;
            addToLog("You found " + newFeathers + "x Feather");
            this.updateInvetory;
        }
        
    } // USER CLASS END
    
    // USER CREATED
    let userName = "TestPlayer";
    let user = new Player(userName, 1, 0, 10, 0, 0);
    user.introText();
    $("#my-name").text("Name: " + user.name);
    $("#my-level").text("Level: " + user.level);
    $("#my-exp").text("EXP: " + user.experience);
    $("#my-energy").text("Energy: " + user.energy + "/" + user.maxEnergy);
    user.refillEnergyOverTime(1);
    
});