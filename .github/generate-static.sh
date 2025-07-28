git checkout site
git rebase origin/main
pnpm run build
mkdir tmp
mv ./ tmp/
mv ./tmp/build ./
rm -rf ./tmp
ga .
gc -m 'deploy'
git push --force-with-lease