let obj = {
    r: 0,
    g: 0,
    b: 0
}
let callbacks = new Map();
let usedActivities = [];
let reactivities = new Map();
let po = reactive(obj);

effect(() => {
    document.getElementById('can').style.backgroundColor = `rgb(${po.r}, ${po.g}, ${po.b})`;

    document.getElementById("r").value = po.r;
    document.getElementById("g").value = po.g;
    document.getElementById("b").value = po.b;
});

document.getElementById('r').addEventListener("input", event => po.r = event.target.value);
document.getElementById('g').addEventListener("input", event => po.g = event.target.value);
document.getElementById('b').addEventListener("input", event => po.b = event.target.value);


function effect(callback) {
    usedActivities = [];
    callback();

    for (const usedActivity of usedActivities) {
        if (!callbacks.get(usedActivity[0])) {
            callbacks.set(usedActivity[0], new Map())
        }

        if (!callbacks.get(usedActivity[0]).get(usedActivity[1])) {
            callbacks.get(usedActivity[0]).set(usedActivity[1], []);
        }
        callbacks.get(usedActivity[0]).get(usedActivity[1]).push(callback);
    }
}
function reactive(object) {
    if (reactivities.has(object)) {
        return reactivities.get(object);
    }
    let proxy = new Proxy(object, {
        set: (obj, prop, value) => {
            obj[prop] = value;
            if (callbacks.get(obj) && callbacks.get(obj).get(prop)) {
                for (const callback of callbacks.get(obj).get(prop)) {
                    callback();
                }
            }
            return obj[prop];
        },
        get: (obj, prop) => {
            usedActivities.push([obj, prop])
            if (typeof obj[prop] === 'object') {
                return reactive(obj[prop]);
            }
            return obj[prop];
        }
    });

    reactivities.set(object, proxy);
    return proxy
}