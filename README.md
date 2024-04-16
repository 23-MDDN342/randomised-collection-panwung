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

The pieces are now able to tile properly at different angles. Tomorrow, I will try to make it so that when the pieces are scaled either vertically or horizontally, they stay connected. The scattering effect has been temporarily removed. 
The reason why I am going through all this effort is because I felt that just having a top down view of the pieces was kind of boring, and I want it to be possible to view them at different orthographic perspectives. The plan is to have them resting on a table as an incomplete puzzle, and also have a box in the background which has the complete set of pieces put together. Both the box and the puzzle pieces will show the faces (I will make these tomorrow).