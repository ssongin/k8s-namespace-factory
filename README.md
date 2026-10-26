# 🏭 Kubernetes Namespace Factory

Create and manage Kubernetes namespaces and their supporting resources with
Ansible. Describe what each namespace needs in inventory variables, then let
the playbook apply or remove those resources.

## 📚 Contents

- [🧭 How it works](#how-it-works)
- [🧰 Before you start](#before-you-start)
- [🚀 Run the playbook](#run-the-playbook)
- [📝 Configure inventory and variables](#configure-inventory-and-variables)
  - [🗂️ Add an inventory host](#add-an-inventory-host)
  - [🏷️ Describe the namespace](#describe-the-namespace)
  - [⚙️ Set shared defaults](#set-shared-defaults)
- [🧩 Resources you can manage](#resources-you-can-manage)
  - [📊 Resource quotas and container limits](#resource-quotas-and-container-limits)
  - [🔐 External secrets](#external-secrets)
  - [🌐 HTTP routes](#http-routes)
  - [📡 DNS endpoints](#dns-endpoints)
  - [🧾 ConfigMaps](#configmaps)
- [🧹 Remove a namespace](#remove-a-namespace)
- [🗃️ Project layout](#project-layout)

<a id="how-it-works"></a>
## 🧭 How it works

The inventory lists the namespaces to manage. Each inventory host gets a
matching file in `host_vars/`, where you describe its namespace and optional
resources. Shared values and defaults belong in `group_vars/all.yml`.

The `apply.yml` playbook creates the namespace first, then applies its
configured resources. When removing a namespace, it deletes those resources
before deleting the namespace.

<a id="before-you-start"></a>
## 🧰 Before you start

You will need:

- Docker and Docker Compose.
- A Kubernetes context in your local kubeconfig that can manage the resources
  you configure.
- The matching Kubernetes APIs or custom resource definitions (CRDs) installed
  in the cluster for any custom resources you use, such as HTTPRoutes or
  ExternalDNS DNSEndpoints.

The Compose service mounts your local kubeconfig read-only into the Ansible
container. Check that your current Kubernetes context points to the intended
cluster before applying changes.

<a id="run-the-playbook"></a>
## 🚀 Run the playbook

From the repository root, apply all hosts in the inventory:

```bash
docker compose run --rm ansible -i inventory apply.yml
```

To apply only one inventory host, add `--limit` and its inventory name:

```bash
docker compose run --rm ansible -i inventory apply.yml --limit DEMO-APP-prod
```

You can check playbook syntax without connecting to the cluster:

```bash
docker compose run --rm ansible -i inventory --syntax-check apply.yml
```

<a id="configure-inventory-and-variables"></a>
## 📝 Configure inventory and variables

The examples in this guide use fictional names and values. Replace them with
your own; do not store real credentials in host or group variables.

<a id="add-an-inventory-host"></a>
### 🗂️ Add an inventory host

Add a host to `inventory/all.yaml`. The name must match the host variables
filename:

```yaml
all:
  hosts:
    DEMO-APP-prod:
```

For this entry, create `host_vars/DEMO-APP-prod.yaml`.

<a id="describe-the-namespace"></a>
### 🏷️ Describe the namespace

Start with the namespace name. Labels and annotations are optional:

```yaml
state: present

namespace:
  name: demo-app-prod
  labels:
    example.org/environment: production
  annotations:
    example.org/owner: demo-team
```

Keep `state: present` for normal provisioning; use `absent` to remove the
namespace and its resources.

<a id="set-shared-defaults"></a>
### ⚙️ Set shared defaults

Use `group_vars/all.yml` for values shared by all inventory hosts. Hosts can
override these values in their own files. For example:

```yaml
namespace_resource_defaults:
  requests:
    enabled: false
    cpu: "250m"
    memory: "128Mi"
  limits:
    enabled: false
    cpu: "500m"
    memory: "256Mi"

container_resource_defaults:
  resources:
    requests:
      enabled: false
      cpu: "100m"
      memory: "64Mi"
    limits:
      enabled: false
      cpu: "300m"
      memory: "192Mi"

externalSecrets_defaults:
  clusterSecretStore:
    name: example-store
  refreshInterval: "30m"
  remoteRefKeyPrefix: "example-secrets"
```

The resource values above are examples. Resource controls are disabled by
default in this example; enable them globally or per host to have the
`resource-quota` role manage them.

<a id="resources-you-can-manage"></a>
## 🧩 Resources you can manage

All resource lists are optional. If a list is omitted or empty, its role has
nothing to apply.

<a id="resource-quotas-and-container-limits"></a>
### 📊 Resource quotas and container limits

Set `namespace.resources` to enable namespace-level quotas. The `requests` and
`limits` values under it control aggregate resource requests and limits for
the namespace:

```yaml
namespace:
  name: demo-app-prod
  resources:
    requests:
      enabled: true
      cpu: "2"
      memory: "2Gi"
    limits:
      enabled: true
      cpu: "4"
      memory: "4Gi"
```

Container defaults are configured separately under the host variable
`container.resources`. These settings are used by the LimitRange role to set
default requests and limits for containers that do not specify their own:

```yaml
container:
  resources:
    requests:
      enabled: true
      cpu: "100m"
      memory: "64Mi"
    limits:
      enabled: true
      cpu: "500m"
      memory: "256Mi"
```

The `enabled` flags decide whether each resource policy is applied. CPU and
memory values should use Kubernetes quantity formats.

<a id="external-secrets"></a>
### 🔐 External secrets

The `external-secrets` role creates ExternalSecret resources. The reference
points to a key and property in an external secret store; the actual secret
value stays there and is not written into this configuration:

```yaml
externalSecrets:
  clusterSecretStore:
    name: example-store
  secrets:
    - name: demo-app-credentials
      target:
        creationPolicy: Owner
      data:
        - secretKey: APP_PASSWORD
          remoteRef:
            key: example-secrets/demo-app
            property: password
```

If `clusterSecretStore` or `refreshInterval` is not set for a secret, the role
uses the corresponding value from `externalSecrets_defaults`. Make sure the
referenced store and remote key exist in your cluster/provider.

<a id="http-routes"></a>
### 🌐 HTTP routes

The `http-route` role creates Gateway API HTTPRoutes in the namespace. Each
route includes a name, one or more hostnames, and routing rules:

```yaml
httpRoutes:
  - name: demo-web
    gateway:
      name: example-gateway
      namespace: gateway-system
    hostnames:
      - app.example.test
    rules:
      - backendRefs:
          - name: demo-web
            port: 8080
```

The backend Service should exist in the route's namespace, and the referenced
Gateway should be available in the cluster.

<a id="dns-endpoints"></a>
### 📡 DNS endpoints

The `dns-endpoint` role creates ExternalDNS DNSEndpoint resources. The record
type is passed through as configured, so use a type supported by your
ExternalDNS installation and DNS provider (for example, `A`, `TXT`, `CNAME`,
`PTR`, or `CAA`):

```yaml
dns:
  - name: demo-web-record
    record:
      name: app.example.test
      type: A
      targets:
        - 192.0.2.10
      ttl: 180
      providerSpecific:
        - name: example-provider/option
          value: "false"
```

`providerSpecific` is optional; its options depend on the DNS provider. Use a
target format that is valid for the selected record type.

<a id="configmaps"></a>
### 🧾 ConfigMaps

The `configmap` role creates ConfigMaps from inline values, files in the
repository, or both:

```yaml
configMaps:
  - name: demo-settings
    values:
      LOG_LEVEL: info
    valuesFromFile:
      application.conf: files/demo-app/application.conf
```

File paths are relative to the repository root. Values from files are stored
under the key shown in `valuesFromFile`.

<a id="remove-a-namespace"></a>
## 🧹 Remove a namespace

Set `state: absent` for the host and run the playbook with `--limit` to target
only that namespace:

```yaml
state: absent
```

```bash
docker compose run --rm ansible -i inventory apply.yml --limit DEMO-APP-prod
```

This removes the resources managed by the playbook and then deletes the
namespace. **Namespace deletion is destructive** and affects all remaining
namespaced resources in Kubernetes, not just resources described here. Confirm
the selected cluster and host before running it.

<a id="project-layout"></a>
## 🗃️ Project layout

```text
inventory/       Hosts managed by Ansible
host_vars/       Per-host namespace and resource configuration
group_vars/      Shared configuration and defaults
roles/           Tasks for managing Kubernetes resources
apply.yml        Apply or remove configured resources
validate.yml     Input validation playbook
```
