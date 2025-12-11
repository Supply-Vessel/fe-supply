/**
 * Информация о местоположении (аэропорт)
 */
export interface Location {
  name: string;
  state: string | null;
  country: string;
  country_code: string;
  locode: string | null;
  iata_code: string;
  icao_code: string;
  lat: number;
  lng: number;
  timezone: string;
  nearest_city: string;
}

/**
 * Дата и время (оценочное и фактическое)
 */
export interface DateTime {
  estimated: string | null;
  actual: string | null;
}

/**
 * Информация об авиакомпании
 */
export interface Airline {
  name: string;
  prefix: string;
  iata_code: string;
  icao_code: string;
  url: string;
}

/**
 * Координаты маршрута (широта, долгота)
 */
export type PathCoordinate = [number, number];

/**
 * Тип транспорта
 */
export type TransportType = 'PLANE' | 'TRUCK' | string;

/**
 * Статус доставки
 */
export type ShipmentStatus = 
  | 'DELIVERED'
  | 'IN_TRANSIT'
  | 'ARRIVED'
  | 'DEPARTED'
  | 'BOOKED'
  | string;

/**
 * Коды событий
 */
export type EventCode = 
  | 'BKD'  // Booked
  | 'RCS'  // Received from shipper
  | 'DEP'  // Departed
  | 'ARR'  // Arrived
  | 'DLV'  // Delivered
  | 'FWB'  // FWB processed
  | 'FOH'  // Freight on hand
  | 'RCF'  // Received from flight
  | 'NFD'  // Notified
  | string;

/**
 * Маршрут перевозки
 */
export interface Route {
  order_id: number;
  status: ShipmentStatus;
  from: Location;
  to: Location;
  transport_type: TransportType;
  departure_datetime_local: DateTime;
  arrival_datetime_local: DateTime;
  piece: number;
  weight: number;
  flight_number: string;
  path: PathCoordinate[];
}

/**
 * Событие в истории перевозки
 */
export interface Event {
  order_id: number;
  event_code: EventCode;
  description: string;
  location: Location;
  datetime_local: DateTime;
  piece: number;
  weight: number;
  flight_number: string | null;
}

/**
 * Данные о перевозке
 */
export interface TrackingData {
  status: ShipmentStatus;
  from: Location;
  to: Location;
  departure_datetime_local: DateTime;
  arrival_datetime_local: DateTime;
  piece: number;
  weight: number;
  flight_number: string;
  routes: Route[];
  events: Event[];
}

/**
 * Параметры запроса
 */
export interface RequestParameters {
  number: string;
}

/**
 * Информация об использовании API
 */
export interface ApiUsage {
  total: number;
  used: number;
  remaining: number;
}

/**
 * Метаданные ответа
 */
export interface Metadata {
  request_parameters: RequestParameters;
  airline: Airline;
  from_cache: boolean;
  updated_at: string;
  cache_expires: string;
  api_calls: ApiUsage;
  unique_shipments: ApiUsage;
}

/**
 * Успешный ответ API отслеживания
 */
export interface AirTrackingResponse {
  success: true;
  status_code: string;
  metadata: Metadata;
  data: TrackingData;
}

/**
 * Ответ с ошибкой
 */
export interface AirTrackingError {
  success: false;
  status_code: string;
  message: string;
  error?: string;
}