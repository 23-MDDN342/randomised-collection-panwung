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

17/04
The shadow is back, this time it renders correctly. The rest of the transformation code is complete; pieces now dislay appropriatly when scaled or rotated (this has the effect of the pieces appearing 3D, as there is a way to "change" perspective). As the blackjack code has not been finished, there is currently a very primitive competing code where the player and dealer simply compare their hands to see which one is bigger. Some primitive faces were added also, one for winning and losing.

18/04
Added new mouth type shock, which happens when a competitor goes bust. X eyes still need to be added for this game outcome. A simple AI representing the player's moves have been added, as well as multiple end game states (WIN, LOSE, BUST, DRAW, BLACKJACK). The colours have also been updated; red is the player and black is the dealer. Some temporary colours have been added for the DRAW state (grey) and the BLACKJACK state (gold). 

19/04
Made a series of new faces and eyes: neutral face, angry, dead and blackjack eyes. More details need to be added to the face based on the suits of each competitors cards, and maybe even what symbols the cards are. I'm thinking of suits being different notch shapes, however, this may take tweaking existing elements of my code.

20/4
Added new eye expression for "LOSE", which occurs whenever a competitor has lost but not to blackjack or bust.
Began working on different notches based on the suit of the competitors first card. So far "spade", "club", and "diamond" have unique notches; point, square, and trapezoid respectivly. I have also begun working on the arrangement of the pieces. The scattering has also returned, allowing for a percentage chance of a piece being "unplaced" as opposed to in place. 

23/4
Made the last notch shape for "heart" suit, a semi rounded notch (I couldn't be bothered making it a complete circle). I have also made it so the editor now can display these alternate notches.

24/04
Began working on the table. Only some simple colours exist so far. Later on I will add a box for the puzzle pieces, or maybe a deck of cards. I want to try to make a gradient across the table. I plan on making accessories for each face if they have a king, queen, jack, or ace in their hand.

26/04
Began reworking the shadows cast by the pieces to make them look more realistic, because currently they are not. A box meant to be the container for the pieces have been added, although the shadow is too a bit broken. Tomorrow will be spent fixing these issues as well as implement one final thing; a new class called Accessories. This will give some additional details to competitors with JQKA cards in their hands, as well as add a logo to the box.

27/04
I have changed my mind. Realistic shadows that connect to certain points of the pieces turns out to be far too complex for me to be bothered dealing with given the time frame. Added a new accessory that is drawn on any competitor that has an ace in their hand.

29/04
Made new accessory for king: crown. These new accessories are given based on which card a competitor held first, e.g. if a competitor has both a king and a queen, but recieved the king card first, then it will have a king accessory. The box also now has an accessory. Its shape and colour is determined by the most occuring symbol out of J Q K and Blackjack, and its colour is determined by the most occuring suit.

30/04
Added the last two accessories for J Q: star and dagger respectively. 