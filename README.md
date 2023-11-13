# PagerDuty annotation datasource for Grafana

This datasource currently supports graph annotations showing incident information from PagerDuty, and can only be filtered by serviceId. To configure the datasource, you need to provide a read-only REST API key for PagerDuty. Please refer to the [official documentation](https://support.pagerduty.com/docs/api-access-keys#rest-api-keys) for instructions on how to create a REST API key.

This plugin is a Frontend only plugin: this means it's not possible to run alerting against it.

## Usage

Add a new Annotation query following [these instructions](https://grafana.com/docs/grafana/latest/dashboards/build-dashboards/annotate-visualizations/#fetch-annotations-through-dashboard-settings) and make sure to choose PagerDuty as the datasource. In your annotation query you'll be able to provide a PagerDuty service id to filter incidents relevant to it.

## Developing

1. Install dependencies

   ```bash
   npm install
   ```

2. Build plugin in development mode and run in watch mode

   ```bash
   npm run dev
   ```

3. Build plugin in production mode

   ```bash
   npm run build
   ```

4. Run the tests (using Jest)

   ```bash
   # Runs the tests and watches for changes, requires git init first
   npm run test

   # Exits after running all the tests
   npm run test:ci
   ```

5. Spin up a Grafana instance and run the plugin inside it (using Docker)

   ```bash
   npm run server
   ```

6. Run the E2E tests (using Cypress)

   ```bash
   # Spins up a Grafana instance first that we tests against
   npm run server

   # Starts the tests
   npm run e2e
   ```

7. Run the linter

   ```bash
   npm run lint

   # or

   npm run lint:fix
   ```
