let rain, mute;
let thunder = [];

$(function(){
    let interval = [];
    goLightning();
    window.onblur = stopLightning;
    window.onfocus = goLightning;

    function lightning(num, t) {
        interval[num] = setInterval(function () {
            $("#container #lightning" + num).fadeIn("fast").fadeOut("fast");
            if (!mute) {
                thunder[num - 1].play();
            }
        }, t);
    }

    function endLightning(num) {
        window.clearInterval(interval[num]);
    }

    function goLightning() {
        lightning(1, 4000);
        lightning(2, 5000);
        lightning(3, 7000);
    }

    function stopLightning() {
        endLightning(1);
        endLightning(2);
        endLightning(3);
    }


    let clix = [0, 0, 0, 0];
    rain = new Audio("sounds/lightRain.wav");
    rain.loop = true;
    thunder[0] = new Audio("sounds/thunder1.mp3");
    thunder[1] = new Audio("sounds/thunder2.mp3");
    thunder[2] = new Audio("sounds/thunder3.mp3");

    mute = true;

    $("#speaker").on("click", function () {
        if (mute) {
            mute = false;
            for (let i = 0; i < 3; i++) {
                thunder[i].muted = false;
            }
            $("#speaker").attr("src", "images/muteoff.png");
            rain.play();
        } else {
            mute = true;
            for (let i = 0; i < 3; i++) {
                thunder[i].muted = true;
            }
            $("#speaker").attr("src", "images/muteon.png");
            rain.pause();
        }
    });

    $("#head").on("click", counter(0));
    $("#eyes").on("click",counter(1));
    $("#nose").on("click",counter(2));
    $("#mouth").on("click",counter(3));

    function counter(i) {
        return function () {
            if (clix[i] < 9) {
                clix[i]++;
                $(this).animate({left:"-=367"}, 500);
            } else {
                clix[i] = 0;
                $(this).animate({left:"0px"}, 500);
            }
        };
    }

    const w = 367;
    const m = 10;

    $("#btnRandom").click(function () {
        $(".face").each(function (index){
            let target_position = getRandom(m);
            let current_position = clix[index];
            clix[index] = target_position;

            if (target_position > current_position) {
                let move_to = (target_position - current_position) * w;
                $(this).animate({left:"-=" + move_to + "px"}, 500);
            } else if (target_position < current_position) {
                let move_to = (current_position - target_position) * w;
                $(this).animate({left:"+=" + move_to + "px"}, 500);
            }
        });
    });

    $("#btnReset").click(function () {
        $(".face").each(function (index){
            $(this).animate({left: "0px"}, 500);
            clix[index] = 0;
        });
    });

    $("#btnDownload").click(function () {
        printToFile($("#frame").get(0));
    });

    function getRandom(num) {
        return Math.floor(Math.random()*num);
    }

    function downloadURI(uri, name) {
        let link = document.createElement("a");
        link.download = name;
        link.href = uri;
        link.click();
        //clearDynamicLink(link);
    }

    function printToFile(div) {
        html2canvas(div).then(function (canvas) {
                let myImage = canvas.toDataURL("image/png");
                //create your own dialog with warning before saving file
                //beforeDownloadReadMessage();
                //Then download file
                downloadURI("data:" + myImage, "monster.png");
        });
    }
});