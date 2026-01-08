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
    
# import os,sys
# from PIL import Image

# script_dir = os.path.dirname(os.path.abspath(__file__))

# image_path = os.path.join(script_dir, "billgates.jpg")

# size = (128,(128))
# for infile in [image_path]: 
#     outfile = os.path.splitext(infile)[0] + ".thumbnail.jpg"
#     if infile != outfile:
#         try:
#             with Image.open(infile) as im:
#                 im.thumbnail(size)
#                 im.save(outfile, "JPEG")
#                 print(f"Success! Saved thumbnail to: {outfile}")
#         except OSError as e:
#             print("Cannot create thumbnail for", infile)
#             print("Error details:", e)
    
# from PIL import Image
# import os

# script_dir = os.path.dirname(os.path.abspath(__file__))

# image_path = os.path.join(script_dir, "billgates.jpg")

# try:
#     original_image = Image.open(image_path) 
# except FileNotFoundError:
#     print(f"Error: Cannot find file at {image_path}")
#     exit()


# angles = [360, 270, 180, 90]
# images = [original_image] 


# for angle in angles:
#     new_image = original_image.rotate(angle)
#     images.append(new_image)
#     new_image.save(f"rotated_billgates_{angle}.jpg")


# images[0].save(
#     "animated_billgates.gif",
#     save_all=True,
#     append_images=images[1:],
#     duration=500,
#     loop=0
# )

# print("Success! animated_billgates.gif has been created.")

#Dynamic Open Graph (OG) Image Generator(final project for pillow module)

# from PIL import Image, ImageDraw, ImageFont

# def create_og_image( title , author):
#     # creating the canvas
#     width = 1200
#     height = 630
#     bg_color = (25, 25, 25)
#     image = Image.new('RGB', (width, height), color=bg_color)
#     draw = ImageDraw.Draw(image)

# #loding the fonts 
#     try:
#         title_font = ImageFont.truetype("arial.ttf", 70)
#         author_font = ImageFont.truetype("arial.ttf", 40)
#     except IOError:
#         print("Custom font not found. Using default font.")
#         title_font = ImageFont.load_default()
#         author_font = ImageFont.load_default()
    
#     left, top, right, bottom = draw.textbbox((0, 0), title, font=title_font)
#     title_width = right - left
#     title_height = bottom - top

# # making the text center
#     title_x = (width - title_width) / 2
#     title_y = (height - title_height) / 2 - 50

#     draw.text((title_x, title_y), title, font=title_font, fill="white")
    
#         # 5. Calculate Layout for Author
#     bbox_auth = draw.textbbox((0, 0), author, font=author_font)
#     auth_w = bbox_auth[2] - bbox_auth[0]
    
#     auth_x = (width - auth_w) / 2
#     auth_y = (title_y + title_height) + 60
#     # drawing the author
#     draw.text((auth_x, auth_y), author, font=author_font, fill="#00ffcc")
    
#     #save 
#     filename = "billgates_card.jpg"
#     image.save(filename)
#     print(f"Success! {filename} has been created.")
    
#     # Running the function
# articles = ["My First Blog", "Why Python is Great", "Bill gates is owner of  Microsoft"]

# for title in articles:
#     create_og_image(title, "Emre Guzel")
    
#     # image.save("og_image_generator.png")
#     # print("Success! og_image_generator.png has been created.")

import cv2