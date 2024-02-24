import {
    DataQueryRequest,
    DataQueryResponse,
    DataSourceApi,
    DataSourceInstanceSettings,
    MutableDataFrame,
    FieldType,
} from '@grafana/data';

import { MyQuery, MyDataSourceOptions, ListIncidentsResponse, Incident } from './types';

import {
    FetchResponse,
    getBackendSrv,
} from "@grafana/runtime";

import { lastValueFrom } from 'rxjs';

export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
    url?: string;

    constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
        super(instanceSettings);
        this.url = instanceSettings.url;
        this.annotations = {};
    }

    async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
        const { range } = options;
        const from = range!.from.toISOString();
        const to = range!.to.toISOString();

        const promises = options.targets.map(async (target) => {
            const response = this.doRequest(target, from, to);
            const frame = new MutableDataFrame({
                refId: target.refId,
                fields: [
                    { name: 'time', type: FieldType.time },
                    { name: 'timeEnd', type: FieldType.time },
                    { name: 'title', type: FieldType.string },
                    { name: 'text', type: FieldType.string },
                    { name: 'id', type: FieldType.string },
                ],
            });
            await response
                .then((response) => {
                    response.data.incidents.forEach((incident: Incident) => {
                        const timestamp: Date = new Date(incident.created_at);
                        const timestamp_end: Date = new Date(incident.resolved_at);
                        const createdAt = timestamp.getTime()
                        const resolvedAt = timestamp_end.getTime();
                        const title = incident.title;
                        const text = incident.summary;
                        const id = incident.incident_key;

                        frame.appendRow([createdAt, resolvedAt, title, text, id]);
                    })
                });
            return frame;
        });

        return Promise.all(promises).then((data) => ({ data: data }));
    }

    async doRequest(query: MyQuery, from: string, to: string): Promise<FetchResponse<ListIncidentsResponse>> {
        const routePath = '/pagerduty';

        const result = getBackendSrv().fetch<ListIncidentsResponse>({
            method: "GET",
            url: this.url + routePath + "/incidents",
            params: {
                "service_ids[]": query.serviceId === "" ? [] : [query.serviceId],
                since: from,
                until: to
            },
            responseType: "json"
        })

        return lastValueFrom(result);
    }

    async testDatasource() {
        // Implement a health check for your data source.
        try {
            const testQuery = { serviceId: "", refId: "" }
            const response = await this.doRequest(testQuery, "", "");
            if (response.status === 200) {
                return {
                    status: 'success',
                    message: 'Success!',
                };
            }
            return {
                status: 'error',
                message: response.statusText,
            };
        }
        catch (err) {
            return {
                status: 'error',
                message: 'Error contacting remote datasource, please check the API key provided.',
            };
        }
    }
}
