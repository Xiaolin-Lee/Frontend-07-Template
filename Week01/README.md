学习笔记

#TickTacToe
    show Board
        画出board
    监听事件
    判断输赢
    遇到的问题
    1. 数组的深拷贝: 
        1. slice 一维数组
        2. concat 一维数组
        3. JSON.parse(JSON.stringify(this.List)) 多维数组

#异步编程
    SetTimeOut 会造成回掉地狱
    Promise new Promise((resolve, reject) => {}); 其中可以放异步方法，再调用resolve
    Async Await 会等待异步方法完成
    generator 比较古老的实现同步方法的办法。
      