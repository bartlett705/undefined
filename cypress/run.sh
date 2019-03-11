NODE_ENV=staging npm start -- --silent &
npx cypress run
# after all tests finish running we need to kill npm start
kill $(jobs -p) || true
echo Background jobs killed.