[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/uYb6fuja)
## 2024 MDDN342 Assignment 2: Randomised Collections

**This is where you talk about your project!**

>This starter code is just some simple faces being drawn. 


14/04 
Began work on drawing each half piece.
The original plan was to have rounded notches, but it became far too complex for my brain to be bothered handling, so instead triangles will be used as the shape of the notch

15/04
Made the board and some comparison logic that determines which way the notches of each piece should be facing

16/04
Added some background details to make it look less bland. Also added scattering so the pieces can have a random location and rotation, making it look a little more interesting. Currently there is only random rotation. It is broken currently, however, as I also added a shadow which is currently rendering over itself. I will likely need to split the drawing method into multiple passes (shadow and layer in case they overlap).