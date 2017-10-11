#!/bin/bash
sudo -E $(which node) index.js >> ./json-server.log 2>&1 </dev/null &
