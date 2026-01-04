# Colorama 
# from colorama import Fore, Back, Style
#  print(Fore.BLUE +'Hello world')
#  print(Fore.GREEN +'My name is Alexhander ')
# print(Back.YELLOW + Fore.BLACK+"lorem ipsum ")
# print(Back.BLUE + Fore.BLACK + Style.BRIGHT+" I love colorama  ")
# print(Back.GREEN + Fore.BLACK + Style.RESET_ALL+" I love colorama  ")
# print(Back.YELLOW + Fore.RED + Style.DIM+" this is a rabdom text   ")
# print(Back.CYAN + Fore.BLACK + Style.NORMAL+" this is a rabdom text   ") 

# import colorama
# from colorama import Fore, Back, Style
# import time

# colorama.init(autoreset=True)

# def trafic_ligth():
#     print("Trafic light simulation (press CTRL+C to stop)")
#     print("-" *40 )
    
#     while(True):
#         print(Fore.RED + Style.BRIGHT + "● STOP (RED)")
#         time.sleep(2)
        
#         print(Fore.GREEN + Style.BRIGHT + "● GO (GREEN)")
#         time.sleep(2)
        
#         print(Fore.YELLOW + Style.BRIGHT + "● SLOW DOWN (YELLOW)")
#         time.sleep(2)
        
# try:
#         trafic_ligth()
# except KeyboardInterrupt:
#         print(Fore.WHITE + "\nSimulation stopped.")

#Pillow 
# import os
# from PIL import Image

# script_dir = os.path.dirname(os.path.abspath(__file__))

# image_path = os.path.join(script_dir, "billgates.jpg")

# try:
#     img = Image.open(image_path)
#     print(f"Format: {img.format}")
#     print(f"Size: {img.size}")
#     print(f"Mode: {img.mode}")
    
#     new_img = img.resize((4000, 3000))
#     new_img.show()
    
# except FileNotFoundError:
#     print(f"Error: The file '{image_path}' was not found.")
    
import os,sys
from PIL import Image

script_dir = os.path.dirname(os.path.abspath(__file__))

image_path = os.path.join(script_dir, "billgates.jpg")

size = (1000,1000)
for infile  in sys.argv[1:]:
    outfile = os.path.splitext(infile[0] + "thumbnail")
    if infile != outfile:
        pass



#     if infile != outfile:
#         try:
#             with Image.open(infile) as im:
#                 im.thumbnail(size)
#                 im.save(outfile, "JPEG")
#         except OSError:
#             print("cannot create thumbnail for", infile)

    