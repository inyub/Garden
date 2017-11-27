"use strict";
$(document).ready(function() {
    console.log("ready");

    let buffActive = 0;
    let collectedCorn = 15;
    let collectedFeathers = 0;
    let collectedNests = 1;
    let summonBirdCost = 15;
    let collectedBirdTypes = [];
    let collectedBirds = 0;

    var pnlLog = document.getElementById("log-box");
    pnlLog.scrollTop = pnlLog.scrollHeight;

    function addToLog(str) {
        $('<li />', {html: str}).appendTo('ul.log')       
        pnlLog.scrollTop = pnlLog.scrollHeight;
    }

 
    $("#btn-energy").click(function() {
        user.refillEnergy(1);
    })
    $("#btn-walk").click(function(){
        user.goForAWalk(buffActive);
    });
    $("#btn-summon").click(function() {
        if (collectedCorn >= 15) {
            collectedCorn = collectedCorn-15;
            if (collectibles.length === 0) {
                console.log("You tamed all the Birds");
            } else {
                addToLog("You put 15 corns in your hand.");
                let group = Math.floor(Math.random()*collectibles.length);
                let i = Math.floor(Math.random()*collectibles[group].length);
                console.log(collectibles[group][i]);
                collectibles[group][i].visits(group,i);
            }
        } else {
            addToLog("Not enough Corn...");
        }
        
    });
    $("#btn-watch").click(function() {
        user.visitNest(buffActive);
    })


    //===========================================
    //================= KLASSEN =================
    //===========================================
    let birdRarity = ["Common", "Rare", "Super Rare", "Legendary"];
    let commonGroup = [];
    let rareGroup = [];
    let superRareGroup = [];
    let legendaryGroup = [];

    let collectibles = [commonGroup, rareGroup, superRareGroup, legendaryGroup];

     class Bird {
         constructor(name, type, rarity, featherRate, tameChance, tameStatus) {
             this.name = name;
             this.type = type;
             this.rarity = rarity;
             this.featherRate = featherRate;
             this.tameChance = tameChance;
             this.tameStatus = tameStatus;

             if (this.rarity === "Common") {
                commonGroup.push(this); 
             } else if (this.rarity === "Rare") {
                 rareGroup.push(this);
             } else if (this.rarity === "Super Rare") {
                 superRareGroup.push(this);
             } else {
                 legendaryGroup.push(this);
             }
         }
         visits(group, i) {   
            $("#my-corn").text("Corn: " + collectedCorn);
            let self = this;
            console.log(self.name + " (" + self.type + ")" + " is here.");
            addToLog(self.name + " (" + self.type + ")" + " is here.");
            let birdCounter = 0;
            let birdVisit = setInterval(function()  {
                birdCounter++;
                console.log(self.name + " (" + self.type + ")" + " is eating " + birdCounter + ". corn...");
                if (birdCounter%5 === 0) {
                    console.log("Thankful for the Corn " + self.name + " (" + self.type + ")" + " has something for you.");
                    addToLog("Thankful for the Corn " + self.name + " (" + self.type + ")" + " has something for you.");
                    self.leavesFeather();
                }
                if (birdCounter >= 15) {
                    let tryTame = Math.random();
                   
                        console.log("Taming Roll: " +  tryTame);
                        if (self.tameChance <= tryTame) {
                            self.tame();
                            collectibles[group].splice($.inArray(collectibles[group][i], collectibles[group]), 1);
                            if (collectibles[group].length === 0) {
                                collectibles.splice($.inArray(collectibles[group], collectibles), 1);
                            }
                            console.log(collectibles);
                        } else {
                            console.log("After eating all Corn, " + self.name + " (" + self.type + ")" + " flies away...");
                            addToLog("After eating all Corn, " + self.name + " (" + self.type + ")" + " flies away...");
                        }
                    
                    
                    clearInterval(birdVisit);
                }
            }, 1000);
         }
         
         leavesFeather() {
            let newFeathers = Math.floor((Math.random() * this.featherRate) +1);
            collectedFeathers = collectedFeathers + newFeathers;
            console.log("Feather x"+ newFeathers);
            $("#my-feathers").text("Feathers: " + collectedFeathers);
        }
        tame() {
            this.tameStatus = 1;
            console.log("You tamed " + this.name+ " (" + this.type + ")");
            addToLog("You tamed " + this.name+ " (" + this.type + ")");
            collectedBirds = collectedBirds + 1;
            let tamedBird = " " + this.name + " " + this.type;
            collectedBirdTypes.push(tamedBird);
            console.log(collectedBirdTypes);

            //let tamedBird = jQuery.inArray(this, collectibles)

            $("#my-birds").text("Birds: " +  collectedBirds);
            $("#my-bird-names").text(collectedBirdTypes);

            let self = this;
            let counter = 0;
            let time = setInterval(function() {
                counter++;
                //collectedCorn = collectedCorn - 1;
                //$("#my-corn").text("Corn: " + collectedCorn);
                if (counter === 10) {
                    self.leavesFeather();
                    counter = 0;
                }
                if (collectedCorn === 0) {
                    self.leave();
                    counter = 0;
                }
                if (jQuery.inArray(tamedBird, collectedBirdTypes)) {
                    clearInterval(time);
                    console.log(collectedBirdTypes);
                }
                console.log(counter + " eaten by " + self.name);
            }, 1000);
        }
        leave() {
            let tamedBird = " " + this.name + " " + this.type;
            collectedBirdTypes.splice($.inArray(tamedBird, collectedBirdTypes), 1);
            console.log(collectedBirdTypes);
            console.log(this.name + " leaves");
            collectedBirds = collectedBirds - 1;
            $("#my-birds").text("Birds: " +  collectedBirds);
            $("#my-bird-names").text(collectedBirdTypes);
        }
     } 

     var currentXp = 0;
     var nextLevelUp = 20;
     class Player {
        constructor(name, level, experience, energy, maxEnergy, totalExperience) {
            this.name = name;
            this.level = level;
            this.experience = experience;
            this.energy = energy;
            this.maxEnergy = maxEnergy;   
            this.totalExperience = totalExperience;
        }

        refillEnergy(i) {
            if (this.energy < this.maxEnergy) {
                this.energy++;
                $("#my-energy").text("Energy: " + this.energy + "/" + this.maxEnergy);
            }
        }
        refillEnergyOverTime(i) {
            let self = this;
            let energyOverTime = setInterval(function(){
                if (self.energy < self.maxEnergy) {
                    self.energy = self.energy + i;
                } else {
                    clearInterval(energyOverTime);
                }
                $("#my-energy").text("Energy: " + self.energy + "/" + self.maxEnergy);
            }, 1000)
        }
        gainExperience (amount) {
            console.log("EXP erhalten: " + amount);
            addToLog("You gained " + amount + " EXP!"); 
            this.experience += amount;
            this.totalExperience += amount;
            $("#my-exp").text("EXP: " + this.experience + "/" + nextLevelUp);
            if (this.experience >= nextLevelUp) {
                this.levelUp();
            }
        }
        levelUp() {
            this.experience = 0;
            nextLevelUp += 20 * this.level;
            $("#my-exp").text("EXP: " + this.experience + "/" + nextLevelUp);
            addToLog("You reached level " + this.level +"! Plus 5 Energy. Next Level Up in " + nextLevelUp + "EXP!")
            console.log("Erreiche " + nextLevelUp);
            this.level += 1;
            this.maxEnergy += 5;
            $("#my-level").text("Level: " + this.level);
            $("#my-energy").text("Energy: " + this.energy + "/" + this.maxEnergy);
        }

        // Spieler Aktionen
        
        goForAWalk(buff) {
            if (this.energy < 10) {
                console.log("Not enough Energy");
                return;
            }
            this.energy = this.energy - 10;
            $("#my-energy").text("Energy: " + this.energy + "/" + this.maxEnergy);
            let self = this;
            let walkCounter = 0;
            let walkTimer = setInterval (walking, 1000);
            console.log("You decide to go for a walk, maybe you find something...");
            addToLog("You decide to go for a walk, maybe you find something...");
            function walking() {
                if (walkCounter === 6) {
                    clearInterval(walkTimer);
                    self.refillEnergyOverTime(1);
                    let findChance = Math.random();
                    let nestChance = 0.3 + buff;
                    console.log("Find Chance: " + findChance);
                    if(findChance <= nestChance) {
                        self.findNests();
                    }
                    if (findChance <= 0.6) {
                        self.findFeathers(2);
                    } else if (findChance <= 0.8) {
                        self.findCorn();
                    }
                    self.findCorn();
                    user.gainExperience(5); 
                    console.log("You head home again...");
                    addToLog("You head home again...");
                } else {
                    walkCounter = walkCounter + 1;
                    console.log(walkCounter + "/6");
                }
            }
        }

        visitNest(buff) {
            let self = this;
            if (collectedNests === 0) {
                alert("You don't know where to go.. Maybe you should go for a walk and look out for some Nests...");
                return;
            } else {
                console.log("You decide to visit some Nests to watch some of these beautiful Birds");
                let watchCounter = 0;
                let watchTimer = setInterval(function() {
                    watchCounter++;
                    console.log(watchCounter + "/10");
                    if (watchCounter === 10) {
                        let featherChance = 10 - buffActive;
                        console.log("Something catches your eye...")
                        self.findFeathers(featherChance);
                        console.log("Thankfully you are heading home again...");
                        clearInterval(watchTimer);
                    }
                }, 1000);
               
            }
        }
        // Passiv: Find Actions
        findCorn() {
            let newCorn =  Math.floor((Math.random()*4)+1)
            collectedCorn = collectedCorn + newCorn;
            console.log("Corn x" +  newCorn);
            addToLog("Corn x" +  newCorn);
            $("#my-corn").text("Corn: " + collectedCorn);
        }
        findFeathers(chance) {
            let newFeathers = Math.floor((Math.random() * chance) +1);
            collectedFeathers = collectedFeathers + newFeathers;
            console.log("Feather x"+ newFeathers);
            addToLog("Feather x"+ newFeathers);
            $("#my-feathers").text("Feathers: " + collectedFeathers);
        }
        findNests() {
            collectedNests = collectedNests + 1;
            console.log("A new Nest!");
            addToLog("A new Nest!");
            $("#my-nests").text("Nest: " + collectedNests);
        }
     }
     //Character Creation
     let  userName = "Player";//prompt("Who are you?");
     let user = new Player(userName, 1, 0, 10, 10, 0);
     $("#my-name").text("Name: " + user.name);
     $("#my-level").text("Level: " + user.level);
     $("#my-exp").text("EXP: " + user.experience);
     $("#my-energy").text("Energy: " + user.energy + "/" + user.maxEnergy);

     console.log(user);
     //user.goForAWalk(buffActive);
     //user.gainExperience(10);


//----------------------------------------------------------------
//=======================>>> BIRD LIST <<<========================
//----------------------------------------------------------------
let zack = new Bird("Zack", "Sparrow", "Common", 10, 0.3, 0);
let lioba = new Bird("Lioba", "Bluebird", "Common", 2, 0.4, 0);
let lucien = new Bird("Lucien", "Fieldfare", "Common", 5, 0.5, 0);

let cookie = new Bird("Cookie", "Green Cochoa", "Rare", 2, 0.2, 0);
let keiya = new Bird("Keiya", "Blackbird", "Rare", 3, 0.5, 0);
let tobi = new Bird("Tobi", "Veery", "Rare", 2, 0.5, 0);

let jamie = new Bird("Jamie", "Robin", "Super Rare", 2, 0.2, 0);

let akira = new Bird("Akira", "Toriyama", "Legendary", 5, 0.4, 0);

collectibles[1][1].tame();
//collectibles[0][0].tame();
//collectibles[1][1].leave();
});

