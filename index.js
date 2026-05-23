const mineflayer = require('mineflayer');
const config = require('./config');

// Переменная для настройки количества ботов
const test_bot_count = 100; 

function spawnBot(botIndex) {
  // Формируем уникальный ник для каждого бота с указанием его индекса
  const username = `${config.usernamePrefix}${botIndex}_${Math.floor(1000 + Math.random() * 9000)}`;

  const bot = mineflayer.createBot({
    host: config.host,
    port: config.port,
    version: config.version,
    username: username,
    auth: 'offline'
  });

  bot.once('spawn', () => {
    console.log(`Бот #${botIndex} (${bot.username}) заспавнился на сервере.`);
    
    // 1. Отправляем сообщение в чат при входе
    bot.chat('TEEEST');
    
    let active = true;
    
    // 2. Движение только вперед, влево или вправо
    const moveInterval = setInterval(() => {
      if (!active) return;
      
      bot.clearControlStates();
      
      // Разрешенные направления
      const controls = ['forward', 'left', 'right'];
      const randomControl = controls[Math.floor(Math.random() * controls.length)];
      bot.setControlState(randomControl, true);
    }, 1000);
    
    // 3. Рандомное вращение головой
    const lookInterval = setInterval(() => {
      if (!active) return;
      
      const yaw = (Math.random() * 2 - 1) * Math.PI;
      const pitch = (Math.random() * 0.4 - 0.2) * Math.PI;
      
      bot.look(yaw, pitch, true);
    }, 100);
    
    // 4. Отключение через 60 секунд после появления конкретного бота
    setTimeout(() => {
      active = false;
      clearInterval(moveInterval);
      clearInterval(lookInterval);
      bot.clearControlStates();
      
      console.log(`30 секунд прошло. Бот #${botIndex} (${bot.username}) отключается...`);
      bot.quit();
    }, 60000);
  });

  bot.on('kicked', (reason) => console.log(`Бот #${botIndex} (${username}) кикнут:`, reason));
  bot.on('error', (err) => console.error(`Ошибка у бота #${botIndex} (${username}):`, err));
}

// Запускаем цикл создания ботов с интервалом 1.5 секунды для стабильного подключения
for (let i = 0; i < test_bot_count; i++) {
  setTimeout(() => {
    spawnBot(i + 1);
  }, i * 1000);
}