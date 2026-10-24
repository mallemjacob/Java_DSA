# Recursively Recurse with Recursion

Recursion is the term for a function calling itself.

Base case = the case in which our function will not recurse is known as the base case.

## Reading Recursive Code

The factorial of 3 is:
`3 * 2 * 1 = 6`

The factorial of 5 is:
`5 * 4 * 3 * 2 * 1 = 120`

1. Identify the base case.
2. Walk through the function for the base case.
3. Identify the next-to-last case. This is the case just before the base case.
4. Walk through the function for the next-to-last case.
5. Repeat this process by identifying the case before the one you just analyzed
   and walking though the function for that case.

## Recursion in the Eyes of the Computer

Say that we call factorial(3). Since 3 isn’t the base case, the computer reaches
this line:

`return number * factorial(number - 1)`

This then launches the function factorial(2).

But there’s a catch. When the computer begins to run factorial(2), did the
computer yet complete running factorial(3)?

(Understanding_Recursion_Factorial_Java.md)

This is what makes recursion tricky for the computer. Until the computer
reaches the end keyword of factorial(3), it’s not done with factorial(3). So we enter
into a weird situation. The computer didn’t yet complete executing factorial(3),
yet it’s starting to run factorial(2) while still in the middle of factorial(3).

And factorial(2) isn’t the end of the story, because factorial(2) triggers factorial(1).
while still in the middle of running factorial(3), the computer
calls factorial(2). And while running factorial(2), the computer runs factorial(1). It
turns out, then, that factorial(1) runs in the middle of both factorial(2) and factorial(3).

How does the computer keep track of all of this? It needs some way to
remember that after it finishes factorial(1), it needs to go back and finish running
factorial(2). And then it needs to remember to complete factorial(3) once it com-
pletes factorial(2).

### the order in which the computer calculates the factorial of 3 is as follows:

1. factorial(3) is called first. Before it’s done…
2. factorial(2) is called second. Before it’s done…
3. factorial(1) is called third.
4. factorial(1) is completed first.
5. factorial(2) is completed based on the result of factorial(1).
6. Finally, factorial(3) is completed based on the result of factorial(2).

## Stack Overflow

In the case of infinite recursion, the computer keeps pushing the same
function again and again onto the call stack. The call stack grows and grows
until, eventually, the computer reaches a point where there’s simply no more
room in its short-term memory to hold all this data. This causes an error
known as stack overflow—the computer just shuts down the recursion and
says, “I refuse to call the function again, because I’m running out of memory!”
