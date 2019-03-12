echo "Starting Decrypt..."
openssl enc -aes-256-cbc -d -in secrets.tar.enc -out secrets.tar -K $CONFIG_KEY -iv $CONFIG_IV
echo "Extracting..."
tar -xvf secrets.tar
ls -al ci
echo "Decrpyt Done!"

echo "Building Dist Pkg..."
npm run build && echo "Copying Dist to remote host..." && scp -vvv -P 5235 -i travis_id_rsa -o UserKnownHostsFile=ci/known_hosts build/*.* travis@mosey.systems:/var/www/undefined/build
echo "Cleaning up..."
rm ci/travis_id_rsa
rm -rf build
echo Done!