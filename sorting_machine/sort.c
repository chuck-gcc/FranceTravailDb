#include <unistd.h>
#include <stdio.h>
#include <fcntl.h>
#include <errno.h>
#include <string.h>
#include <assert.h>

#define BUFFER_SIZE 1024

int error_managment()
{
    perror("Err");
    return(1);

}

int read_bytes(int fd)
{
    ssize_t b_read;
    char buffer[BUFFER_SIZE];
    int counter;

    counter = 0;
    b_read = 1;
    while (b_read > 0)
    {
        b_read = read(fd,buffer,BUFFER_SIZE - 1);
        if(b_read  == -1)
            return(error_managment());
        buffer[BUFFER_SIZE] = '\0';
        printf("%s", buffer);
        // if(b_read < BUFFER_SIZE - 1 && b_read != 0)
        // {
        //     printf("last read % ld\n", b_read);
        //     printf("last read :  %s\n", byte);
        // }
        memset(buffer,0,BUFFER_SIZE);
        counter++;
    }
    //printf("dzdzd %s\n", byte);
    
    printf("\nEnd of reading couter reading = %d, total bytes %d\n", counter, counter * BUFFER_SIZE);
    assert(!b_read);
}

int main(void)
{
    printf("hello you are runnig the job sorter\n");
    printf("to the trash? or to de db ? that the question\n");
    printf("for that i compare the job offer hash to the sorted hash table \n");
    printf("Isn't on the table ??? >>> go to the trasssssssh\n\n");

    int fd;

    fd = open("/home/cc/Documents/data_worker/ftdb/data/74/2025-08-17T12:40:07.614Z/2025-08-17T12:40:07.614Z-1", O_RDONLY);
    //fd = open("/home/cc/Documents/data_worker/ftdb/data/74/2025-08-17T12:40:07.614Z/test", O_RDONLY);
    if(fd == -1)
    {
        return(error_managment());
    }

    read_bytes(fd);
    return(0);
}