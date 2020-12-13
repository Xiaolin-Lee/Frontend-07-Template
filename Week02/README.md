学习笔记

1. line-height 不起作用. 应该设置到父元素上。
2. e.which 过时了，应该用e.button
3. insert到queue的顺序也很重要
4. 校准路径: 到start的距离越近越好

疑问
1. 为什么要区分1，和2？
1代表原本的墙，2代表曾经遍历过的节点，可目前来看，代码并没有对1 和2 分别处理？
2. path 方法中有个变量叫path, 请问这个path的作用是什么？
如果这个变量path的作用是存储从start point 到end point的路径，那示例代码里的`path.push(map[y * 100 +x]);`只是存储这个格子的值，即2。
```javascript
const table = Object.create(map);
const queue = [start];

while (queue.length) {
            let path = [];
            let [x, y] = queue.shift();

            if (x === end[0] && y === end[1]) {

                while (x !== start[0] || y!== start[0]) {
                    path.push(map[y * 100 +x]);
                    [x, y] = table[y * 100 + x];
                    await sleep(30);
                    content.children[y * 100 +x].style.backgroundColor = 'purple';
                }
                return path;
            }
            await insert(x+1, y, [x, y]);
            await insert(x-1, y, [x, y]);
            await insert(x, y+1, [x, y]);
            await insert(x, y-1, [x, y]);

            await insert(x-1, y-1, [x, y]);
            await insert(x-1, y+1, [x, y]);
            await insert(x+1, y+1, [x, y]);
            await insert(x+1, y-1, [x, y]);
        }
```
