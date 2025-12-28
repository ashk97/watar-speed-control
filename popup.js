const slider = document.getElementById('speedSlider');
const display = document.getElementById('speedVal');
const resetBtn = document.getElementById('resetBtn');

// 1. عند فتح الإضافة: جلب السرعة المحفوظة مسبقاً
browser.storage.local.get("savedSpeed").then((result) => {
    let speed = result.savedSpeed || 1; // إذا لم يوجد شيء محفوظ، استخدم 1
    slider.value = speed;
    display.innerText = speed;
    applySpeed(speed);
});

// 2. عند تحريك الشريط: حفظ السرعة وتطبيقها
slider.addEventListener('input', (e) => {
    let speed = e.target.value;
    display.innerText = speed;
    browser.storage.local.set({ savedSpeed: speed }); // حفظ في ذاكرة المتصفح
    applySpeed(speed);
});

// 3. عند الضغط على زر إعادة الضبط
resetBtn.addEventListener('click', () => {
    let speed = 1;
    slider.value = speed;
    display.innerText = speed;
    browser.storage.local.set({ savedSpeed: speed });
    applySpeed(speed);
});

// وظيفة تطبيق السرعة على الفيديو/الصوت في الصفحة
function applySpeed(speed) {
    browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
        if (tabs[0]) {
            browser.scripting.executeScript({
                target: {tabId: tabs[0].id},
                func: (s) => {
                    document.querySelectorAll('video, audio').forEach(el => el.playbackRate = s);
                },
                args: [speed]
            });
        }
    });
}