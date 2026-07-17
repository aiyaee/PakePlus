window.addEventListener("DOMContentLoaded",()=>{const t=document.createElement("script");t.src="https://www.googletagmanager.com/gtag/js?id=G-W5GKHM0893",t.async=!0,document.head.appendChild(t);const n=document.createElement("script");n.textContent="window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-W5GKHM0893');",document.body.appendChild(n)});// 保存原生window.open
const rawWindowOpen = window.open;

/**
 * 点击拦截逻辑：新标签链接转当前页，打印按钮全部放行不拦截
 */
const hookClick = (e) => {
    const targetA = e.target.closest('a');
    const baseHasBlank = document.querySelector('head base[target="_blank"]');

    // 识别所有打印相关元素，直接放行，不做任何拦截
    const targetEl = e.target;
    const isPrint = (
        // a标签带data-print属性
        targetA?.dataset?.print
        // 链接地址包含print
        || targetA?.href?.toLowerCase().includes('print')
        // 按钮class/id包含print关键词
        || targetEl.className?.toLowerCase().includes('print')
        || targetEl.id?.toLowerCase().includes('print')
        // 父级元素标记打印
        || targetEl.closest('[data-print]')
    );

    // 打印元素直接退出，不阻止默认、不劫持
    if (isPrint) {
        return;
    }

    // 非打印的_blank链接统一劫持为本页跳转
    if (targetA && targetA.href) {
        if (targetA.target === '_blank' || baseHasBlank) {
            e.preventDefault();
            location.href = targetA.href;
        }
    }
};

// 重写window.open劫持逻辑，打印弹窗放行原生窗口
window.open = function (url, target, features) {
    // 判断打印场景，全部放行原生弹窗
    const isPrintPopup = (
        // 打印页面地址
        (url && url.toLowerCase().includes('print'))
        // 空白弹窗打印（window.open('', '_blank') 打印模板）
        || (url === '' && target === '_blank')
        // target指定为print
        || String(target).toLowerCase() === 'print'
    );

    if (isPrintPopup) {
        // 打印走原生open，不会被拦截
        return rawWindowOpen(url, target, features);
    }

    // 普通新窗口直接在当前页打开
    if (url) {
        location.href = url;
    }
    return null;
};

// 监听改为冒泡阶段，不抢占打印按钮事件
document.addEventListener('click', hookClick, { capture: false });