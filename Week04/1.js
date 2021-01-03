const $ = Symbol("$");
class Trie {
    constructor() {
        this.root = Object.create(null);
    }
    insert(word) {
        let node = this.root;
        for (const w of word) {
            if (!node[w]) {
                node[w] = Object.create(null)
            }
            node = node[w];
        }

        if (!($ in node)) {
            node[$] = 0;
        }

        node[$] ++;
    }
    max() {
        let max = 0;
        let maxStr = "";
        let visit = (node, str) => {
            if (!!node[$] && node[$] > max) {
                max = node[$];
                maxStr = str;
            }

            for (let p in node) {
                visit(node[p], str + p);
            }
        }

        visit(this.root, "");
        console.log(maxStr)
        console.log(max)
    }
}

function randomWord(length) {
    let s = "";
    for (let i = 0; i< length; i++) {
        s += String.fromCharCode(Math.random() * 26 + "a".charCodeAt());
    }
    return s;
}

let trie = new Trie();
for (let i = 0; i< 10; i++) {
    const str = randomWord(4);
    trie.insert(str);
}
trie.max();
console.log(trie.root)
