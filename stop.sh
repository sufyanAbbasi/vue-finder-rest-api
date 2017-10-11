#!/bin/bash
pid = $(pgrep -f -n "node")
kill $pid