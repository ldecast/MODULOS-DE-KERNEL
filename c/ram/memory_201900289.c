#include <linux/init.h>     
#include <linux/proc_fs.h>
#include <linux/seq_file.h>
#include <linux/sched/signal.h>
#include <linux/mm.h>
#include <linux/module.h>   
#include <linux/kernel.h>   
#include <linux/sched.h>
#include <linux/fs.h>
#include <linux/version.h>

MODULE_LICENSE("GPL");
MODULE_AUTHOR("Juan Pablo Rojas Chinchilla");
MODULE_DESCRIPTION("modulo de RAM");

#if LINUX_VERSION_CODE >= KERNEL_VERSION(5,6,0)
#define HAVE_PROC_OPS
#endif

struct sysinfo info;

static int proc_ram_data(struct seq_file * file, void *v){
    si_meminfo(&info);
    unsigned long totalRam = (info.totalram*4);
    unsigned long freeRam = (info.freeram*4)-(info.sharedram*4)-(info.bufferram*4);
    seq_printf(file, "{\n");
    seq_printf(file,"\"total_memory\": %lu,\n",totalRam/1024);
    seq_printf(file,"\"free_memory\": %lu,\n", freeRam/1024);
    seq_printf(file,"\"used_memory\": %lu\n", ((totalRam - freeRam)*100)/totalRam);
    seq_printf(file, "}\n");
    return 0;
}

static int open_memory(struct inode *inode,struct file * file){
    return single_open(file,proc_ram_data,NULL);
}

#ifdef HAVE_PROC_OPS
static const struct proc_ops operations = {
  .proc_open = open_memory,
  .proc_read = seq_read,
  .proc_lseek = seq_lseek,
  .proc_release = single_release,
};
#else
static const struct file_operations operations = {
  .owner = THIS_MODULE,
  .open = open_memory,
  .read = seq_read,
  .llseek = seq_lseek,
  .release = single_release,
};
#endif

static int start(void){
    proc_create("memo_201900289",0,NULL,&operations);
    printk(KERN_INFO "Cargando modulo de RAM\n");
    printk(KERN_INFO "Carnet: 201900289\n");
    return 0;
}

static void __exit finish(void){
    remove_proc_entry("memo_201900289",NULL);
    printk(KERN_INFO "Removiendo modulo de RAM\n");
    printk(KERN_INFO "LABORATORIO SISTEMAS OPERATIVOS 1\n");
}

module_init(start);
module_exit(finish);