# Users: Requesting a Namespace

Request a namespace by adding an inventory host and its matching host-variable
file in a pull request. The CI workflow validates the commit message, checks
the Ansible playbook and lints the project, and validates host variables
against `schemas/namespace-schema.json`. It does not apply changes to a
Kubernetes cluster.

## Add a namespace entry

Add a unique host under `all.hosts` in `inventory/all.yaml`:

```yaml
all:
  hosts:
    DEMO-APP-prod:
```

Create `host_vars/DEMO-APP-prod.yaml` with the same host name. Start from
`host_vars/sample.yaml` and update its example values. A namespace definition
has this general shape:

```yaml
state: present

configurationItem:
  owner: Example Team
  environment: prod
  serviceOffering: Example Service
  serviceOfferingId: so-example
  serviceComponent: Example Component
  serviceComponentId: sc-101
  description: Namespace for the Example Service

namespace:
  name: "{{ configurationItem.serviceOfferingId }}-{{ configurationItem.serviceComponentId }}-{{ configurationItem.environment }}"
  labels:
    example.org/team: "{{ configurationItem.owner }}"
  annotations:
    example.org/description: "{{ configurationItem.description }}"
```

Use the namespace name format approved for your organization. Values in
`configurationItem` can be used in Jinja expressions elsewhere in the file.
Keep credentials and secret values out of Git; reference secret-store keys
instead.

## Optional resources

Depending on your team's requirements and what is installed in the target
cluster, you can configure resource quotas and container defaults, external
secrets, ConfigMaps, HTTPRoutes, and DNS endpoints. See
[Kubernetes provisioners and providers](../provisioner/operating-services.md)
for the supported resources and their prerequisites. Coordinate names,
resource budgets, and external references with your provisioner.

## Remove a namespace

To decommission a namespace, change `state` to `absent` in its host-variable
file and submit a pull request. After the change is merged, the playbook
removes the resources managed for that host and then deletes the namespace.
Keep the inventory entry and host-variable file until removal has been
reviewed and applied by the authorized operator.
