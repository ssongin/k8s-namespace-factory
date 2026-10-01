# k8s-namespace-factory

- [About](#about)
  - [Description](#description)
  - [Ansible roles](#ansible-roles)

## <a name="about"></a> About

### <a name="description"></a> Description

**Template project** - template repository to fork and fill in with own variables.
It's an Ansible playbook to manage namespaces. Create
namespace, resources requests and limits per namespace/container. Create RBAC, secrets. Define network access.

### <a name="ansible-roles"></a> Ansible roles

- **namespace** - Creates/Destroys namespace with annotations and labels.
- **resource_quota** - Manages ResourceQuota and LimitRange



