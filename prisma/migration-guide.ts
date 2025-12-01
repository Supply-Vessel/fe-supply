/**
 * ===================================================================
 * МИГРАЦИОННЫЙ СКРИПТ ДЛЯ ПЕРЕХОДА НА НОВУЮ АРХИТЕКТУРУ
 * ===================================================================
 * 
 * ЭТОТ ФАЙЛ СОДЕРЖИТ ЛОГИКУ МИГРАЦИИ СУЩЕСТВУЮЩИХ ДАННЫХ
 * НА НОВУЮ АРХИТЕКТУРУ С ОРГАНИЗАЦИЯМИ
 * 
 * ВАЖНО: НЕ ЗАПУСКАТЬ НА ПРОДАКШЕНЕ БЕЗ РЕЗЕРВНОЙ КОПИИ!
 * 
 * Последовательность действий:
 * 1. Создать резервную копию БД
 * 2. Создать новые таблицы Organization и OrganizationMember
 * 3. Мигрировать данные
 * 4. Обновить связи
 * 5. Протестировать
 * 6. Удалить старые поля (опционально)
 * 
 * ===================================================================
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface MigrationStats {
  organizationsCreated: number;
  membersCreated: number;
  vesselsUpdated: number;
  subscriptionsUpdated: number;
  usersUpdated: number;
  errors: Array<{ step: string; error: string }>;
}

/**
 * ШАБЛОН МИГРАЦИИ - АДАПТИРОВАТЬ ПОД РЕАЛЬНУЮ СТРУКТУРУ
 */
