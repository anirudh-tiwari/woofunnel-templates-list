#!/bin/bash
read -p "Enter Version : " version
BWFTL=$PWD;
grunt;

rm -rf ./woofunnel-templates-list;
rm ./rm woofunnel-templates-list-*.zip;

mkdir woofunnel-templates-list;
#cp -R . woofunnel-templates-list;
wp i18n make-pot $BWFTL $BWFTL'/languages/woofunnel-templates-list.pot' --exclude=".github,.git,node_modules,woofunnels,.gitignore,.gitmodules,gruntfile,license.txt,package.json,package-lock.json,wpml-config.xml,admin/assets,assets,/libraries/action-scheduler"

rsync -av --exclude='.git' --exclude='.babelrc' --exclude='.gitignore' --exclude='.github' --exclude='.gitmodules' --exclude='node_modules' --exclude='build.sh' --exclude='gruntfile.js' --exclude='package.json' --exclude='phpcs.xml' --exclude='package-lock.json' --exclude='admin/frontend/src' --exclude='.prettierrc.js' --exclude='webpack.production.config.js' --exclude='webpack.development.config.js' --exclude='webpack.production-source-maps.config.js' --exclude='.eslintrc' --exclude='.babelrc.js' ./ ./woofunnel-templates-list

rm -rf ./woofunnel-templates-list/src;

rm -rf ./woofunnel-templates-list/woofunnel-templates-list;

grep -rl "pc::" ./woofunnel-templates-list;
grep -rl "var_dump" ./woofunnel-templates-list;
grep -rl "print_r" ./woofunnel-templates-list;

zip -r woofunnel-templates-list-v$version.zip ./woofunnel-templates-list;

rm -rf ./woofunnel-templates-list;
clear;
exit 0