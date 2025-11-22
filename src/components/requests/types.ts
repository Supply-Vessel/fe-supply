// ==================== ENUMS ====================

export enum RequestType {
  ENGINE = "ENGINE",
  ELECTRICAL = "ELECTRICAL",
  DECK = "DECK",
}

export enum RequestStatus {
  WAITING = "WAITING",
  ORDERED = "ORDERED",
  RECEIVED = "RECEIVED",
  ON_HOLD = "ON_HOLD",
  CANCELLED = "CANCELLED",
}

export enum PoStatus {
  WITHOUT_PO = "WITHOUT_PO",
  PO_DONE = "PO_DONE",
}

export enum PaymentStatus {
  PREPAYMENT_NOT_PAID = "PREPAYMENT_NOT_PAID",
  PREPAYMENT_PAID = "PREPAYMENT_PAID",
  CREDIT_NOT_PAID = "CREDIT_NOT_PAID",
  CREDIT_PAID = "CREDIT_PAID",
}

export enum TSIConfirm {
  CONFIRMED_WITH_NOTES = "CONFIRMED_WITH_NOTES",
  NOT_CONFIRMED = "NOT_CONFIRMED",
  IN_PROGRESS = "IN_PROGRESS",
  CONFIRMED = "CONFIRMED",
}

export enum FieldType {
  TEXT = "TEXT",
  NUMBER = "NUMBER",
  BOOLEAN = "BOOLEAN",
  DATE = "DATE",
  DROPDOWN = "DROPDOWN",
  MULTISELECT = "MULTISELECT",
}

export enum RecordType {
  ROUTINE_CHECK = "ROUTINE_CHECK",
  MEDICATION = "MEDICATION",
  SAMPLING = "SAMPLING",
  OBSERVATION = "OBSERVATION",
  TREATMENT = "TREATMENT",
  EMERGENCY = "EMERGENCY",
}

export enum ActivityLevel {
  VERY_LOW = "VERY_LOW",
  LOW = "LOW",
  NORMAL = "NORMAL",
  HIGH = "HIGH",
  VERY_HIGH = "VERY_HIGH",
}

export enum Role {
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

export enum AccessStatus {
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
  REVOKED = "REVOKED",
  PENDING = "PENDING",
}

// ==================== INTERFACES ====================

export interface Vessel {
  id: string;
  name: string;
  username: string;
  position: Role;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RequestTypeModel {
  id: string;
  name: string;
  description?: string;
  vesselId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CustomField {
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

export interface CustomFieldValue {
  id: string;
  value: string;
  requestId: string;
  customFieldId: string;
  customField?: CustomField;
  createdAt?: string;
  updatedAt?: string;
}

export interface Request {
  id?: string;
  tsiConfirm?: TSIConfirm;
  identifier: string;
  poStatus: PoStatus;
  poNumber?: string;
  paymentStatus?: PaymentStatus;
  description?: string;
  wayBillNumber?: string;
  storeLocation?: string;
  status: RequestStatus;
  offerNumber?: string;
  companyOfOrder?: string;
  countryOfOrder?: string;
  requestTypeId?: string;
  vesselId: string;
  createdAt?: string;
  updatedAt?: string;
  // Relations
  requestType?: RequestType;
  vessel?: Vessel;
  records?: RequestRecord[];
  customFields?: CustomFieldValue[];
}

export interface Measurement {
  id?: string;
  recordId: string;
  parameter: string;
  value: number;
  unit?: string;
  createdAt?: string;
}

export interface RequestRecord {
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
}

// ==================== CREATE/UPDATE INTERFACES ====================

export interface CreateRequestData {
  identifier: string;
  description?: string;
  requestType?: RequestType;
  requestTypeId?: string;
  poStatus?: PoStatus;
  poNumber?: string;
  paimentStatus?: PaymentStatus;
  status?: RequestStatus;
  offerNumber?: string;
  companyOfOrder?: string;
  countryOfOrder?: string;
  tsiConfirm?: TSIConfirm;
  customFields?: CreateCustomFieldValue[];
}

export type FiltersType = RequestFilters;

export interface CreateCustomFieldValue {
  customFieldId: string;
  value: string;
}

export interface UpdateRequestData extends Partial<CreateRequestData> {
  id: string;
}

export interface CreateRequestRecordData {
  requestId: string;
  recordType: RecordType;
  date?: string;
  createdById: string;
  temperature?: number;
  weight?: number;
  feedIntake?: number;
  waterIntake?: number;
  activityLevel?: ActivityLevel;
  notes?: string;
  measurements?: CreateMeasurementData[];
}

export interface CreateMeasurementData {
  parameter: string;
  value: number;
  unit?: string;
}

// ==================== PAGINATION ====================

export interface RequestPagination {
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  currentPage: number;
  totalCount: number;
  totalPages: number;
  pageSize: number;
}

// ==================== FILTERS ====================

export interface RequestFilters {
  statuses?: RequestStatus[];
  requestTypes?: RequestType[];
  poStatus?: PoStatus[];
  paymentStatus?: PaymentStatus[];
  tsiConfirm?: TSIConfirm[];
  search?: string;
}

// ==================== COMPONENT PROPS ====================

export interface RequestsListProps {
  requests: Request[];
  requestPagination: RequestPagination;
  setPagination: (pagination: RequestPagination) => void;
  handleUpdateDataPagination: (data: { page?: number; pageSize?: number }) => void;
  onSave: (request: Partial<Request>) => void;
  onAdd: (request: Partial<Request>) => void;
  defaultType?: RequestType;
}

export interface RequestEnums {
  requestStatus: RequestStatus[];
  paymentStatus: PaymentStatus[];
  requestType: RequestType[];
  tsiConfirm: TSIConfirm[];
  poStatus: PoStatus[];
  role: Role[];
}
