# <a name=top></a>K8s namespace factory

- [K8s namespace factory](#top)
  - [About](#about)
    - [Description](#description)
    - [Ansible roles](#ansible-roles)
  - [Usage](#usage)
    - [Local usage](#local-usage)

## <a name="about"></a> About

### <a name="description"></a> Description

**Template project** - template repository to fork and fill in with own variables.
It's an Ansible playbook to manage namespaces. Create
namespace, resources requests and limits per namespace/container. Create RBAC, secrets. Define network access.

### <a name="ansible-roles"></a> Ansible roles

- **namespace** - Creates/Destroys namespace with annotations and labels.
- **resource-quota** - Manages ResourceQuota and LimitRange
- **external-secrets** - Creates ExternalSecrets resource based on provided ClusterSecretStore

## <a name="usage"></a> Usage

### <a name="local-usage"></a> Local Usage

Run CLI command from repository root directory.

```bash
docker compose run --rm ansible -i inventory apply.yml
```

