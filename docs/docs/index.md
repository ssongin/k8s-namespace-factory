# Kubernetes Namespace Factory

## Overview

Kubernetes Namespace Factory is an Ansible project for declaratively creating,
updating, and removing namespaces and a selected set of namespace-scoped
resources. The inventory identifies the namespaces to manage; each inventory
host has a matching file under `host_vars/`.

The `apply.yml` playbook applies the roles in a controlled order. Namespace
configuration and optional resources are defined as YAML variables, with
shared defaults in `group_vars/all.yml`. Changes are reviewed through GitHub
pull requests before an authorized operator applies them to a cluster.

## Documentation

- [Users](customer/ordering-namespace.md): request or decommission a namespace.
- [Repository maintainers](maintainer/ci-cd-secrets-setup.md): maintain CI,
  schemas, and docs.
- [Kubernetes provisioners and providers](provisioner/operating-services.md):
  review requests and maintain required cluster APIs and controllers.
- [Versioning](versioning.md): understand releases and documentation versions.

The navigation version selector lets you switch between the latest published
documentation and available tagged releases.

## Supported resources

The playbook manages namespaces, resource quotas and limit ranges, External
Secrets, ConfigMaps, Gateway API HTTPRoutes, and ExternalDNS DNSEndpoints.
Some resources require their corresponding CRDs, operators, or provider
configuration to be installed in the target cluster. See the
[provisioner guide](provisioner/operating-services.md) before requesting them.
