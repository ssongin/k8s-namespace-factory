# Documentation Versions

Documentation is published with
[`gha-docs`](https://github.com/ssongin/gha-docs). The latest version is
published at the site root. When a master commit creates a semantic version
tag, the same source is also published under `versions/<tag>/`.

The navigation selector loads `versions.json`, which the publishing workflow
maintains on the GitHub Pages branch. It lists the latest documentation and
the available tagged versions. The selector preserves the current page,
query, and hash when switching versions.

Version tags are selected from Conventional Commit messages. A feature commit
creates a minor release, patch-level changes create a patch release, and a
breaking change creates a major release. `docs` and `test` commits normally do
not create a tag. See [repository maintenance](maintainer/ci-cd-secrets-setup.md)
for the workflow order.
