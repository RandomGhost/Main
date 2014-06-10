if [ -d .build ]; then 
    echo ""
else 
    mkdir .build
fi;

cd build
cmake ..
make
./me
    