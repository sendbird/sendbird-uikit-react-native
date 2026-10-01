#!/usr/bin/env bash
# Posts a mrkdwn message to a Slack channel as the SDK Team Bot.
#
# Usage: post-slack-message.sh <channel-id> <text>
# Env:   SLACK_BOT_TOKEN
set -euo pipefail

channel="${1:?channel id is required}"
text="${2:?text is required}"

if [ -z "${SLACK_BOT_TOKEN:-}" ]; then
  echo "::error::SLACK_BOT_TOKEN is not configured"
  exit 1
fi

payload=$(jq -n --arg channel "$channel" --arg text "$text" \
  '{channel: $channel, text: $text, unfurl_links: false, unfurl_media: false}')

response=$(curl -sS -X POST https://slack.com/api/chat.postMessage \
  -H "Authorization: Bearer ${SLACK_BOT_TOKEN}" \
  -H "Content-Type: application/json; charset=utf-8" \
  --data "$payload")

if [ "$(echo "$response" | jq -r '.ok')" != "true" ]; then
  echo "::error::Failed to post Slack message: $(echo "$response" | jq -r '.error // "unknown error"')"
  exit 1
fi
