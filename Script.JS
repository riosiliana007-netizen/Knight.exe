const output = document.getElementById("output");
const button = document.getElementById("continueBtn");

const intro = [
"> boot Knight.exe",
"",
"Initializing...",
"",
"Loading memories...",
"",
"Searching...",
"",
"Identity found.",
"",
"Welcome back,",
"Alejandro.",
"",
"Alias detected:",
"Knight.exe",
"",
"━━━━━━━━━━━━━━━━━━━━━━",
"",
"Location      Spokane, WA",
"Strength      ██████████",
"Intelligence  ██████████",
"Loyalty       ██████████",
"Luck          ██████░░░░",
"Friendship    ∞",
"",
"Quest Available",
""
];

let line = 0;

function typeLine(){

    if(line >= intro.length){

        button.style.display = "inline-block";
        button.classList.add("fade");
        return;

    }

    output.innerHTML += intro[line] + "\n";

    line++;

    setTimeout(typeLine, 500);

}

typeLine();

button.addEventListener("click", () => {

    button.style.display = "none";

    output.innerHTML = "";

    const quest = [

        "Today's Quest",
        "",
        "Keep moving.",
        "",
        "████████████████████",
        "",
        "Achievement Unlocked",
        "",
        "🏆 WALLS ARE DOWN",
        "",
        "One more thing...",
        "",
        "The red thread",
        "is still connected.",
        "",
        "...",
        "",
        "See you",
        "in the next chapter."

    ];

    let i = 0;

    function next(){

        if(i >= quest.length) return;

        output.innerHTML += quest[i] + "\n";

        i++;

        setTimeout(next,700);

    }

    next();

});