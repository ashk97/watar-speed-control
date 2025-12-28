// الاستماع لضغطات الأزرار
browser.commands.onCommand.addListener((command) => {
    browser.storage.local.get("savedSpeed").then((result) => {
        let currentSpeed = parseFloat(result.savedSpeed) || 1.0;
        
        if (command === "increase_speed" && currentSpeed < 3) {
            currentSpeed += 0.1;
        } else if (command === "decrease_speed" && currentSpeed > 0.5) {
            currentSpeed -= 0.1;
        }

        currentSpeed = parseFloat(currentSpeed.toFixed(1)); // لضمان عدم وجود كسور طويلة
        browser.storage.local.set({ savedSpeed: currentSpeed });

        // إرسال السرعة الجديدة للصفحة المفتوحة
        browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
            browser.scripting.executeScript({
                target: {tabId: tabs[0].id},
                func: (s) => {
                    document.querySelectorAll('video, audio').forEach(el => el.playbackRate = s);
                },
                args: [currentSpeed]
            });
        });
    });
});