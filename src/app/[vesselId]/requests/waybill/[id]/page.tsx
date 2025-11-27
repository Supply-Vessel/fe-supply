"use server"

import RecordContainer from "./record.container";
import { apiClient } from "@/src/lib/apiClient";
import { cookies } from "next/headers";

export interface PageProps {
    params: {
        wayBillId: string;
    }
}

// create mock data from this data: but a bit shorter
const mockData = {
	"success": true,
	"status_code": "OK",
	"metadata": {
		"request_parameters": {
			"number": "910-18420146"
		},
		"airline": {
			"name": "Oman Air",
			"prefix": "910",
			"iata_code": "WY",
			"icao_code": "OMA",
			"url": "https://www.omanair.com/en"
		},
		"from_cache": false,
		"updated_at": "2025-11-26 18:59:37",
		"cache_expires": "2025-11-26 20:00:37",
		"api_calls": {
			"total": 2000,
			"used": 81,
			"remaining": 1919
		},
		"unique_shipments": {
			"total": 150,
			"used": 32,
			"remaining": 118
		}
	},
	"data": {
		"status": "DELIVERED",
		"from": {
			"name": "Incheon International Airport",
			"state": "Incheon",
			"country": "South Korea",
			"country_code": "KR",
			"locode": null,
			"iata_code": "ICN",
			"icao_code": "RKSI",
			"lat": 37.4691009521,
			"lng": 126.4509963989,
			"timezone": "Asia/Seoul",
			"nearest_city": "Seoul"
		},
		"to": {
			"name": "Muscat International Airport",
			"state": "Muscat",
			"country": "Oman",
			"country_code": "OM",
			"locode": null,
			"iata_code": "MCT",
			"icao_code": "OOMS",
			"lat": 23.5932998657,
			"lng": 58.2844009399,
			"timezone": "Asia/Muscat",
			"nearest_city": "Muscat"
		},
		"departure_datetime_local": {
			"estimated": "2025-10-19 00:00:00",
			"actual": null
		},
		"arrival_datetime_local": {
			"estimated": "2025-10-21 12:00:00",
			"actual": "2025-10-21 13:50:00"
		},
		"piece": 8,
		"weight": 541,
		"flight_number": "WY844",
		"routes": [
			{
				"order_id": 1,
				"status": "ARRIVED",
				"from": {
					"name": "Incheon International Airport",
					"state": "Incheon",
					"country": "South Korea",
					"country_code": "KR",
					"locode": null,
					"iata_code": "ICN",
					"icao_code": "RKSI",
					"lat": 37.4691009521,
					"lng": 126.4509963989,
					"timezone": "Asia/Seoul",
					"nearest_city": "Seoul"
				},
				"to": {
					"name": "Ninoy Aquino International Airport",
					"state": null,
					"country": "Philippines",
					"country_code": "PH",
					"locode": null,
					"iata_code": "MNL",
					"icao_code": "RPLL",
					"lat": 14.508600235,
					"lng": 121.019996643,
					"timezone": "Asia/Manila",
					"nearest_city": "Manila"
				},
				"transport_type": "PLANE",
				"departure_datetime_local": {
					"estimated": "2025-10-19 00:00:00",
					"actual": null
				},
				"arrival_datetime_local": {
					"estimated": null,
					"actual": "2025-10-27 11:04:00"
				},
				"piece": 8,
				"weight": 541,
				"flight_number": "5J187",
				"path": [
					[37.4691009521, 126.4509963989],
					[36.469, 126.528],
					[35.469, 126.598],
					[34.469, 126.658],
					[33.469, 126.7],
					[32.469, 126.719],
					[31.469, 126.712],
					[30.469, 126.673],
					[29.469, 126.599],
					[28.469, 126.487],
					[27.469, 126.335],
					[26.469, 126.14],
					[25.469, 125.903],
					[24.469, 125.623],
					[23.469, 125.3],
					[22.469, 124.938],
					[21.469, 124.537],
					[20.469, 124.102],
					[19.469, 123.635],
					[18.469, 123.141],
					[17.469, 122.625],
					[16.469, 122.092],
					[15.469, 121.548],
					[14.508600235, 121.019996643]
				]
			},
			{
				"order_id": 2,
				"status": "ARRIVED",
				"from": {
					"name": "Ninoy Aquino International Airport",
					"state": null,
					"country": "Philippines",
					"country_code": "PH",
					"locode": null,
					"iata_code": "MNL",
					"icao_code": "RPLL",
					"lat": 14.508600235,
					"lng": 121.019996643,
					"timezone": "Asia/Manila",
					"nearest_city": "Manila"
				},
				"to": {
					"name": "Muscat International Airport",
					"state": "Muscat",
					"country": "Oman",
					"country_code": "OM",
					"locode": null,
					"iata_code": "MCT",
					"icao_code": "OOMS",
					"lat": 23.5932998657,
					"lng": 58.2844009399,
					"timezone": "Asia/Muscat",
					"nearest_city": "Muscat"
				},
				"transport_type": "PLANE",
				"departure_datetime_local": {
					"estimated": "2025-10-21 07:45:00",
					"actual": "2025-10-21 07:45:00"
				},
				"arrival_datetime_local": {
					"estimated": "2025-10-21 12:00:00",
					"actual": "2025-10-21 13:50:00"
				},
				"piece": 8,
				"weight": 541,
				"flight_number": "WY844",
				"path": [
					[14.508600235, 121.019996643],
					[15.882, 118.02],
					[16.787, 116.02],
					[17.234, 115.02],
					[23.5932998657, 58.2844009399]
				]
			}
		],
		"events": [
			{
				"order_id": 1,
				"event_code": "BKD",
				"description": "Booked, 8 pcs / 541 kg, flight №: 5J187, from: ICN, to: MNL, etd: 19 Oct 2025",
				"location": {
					"name": "Incheon International Airport",
					"state": "Incheon",
					"country": "South Korea",
					"country_code": "KR",
					"locode": null,
					"iata_code": "ICN",
					"icao_code": "RKSI",
					"lat": 37.4691009521,
					"lng": 126.4509963989,
					"timezone": "Asia/Seoul",
					"nearest_city": "Seoul"
				},
				"datetime_local": {
					"estimated": null,
					"actual": "2025-10-17 15:19:00"
				},
				"piece": 8,
				"weight": 541,
				"flight_number": "5J187"
			},
			{
				"order_id": 2,
				"event_code": "BKD",
				"description": "Booked, 8 pcs / 541 kg, flight №: WY844, from: MNL, to: MCT, etd: 21 Oct 2025",
				"location": {
					"name": "Ninoy Aquino International Airport",
					"state": null,
					"country": "Philippines",
					"country_code": "PH",
					"locode": null,
					"iata_code": "MNL",
					"icao_code": "RPLL",
					"lat": 14.508600235,
					"lng": 121.019996643,
					"timezone": "Asia/Manila",
					"nearest_city": "Manila"
				},
				"datetime_local": {
					"estimated": null,
					"actual": "2025-10-17 15:19:00"
				},
				"piece": 8,
				"weight": 541,
				"flight_number": "WY844"
			},
			{
				"order_id": 3,
				"event_code": "RCS",
				"description": "Received from shipper, 8 pcs / 541 kg",
				"location": {
					"name": "Incheon International Airport",
					"state": "Incheon",
					"country": "South Korea",
					"country_code": "KR",
					"locode": null,
					"iata_code": "ICN",
					"icao_code": "RKSI",
					"lat": 37.4691009521,
					"lng": 126.4509963989,
					"timezone": "Asia/Seoul",
					"nearest_city": "Seoul"
				},
				"datetime_local": {
					"estimated": null,
					"actual": "2025-10-20 19:26:00"
				},
				"piece": 8,
				"weight": 541,
				"flight_number": null
			},
			{
				"order_id": 4,
				"event_code": "ARR",
				"description": "Arrived, 8 pcs / 541 kg, from: ICN",
				"location": {
					"name": "Ninoy Aquino International Airport",
					"state": null,
					"country": "Philippines",
					"country_code": "PH",
					"locode": null,
					"iata_code": "MNL",
					"icao_code": "RPLL",
					"lat": 14.508600235,
					"lng": 121.019996643,
					"timezone": "Asia/Manila",
					"nearest_city": "Manila"
				},
				"datetime_local": {
					"estimated": null,
					"actual": "2025-10-27 11:04:00"
				},
				"piece": 8,
				"weight": 541,
				"flight_number": null
			},
			{
				"order_id": 5,
				"event_code": "ARR",
				"description": "Arrived, 8 pcs / 541 kg, flight №: WY844, from: MNL",
				"location": {
					"name": "Muscat International Airport",
					"state": "Muscat",
					"country": "Oman",
					"country_code": "OM",
					"locode": null,
					"iata_code": "MCT",
					"icao_code": "OOMS",
					"lat": 23.5932998657,
					"lng": 58.2844009399,
					"timezone": "Asia/Muscat",
					"nearest_city": "Muscat"
				},
				"datetime_local": {
					"estimated": null,
					"actual": "2025-10-21 13:50:00"
				},
				"piece": 8,
				"weight": 541,
				"flight_number": "WY844"
			},
			{
				"order_id": 6,
				"event_code": "DEP",
				"description": "Departed, 8 pcs / 541 kg, flight №: WY844, to: MCT (ULD: PAJ17101WY (8))",
				"location": {
					"name": "Ninoy Aquino International Airport",
					"state": null,
					"country": "Philippines",
					"country_code": "PH",
					"locode": null,
					"iata_code": "MNL",
					"icao_code": "RPLL",
					"lat": 14.508600235,
					"lng": 121.019996643,
					"timezone": "Asia/Manila",
					"nearest_city": "Manila"
				},
				"datetime_local": {
					"estimated": null,
					"actual": "2025-10-21 07:45:00"
				},
				"piece": 8,
				"weight": 541,
				"flight_number": "WY844"
			},
			{
				"order_id": 7,
				"event_code": "ARR",
				"description": "Arrived, 8 pcs / 541 kg, flight №: WY844, from: MNL (ULD: AWB received from a given flight (8))",
				"location": {
					"name": "Muscat International Airport",
					"state": "Muscat",
					"country": "Oman",
					"country_code": "OM",
					"locode": null,
					"iata_code": "MCT",
					"icao_code": "OOMS",
					"lat": 23.5932998657,
					"lng": 58.2844009399,
					"timezone": "Asia/Muscat",
					"nearest_city": "Muscat"
				},
				"datetime_local": {
					"estimated": null,
					"actual": "2025-10-21 12:00:00"
				},
				"piece": 8,
				"weight": 541,
				"flight_number": "WY844"
			},
			{
				"order_id": 8,
				"event_code": "DLV",
				"description": "Delivered, 8 pcs / 541 kg, flight №: WY844",
				"location": {
					"name": "Muscat International Airport",
					"state": "Muscat",
					"country": "Oman",
					"country_code": "OM",
					"locode": null,
					"iata_code": "MCT",
					"icao_code": "OOMS",
					"lat": 23.5932998657,
					"lng": 58.2844009399,
					"timezone": "Asia/Muscat",
					"nearest_city": "Muscat"
				},
				"datetime_local": {
					"estimated": null,
					"actual": "2025-10-21 12:00:00"
				},
				"piece": 8,
				"weight": 541,
				"flight_number": "WY844"
			}
		]
	}
}

export default async function RecordPage({params}: PageProps) {
    const {wayBillId} = await params;
    const cookieStore = await cookies();
    const userId = await cookieStore.get('USER_ID')?.value || 'default';
    const logistics = await apiClient.get(`/api/tracking/${wayBillId}`);
    console.log("logistics", logistics);
	
    return (
        <RecordContainer
            wayBillId={wayBillId}
            logistics={logistics}
            userId={userId}
        />
    )
}