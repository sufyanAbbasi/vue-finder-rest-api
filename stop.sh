#!/bin/bash
sudo kill -0 $(pgrep -f -n "node") 2>/dev/null
if [ $? -eq 0 ]; then
  sudo kill $(pgrep -f -n "node")
fi
