cmd_/home/juanpa/Documents/SOPES/so1_proyecto1_201900289/c/cpu/Module.symvers := sed 's/\.ko$$/\.o/' /home/juanpa/Documents/SOPES/so1_proyecto1_201900289/c/cpu/modules.order | scripts/mod/modpost  -a  -o /home/juanpa/Documents/SOPES/so1_proyecto1_201900289/c/cpu/Module.symvers -e -i Module.symvers  -N -T -