echo Starting Decrypt...
openssl help
openssl enc -aes-256-cbc -d -in secrets.tar.enc -out secrets.tar -k $CONFIG_KEY
echo Extracting...
tar -xvf secrets.tar
ls -al ci
echo Done!