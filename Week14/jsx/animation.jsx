const TICK = Symbol('tick');
const TICK_HANDLER = Symbol('tick-handler')
const ANIMATIONS = Symbol('animation')
const START_TIME = Symbol('add-time');
const PAUSE_START = Symbol('pause-start');
const PAUSE_TIME = Symbol('pause-time');

export class TimeLine {
    constructor() {
        this[ANIMATIONS] = new Set();
        this[START_TIME] = new Map();
        this[PAUSE_TIME] = 0;
        this.isPaused = false;
    }

    start() {
        const startTime = Date.now();
        this[TICK] = () =>  {
            let now = Date.now();
            for (const animation of this[ANIMATIONS]) {
                let duration = this.getDuration(animation, startTime, now);
                if (animation.duration < duration) {
                    this[ANIMATIONS].delete(animation);
                    duration = animation.duration;
                }
                animation.receive(duration);
            }
            this[TICK_HANDLER] = requestAnimationFrame(this[TICK])
        }

        this[TICK]();
    }

    getDuration(animation, startTime, now) {
        if (this[START_TIME].get(animation) < startTime) {
            return now - startTime - this[PAUSE_TIME]
        }
        return now - this[START_TIME].get(animation) - this[PAUSE_TIME];
    }

    pause() {
        if (!this.isPaused) {
            this.isPaused = true;
            this[PAUSE_START] = Date.now();
            cancelAnimationFrame(this[TICK_HANDLER]);
        }
    }

    resume() {
        if (this.isPaused) {
            this[PAUSE_TIME] += Date.now() - this[PAUSE_START] || 0;
            this.isPaused = false;
            this[TICK]();
        }
    }

    reset() {}

    add(animation, startTime) {
        if (arguments.length < 2) {
            startTime = Date.now();
        }
        this[ANIMATIONS].add(animation);
        this[START_TIME].set(animation, startTime);
    }
    remove() {}
}

export class Animation {
    constructor(object, property, startValue, endValue, duration,delay, timingFunction, template) {
        this.object = object;
        this.property = property;
        this.startValue = startValue;
        this.endValue = endValue;
        this.duration = duration;
        this.timingFunction = timingFunction;
        this.delay = delay;
        this.template = template;
    }

    receive(time) {
        console.log(time)
        let range = this.endValue - this.startValue
        this.object[this.property] =  this.template(this.startValue + range * time /this.duration);
    }
}