echo setting up auth
ssh-keyscan  mosey.systems >> ~/.ssh/known_hosts
echo $TRAVIS_RSA > travis_id_rsa
chmod 600 travis_id_rsa
echo Building Dist Pkg...
npm run build && echo Copying Dist to remote host && scp -v -P 5235 -i travis_id_rsa build/*.* travis@mosey.systems:/var/www/undefined/build
rm travis_id_rsa
echo Done!