export async function migrateToOrganizationArchitecture(): Promise<MigrationStats> {
  const stats: MigrationStats = {
    organizationsCreated: 0,
    membersCreated: 0,
    vesselsUpdated: 0,
    subscriptionsUpdated: 0,
    usersUpdated: 0,
    errors: [],
  };

  console.log('🚀 Начало миграции на новую архитектуру...\n');

  try {
    await prisma.$transaction(async (tx) => {
      // ================================================================
      // ШАГ 1: Получить все существующие Vessels
      // ================================================================
      console.log('📋 Шаг 1: Загрузка существующих кораблей...');
      
      const vessels = await tx.vessel.findMany({
        include: {
          users: {
            include: {
              user: true,
            },
            orderBy: {
              joinedAt: 'asc', // Первый пользователь станет владельцем
            },
          },
          subscriptions: true,
        },
      });

      console.log(`   Найдено кораблей: ${vessels.length}\n`);

      // ================================================================
      // ШАГ 2: Создать Organization для каждого Vessel
      // ================================================================
      console.log('🏢 Шаг 2: Создание организаций...');

      for (const vessel of vessels) {
        try {
          // Определяем владельца: первый пользователь корабля
          const owner = vessel.users[0];
          
          if (!owner) {
            stats.errors.push({
              step: 'Organization Creation',
              error: `Vessel ${vessel.id} (${vessel.name}) не имеет пользователей. Пропускаем.`,
            });
            console.warn(`   ⚠️  Vessel "${vessel.name}" не имеет пользователей`);
            continue;
          }

          // Создаем организацию на базе vessel
          const organization = await tx.organization.create({
            data: {
              name: vessel.name || `Organization for ${vessel.username}`,
              description: vessel.description,
              ownerId: owner.userId,
              type: 'COMPANY',
              createdAt: vessel.createdAt,
              updatedAt: vessel.updatedAt,
            },
          });

          stats.organizationsCreated++;
          console.log(`   ✅ Создана организация: "${organization.name}" (owner: ${owner.user.email})`);

          // ================================================================
          // ШАГ 3: Обновить владельца как ORGANIZATION_OWNER
          // ================================================================
          await tx.user.update({
            where: { id: owner.userId },
            data: { userType: 'ORGANIZATION_OWNER' },
          });
          stats.usersUpdated++;

          // ================================================================
          // ШАГ 4: Создать OrganizationMember для всех пользователей vessel
          // ================================================================
          for (let i = 0; i < vessel.users.length; i++) {
            const userVessel = vessel.users[i];
            
            // Определяем роль в организации
            let orgRole: 'ADMIN' | 'MANAGER' | 'MEMBER' = 'MEMBER';
            if (i === 0) {
              orgRole = 'ADMIN'; // Владелец = админ
            } else if (
              userVessel.role === 'DIRECTOR' ||
              userVessel.role === 'HEAD_OF_DEPARTMENT'
            ) {
              orgRole = 'MANAGER';
            }

            await tx.organizationMember.create({
              data: {
                userId: userVessel.userId,
                organizationId: organization.id,
                role: orgRole,
                invitedBy: i === 0 ? null : owner.userId, // Все кроме владельца были приглашены им
                status: 'ACTIVE',
                joinedAt: userVessel.joinedAt,
              },
            });

            stats.membersCreated++;
          }

          // ================================================================
          // ШАГ 5: Связать Vessel с Organization
          // ================================================================
          await tx.vessel.update({
            where: { id: vessel.id },
            data: {
              organizationId: organization.id,
            },
          });
          stats.vesselsUpdated++;

          // ================================================================
          // ШАГ 6: Перенести Subscriptions на уровень Organization
          // ================================================================
          if (vessel.subscriptions.length > 0) {
            for (const subscription of vessel.subscriptions) {
              await tx.subscription.update({
                where: { id: subscription.id },
                data: {
                  organizationId: organization.id,
                  // Удаляем vesselId (будет удален из схемы)
                },
              });
              stats.subscriptionsUpdated++;
            }
          }

          console.log(`   ✅ Vessel "${vessel.name}" связан с организацией\n`);

        } catch (error) {
          stats.errors.push({
            step: 'Vessel Migration',
            error: `Ошибка при миграции vessel ${vessel.id}: ${error}`,
          });
          console.error(`   ❌ Ошибка при миграции vessel ${vessel.id}:`, error);
        }
      }

      // ================================================================
      // ШАГ 7: Обновить все Invitations
      // ================================================================
      console.log('📨 Шаг 3: Обновление приглашений...');
      
      const invitations = await tx.invitation.findMany({
        include: {
          vessel: true,
        },
      });

      for (const invitation of invitations) {
        try {
          if (invitation.vessel) {
            // Найти organization для этого vessel
            const vessel = await tx.vessel.findUnique({
              where: { id: invitation.vesselId },
              select: { organizationId: true },
            });

            if (vessel?.organizationId) {
              await tx.invitation.update({
                where: { id: invitation.id },
                data: {
                  organizationId: vessel.organizationId,
                  // vesselId остается для конкретного корабля
                },
              });
            }
          }
        } catch (error) {
          stats.errors.push({
            step: 'Invitation Migration',
            error: `Ошибка при обновлении invitation ${invitation.id}: ${error}`,
          });
        }
      }

      console.log('✅ Приглашения обновлены\n');
    });

    // ================================================================
    // ФИНАЛЬНЫЙ ОТЧЕТ
    // ================================================================
    console.log('\n='.repeat(60));
    console.log('📊 ИТОГОВАЯ СТАТИСТИКА МИГРАЦИИ');
    console.log('='.repeat(60));
    console.log(`✅ Создано организаций:      ${stats.organizationsCreated}`);
    console.log(`✅ Создано членов:           ${stats.membersCreated}`);
    console.log(`✅ Обновлено кораблей:       ${stats.vesselsUpdated}`);
    console.log(`✅ Обновлено подписок:       ${stats.subscriptionsUpdated}`);
    console.log(`✅ Обновлено пользователей:  ${stats.usersUpdated}`);
    console.log(`❌ Ошибок:                   ${stats.errors.length}`);
    
    if (stats.errors.length > 0) {
      console.log('\n⚠️  СПИСОК ОШИБОК:');
      stats.errors.forEach((err, idx) => {
        console.log(`   ${idx + 1}. [${err.step}] ${err.error}`);
      });
    }
    
    console.log('='.repeat(60));
    console.log('✅ Миграция завершена!\n');

  } catch (error) {
    console.error('\n❌ КРИТИЧЕСКАЯ ОШИБКА ПРИ МИГРАЦИИ:', error);
    throw error;
  }

  return stats;
}

