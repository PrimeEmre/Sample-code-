# from colorama import Fore, Back, Style
#  print(Fore.BLUE +'Hello world')
#  print(Fore.GREEN +'My name is Alexhander ')
# print(Back.YELLOW + Fore.BLACK+"lorem ipsum ")
# print(Back.BLUE + Fore.BLACK + Style.BRIGHT+" I love colorama  ")
# print(Back.GREEN + Fore.BLACK + Style.RESET_ALL+" I love colorama  ")
# print(Back.YELLOW + Fore.RED + Style.DIM+" this is a rabdom text   ")
# print(Back.CYAN + Fore.BLACK + Style.NORMAL+" this is a rabdom text   ") 

import colorama
from colorama import Fore, Back, Style
import time

colorama.init(autoreset=True)

def trafic_ligth():
    print("Trafic light simulation (press CTRL+C to stop)")
    print("-" *40 )
    
    while(True):
        print(Fore.RED + Style.BRIGHT + "● STOP (RED)")
        time.sleep(2)
        
        print(Fore.GREEN + Style.BRIGHT + "● GO (GREEN)")
        time.sleep(2)
        
        print(Fore.YELLOW + Style.BRIGHT + "● SLOW DOWN (YELLOW)")
        time.sleep(2)
        
try:
        trafic_ligth()
except KeyboardInterrupt:
        print(Fore.WHITE + "\nSimulation stopped.")
