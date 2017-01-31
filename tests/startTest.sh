#!/bin/bash
set -o errexit

node test.js &
pid1=$!
node test.js &
pid2=$! 

