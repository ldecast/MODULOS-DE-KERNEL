#include <linux/init.h>
#include <linux/sched/signal.h>
#include <linux/proc_fs.h>
#include <linux/seq_file.h>
#include <linux/mm.h>
#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/sched.h>
#include <linux/version.h>
#include <linux/fs.h>

MODULE_LICENSE("GPL");
MODULE_AUTHOR("Juan Pablo Rojas Chinchilla");
MODULE_DESCRIPTION("modulo de cpu");

#if LINUX_VERSION_CODE >= KERNEL_VERSION(5, 6, 0)
#define HAVE_PROC_OPS
#endif

struct task_struct *task;
struct task_struct *taskChild;
struct list_head *list;
unsigned long rss;

static int proc_cpu(struct seq_file *file, void *v)
{
    int running = 0;
    int sleeping = 0;
    int zombie = 0;
    int stopped = 0;

#ifndef CONFIG_MMU
    pr_err("No MMU, cannot calculate RSS.\n");
    return -EINVAL;
#endif

    seq_printf(file, "{\n\"processes\":[\n");
    int b = 0;
    for_each_process(task)
    {
        if (task->mm)
        {
            rss = get_mm_rss(task->mm) << PAGE_SHIFT;
        }
        else
        {
            rss = 0;
        }
        if (b == 0)
        {
            seq_printf(file, "{");
            b = 1;
        }
        else
        {
            seq_printf(file, ",{");
        }
        seq_printf(file, "\"pid\":%d,\n", task->pid);
        seq_printf(file, "\"name\":\"%s\",\n", task->comm);
        seq_printf(file, "\"user\": %d,\n", task->cred->uid);
        seq_printf(file, "\"state\":%ld,\n", task->__state);
        int porcentaje = (((rss / (1024 * 1024))) * 100) / (15685);
        seq_printf(file, "\"ram\":%d,\n", porcentaje);

        seq_printf(file, "\"child\":[\n");
        int a = 0;
        list_for_each(list, &(task->children))
        {
            taskChild = list_entry(list, struct task_struct, sibling);
            if (a != 0)
            {
                seq_printf(file, ",{");
                seq_printf(file, "\"pid\":%d,\n", taskChild->pid);
                seq_printf(file, "\"name\":\"%s\"\n", taskChild->comm);
                seq_printf(file, "}\n");
            }
            else
            {
                seq_printf(file, "{");
                seq_printf(file, "\"pid\":%d,\n", taskChild->pid);
                seq_printf(file, "\"name\":\"%s\"\n", taskChild->comm);
                seq_printf(file, "}\n");
                a = 1;
            }
        }
        a = 0;
        seq_printf(file, "\n]");

        if (task->__state == 0)
        {
            running += 1;
        }
        else if (task->__state == 1)
        {
            sleeping += 1;
        }
        else if (task->__state == 4)
        {
            zombie += 1;
        }
        else
        {
            stopped += 1;
        }
        seq_printf(file, "}\n");
    }
    b = 0;
    seq_printf(file, "],\n");
    seq_printf(file, "\"running\":%d,\n", running);
    seq_printf(file, "\"sleeping\":%d,\n", sleeping);
    seq_printf(file, "\"zombie\":%d,\n", zombie);
    seq_printf(file, "\"stopped\":%d,\n", stopped);
    seq_printf(file, "\"total\":%d\n", running + sleeping + zombie + stopped);
    seq_printf(file, "}\n");
    return 0;
}

static int open_cpu(struct inode *inode, struct file *file)
{
    return single_open(file, proc_cpu, NULL);
}

#ifdef HAVE_PROC_OPS
static const struct proc_ops operations = {
    .proc_open = open_cpu,
    .proc_read = seq_read,
    .proc_lseek = seq_lseek,
    .proc_release = single_release,
};
#else
static const struct file_operations operations = {
    .owner = THIS_MODULE,
    .open = open_cpu,
    .read = seq_read,
    .llseek = seq_lseek,
    .release = single_release,
};
#endif

static int start(void)
{
    proc_create("cpu_201900289", 0, NULL, &operations);
    printk(KERN_INFO "Cargando modulo de cpu\n");
    printk(KERN_INFO "Nombre: Juan Pablo Rojas Chinchilla\n");
    return 0;
}

static void __exit finish(void)
{
    remove_proc_entry("cpu_201900289", NULL);
    printk(KERN_INFO "Removiendo modulo cpu\n");
    printk(KERN_INFO "Diciembre 2021\n");
}

module_init(start);
module_exit(finish);