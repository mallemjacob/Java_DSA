# Big O in Everyday Code

1. Determining the efficiency of our code is the first step in optimizing it.
   After all, if we don’t know how fast our code is, how would we know if our modifi-
   cations would make it faster?
2. For example, an algorithm that is O(N2) is generally considered
   to be a slow algorithm. So if we’ve determined that our algorithm falls
   into such a category, we should take pause and wonder if there are ways to
   optimize it.
3. O(N2) may be the best we can do for a given problem. However,
   knowing that our algorithm is considered slow can signal to us to dig deeper
   and analyze whether faster alternatives are available.

## Steps to determine the efficiency of the code:

Remember that Big O is all about answering the key question: if there are N
data elements, how many steps will the algorithm take?

Let's take "Mean Average of Even Numbers" problem.

1. The first thing we want to do is determine what the N data elements are.

    `N = ?`

2. In case of "Mean Average of Even Numbers", the N data elements are the numbers in the
   array.

    `N = length of the array`
    `N=5`

3. Next, we have to determine how many steps the algorithm takes to process
   these N values.

    `steps = ?`

4. We can see the loop that iterates over each number
   inside the array, so we’ll want to analyze that first.

5. Since the loop iterates over each of the N elements, we know the algorithm takes at least N steps.

    `steps = N`

6. For each and every number, we check whether the number is even.
   If the number is even, we perform two more steps:
    1. we modify the sum variable
    2. we modify the count_of_even_numbers variable.

7. Big O focuses primarily on worst-case scenarios.
   we perform three steps during each round of the loop.
   we can say that for N data elements, our algorithm takes `3N steps`.
   That is, for each of the N numbers, our algorithm executes three steps.

8. Next, we initialize the two variables and set them to 0. two steps

9. we perform another step: the division of `sum / count_of_even_numbers`.

10. So we can say that our algorithm takes `3N + 3` steps.
    Big O notation ignores constant numbers, so we can simplify this to `O(N)`.
