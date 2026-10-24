# Bubble sort

array = {4,2,7,1,3}

index = 0,1,2,3,4

## round 1

length = 5, starting_index = 0, last_index = 4

index 0 > index 1 -> swap
index 1 < index 2 -> no swap
index 2 > index 3 -> swap
index 3 > index 4 -> swap

## round 2

length = 4, starting_index = 0, last_index = 3

index 0 < index 1 -> no swap
index 1 > index 2 -> swap
index 2 > index 3 -> swap

## round 3

length = 3, starting_index = 0, last_index = 2

index 0 > index 1 -> swap
index 1 < index 2 -> no swap

## round 4

length = 2, starting_index = 0, last_index = 1

index 0 < index 1 -> no swap
