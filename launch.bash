#!/bin/bash
while true; do
  npm install
  node app.js
  echo "Restarting in 3 seconds... Abort with Control C."
  sleep 3
done
