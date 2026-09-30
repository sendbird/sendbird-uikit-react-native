#!/usr/bin/env bash
# Moves the Jira release ticket to a new state using the shared sdk-deployment script.
#
# Usage: transit-release-ticket.sh <from-state> <to-state>
#        States: RELEASING, RELEASED, CONDITIONAL_RELEASE_APPROVED, ...
# Env:   RELEASE_TICKET_KEY, JIRA_AUTH_USER, JIRA_AUTH_API_TOKEN, SDK_DEPLOYMENT_DIR
set -euo pipefail

from_state="${1:?from state is required}"
to_state="${2:?to state is required}"

python3 "${SDK_DEPLOYMENT_DIR:?}/scripts/v1.2/transit_ticket.py" \
  --jira_auth_user "${JIRA_AUTH_USER:?}" \
  --jira_auth_api_token "${JIRA_AUTH_API_TOKEN:?}" \
  --issue_key "${RELEASE_TICKET_KEY:?}" \
  --from_issue_state "$from_state" \
  --to_issue_state "$to_state"
