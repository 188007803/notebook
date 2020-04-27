# 常用算法

## 斐波那契数列

```javascript

// 常归递归算法，最多加上缓存优化
// function fid(n) {
//   if (n == 0) return 0;
//   if (n == 1) return 1;
//   return fid(n-1) + fid(n-2)
// }

// 高效的尾递归优化算法，
function fid(n=0, a=1 , b=1){
    if(n <= 2){
        return a;
    }
    return fid(n-1, a+b, a);
}

```