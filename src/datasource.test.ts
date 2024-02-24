import { of } from 'rxjs';
import { MyDataSourceOptions } from 'types';
import { DataSourceInstanceSettings, dateTime, FieldType, MutableDataFrame } from '@grafana/data';
import { DataSource } from 'datasource';

const fetchMock = jest.fn().mockReturnValue(of(createDefaultPagerdutyResponse()));

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;

const time = ({ hours = 0, seconds = 0, minutes = 0 }) => dateTime(hours * HOUR + minutes * MINUTE + seconds * SECOND);

jest.mock('@grafana/runtime', () => ({
    ...jest.requireActual('@grafana/runtime'),
    getBackendSrv: () => ({
        fetch: fetchMock,
    }),
}));

const range = { from: time({ seconds: 63 }), to: time({ seconds: 183 }) };
const defaultQuery = {
    range: { ...range, raw: range },
    requestId: "uuid",
    interval: "1",
    intervalMs: 1,
    timezone: "UTC",
    app: "Pagerduty",
    startTime: 1,
    targets: [{ serviceId: "", refId: "refId" }],
    scopedVars: {}
}

describe('API testing', () => {
    it('Query executes and API response can be parsed', async () => {
        const instanceSettings = {
            url: 'proxied',
            directUrl: 'direct',
            user: 'test',
            password: 'mupp',
            access: 'direct',
            jsonData: {
                customQueryParameters: '',
            },
        } as unknown as DataSourceInstanceSettings<MyDataSourceOptions>;
        const directDs = new DataSource(instanceSettings);

        await directDs.query(defaultQuery);
    });

    it('Query returns expected DatadFrame', async () => {
        const instanceSettings = {
            url: 'proxied',
            directUrl: 'direct',
            user: 'test',
            password: 'mupp',
            access: 'direct',
            jsonData: {
                customQueryParameters: '',
            },
        } as unknown as DataSourceInstanceSettings<MyDataSourceOptions>;
        const directDs = new DataSource(instanceSettings);

        const expectedResponse = new MutableDataFrame({
            refId: "refId",
            fields: [
                { config: {}, name: 'time', values: [1444167042000], type: FieldType.time },
                { config: {}, name: 'timeEnd', values: [1444167503000], type: FieldType.time },
                { config: {}, name: 'title', values: ["The server is on fire."], type: FieldType.string },
                { config: {}, name: 'text', values: ["[#1234] The server is on fire."], type: FieldType.string },
                { config: {}, name: 'id', values: ["baf7cf21b1da41b4b0221008339ff357"], type: FieldType.string },
            ]
        })

        const result = await directDs.query(defaultQuery);
        expect(JSON.stringify(result.data)).toEqual(JSON.stringify([expectedResponse]));
    })
});

function createDefaultPagerdutyResponse() {
    return {
        "data": {
            "incidents": [
                {
                    "id": "PT4KHLK",
                    "type": "incident",
                    "summary": "[#1234] The server is on fire.",
                    "self": "https://api.pagerduty.com/incidents/PT4KHLK",
                    "html_url": "https://subdomain.pagerduty.com/incidents/PT4KHLK",
                    "incident_number": 1234,
                    "title": "The server is on fire.",
                    "created_at": "2015-10-06T21:30:42Z",
                    "updated_at": "2015-10-06T21:40:23Z",
                    "status": "resolved",
                    "incident_key": "baf7cf21b1da41b4b0221008339ff357",
                    "service": {
                        "id": "PIJ90N7",
                        "type": "service_reference",
                        "summary": "My Mail Service",
                        "self": "https://api.pagerduty.com/services/PIJ90N7",
                        "html_url": "https://subdomain.pagerduty.com/service-directory/PIJ90N7"
                    },
                    "assignments": [],
                    "assigned_via": "escalation_policy",
                    "last_status_change_at": "2015-10-06T21:38:23Z",
                    "resolved_at": "2015-10-06T21:38:23Z",
                    "first_trigger_log_entry": {
                        "id": "Q02JTSNZWHSEKV",
                        "type": "trigger_log_entry_reference",
                        "summary": "Triggered through the API",
                        "self": "https://api.pagerduty.com/log_entries/Q02JTSNZWHSEKV?incident_id=PT4KHLK",
                        "html_url": "https://subdomain.pagerduty.com/incidents/PT4KHLK/log_entries/Q02JTSNZWHSEKV"
                    },
                    "alert_counts": {
                        "all": 2,
                        "triggered": 0,
                        "resolved": 2
                    },
                    "is_mergeable": true,
                    "escalation_policy": {
                        "id": "PT20YPA",
                        "type": "escalation_policy_reference",
                        "summary": "Another Escalation Policy",
                        "self": "https://api.pagerduty.com/escalation_policies/PT20YPA",
                        "html_url": "https://subdomain.pagerduty.com/escalation_policies/PT20YPA"
                    },
                    "teams": [
                        {
                            "id": "PQ9K7I8",
                            "type": "team_reference",
                            "summary": "Engineering",
                            "self": "https://api.pagerduty.com/teams/PQ9K7I8",
                            "html_url": "https://subdomain.pagerduty.com/teams/PQ9K7I8"
                        }
                    ],
                    "pending_actions": [],
                    "acknowledgements": [],
                    "alert_grouping": {
                        "grouping_type": "advanced",
                        "started_at": "2015-10-06T21:30:42Z",
                        "ended_at": null,
                        "alert_grouping_active": true
                    },
                    "last_status_change_by": {
                        "id": "PXPGF42",
                        "type": "user_reference",
                        "summary": "Earline Greenholt",
                        "self": "https://api.pagerduty.com/users/PXPGF42",
                        "html_url": "https://subdomain.pagerduty.com/users/PXPGF42"
                    },
                    "priority": {
                        "id": "P53ZZH5",
                        "type": "priority_reference",
                        "summary": "P2",
                        "self": "https://api.pagerduty.com/priorities/P53ZZH5"
                    },
                    "resolve_reason": null,
                    "conference_bridge": {
                        "conference_number": "+1-415-555-1212,,,,1234#",
                        "conference_url": "https://example.com/acb-123"
                    },
                    "incidents_responders": [],
                    "responder_requests": [],
                    "urgency": "high"
                }
            ],
            "limit": 1,
            "offset": 0,
            "more": true
        }
    };
}
