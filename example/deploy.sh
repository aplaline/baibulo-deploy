#!/bin/bash

if [ "$1" == "" ]; then
  echo "No version specified - using 'next'"
  VERSION=next
else
  VERSION=$1
fi

../bin/baibulo deploy --dir hello --url http://localhost:8080/assets --version $VERSION
