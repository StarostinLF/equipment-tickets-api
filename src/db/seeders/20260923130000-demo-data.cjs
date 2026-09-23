'use strict';

const { randomUUID } = require('node:crypto');

const DAY_MS = 24 * 60 * 60 * 1000;
const daysAgo = (n) => new Date(Date.now() - n * DAY_MS);
const daysAfter = (date, n) => new Date(date.getTime() + n * DAY_MS);

const SITES = [
  { id: randomUUID(), name: 'Ветропарк Северный', code: 'SITE-01', region: 'Мурманская область', lat: 68.9707, lon: 33.0759 },
  { id: randomUUID(), name: 'Солнечная станция Южная', code: 'SITE-02', region: 'Краснодарский край', lat: 45.0355, lon: 38.9753 },
];
const [NORTH, SOUTH] = SITES;

const EQUIPMENT = [
  { id: randomUUID(), site_id: NORTH.id, name: 'Турбина №1', type: 'turbine', serial_number: 'SN-001', status: 'operational', lat: 68.9710, lon: 33.0765, installed_at: '2020-05-01' },
  { id: randomUUID(), site_id: NORTH.id, name: 'Турбина №2', type: 'turbine', serial_number: 'SN-002', status: 'maintenance', lat: 68.9715, lon: 33.0770, installed_at: '2020-06-15' },
  { id: randomUUID(), site_id: SOUTH.id, name: 'Инвертор №1', type: 'inverter', serial_number: 'SN-101', status: 'operational', lat: 45.0360, lon: 38.9758, installed_at: '2021-03-10' },
  { id: randomUUID(), site_id: SOUTH.id, name: 'Инвертор №2', type: 'inverter', serial_number: 'SN-102', status: 'fault', lat: 45.0365, lon: 38.9762, installed_at: '2021-03-10' },
  { id: randomUUID(), site_id: NORTH.id, name: 'Датчик ветра №1', type: 'sensor', serial_number: 'SN-201', status: 'operational', lat: 68.9720, lon: 33.0775, installed_at: '2022-01-20' },
  { id: randomUUID(), site_id: SOUTH.id, name: 'Датчик температуры №1', type: 'sensor', serial_number: 'SN-202', status: 'operational', lat: 45.0370, lon: 38.9766, installed_at: '2022-02-14' },
  { id: randomUUID(), site_id: NORTH.id, name: 'Подстанция №1', type: 'substation', serial_number: 'SN-301', status: 'operational', lat: 68.9725, lon: 33.0780, installed_at: '2019-11-01' },
  { id: randomUUID(), site_id: SOUTH.id, name: 'Подстанция №2', type: 'substation', serial_number: 'SN-302', status: 'decommissioned', lat: 45.0375, lon: 38.9770, installed_at: '2018-07-01' },
];

const PASSPORTS = [
  { equipment_id: EQUIPMENT[0].id, manufacturer: 'Vestas', model: 'V90-2.0', rated_power: 2000.0, last_inspection_date: '2025-11-01' },
  { equipment_id: EQUIPMENT[1].id, manufacturer: 'Vestas', model: 'V90-2.0', rated_power: 2000.0, last_inspection_date: '2025-10-15' },
  { equipment_id: EQUIPMENT[2].id, manufacturer: 'Huawei', model: 'SUN2000-100KTL', rated_power: 100.0, last_inspection_date: '2025-09-20' },
  { equipment_id: EQUIPMENT[3].id, manufacturer: 'Huawei', model: 'SUN2000-100KTL', rated_power: 100.0, last_inspection_date: '2025-08-05' },
  { equipment_id: EQUIPMENT[4].id, manufacturer: 'Vaisala', model: 'WMT700', rated_power: 0.05, last_inspection_date: '2025-07-12' },
  { equipment_id: EQUIPMENT[6].id, manufacturer: 'Siemens', model: 'SIESTORAGE', rated_power: 5000.0, last_inspection_date: '2025-06-01' },
].map((passport) => ({ id: randomUUID(), ...passport }));

const TECHNICIANS = [
  { id: randomUUID(), full_name: 'Иванов Иван Иванович', specialization: 'Электрооборудование', personnel_number: 'T-1001' },
  { id: randomUUID(), full_name: 'Петров Пётр Петрович', specialization: 'Механика', personnel_number: 'T-1002' },
  { id: randomUUID(), full_name: 'Сидорова Анна Викторовна', specialization: 'Автоматика и КИП', personnel_number: 'T-1003' },
  { id: randomUUID(), full_name: 'Кузнецов Дмитрий Олегович', specialization: 'Электрооборудование', personnel_number: 'T-1004' },
  { id: randomUUID(), full_name: 'Смирнова Ольга Сергеевна', specialization: 'Механика', personnel_number: 'T-1005' },
  { id: randomUUID(), full_name: 'Фёдоров Артём Николаевич', specialization: 'Автоматика и КИП', personnel_number: 'T-1006' },
];

