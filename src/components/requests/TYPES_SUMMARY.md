# Типы данных - Синхронизация с Prisma Schema

## ✅ Выполненные изменения

Все типы в `/fe-supply/src/components/requests/` синхронизированы со схемой Prisma из `/be-supply/prisma/schema.prisma`.

---

## 📋 Основные изменения

### 1. RequestType Enum
```typescript
// ❌ БЫЛО (НЕПРАВИЛЬНО):
enum RequestType {
  ENGINE = "ENGINE",
  ELECTRIC = "ELECTRIC",  // ← ОШИБКА!
  DECK = "DECK",
}

// ✅ СТАЛО (ПРАВИЛЬНО):
enum RequestType {
  ENGINE = "ENGINE",
  ELECTRICAL = "ELECTRICAL",  // ← Исправлено согласно Prisma
  DECK = "DECK",
}
```

### 2. Animal → Request
Все интерфейсы и типы переименованы с `Animal` на `Request` для соответствия бизнес-логике.

### 3. Laboratory → Vessel
```typescript
// ❌ БЫЛО:
interface Laboratory {
  id?: string;
  name?: string;
  code?: string;
}

// ✅ СТАЛО:
interface Vessel {
  id: string;
  name: string;
  username: string;
  position: Role;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}
```

### 4. Добавлены новые Enums из Prisma

```typescript
// Статусы запросов
enum RequestStatus {
  WAITING = "WAITING",
  ORDERED = "ORDERED",
  RECEIVED = "RECEIVED",
  ON_HOLD = "ON_HOLD",
  CANCELLED = "CANCELLED",
}

// Статусы PO (Purchase Order)
enum PoStatus {
  WITHOUT_PO = "WITHOUT_PO",
  PO_DONE = "PO_DONE",
}

// Статусы оплаты
enum PaymentStatus {
  PREPAIMENT_NOT_PAID = "PREPAIMENT_NOT_PAID",
  PREPAIMENT_PAID = "PREPAIMENT_PAID",
  CREDIT_NOT_PAID = "CREDIT_NOT_PAID",
  CREDIT_PAID = "CREDIT_PAID",
}

// Подтверждение TSI
enum TSIConfirm {
  CONFIRMED_WITH_NOTES = "CONFIRMED_WITH_NOTES",
  NOT_CONFIRMED = "NOT_CONFIRMED",
  IN_PROGRESS = "IN_PROGRESS",
  CONFIRMED = "CONFIRMED",
}

// Роли пользователей
enum Role {
  HEAD_OF_DEPARTMENT = "HEAD_OF_DEPARTMENT",
  SAFETY_SPECIALIST = "SAFETY_SPECIALIST",
  VESSEL_MANAGER = "VESSEL_MANAGER",
  TEAM_LEADER = "TEAM_LEADER",
  SUPPLIER = "SUPPLIER",
  DIRECTOR = "DIRECTOR",
  COUNTER = "COUNTER",
  GUEST = "GUEST",
  TSI = "TSI",
}

// Статусы доступа
enum AccessStatus {
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
  REVOKED = "REVOKED",
  PENDING = "PENDING",
}

// Типы полей
enum FieldType {
  TEXT = "TEXT",
  NUMBER = "NUMBER",
  BOOLEAN = "BOOLEAN",
  DATE = "DATE",
  DROPDOWN = "DROPDOWN",
  MULTISELECT = "MULTISELECT",
}

// Типы записей
enum RecordType {
  ROUTINE_CHECK = "ROUTINE_CHECK",
  MEDICATION = "MEDICATION",
  SAMPLING = "SAMPLING",
  OBSERVATION = "OBSERVATION",
  TREATMENT = "TREATMENT",
  EMERGENCY = "EMERGENCY",
}

// Уровни активности
enum ActivityLevel {
  VERY_LOW = "VERY_LOW",
  LOW = "LOW",
  NORMAL = "NORMAL",
  HIGH = "HIGH",
  VERY_HIGH = "VERY_HIGH",
}
```

---

## 📦 Структура Request (Основная модель)

```typescript
interface Request {
  // Основные поля
  id?: string;
  identifier: string;              // Обязательное - уникальный идентификатор
  vesselId: string;                // Обязательное - ID судна (раньше laboratoryId)
  
  // Статусы
  status: RequestStatus;           // Обязательное - статус запроса
  poStatus: PoStatus;              // Обязательное - статус PO
  tsiConfirm?: TSIConfirm;        // Опциональное - подтверждение TSI
  paimentStatus?: PaymentStatus;   // Опциональное - статус оплаты (typo в Prisma: paiment)
  
  // Информация о заказе
  description?: string;            // Описание запроса
  poNumber?: string;               // Номер PO
  offerNumber?: string;            // Номер предложения
  companyOfOrder?: string;         // Компания заказа
  countryOfOrder?: string;         // Страна заказа
  
  // Связи
  requestTypeId?: string;          // ID типа запроса
  requestType?: RequestTypeModel;  // Связь с моделью типа запроса
  vessel?: Vessel;                 // Связь с судном
  records?: RequestRecord[];       // Записи запроса
  customFields?: CustomFieldValue[]; // Кастомные поля
  
  // Метаданные
  createdAt?: string;
  updatedAt?: string;
}
```

