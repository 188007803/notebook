# 常用算法

## 斐波那契数列

```javascript

// 普通递归算法
function fid(n) {
    if (n === 0) return 0;
    if (n === 1 || n === 2) return 1;
    return fid(n-1) + fid(n-2)
}

// 加缓存的递归算法
const fib = (function(){
    const memo = new Map();
    return function(n){
        let memorized = memo.get(n);
        if (memorized != null) {
            return memorized;
        }
        if (n === 0) return 0;
        if (n === 1 || n === 2) return 1;

        let f1 = fib(n - 1)
        let f2 = fib(n - 2)

        memo.set(n - 1, f1)
        memo.set(n - 2, f2)

        return f1 + f2;

    }
})();


// 尾递归优化算法，
function fid(n=0, a=1 , b=1){
    if(n <= 2){
        return a;
    }
    return fid(n-1, a+b, a);
}

// 动态规划算法
function fib (N) {
    let dp = [0, 1]
    for (let i = 2; i <= N; i++) {
        dp[i] = dp[i-1] + dp[i-2]
    }
    return dp[N];
}

```