/*
Player startet auf level 1 und hat am Anfang 10 Energie
Spatzieren gehen kostet x Energie und gibt x EXP
Vögel beobachten kostet x Energie und gibt x EXP
Level Up gibts nach xx EXP und erhöht sich zum nächsten Ziel
Leve Up gibt mehr Energie

Idee: Wenn Vogel: Erschrecken (=x Federn) || Zähmen (Chance X)
Idee: Mit Energie durch Beeren, Vögel könnten Beeren mitbringen.

Geh spazieren: 1-2 Federn || 3-5 Körner || Kann Nest Vogelart x entdecken / 20 min
Nest entdeckt: Vögel beobachten 5-15 Federn / 30 min (bzw je nach Vogelart)

Farmer: Federn tauschen gegen Körner 1:5 (option automatisch tauschen)

Vogel anlocken: 15 Körner = 1 Feder / 5 min für 15-30 min || Chance auf Zahm 0.1

Korn Feld anlegen: 500 Körner = 10 Körner / 10 min
Vogelscheuche: 80 Federn 1 pro Feld, Feld produziert +5

Vogelhäuser befüllen: 100 Körner = Lockt 10 Vögel an = 10 Federn / 5 min für 45-60 min  || chance auf Zahm

Zahmer Vogel: 1 Feder / 10 min // Collectibles - Level der gefundenen Nester relevant

Bier: 150 Körner = Chance auf Nest +x%

Vögel
*/
/* 
<li class='bird1'> >`)<br> ( \xa0 \\<br>\xa0 ^</li>
    <li class='bird1'> (\"<<br> / \xa0 )<br>\xa0 L</li>
>o)
(_>

<o)
(_> 

         .-.                                              .-.
        (. .)__.')                                  (`.__(. .)
        / V      )                                  (      V \
  ()    \  (   \/                                    \/   )  /    ()
<)-`\()  `._`._ \                                    / _.'_.'  ()/'-(>
  <)_>=====<<==`'====================================`'==>>=====<_(>
 <>-'`(>                                         hjw          <)'`-<>


>o)
  ( \

 >o)
 ( \
  |

  >`)
  ( \
   ^

 ("<
 / )
  L

  f
 >@)
 ( \
  Z

 ~('>
  / )
   4

   
    function catchBird() {
        let cage = $.parseHTML("<ul id='cage'></ul")
        let bird1 = $.parseHTML("<li class='bird1'> >°)<br> ( \xa0 \\<br>\xa0 ^</li>");
        $("body").append(cage);
        $("#cage").append(bird1);
    }

    function addToLog(str) {
        let log = $.parseHTML("<ul id='log'></ul>")
        let entry = $.parseHTML("<li class='entry'></li");
        $("#log-box").append(log);
        $("#log").append(entry);
        $("#entry").append(str);
        $("#entry").append(<br>);
    }
 
    let group = Math.floor(Math.random()*collectibles.length);
            let i = Math.floor(Math.random()*collectibles[group].length);
            console.log(collectibles[group][i]);
            collectibles[group][i].visits();
            collectibles[group].splice($.inArray(collectibles[group][i], collectibles[group]), 1);
            if (collectibles[group].length === 0) {
                collectibles.splice($.inArray(collectibles[group], collectibles), 1);
            }
            console.log(collectibles);
 */