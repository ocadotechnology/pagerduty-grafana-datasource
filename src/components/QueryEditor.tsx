import React, { ChangeEvent } from 'react';
import { InlineField, Input } from '@grafana/ui';
import { QueryEditorProps } from '@grafana/data';
import { DataSource } from '../datasource';
import { MyDataSourceOptions, MyQuery } from '../types';

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

export function QueryEditor({ query, onChange }: Props) {
    const onServiceIdChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChange({ ...query, serviceId: event.target.value });
    };

    const { serviceId } = query;

    return (
        <div className="gf-form">
            <InlineField label="Service Id" labelWidth={16} tooltip="Not used yet">
                <Input onChange={onServiceIdChange} value={serviceId || ''} />
            </InlineField>
        </div>
    );
}
