let rain, mute;
let thunder = [];

$(function(){
    let headclix = 0, eyesclix = 0, noseclix = 0, mouthclix = 0;
    rain = new Audio("sounds/lightRain.wav");
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
    })

    lightning(1, 4000);
    lightning(2, 5000);
    lightning(3, 7000);

    $("#head").on("click", counter(headclix));
    $("#eyes").on("click",counter(eyesclix));
    $("#nose").on("click",counter(noseclix));
    $("#mouth").on("click",counter(mouthclix));
});

function counter(clix) {
    return function () {
        if (clix < 9) {
            clix++;
            $(this).animate({left:"-=367"}, 500);
        } else {
            clix = 0;
            $(this).animate({left:"0px"}, 500);
        }
    };
}

function lightning(num, t) {
    setInterval(function () {
        $("#container #lightning" + num).fadeIn("fast").fadeOut("fast");
        if (!mute) {
            thunder[num - 1].play();
        }
    }, t);
}
