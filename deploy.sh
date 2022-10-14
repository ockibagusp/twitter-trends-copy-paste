#!/bin/bash

. /etc/rc.d/init.d/functions

# Linux or MacOS: $ chmod 755 deploy.sh

ARGS=$#
# save the latest commit hash as a string
LOGSTRING=$(git log);
COMMIT=$(echo $LOGSTRING | awk '{print $2}');

function help {
  printf 'Use: ./deploy.sh \n'
}

if [ $ARGS != 0 ]; then
  help;
  exit;
fi

function selection {
  printf '$ npm run build... \n'
  npm run build;

  printf '\n$ git add dist -f...\n'
  git add dist -f;
  printf '\n$ git commit...\n';
  git commit -m "deploy (commit: $COMMIT)";

  printf '\n$ git subtree push --prefix dist origin gh-pages...\n';
  git subtree push --prefix dist origin gh-pages;
}

selection