/**
 * ===================================================================
 * ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
 * ===================================================================
 */

/**
 * Проверка данных перед миграцией
 */
export async function validateBeforeMigration() {
  console.log('🔍 Валидация данных перед миграцией...\n');

  const vessels = await prisma.vessel.findMany({
    include: {
      users: true,
      subscriptions: true,
    },
  });

  const vesselsWithoutUsers = vessels.filter(v => v.users.length === 0);
  const vesselsWithSubscriptions = vessels.filter(v => v.subscriptions.length > 0);

  console.log(`📊 Всего кораблей: ${vessels.length}`);
  console.log(`⚠️  Кораблей без пользователей: ${vesselsWithoutUsers.length}`);
  console.log(`💳 Кораблей с подписками: ${vesselsWithSubscriptions.length}\n`);

  if (vesselsWithoutUsers.length > 0) {
    console.log('⚠️  ВНИМАНИЕ: Следующие корабли не имеют пользователей:');
    vesselsWithoutUsers.forEach(v => {
      console.log(`   - ${v.name} (${v.id})`);
    });
    console.log('\n   Эти корабли будут пропущены при миграции.\n');
  }

  return {
    totalVessels: vessels.length,
    vesselsWithoutUsers: vesselsWithoutUsers.length,
    vesselsWithSubscriptions: vesselsWithSubscriptions.length,
    canProceed: true,
  };
}

/**
 * Откат миграции (если что-то пошло не так)
 */
export async function rollbackMigration() {
  console.log('🔄 ОТКАТ МИГРАЦИИ...\n');
  
  // ВНИМАНИЕ: Эта функция удалит все созданные организации
  // Используйте только если миграция прошла с ошибками
  
  try {
    await prisma.$transaction(async (tx) => {
      // Удалить всех members
      await tx.organizationMember.deleteMany({});
      console.log('✅ Удалены OrganizationMembers');
      
      // Удалить все организации
      await tx.organization.deleteMany({});
      console.log('✅ Удалены Organizations');
      
      // Вернуть userType всем пользователям в REGULAR
      await tx.user.updateMany({
        data: { userType: 'REGULAR' },
      });
      console.log('✅ UserType восстановлены');
    });
    
    console.log('\n✅ Откат миграции завершен успешно!');
  } catch (error) {
    console.error('❌ Ошибка при откате миграции:', error);
    throw error;
  }
}

/**
 * ===================================================================
 * ЗАПУСК МИГРАЦИИ
 * ===================================================================
 */

// Раскомментируйте для запуска:
/*
async function main() {
  console.log('⚠️  ВНИМАНИЕ: Вы запускаете миграцию БД!\n');
  console.log('Перед продолжением убедитесь, что:');
  console.log('1. ✅ Создана резервная копия БД');
  console.log('2. ✅ Вы понимаете, что делаете');
  console.log('3. ✅ Это тестовая среда (НЕ продакшен)\n');
  
  // Валидация
  const validation = await validateBeforeMigration();
  
  if (!validation.canProceed) {
    console.log('❌ Миграция отменена из-за проблем с данными');
    return;
  }
  
  console.log('Начинаем миграцию через 5 секунд...');
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // Запуск миграции
  const stats = await migrateToOrganizationArchitecture();
  
  // Если были ошибки, предложить откат
  if (stats.errors.length > 10) {
    console.log('\n⚠️  Обнаружено много ошибок. Рекомендуется откат миграции.');
    console.log('Для отката выполните: rollbackMigration()');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
*/

