## [3.12.7]

### Bug Fixes

- fix: support Expo 56 media library saves
- fix: support Expo clipboard async setter
- fix: use premiumFeatureList for super group and broadcast channel features
- fix: revert broadcast channel flag to applicationAttributes

### Security

- fix: upgrade axios to ^1.16.0 (SECURE-3734)
- fix: upgrade vulnerable transitive deps (SECURE-2965, SECURE-3009, SECURE-3438)
- fix: upgrade nx transitive dep axios 1.12.0 → 1.15.0 (SECURE-3216)

### Chores

- chore: merge docs workflows into single release-triggered pipeline
- chore: add tsbuildinfo to gitignore
