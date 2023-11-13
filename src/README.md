# PagerDuty Grafana Datasource
![Marketplace](https://img.shields.io/badge/dynamic/json?logo=grafana&query=$.version&url=https://grafana.com/api/plugins/pagerduty-grafana-datasource&label=Marketplace&prefix=v&color=F47A20)
[![Downloads](https://img.shields.io/badge/dynamic/json?logo=grafana&color=F47A20&label=downloads&query=%24.items%5B%3F%28%40.slug%20%3D%3D%20%22pagerduty-grafana-datasource%22%29%5D.downloads&url=https%3A%2F%2Fgrafana.com%2Fapi%2Fplugins)](https://grafana.com/grafana/plugins/pagerduty-grafana-datasource)
[![License](https://img.shields.io/github/license/ocadotechnology/pagerduty-grafana-datasource)](LICENSE)

Annotation datasource plugin for PagerDuty incidents.

## Overview
This datasource is an *annotation only* datasource. It's intended to be used to enrich your visualisations with contextual information about incidents raised in PagerDuty. See an example of visualisation panel showing an incident annotation:

![Example](https://github.com/ocadotechnology/pagerduty-grafana-datasource/blob/ea26a433e54a729f8fa9dacd7db6ef97810c3474/src/img/screenshots/example.png)

## Requirements
* A [PagerDuty](https://www.pagerduty.com/) subscription.
* A [PagerDuty REST API key](https://support.pagerduty.com/docs/api-access-keys) with Read-only permission.

## Getting Started

* Configure a new PagerDuty datasource: you'll be required to introduce a PagerDuty API key, please refer to [PagerDuty documentation](https://support.pagerduty.com/docs/api-access-keys#generate-a-general-access-rest-api-key) about how to generate one. Read-only permissions are sufficient to run this datasource.
* Add a new annotation query to your dashboard: refer to [Grafana documentation](https://grafana.com/docs/grafana/latest/dashboards/build-dashboards/annotate-visualizations/#add-new-annotation-queries) for detailed steps.
* Select PagerDuty as the datasource for the annotation query.
* Supply the [PagerDuty service](https://support.pagerduty.com/docs/services-and-integrations) id for the service you're interested in.

![Annotation Query config](https://github.com/ocadotechnology/pagerduty-grafana-datasource/blob/444d2e7c5f25be19d01845f2102901ffebabb5be/src/img/screenshots/query.png)

* Test and save the dashboard.

## Contributing

Feel free to open issues in the [GitHub project](https://github.com/ocadotechnology/pagerduty-grafana-datasource) and submit PR to the project. Please before raising a new issue, search through the existing ones in case someone else already raised the same issue.
