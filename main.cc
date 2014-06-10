#include <cstdlib>
#include <unistd.h>
#include <stdio.h>

int main() {
    system ( "./../push.sh" );
    sleep ( 1 );
    system ( "./../compile.sh" );
}
