if [ -n "$CONFIG_KEY" ]; then 
  openssl --list-ciphers
  openssl enc -aes-256-cbc -d -in secrets.tar.enc -out secrets.tar -k $CONFIG_KEY
  tar -xvf secrets.tar
fi
NODE_ENV=staging npm start -- --silent &
npx cypress run
# after all tests finish running we need to kill npm start
kill $(jobs -p) || true
echo Background jobs killed.