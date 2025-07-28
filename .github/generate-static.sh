git checkout main
git checkout pull
git checkout site
git rebase origin/main
pnpm run build
mkdir tmp
mv ./ ./tmp/
mv ./tmp/build ./
rm -rf ./tmp
git add .
git commit -m 'deploy'
# git push --force-with-lease