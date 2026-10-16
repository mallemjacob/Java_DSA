# Dynamic Programming

While recursion can certainly solve some problems, it can also create new
ones if not used properly.

We can fix these problems.

## Unnecessary Recursive Calls

Recursive function that finds the greatest number from an array:

Let’s break this down for an example array of [1, 2, 3, 4].

We know that we’re going to start by comparing the 1 with the maximum
number of the remaining array, [2, 3, 4]. That, in turn, will compare the 2 against
the max of the remaining [3, 4], which in turn will compare the 3 against the
[4]. This, too, triggers one more recursive call on the [4] itself, which is the
base case.

### Max Recursive Walk-Through

1. When we call max([4]), the function simply returns the number 4. Again, this
   is because our base case is when the array only contains one element, as
   dictated by the following line of code:

2. Moving up the call chain, let’s see what happens when we call max([3, 4]). In
   the first half of the conditional statement (if array[0] > max(remainingArray)), we compare the 3 to max([4]). But calling max([4]) is itself a recursive call. The following
   diagram depicts max([3, 4]) calling max([4]).

3. Note that next to the arrow, we put the label “1st” to indicate that this
   recursive call was triggered by the first half of the conditional statement
   within max([3, 4]).

4. After this step has been completed, our code can now compare the 3 with the
   result of max([4]). Since the 3 is not greater than that result (4), we trigger the
   second half of the conditional. (This is the code, return max(array[1:]).) In this
   case, we return max([4]).

5. But when our code returns max([4]), it triggers the actual function call of
   max([4]). This is now the second time we’ve triggered the max([4]) call:

6. As you can see, the function, max([3, 4]) ends up calling max([4]) twice.

7. So when we call max([1, 2, 3, 4]), we actually end up triggering the max function
   fifteen times.

## The Little Fix for Big O

Thankfully, there’s an easy way to eliminate all these extra recursive calls.
We’ll call max only once within our code, and save the result to a variable:

By implementing this simple modification, we end up calling max a mere four
times.

The trick here is that we’re making each necessary function call once and
saving the result in a variable so that we don’t have to ever call that function
again.

## The Efficiency of Recursion

In our second, improved version of the max function, the function recursively
calls itself as many times as there are values in the array. We’d call this O(N).

As you’ll recall, Big O answers the key question: if there are N data elements,
how many steps will the algorithm take?

Since the improved max function runs N times for N values in the array, it has
a time complexity of O(N). Even if the function itself contains multiple steps,
such as five, its time complexity would be O(5N), which is reduced to O(N).

In the first version, though, the function called itself twice during each run
(save for the base case). Let’s see how this plays out for different array sizes.

(08.png)

Can you see the pattern? When we increase the data by one, we roughly
double the number of steps the algorithm takes.

- this is the pattern of O(2N).

Time complexity: `O(n^2)` because each recursive call copies the remaining array.

## Overlapping Subproblems

we end up computing the same recursive
calls over and over again.

The Fibonacci sequence is a mathematical sequence of numbers that goes
like this until infinity:

`0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55…`

What makes these subproblems overlapping, though, is the fact that fib(n - 2)
and fib(n - 1) end up calling many of the same functions as each other. Specif-
ically, fib(n - 1) ends up making some of the very same calculations already
made by fib(n - 2). For example, you can see in the previous diagram that fib(5)
calls fib(3) even though fib(4) has itself already done so. Many other calls are
duplicated too.

## Dynamic Programming Through Memoization

Memoization is a simple, but brilliant, technique for reducing recursive calls in cases of overlapping subproblems.

Essentially, memoization reduces recursive calls by remembering previously
computed functions.

In our Fibonacci example, the first time fib(3) is called, the function does its
computation and returns the number 2. However, before moving on, the
function stores this result inside a hash table. The hash table will look
something like this:

`{3: 2}`

This indicates that the result of fib(3) is the number 2.

Similarly, our code will memoize the results of all new computations it encoun-
ters. After encountering fib(4), fib(5), and fib(6), for example, our hash table will
look like this:

```hash
{
  3: 2,
  4: 3,
  5: 5,
  6: 8
}
```

Now that we have this hash table, we can use it to prevent future recursive
calls. Here’s the way this works:

Without memoization, fib(4) would normally call fib(3) and fib(2), which in turn
make their own recursive calls. Now that we have this hash table, we can
approach things differently. Instead of fib(4) just blithely calling fib(3), for
example, it first checks the hash table to see if the result of fib(3) has already
been computed. Only if the 3 key is not in the hash table does the function
proceed to call fib(3).

The whole issue with overlapping subproblems is that we end up computing the same recursive
calls over and over again. With memoization, though, each time we make a
new calculation, we store it in the hash table for future use. This way, we
only make a calculation if it hasn’t ever been made before.

Okay, this all sounds good, but there’s one glaring problem. How does each
recursive function get access to this hash table?

The answer is this: we pass the hash table as a second parameter to the
function.

## Implementing Memoization

1. To pass the hash table along, we modify our function to accept two arguments,
   with the hash table as the second. We call this hash table, memo, as in mem-
   oization:

2. When calling the function the first time, we pass in both the number and an
   empty hash table:

3. Each time fib calls itself, it also passes along the hash table, which gets filled
   up along the way.
