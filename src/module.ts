import { DataSourcePlugin } from '@grafana/data';
import { DataSource } from './datasource';
import { ConfigEditor } from './components/ConfigEditor';
import { QueryEditor } from './components/QueryEditor';
import { MyQuery } from './types';

export const plugin = new DataSourcePlugin<DataSource, MyQuery>(DataSource)
    .setConfigEditor(ConfigEditor)
    .setQueryEditor(QueryEditor);
