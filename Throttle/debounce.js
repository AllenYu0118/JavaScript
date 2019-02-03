/**
 * 防抖函数
 * @param {Function} fn 需要執行的函數
 * @param {Number} interval 間隔時間
 * @param {Boolean} immediate true 表示立即執行,false 表示非立即執行
 */
function debounce(fn, interval = 600, immediate) {
    let timer = null;

    return function () {
        // 如果有函数在执行,则返回
        if (timer) clearTimeout(timer)

        // 立即執行
        if (immediate) {
            // 第一次進入時,因為 timer 還未賦值,所以 callNow 為 true
            // 第二次觸發時,間隔很短, timeOut 還未執行完畢, 所以 timer 內有值, callNow 為 false
            let callNow = !timer

            // setTimeout 的返回值是一個數字
            timer = setTimeout(() => {
                // 清空 timer 內的值
                timer = null
            }, interval)

            // 因為 callNow 第一次進入時為 true, 所以很快會執行 fn 函數
            if (callNow) fn.apply(this, arguments)
        } else {
            timer = setTimeout(() => {
                fn.apply(this, arguments)
            }, interval)
        }
    }
}