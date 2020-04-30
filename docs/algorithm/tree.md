# 二叉树


## 二叉树遍历

```javascript

const tree = [
    {
        name: '1',
        children: [
            {
                name: '2',
                children: [
                    { name: '4'},
                    { name: '5' }
                ]
            },
            {
                name: '3',
                children: [
                    null,
                    { name: '6' }
                ]
            },

        ]
    }
]



/**
 * 递归深度优先遍历
 */
function preWalk(node){
    if (node == null) return;

    console.log(node.name) // 放在前面为前序，中间为中序，后面为后序
    preWalk(node.children && node.children[0])
    preWalk(node.children && node.children[1])
}

/**
 * 非递归深度优先遍历
 */
function stackWalk(root) {
    const stack = [];

    let node = root;

    // 只要结点存在
    while (node || stack.length > 0) {

        // 找到最终左结点，压入路径上所有左结点
        while (node) {
            stack.push(node)
            node = node.children && node.children[0]
        }

        // 一旦没有可用的左结点了，开始弹出最后压入的结点，从他的右结点开始遍历
        if (stack.length > 0) {
            node = stack.pop();
            node = node.children && node.children[1]
        }
    }
}




/**
 * 非递归广度优先遍历
**/
function queueWalk(root){

    // 根结点放进队列
    const queue = [root]

    // 只要队列不为空
    while ( queue.length > 0 ) {

        // 就出队
        let node = queue.shift()

        // 压入左结点
        if (node.children && node.children[0]) {
            queue.push(node.children[0])
        }

        // 压入右结点
        if (node.children && node.children[1]) {
            queue.push(node.children[1])
        }
    }
}


```



## 二叉树与数组互转

```javascript

/**
 * 二叉树转数组存储
**/
function tree2arr(root) {
    // 数组容器
    const arr = [];

    // 放置节点到数组（指定下标）
    function setNode(node, i) {

        // 如果节点不为空
        if (node) {

            // 放置本节点
            arr[i] = node.name;

            // 放置左、右孩子节点
            let left  = node.children && node.children[0] || null;
            let right = node.children && node.children[1] || null;
            setNode( left,  2 * i + 1);
            setNode( right, 2 * i + 2);
        }
    }

    // 从放置根结点开始
    setNode(root, 0);

    // 返回数组
    return arr;
}

/**
 * 数组还原到二叉树
**/
function arr2tree(arr) {

  	// 获取节点从数组（指定下标）
    function getNode(i){

        // 下标越界或指向元素为空，则返回空
        if (i >= arr.length || arr[i] == null) {
            return null;
        }

        // 构造本节点
        let node = {
            name: arr[i]
        }

        // 获取本结点的左右子节点
        let left  = getNode( 2 * i + 1)
        let right = getNode( 2 * i + 2)

        // 将子节点加到本节点上
        if (left || right) {
            node.children = [];
            node.children[0] = left;
            node.children[1] = right;
        }

        // 返回本节点
        return node;
    }

    // 返回顶节点
    return getNode(0)
}


```




```