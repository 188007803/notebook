# 二叉堆与优先队列

> - 二叉堆是一种完全二叉树，分为最小堆，和最大堆。
> - 最小堆即指任何一个父节点的值，都小于或等于它左右孩子的值，最大堆即相反。
> - 基于二叉堆，可以实现优先队列，即无论怎么入队，出队的总是最小/最大的值。
> - 其算法本质是：将二叉堆映射到一个一维数组，所有的动作都是对这个数组进行操作。
> - 下面以最小优先队列为例，来进行实现：

```js

/**
 * 标题：最小二叉堆的上浮调整
 * 描述：从尾部开始，自动与父节点比大小，逐渐上浮到合适位置。
 */
function upAdjust (arr) {

    // 获取子下标，及其父下标
    let childIndex = arr.length - 1;
    let parentIndex = Math.floor((childIndex - 1) / 2);

    // 获取子值
    let child = arr[childIndex];

    // 逐步向上比较，一旦比父值小
    while ( childIndex > 0 && child < arr[parentIndex] ) {

        // 子值改为父值
        arr[childIndex] = arr[parentIndex];

        // 子下标上移一层
        childIndex = parentIndex;

        // 父下标上移一层
        parentIndex = Math.floor((parentIndex - 1) / 2);
    }

    // 落地子值
    arr[childIndex] = child;
    return arr;
}

/**
 * 标题：最小二叉堆的下沉调整
 * 描述：从头部开始，自动与子节点比大小，逐渐下沉到合适位置。
 */
function downAdjust (arr, parentIndex=0, length=arr.length) {

    // 父值设为父标值
    let parent = arr[parentIndex];

    // 获取子标为左子标
    let childIndex = 2 * parentIndex + 1;

    // 如果子标合法
    while ( childIndex < length ) {

        // 如果右子标也合法，且值更小，则子标改为右子标
        if (childIndex + 1 < length && arr[childIndex + 1] < arr[childIndex] ) {
            childIndex += 1;
        }

        // 如果父值小于任何子值，直接跳出，不再深入
        if ( parent <= arr[childIndex]) {
            break;
        }

        // 父值改为子值
        arr[parentIndex] = arr[childIndex];

        // 父标改为子标
        parentIndex = childIndex;

        // 子标改为孙子标
        childIndex  = 2 * parentIndex + 1;
    }

    // 落地父值
    arr[parentIndex] = parent;
    return arr;
}

/**
 * 标题：将无序堆调整为最小堆
 * 描述：从最后一个父结点开始，让所有的父结点依次“下沉”
 */
function buildHeap(arr){
    for ( let i = Math.floor((arr.length - 2) / 2); i >=0; i--) {
        downAdjust(arr, i, arr.length)
    }
}

/**
 * 标题：优先队列
 * 描述：利用最小堆实现
 * 初始算法：将无序堆调整为最小堆
 * 入队算法：添加到尾部（下一个叶子节点），然后自动向上调整
 * 出队算法：用队尾替换队头，然后自动向下调整，返回旧的队头
 */
class PriorityQueue {

  // 初始化
  constructor(array){
    this.array = array || []
    buildHeap(this.array)
  }

  // 入队
  push(key){
    this.array.push(key)
    upAdjust(this.array)
    return this;
  }

  // 出队
  pop(){
    let len = this.array.length;
    if (len == 0) return undefined;
    if (len == 1) return this.array.pop();

    const key = this.array[0]
    this.array[0]=this.array[len - 1]
    this.array.length = len - 1;
    downAdjust(this.array)
    return key;
  }

  toString(){
    return this.array.join(',')
  }
}

// 测试
let arr = new PriorityQueue([1,3,5,7,2,0,9,5])
console.log(arr.pop(), arr)
console.log(arr.pop(), arr)




```