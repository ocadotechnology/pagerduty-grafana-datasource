import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  MutableDataFrame,
  FieldType,
} from '@grafana/data';

import { MyQuery, MyDataSourceOptions, ListIncidentsResponse, Incident } from './types';

import { FetchResponse, getBackendSrv } from '@grafana/runtime';

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
      const response = await this.doRequestPaginated(target, from, to, 25);

      response.incidents.forEach((incident: Incident) => {
        const timestamp: Date = new Date(incident.created_at);
        const timestamp_end: Date = incident.resolved_at !== null ? new Date(incident.resolved_at) : new Date(to);
        const createdAt = timestamp.getTime();
        const resolvedAt = timestamp_end.getTime();
        const title = incident.title;
        const text = incident.summary;
        const id = incident.incident_key;

        frame.appendRow([createdAt, resolvedAt, title, text, id]);
      });
      return frame;
    });

    return Promise.all(promises).then((data) => ({ data: data }));
  }

  async doRequestPaginated(query: MyQuery, from: string, to: string, pageSize: number): Promise<ListIncidentsResponse> {
    let listIncidentReponse: ListIncidentsResponse = { incidents: [], more: false };

    let pageNumber = 0;
    do {
      const response = await this.doRequest(query, from, to, pageSize, pageNumber);
      listIncidentReponse.incidents = Array.prototype.concat(listIncidentReponse.incidents, response.data.incidents);
      listIncidentReponse.more = response.data.more;
      pageNumber++;
    } while (listIncidentReponse.more);
    return listIncidentReponse;
  }

  async doRequest(
    query: MyQuery,
    from: string,
    to: string,
    pageSize: number,
    pageNumber: number
  ): Promise<FetchResponse<ListIncidentsResponse>> {
    const routePath = '/pagerduty';

    const result = getBackendSrv().fetch<ListIncidentsResponse>({
      method: 'GET',
      url: this.url + routePath + '/incidents',
      params: {
        'service_ids[]': query.serviceId === '' ? [] : [query.serviceId],
        since: from,
        until: to,
        limit: pageSize,
        offset: pageNumber * pageSize,
      },
      responseType: 'json',
    });

    return lastValueFrom(result);
  }

  async testDatasource() {
    // Implement a health check for your data source.
    try {
      const testQuery = { serviceId: '', refId: '' };
      const response = await this.doRequest(testQuery, '', '', 25, 0);
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
    } catch (err) {
      return {
        status: 'error',
        message: 'Error contacting remote datasource, please check the API key provided.',
      };
    }
  }
}
