/**
 * 节流函数
 * @param {Function} fn 需要執行的函數
 * @param {Number} interval 間隔時間
 * @param {Boolean} type 1 表示時間戳版, 2表示定時器版
 */
function throttle (fn, interval = 600, type=1) {
    if (type === 1) {
        // 定義開始時間 
        var previous = 0
    } else if (type === 2) {
        var timer
    }
    
    return function () {
        if (type === 1) {
            var now = Date.now()
            // 當前間隔大於設定的 interval,執行函數,且把 previous 設定為當前時間
            if (now - previous > interval) {
                fn.apply(this, arguments)
                previous = now
            }
        } else if (type === 2) {
            // 如果 timer 有值,則不往下再執行
            if (timer) return

            timer = setTimeout(() => {
                timer = null
                fn.apply(this, arguments)
            }, interval)
        }
        
    }
}