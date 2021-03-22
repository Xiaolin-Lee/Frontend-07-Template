import {Component} from "./framework.jsx";

export class Carousl extends Component{
    constructor() {
        super();
        this.attribute = Object.create(null);
    }
    setAttribute(name, value) {
        this.attribute[name] = value;
    }

    render() {
        this.root = document.createElement('div');
        this.root.classList.add('carousl');
        this.root.id = 'carousl';
        for (const record of this.attribute.src) {
            const img = document.createElement('div');
            img.style.backgroundImage = `url('${record}')`;
            this.root.appendChild(img);
        }
        let position = 0;
        document.addEventListener('mousedown', event => {
            const startX = event.clientX;
            const children = this.root.children;

            let move = e => {
                let movedX = e.clientX - startX;

                let current =  position - Math.round((movedX - movedX% 571 ) / 571 );
                for (const offset of [-1, 0, 1]) {
                    let pos = current + offset;
                    pos = (pos + children.length) % children.length;

                    const child = children[pos];
                    child.style.transition = "none";
                    child.style.transform =`translateX(${-pos * 571 + offset * 571 + movedX  % 571}px)`;
                }
            }

            let up = e => {
                let movedX = e.clientX - startX;
                position = position - Math.round(movedX / 571 )

                for (const offset of [0, - Math.sign(Math.round(movedX / 571 - movedX + 250 * Math.sign(movedX)))]) {
                    let pos = position + offset;
                    pos = (pos + children.length) % children.length;

                    const child = children[pos];
                    child.style.transition = "none";
                    child.style.transform =`translateX(${-pos * 571 + offset * 571}px)`;
                }
                document.removeEventListener('mousemove', move);
                document.removeEventListener('mouseup', up);
            }
            document.addEventListener('mousemove', move);

            document.addEventListener('mouseup', up);
        });

        // let currentIndex = 0;
        // let nextIndex = 0;
        // setInterval(() => {
        //     const children = this.root.children;
        //     currentIndex = currentIndex % children.length;
        //     nextIndex = (currentIndex + 1) % children.length;
        //
        //     let currentChild = children[currentIndex];
        //     currentChild.style.transform = `translate(-${currentIndex * 100}%)`;
        //
        //     let nextChild = children[nextIndex];
        //     nextChild.style.transition = "none";
        //     nextChild.style.transform = `translate( ${(currentIndex - 1) * 100}%)`;
        //
        //     setTimeout(() => {
        //         nextChild.style.transition = "";
        //         currentChild.style.transform = `translate(${- 100 - currentIndex * 100}%)`
        //         nextChild.style.transform = `translate(${- nextIndex * 100}%)`
        //     }, 16)
        //     currentIndex = nextIndex;
        // }, 5000);

        return this.root;
    }
    mountTo(parent) {
        parent.appendChild(this.render());
    }
}