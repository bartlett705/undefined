echo "Setting up auth..."
echo $TRAVIS_RSA > travis_id_rsa
chmod 600 travis_id_rsa
echo "Building Dist Pkg..."
npm run build && echo "Copying Dist to remote host..." && scp -vvv -P 5235 -i travis_id_rsa -o UserKnownHostsFile=ci/known_hosts build/*.* travis@mosey.systems:/var/www/undefined/build
echo "Cleaning up..."
rm travis_id_rsa
echo Done!