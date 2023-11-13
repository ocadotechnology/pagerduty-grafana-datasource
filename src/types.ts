import { DataQuery, DataSourceJsonData } from '@grafana/schema';

export interface MyQuery extends DataQuery {
    serviceId: string;
}

/**
 * These are options configured for each DataSource instance
 */
export interface MyDataSourceOptions extends DataSourceJsonData {
}

export const DEFAULT_QUERY: Partial<MyQuery> = {
  serviceId: "",
};
/**
 * Value that is used in the backend, but never sent over HTTP to the frontend
 */
export interface MySecureJsonData {
    apiKey?: string;
}

/**
 * Value that is used in the backend, but never sent over HTTP to the frontend
 */
export interface ListIncidentsResponse {
    incidents: Incident[]
}

/**
 * Value that is used in the backend, but never sent over HTTP to the frontend
 */
export interface Incident {
    created_at: string;
    resolved_at: string;
    title?: string;
    description?: string;
    incident_key?: string;
}

