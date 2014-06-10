#include <cstdlib>
#include <unistd.h>
#include <stdio.h>

int main() {
  while ( 1 ) {
    system ( "./../push.sh" );
    sleep ( 1 );
  }
}
