#!/bin/bash
set -o errexit

function testStart {
	node test.js &
	wait %1 && testStart
}

testStart &
testStart &
testStart &
testStart &
testStart &