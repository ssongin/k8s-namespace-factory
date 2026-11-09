# Kubernetes Provisioners and Providers

Provisioners review namespace changes and maintain the Kubernetes APIs and
operators that the factory integrates with. The CI workflow checks commit
formatting, Ansible lint and syntax, and the host-variable schema; it does not
connect to a cluster or apply changes.

## Review a namespace change

Before approving a pull request:

1. Confirm the inventory host and its matching `host_vars/<host>.yaml` entry
   are correct.
2. Review the namespace name, ownership labels and annotations, and any
   requested resource quota or container defaults.
3. Check external references such as secret-store names, remote secret keys,
   Gateway names, DNS records, ConfigMap file paths, and backends.
4. Confirm the requested resources and API versions are supported by the
   target cluster and do not exceed its capacity.
5. Review the successful CI checks. They do not replace a provider-side review
   or a test against the intended cluster.

## Integrated Kubernetes resources

The playbook currently manages:

- Namespaces and their labels and annotations.
- ResourceQuotas and LimitRanges, when enabled in the host or shared defaults.
- ExternalSecret resources backed by an existing ClusterSecretStore.
- ConfigMaps populated from inline values or files in the repository.
- Gateway API HTTPRoutes that refer to an existing Gateway and Service.
- ExternalDNS DNSEndpoint resources.

## Cluster and provider prerequisites

Install the Kubernetes APIs and controllers required by the resources you
configure:

- Gateway API CRDs and a Gateway implementation for HTTPRoutes.
- External Secrets Operator and the referenced ClusterSecretStore for
  ExternalSecrets.
- ExternalDNS and its DNSEndpoint CRD for DNS records.
- The Kubernetes API types for built-in Namespace, ResourceQuota, LimitRange,
  and ConfigMap resources.

The provider or cluster operator is responsible for controller configuration,
credentials, access policies, DNS zones, and ensuring referenced objects exist.
These dependencies are not created by this repository.