---

## 🔗 Связанные модели

### RequestTypeModel (справочник типов запросов)
```typescript
interface RequestTypeModel {
  id: string;
  name: string;
  description?: string;
  vesselId: string;
  createdAt?: string;
  updatedAt?: string;
}
```

⚠️ **Важно**: `RequestType` (enum) и `RequestTypeModel` (модель) - это разные сущности!
- **RequestType** (enum) - используется для вкладок: ENGINE, ELECTRICAL, DECK
- **RequestTypeModel** - справочник типов запросов, привязанный к конкретному судну

### CustomField (кастомные поля)
```typescript
interface CustomField {
  id: string;
  name: string;
  fieldType: FieldType;
  isRequired: boolean;
  defaultValue?: string;
  description?: string;
  requestTypeId: string;
  createdAt?: string;
  updatedAt?: string;
}
```

### CustomFieldValue (значения кастомных полей)
```typescript
interface CustomFieldValue {
  id: string;
  value: string;
  requestId: string;
  customFieldId: string;
  customField?: CustomField;
  createdAt?: string;
  updatedAt?: string;
}
```

### RequestRecord (записи запроса)
```typescript
interface RequestRecord {
  id?: string;
  requestId: string;
  recordType: RecordType;
  date: string;
  createdById: string;
  temperature?: number;
  weight?: number;
  feedIntake?: number;
  waterIntake?: number;
  activityLevel?: ActivityLevel;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  // Relations
  measurements?: Measurement[];
  photos?: RecordPhoto[];
}
```

### Measurement (измерения)
```typescript
interface Measurement {
  id?: string;
  recordId: string;
  parameter: string;
  value: number;
  unit?: string;
  createdAt?: string;
}
```

### RecordPhoto (фотографии записей)
```typescript
interface RecordPhoto {
  id?: string;
  recordId: string;
  imageUrl: string;
  caption?: string;
  createdAt?: string;
}
```

---

## 🎯 Использование в компонентах

### Создание нового запроса
```typescript
const createRequest: CreateRequestData = {
  identifier: "REQ-001",
  vesselId: "vessel-uuid",
  description: "Engine spare parts",
  status: RequestStatus.WAITING,
  poStatus: PoStatus.WITHOUT_PO,
  companyOfOrder: "Marine Supplies Inc",
  countryOfOrder: "USA",
};
```

### Обновление запроса
```typescript
const updateRequest: UpdateRequestData = {
  id: "request-uuid",
  status: RequestStatus.ORDERED,
  poStatus: PoStatus.PO_DONE,
  poNumber: "PO-2024-001",
};
```

### Фильтрация запросов
```typescript
const filters: RequestFilters = {
  statuses: [RequestStatus.WAITING, RequestStatus.ORDERED],
  requestTypes: [RequestType.ENGINE],
  poStatus: [PoStatus.WITHOUT_PO],
  search: "spare parts",
};
```

---

## 📝 API Endpoints (рекомендуемые)

```typescript
// GET - получить список запросов
GET /api/requests?vesselId={id}&page=1&pageSize=10

// GET - получить конкретный запрос
GET /api/requests/{id}

// POST - создать новый запрос
POST /api/requests
Body: CreateRequestData

// PUT - обновить запрос
PUT /api/requests
Body: UpdateRequestData

// DELETE - удалить запрос
DELETE /api/requests/{id}

// GET - получить записи запроса
GET /api/requests/{id}/records

// POST - создать запись для запроса
POST /api/requests/{id}/records
Body: CreateRequestRecordData
```

---

## ⚠️ Важные замечания

### 1. Опечатка в Prisma Schema
```typescript
// В schema.prisma используется "paiment" вместо "payment"
paimentStatus     PaymentStatus?

// Мы используем такое же написание для совместимости:
interface Request {
  paimentStatus?: PaymentStatus;  // ← С опечаткой как в БД
}
```

### 2. Обратная совместимость
В компонентах prop `animals` используется для передачи `Request[]` для обратной совместимости. Рекомендуется переименовать в будущем:

```typescript
// Сейчас:
interface RequestsListProps {
  animals: Request[];  // ← Старое название prop
  ...
}

// Рекомендуется изменить на:
interface RequestsListProps {
  requests: Request[];  // ← Более логичное название
  ...
}
```

### 3. Миграция данных
При переходе с animals на requests необходимо:
1. Обновить все API endpoints
2. Изменить структуру базы данных
3. Мигрировать существующие данные
4. Обновить все компоненты и контейнеры

---

## 🔄 Статус миграции

- ✅ Типы синхронизированы с Prisma
- ✅ RequestType исправлен (ELECTRIC → ELECTRICAL)
- ✅ requests-list.tsx обновлен
- ✅ requests-tabs.tsx обновлен
- ⏳ animal.container.tsx требует обновления
- ⏳ animals-filter.tsx требует обновления
- ⏳ API endpoints требуют создания/обновления

---

## 📚 Следующие шаги

1. **Backend**: Создать API endpoints для работы с Request моделью
2. **Frontend**: Обновить контейнеры и фильтры
3. **Тестирование**: Проверить все CRUD операции
4. **Миграция**: Перенести существующие данные (если есть)
5. **Документация**: Обновить API документацию

