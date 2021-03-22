import {TimeLine, Animation} from "./animation.jsx";

let tl = new TimeLine();
tl.start();
tl.add(new Animation(document.querySelector('#el').style,
    "transform",
    0,
    500,
    10000,
    0,
    null ,
    v => `translate(${v}px)`))

document.querySelector('#pause').addEventListener('click', () => {
    tl.pause();
});document.querySelector('#resume').addEventListener('click', () => {
    tl.resume();
});