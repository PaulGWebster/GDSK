#!/bin/bash

if pgrep -x "pm2" > /dev/null; then
 
  npx pm2 stop all
  npx pm2 delete all
  echo "pm2 processes stopped and deleted."
else
  echo "pm2 is not running."
fi

npm install

npx pm2 start ../index.js --output ../logs/log.txt --error ../logs/error.txt

echo "Application started successfully."
