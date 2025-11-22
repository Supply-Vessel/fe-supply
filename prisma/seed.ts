import { PrismaClient } from '@prisma/client';

// Создаем новый экземпляр для seed операций с прямым соединением
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL || process.env.DATABASE_URL,
    },
  },
});

async function cleanup() {
  console.log('🧹 Очистка существующих данных...');

  try {
    // Удаляем в правильном порядке
    const tables = [
      'payment', 'breeding', 'breedingProtocol', 'notification',
      'task', 'experimentAnimal', 'experiment', 'measurement',
      'recordPhoto', 'requestRecord', 'animalPhoto', 'customFieldValue',
      'request', 'customField', 'userVessel',
      'user', 'subscription', 'vessel', 'plan', 'invitation', 'verificationCode'
    ];

    for (const table of tables) {
      try {
        await (prisma as any)[table].deleteMany();
        console.log(`   ✓ Очищена таблица ${table}`);
      } catch (error) {
        console.log(`   ⚠ Таблица ${table} уже пуста или не существует`);
      }
    }

    console.log('✅ Очистка завершена');
  } catch (error) {
    console.error('❌ Ошибка при очистке:', error);
  }
}

async function main() {
  try {
    console.log('🌱 Начинаем наполнение базы данных...');

    await cleanup();

    // Создаем планы подписки
    console.log('📋 Создание планов подписки...');
    const plan1 = await prisma.plan.create({
      data: {
        name: 'Free',
        description: 'Базовый бесплатный план для малых судов',
        price: 0,
        currency: 'CAD',
        billingCycle: 'MONTHLY',
        maxUsers: 3,
        features: {
          maxRequests: 50,
          basicReporting: true,
          storage: '1GB',
        },
        isActive: true,
      },
    });
    const plan2 = await prisma.plan.create({
      data: {
        name: 'Standard',
        description: 'Стандартный план для средних судов',
        price: 49.99,
        currency: 'CAD',
        billingCycle: 'MONTHLY',
        maxUsers: 10,
        features: {
          maxRequests: 500,
          advancedReporting: true,
          storage: '10GB',
        },
        isActive: true,
      },
    });
    await prisma.plan.create({
      data: {
        name: 'Premium',
        description: 'Премиум план для крупных судов',
        price: 149.99,
        currency: 'CAD',
        billingCycle: 'MONTHLY',
        maxUsers: 50,
        features: {
          maxRequests: 'unlimited',
          advancedReporting: true,
          customFields: true,
          apiAccess: true,
          storage: '100GB',
        },
        isActive: true,
      },
    });
    console.log('✅ Планы подписки созданы');

    // Создаем суда (vessels)
    console.log('🚢 Создание судов...');
    const vessel1 = await prisma.vessel.create({
      data: {
        name: 'Морской Исследователь',
        description: 'Исследовательское судно для океанографических работ',
        username: 'captain_ivanov',
        position: 'VESSEL_MANAGER',
      },
    });
    const vessel2 = await prisma.vessel.create({
      data: {
        name: 'Северный Ветер',
        description: 'Грузовое судно для перевозки контейнеров',
        username: 'manager_petrov',
        position: 'HEAD_OF_DEPARTMENT',
      },
    });
    console.log('✅ Суда созданы');

    // Создаем подписки для судов
    console.log('💳 Создание подписок...');
    const subscription1 = await prisma.subscription.create({
      data: {
        vesselId: vessel1.id,
        planId: plan2.id,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'ACTIVE',
        maxUsers: 10,
        paymentMethod: 'Credit Card',
        autoRenew: true,
      },
    });
    const subscription2 = await prisma.subscription.create({
      data: {
        vesselId: vessel2.id,
        planId: plan1.id,
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        status: 'ACTIVE',
        maxUsers: 50,
        paymentMethod: 'Bank Transfer',
        autoRenew: true,
      },
    });
    console.log('✅ Подписки созданы');

    // Создаем пользователей
    console.log('👥 Создание пользователей...');
    const user1 = await prisma.user.create({
      data: {
        email: 'captain@research-vessel.ca',
        institution: 'Marine Research Institute',
        address: '123 Harbor St, Vancouver, BC V6B 1A1',
        contactPhone: '+1-604-555-0123',
        password: 'hashedPassword123',
        firstName: 'Иван',
        lastName: 'Иванов',
        confirmedEmail: true,
      },
    });
    const user2 = await prisma.user.create({
      data: {
        email: 'engineer@research-vessel.ca',
        institution: 'Maritime Engineering Corp',
        address: '456 Dock Ave, Vancouver, BC V6B 2K9',
        contactPhone: '+1-604-555-0456',
        password: 'hashedPassword456',
        firstName: 'Петр',
        lastName: 'Петров',
        confirmedEmail: true,
      },
    });
    const user3 = await prisma.user.create({
      data: {
        email: 'electrician@cargo-ship.ca',
        institution: 'Ship Electrical Services',
        address: '789 Marine Dr, Halifax, NS B3H 4R2',
        contactPhone: '+1-902-555-0789',
        password: 'hashedPassword789',
        firstName: 'Мария',
        lastName: 'Сидорова',
        confirmedEmail: true,
      },
    });
    const user4 = await prisma.user.create({
      data: {
        email: 'deckhand@cargo-ship.ca',
        institution: 'Deck Operations Ltd',
        address: '321 Port Rd, Halifax, NS B3H 1Z9',
        contactPhone: '+1-902-555-0321',
        password: 'hashedPassword101',
        firstName: 'Александр',
        lastName: 'Комаров',
        confirmedEmail: false,
      },
    });
    console.log('✅ Пользователи созданы');

    // Связываем пользователей с судами
    console.log('🔗 Создание связей пользователей с судами...');
    await prisma.userVessel.create({
      data: {
        userId: user1.id,
        vesselId: vessel1.id,
        role: 'VESSEL_MANAGER',
        accessStatus: 'ACTIVE',
      },
    });
    await prisma.userVessel.create({
      data: {
        userId: user2.id,
        vesselId: vessel1.id,
        role: 'TEAM_LEADER',
        accessStatus: 'ACTIVE',
      },
    });
    await prisma.userVessel.create({
      data: {
        userId: user3.id,
        vesselId: vessel2.id,
        role: 'SAFETY_SPECIALIST',
        accessStatus: 'ACTIVE',
      },
    });
    await prisma.userVessel.create({
      data: {
        userId: user4.id,
        vesselId: vessel2.id,
        role: 'SUPPLIER',
        accessStatus: 'ACTIVE',
      },
    });
    console.log('✅ Связи пользователей с судами созданы');

    // Создаем эксперименты
    console.log('🧪 Создание экспериментов...');
    const experiment1 = await prisma.experiment.create({
      data: {
        title: 'Тестирование топливных фильтров',
        description: 'Оценка эффективности новых топливных фильтров',
        vesselId: vessel1.id,
        startDate: new Date(),
        status: 'ACTIVE',
        createdById: user2.id,
        protocol: 'Установка фильтра, мониторинг давления и чистоты топлива в течение 30 дней',
      },
    });
    const experiment2 = await prisma.experiment.create({
      data: {
        title: 'Проверка навигационного освещения',
        description: 'Оценка яркости и долговечности LED ламп',
        vesselId: vessel1.id,
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: 'PLANNED',
        createdById: user3.id,
        protocol: 'Замена всех навигационных ламп, контроль яркости каждые 100 часов работы',
      },
    });
    console.log('✅ Эксперименты созданы');

    // Создаем задачи
    console.log('📝 Создание задач...');
    await prisma.task.create({
      data: {
        title: 'Проверить статус заказа топливного фильтра',
        description: 'Связаться с поставщиком и уточнить дату доставки',
        vesselId: vessel1.id,
        assignedToId: user2.id,
        experimentId: experiment1.id,
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        status: 'PENDING',
        priority: 'HIGH',
      },
    });
    await prisma.task.create({
      data: {
        title: 'Подготовить отчет по тестированию освещения',
        description: 'Составить сводный отчет о результатах проверки LED ламп',
        vesselId: vessel1.id,
        assignedToId: user3.id,
        experimentId: experiment2.id,
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
      },
    });
    await prisma.task.create({
      data: {
        title: 'Обновить базу данных запросов',
        description: 'Внести данные о новых поставках в систему',
        vesselId: vessel2.id,
        assignedToId: user4.id,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        status: 'PENDING',
        priority: 'LOW',
      },
    });
    console.log('✅ Задачи созданы');

    // Создаем уведомления
    console.log('🔔 Создание уведомлений...');
    await prisma.notification.create({
      data: {
        userId: user2.id,
        title: 'Напоминание о проверке статуса',
        message: 'Не забудьте проверить статус заказа топливного фильтра',
        type: 'TASK',
        isRead: false,
      },
    });
    await prisma.notification.create({
      data: {
        userId: user3.id,
        title: 'Новый запрос добавлен',
        message: 'В систему добавлен новый запрос на электрооборудование',
        type: 'SYSTEM',
        isRead: true,
      },
    });
    await prisma.notification.create({
      data: {
        userId: user4.id,
        title: 'Эксперимент запланирован',
        message: 'Эксперимент "Проверка навигационного освещения" запланирован на следующую неделю',
        type: 'EXPERIMENT',
        isRead: false,
      },
    });
    console.log('✅ Уведомления созданы');

    // Создаем платежи
    console.log('💰 Создание платежей...');
    await prisma.payment.create({
      data: {
        subscriptionId: subscription1.id,
        amount: 49.99,
        currency: 'CAD',
        paymentDate: new Date(),
        paymentMethod: 'Credit Card',
        transactionId: 'tx_vessel_1234567890',
        status: 'PREPAYMENT_PAID',
        invoiceNumber: 'INV-2024-001',
        notes: 'Автоматический платеж за Standard план',
      },
    });
    await prisma.payment.create({
      data: {
        subscriptionId: subscription2.id,
        amount: 0,
        currency: 'CAD',
        paymentDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        paymentMethod: 'Free Trial',
        transactionId: 'free_0987654321',
        status: 'CREDIT_PAID',
        invoiceNumber: 'INV-2024-002',
        notes: 'Бесплатный план',
      },
    });
    console.log('✅ Платежи созданы');

    console.log('🎉 База данных успешно наполнена тестовыми данными!');

    // Выводим сводку
    console.log('\n📊 Сводка созданных записей:');
    const counts = {
      plans: await prisma.plan.count(),
      vessels: await prisma.vessel.count(),
      subscriptions: await prisma.subscription.count(),
      users: await prisma.user.count(),
      userVessels: await prisma.userVessel.count(),
      experiments: await prisma.experiment.count(),
      tasks: await prisma.task.count(),
      notifications: await prisma.notification.count(),
      payments: await prisma.payment.count(),
    };

    console.log(`   ✓ Планов: ${counts.plans}`);
    console.log(`   ✓ Судов: ${counts.vessels}`);
    console.log(`   ✓ Подписок: ${counts.subscriptions}`);
    console.log(`   ✓ Пользователей: ${counts.users}`);
    console.log(`   ✓ Связей пользователи-суда: ${counts.userVessels}`);
    console.log(`   ✓ Экспериментов: ${counts.experiments}`);
    console.log(`   ✓ Задач: ${counts.tasks}`);
    console.log(`   ✓ Уведомлений: ${counts.notifications}`);
    console.log(`   ✓ Платежей: ${counts.payments}`);
  } catch (error) {
    console.error('❌ Ошибка при наполнении базы данных:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Критическая ошибка:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

