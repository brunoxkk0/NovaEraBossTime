const BOSSES = [];
let interval;

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

    let times = document.querySelectorAll('input[type="time"]');

    times.forEach(el =>{

        let horaAgora = new Date();
        el.value = `${horaAgora.getHours()}:${horaAgora.getMinutes()}`

    })

    interval = setInterval(() => {

        times.forEach(el => {

            let horaAgora = new Date();
            let boss = BOSSES[el.getAttribute("tag")];

            if(!boss){

                el.value = `${horaAgora.getHours()}:${horaAgora.getMinutes()}`

            }else{

                let horaFinal = new Date(boss.resetTime)

                el.value = `${horaFinal.getHours()}:${horaFinal.getMinutes()}`

                updateStatus(el.getAttribute("tag"))

                if(boss.resetTime <= horaAgora.getTime()){

                    delete BOSSES[el.getAttribute("tag")];
                    doAlert(el.getAttribute("tag"));

                }

            }
        })
    }, 500)

})

const onBossDeath = (boss, type) => {

    console.log("MALANDRA")

    BOSSES[boss] = {
        resetTime: (new Date().getTime() + ((type === 'YELLOW' ? 59 : 29) * 60 * 1000)),
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