const REQUEST_STATUS_PLAN = [
  'done', 'done', 'done', 'done', 'done', 'done', 'done', 'done',
  'in_progress', 'in_progress', 'in_progress', 'in_progress', 'in_progress', 'in_progress',
  'new', 'new', 'new', 'new', 'new',
  'rejected', 'rejected', 'rejected', 'rejected', 'rejected',
];
const PRIORITIES = ['low', 'medium', 'high', 'critical'];
const TITLE_TEMPLATES = [
  'Плановое ТО', 'Замена датчика', 'Посторонний шум', 'Просадка мощности',
  'Утечка масла', 'Ошибка контроллера', 'Коррозия корпуса', 'Перегрев узла',
];
const AUTHORS = ['Оператор ДПУ', 'Мастер участка', 'Диспетчер смены'];

const REQUESTS = [];
const STATUS_HISTORY = [];
const ASSIGNEES = [];

REQUEST_STATUS_PLAN.forEach((status, i) => {
  const equipment = EQUIPMENT[i % EQUIPMENT.length];
  const priority = PRIORITIES[i % PRIORITIES.length];
  const title = `${TITLE_TEMPLATES[i % TITLE_TEMPLATES.length]} — ${equipment.name}`;
  const createdAt = daysAgo(10 + i * 3);
  const plannedAt = i % 2 === 0 ? daysAfter(createdAt, 5) : null;
  const author = i % 3 === 0 ? AUTHORS[i % AUTHORS.length] : null;
  const id = randomUUID();

  let updatedAt = createdAt;
  const pushHistory = (previousStatus, newStatus, offsetDays, changedBy) => {
    updatedAt = daysAfter(createdAt, offsetDays);
    STATUS_HISTORY.push({
      id: randomUUID(),
      request_id: id,
      previous_status: previousStatus,
      new_status: newStatus,
      changed_by: changedBy,
      comment: newStatus === 'rejected' ? 'Отклонено после осмотра' : null,
      changed_at: updatedAt,
    });
  };

  if (status === 'in_progress' || status === 'done') {
    pushHistory('new', 'in_progress', 2, TECHNICIANS[i % TECHNICIANS.length].full_name);
  }
  if (status === 'done') {
    pushHistory('in_progress', 'done', 9, TECHNICIANS[(i + 1) % TECHNICIANS.length].full_name);
  }
  if (status === 'rejected') {
    if (i % 2 === 0) {
      pushHistory('new', 'rejected', 1, AUTHORS[i % AUTHORS.length]);
    } else {
      pushHistory('new', 'in_progress', 1, TECHNICIANS[i % TECHNICIANS.length].full_name);
      pushHistory('in_progress', 'rejected', 4, TECHNICIANS[i % TECHNICIANS.length].full_name);
    }
  }

  if (status === 'in_progress' || status === 'done') {
    const lead = TECHNICIANS[i % TECHNICIANS.length];
    ASSIGNEES.push({
      id: randomUUID(),
      request_id: id,
      technician_id: lead.id,
      role: 'lead',
      planned_hours: 6 + (i % 4) * 2,
    });
    if (priority === 'high' || priority === 'critical') {
      const member = TECHNICIANS[(i + 2) % TECHNICIANS.length];
      ASSIGNEES.push({
        id: randomUUID(),
        request_id: id,
        technician_id: member.id,
        role: 'member',
        planned_hours: 4 + (i % 3) * 2,
      });
    }
  }

  REQUESTS.push({
    id,
    equipment_id: equipment.id,
    title,
    description: `Автосгенерированная заявка для демонстрации отчётов (${equipment.name}).`,
    priority,
    status,
    planned_at: plannedAt,
    author,
    created_at: createdAt,
    updated_at: updatedAt,
  });
});

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.bulkInsert('sites', SITES, { transaction });
      await queryInterface.bulkInsert('equipment', EQUIPMENT, { transaction });
      await queryInterface.bulkInsert('equipment_passports', PASSPORTS, { transaction });
      await queryInterface.bulkInsert('technicians', TECHNICIANS, { transaction });
      await queryInterface.bulkInsert('maintenance_requests', REQUESTS, { transaction });
      await queryInterface.bulkInsert('request_status_history', STATUS_HISTORY, { transaction });
      await queryInterface.bulkInsert('request_assignees', ASSIGNEES, { transaction });
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.bulkDelete('request_assignees', null, { transaction });
      await queryInterface.bulkDelete('request_status_history', null, { transaction });
      await queryInterface.bulkDelete('maintenance_requests', null, { transaction });
      await queryInterface.bulkDelete('equipment_passports', null, { transaction });
      await queryInterface.bulkDelete('equipment', null, { transaction });
      await queryInterface.bulkDelete('technicians', null, { transaction });
      await queryInterface.bulkDelete('sites', null, { transaction });
    });
  },
};
