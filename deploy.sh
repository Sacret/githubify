#!/bin/bash
set -e

# Load deploy settings
if [ -f .env.deploy ]; then
  set -a
  source .env.deploy
  set +a
else
  echo "Error: .env.deploy file not found. Copy .env.deploy.example and fill DEPLOY_HOST, DEPLOY_USER, DEPLOY_PASS, DEPLOY_PATH."
  exit 1
fi

if [ ! -f .env.local ]; then
  echo "Error: .env.local file with Firebase config not found."
  exit 1
fi

echo "==> Building site..."
npm run build

echo "==> Deploying to ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}..."
sshpass -p "${DEPLOY_PASS}" rsync -avz --delete \
  dist/ \
  "${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}" || RSYNC_EXIT=$?

# rsync exit code 23 = partial transfer (usually just permission warnings), treat as success
if [ "${RSYNC_EXIT:-0}" -ne 0 ] && [ "${RSYNC_EXIT:-0}" -ne 23 ]; then
  echo "Error: rsync failed with exit code ${RSYNC_EXIT}"
  exit 1
fi

echo "==> Done! Site deployed to ${DEPLOY_HOST}"
