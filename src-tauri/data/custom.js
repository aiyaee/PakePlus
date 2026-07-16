window.addEventListener("DOMContentLoaded",()=>{const t=document.createElement("script");t.src="https://www.googletagmanager.com/gtag/js?id=G-W5GKHM0893",t.async=!0,document.head.appendChild(t);const n=document.createElement("script");n.textContent="window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-W5GKHM0893');",document.body.appendChild(n)});// very important, if you don't know what it is, don't touch it
// 非常重要，不懂代码不要动，这里可以解决80%的问题，也可以生产1000+的bug
// 保存原生open，不能直接覆盖丢失原生能力
const rawWindowOpen = window.open;
const hookClick = (e) => {
    const origin = e.target.closest('a')
    const isBaseTargetBlank = document.querySelector('head base[target="_blank"]')
    console.log('origin', origin, isBaseTargetBlank)

    // ========== 新增：打印按钮直接放行，不拦截
    if (origin?.dataset?.print || origin?.href?.includes('print')) {
        return;
    }

    if (
        (origin && origin.href && origin.target === '_blank') ||
        (origin && origin.href && isBaseTargetBlank)
    ) {
        e.preventDefault()
        console.log('handle origin', origin)
        location.href = origin.href
    } else {
        console.log('not handle origin', origin)
    }
}

// 重写open时区分打印
window.open = function (url, target, features) {
    console.log('open', url, target, features)
    // 判断是打印页面，调用原生window.open，不拦截
    if(url.includes('print') || target === '_blank' && url === ''){
        return rawWindowOpen(url, target, features);
    }
    location.href = url
}

document.addEventListener('click', hookClick, { capture: true })
