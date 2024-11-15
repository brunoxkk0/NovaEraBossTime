const BOSSES = [];
let interval;
let CURRENT_MODE = "BOSS";

const requestPermission = () => {

    if (Notification.permission !== "granted") {

        alert("Ative as notificações para utilizar a ferramenta.");

        Notification.requestPermission().then(permission => {

            if(permission !== "granted"){
                requestPermission();
            }else{
                console.log("Permissão garantida.");
            }

        });
    }
}

document.addEventListener("DOMContentLoaded", evt => {

    requestPermission();

    let times = document.querySelectorAll('input[type="time"]');

    times.forEach(el =>{

        let horaAgora = new Date();
        el.value = `${horaAgora.getHours().toString().padStart(2,'0')}:${horaAgora.getMinutes().toString().padStart(2,'0')}`

    })

    interval = setInterval(() => {

        times.forEach(el => {

            let horaAgora = new Date();
            let boss = BOSSES[el.getAttribute("tag")];

            if(!boss){

                el.value = `${horaAgora.getHours().toString().padStart(2,'0')}:${horaAgora.getMinutes().toString().padStart(2,'0')}`

            }else{

                let horaFinal = new Date(boss.resetTime)

                el.value = `${horaFinal.getHours().toString().padStart(2,'0')}:${horaFinal.getMinutes().toString().padStart(2,'0')}`

                updateStatus(el.getAttribute("tag"))

                if(boss.resetTime <= horaAgora.getTime()){

                    delete BOSSES[el.getAttribute("tag")];
                    doAlert(el.getAttribute("tag"));

                }

            }
        })
    }, 500)

    updateTabState()
})

const onBossDeath = (boss, type) => {

    BOSSES[boss] = {
        resetTime: (new Date().getTime() + (type === 'TOWER' ? ((19 * 60 + 50) * 1000) : ((type === 'YELLOW' ? 59 : 29) * 60 * 1000))),
        alive: false
    }

    updateStatus(boss)

    console.log(BOSSES)
}

const doAlert = (boss) => {

    let name = document.querySelectorAll('input[type="text"]' + `[tag="${boss}"]`)[0];
    let bossName = name.value ? name.value : name.placeholder;

    new Notification("Seu boss vai nascer em breve.", {
        body: "Boss: " + bossName + ".",
        icon: "./src/logo.png"
    })

    const audio = new Audio("./src/alert.wav");
    audio.volume = 0.15;
    audio.play();

    updateStatus(boss)
}

const updateStatus = (boss) => {

    let status = document.getElementById(`${boss}`);

    if(BOSSES[boss]){
        status.style.backgroundColor = "#ff0000"
    }else{
        status.style.backgroundColor = "#08d202"
    }

}

const updateTabState = () => {

    if(CURRENT_MODE === "BOSS"){
        document.querySelector("#BOSSES_BUTTON").toggleAttribute("currentMode")
        document.querySelector("#TOWER_BUTTON").removeAttribute("currentMode")
    }else{
        document.querySelector("#TOWER_BUTTON").toggleAttribute("currentMode")
        document.querySelector("#BOSSES_BUTTON").removeAttribute("currentMode")
    }


    switch(CURRENT_MODE){
        case "BOSS":{
            document.querySelector("#BOSS_CONTENT").style.display = "table"
            document.querySelector("#TOWER_CONTENT").style.display = "none"
            break;
        }
        case "TOWER":{
            document.querySelector("#TOWER_CONTENT").style.display = "table"
            document.querySelector("#BOSS_CONTENT").style.display = "none"
            break;
        }
    }

}

const updateTab = (tab) => {

    if(CURRENT_MODE === tab)
        return;

    CURRENT_MODE = tab;
    updateTabState();
}