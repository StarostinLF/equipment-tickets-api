import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { sequelize } from './config/database.js';

const app = createApp();

async function start() {
  try {
    await sequelize.authenticate();
  } catch (err) {
    logger.error({ err }, 'Не удалось подключиться к базе данных');
    process.exit(1);
  }

  const server = app.listen(env.port, () => {
    logger.info(`API запущено на порту ${env.port} (${env.nodeEnv})`);
  });

  const shutdown = (signal) => {
    logger.info(`Получен сигнал ${signal}, завершение работы`);
    server.close(async () => {
      await sequelize.close();
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

start();
