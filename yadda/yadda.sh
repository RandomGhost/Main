#!/bin/bash



function displayhelp {
    echo
    echo Help:
    echo $0 {baseurl} This will test all features
    echo $0 {baseurl} {workspace directory} - This will test all features and save results to {workspace directory}
    echo $0 {baseurl} {feature file} - This will run {feature file}
}

rm definitions/*~
rm -rf praga/
cd `dirname $0`
if [ "$1" = "-r" ]; then
    if [ -f "$2" ]; then 
	node_modules/casperjs/bin/casperjs test --includes=./support/include.js --baseurl=$3 --workspace=./workspace --dependance=$2  --restart=$1 ./test.js    
    fi;
elif [ -f "$1" ]; then 
    if [ -z "$2" ]; then 
	echo Error: {baseurl} is mandatory
	displayhelp
    else
	node_modules/casperjs/bin/casperjs test --includes=./support/include.js --baseurl=$2 --workspace=./workspace --dependance=$1 --feature=$3 ./test.js
    fi;
elif [ -z "$1" ]; then
    echo Error: {baseurl} is mandatory
    displayhelp
elif [ -z "$2" ]; then
    node_modules/casperjs/bin/casperjs test --includes=./support/include.js --baseurl=$1 --workspace=./workspace ./test.js
elif [ -f "$2" ]; then
    node_modules/casperjs/bin/casperjs test --includes=./support/include.js --baseurl=$1 --workspace=./workspace --feature=$2 ./test.js
elif [ -d "$2" ]; then
    node_modules/casperjs/bin/casperjs test --includes=./support/include.js --baseurl=$1 --workspace=$2 --xunit=$2/yadda-unit.xml ./test.js
else
    echo Error: $2 is not a file nor a directory
    displayhelp
fi;