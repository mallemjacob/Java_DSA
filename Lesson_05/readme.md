# Big-O

The number of steps an algorithm takes cannot be pinned down to a single number.
If the array contains 22 elements, linear search takes 22 steps.
If the array contains 400 elements, however, linear search takes 400 steps.

The more effective way, then, to quantify the efficiency of linear search is to
say that linear search takes N steps for N elements in the array.

N elements = N steps

## Big O: How Many Steps Relative to N Elements?

Big O achieves consistency by focusing on the number of steps an algorithm
takes.

1. First, we ask the key question: if there are N data elements in an array,
   how many steps will linear search take?
2. The answer to the key question lies within the parentheses of our Big O
   expression. 0(?)
3. For example, linear search will take N steps, we express this as O(N).

## Efficiency of reading from a standard array

for
[1,2,3,4,5,6,7,8,9,10] O(n) --> linear
1
1 step
O(1) --> constant

Reading from an array takes just one step, no matter how large the array is.
To figure out how to express this in Big O terms, we’re
going to again ask the key question:
If there are N data elements, how many steps will reading from an array take?
The answer is that reading takes just one step. So we express this as O(1).

Reading from an Array = O(1)

O(1) algorithm can also be referred to as having constant time.

## Big O in depth

Let’s say we have an algorithm that always takes three steps no matter how
much data there is. That is, for N elements, the algorithm always takes three
steps. How would you express that in terms of Big O?

10 -> 3 steps
1000 -> 3 steps
10000 -> 3 steps

You might say, O(3). This is wrong
It is actually 0(1)

Why?

What Big O is truly concerned about: how will an algorithm’s performance change as the data increases?

Big O doesn’t want to simply tell you how many steps an algorithm takes. It wants to tell you the story of how the number of steps increases as the data changes.

So, we don’t care very much whether an algorithm is O(1) or
O(3).
Because both algorithms are the type that aren’t affected by increased
data, as their number of steps remains constant, they’re essentially the same
kind of algorithm.
They’re both algorithms whose steps remain constant irre-
spective of the data, and we don’t care to make a distinction between the two.

O(1) = steps remain constant as data increases.
0(N) = steps increase in direct proportion to the data as the data increases.

## Deeper into the Soul of Big O

{1,2,3,4,5,6,7,8,9,10}
n = 10000

n = 10000, steps = 10000 --> linear --> O(N) --> worse
n = 10, steps = 100 --> constant --> O(1) --> better

Say we had an algorithm of constant time that always took 100 steps no matter how
much data there was. Would you consider that to be more or less performant
than an algorithm that is O(N)?

As the graph (02.png) depicts, for a data set that is fewer than 100 elements, an O(N)
algorithm takes fewer steps than the O(1) 100-step algorithm. At exactly 100
elements, the lines cross, meaning the two algorithms take the same number
of steps, namely 100. But here’s the key point: for all arrays greater than 100,
the O(N) algorithm takes more steps.

## Same Algorithm, Different Scenarios

linear search isn’t always O(N).
If item is in first cell, it takes O(1)
O(1) in a best-case scenario and O(N) in a worst-case scenario.

- Big O notation generally refers to the worst-case scenario
  unless specified otherwise.

## An Algorithm of the Third Kind

Let’s now look at how to describe binary search in terms of Big O notation.

Binary search, then, seems to fall somewhere in between O(1) and O(N). So
what is it?

In Big O terms, we describe binary search as having a time complexity of:
O(log N).
This type of algorithm is also known as having a time complexity of log time.

O(log N) is the Big O way of describing an algorithm that
increases one step each time the data is doubled.

The three types of algorithms you’ve learned about so far can be sorted from
most efficient to least efficient as follows:
O(1)
O(log N)
O(N)

Let’s look at a graph that compares the three types: (03.png)

## Logarithms

Logarithms are the inverse of exponents.

`2*3 is the equivalent of: 2*2*2`

[1,2,3,4,5,6,7,8,9,10]

```numbers
64 -> 32 -> 16 -> 8 -> 4 -> 2 -> 1
       2 * 2 * 2 * 2 * 2 * 2 = 64
```

This just happens to be 8.

Now, log2 8 is the converse.
It means: how many times do you have to multiply 2 by itself to get a result of 8?

Because you have to multiply 2 by itself 3 times to get 8, log2 8 = 3.

`2*6 translates to: 2 * 2 * 2 * 2 * 2 * 2 = 64`
Because we had to multiply 2 by itself six times to get 64, we have, therefore:
log2 64 = 6.

Another way of explaining log2 8 is this: if we kept dividing 8 by 2 until we
ended up with 1, how many 2s would we have in our equation?

`8/2/2/2=1`

In other words, how many times do we need to halve 8 until we end up with
1? In this example, it takes us three times. Therefore,

`log2 8 = 3.`

## O(log N) Explained

If there are N data elements, how many steps will the algorithm take?

O(log N) means that for N data elements, the algorithm would take log2 N
steps.
If there are 8 elements, the algorithm would take three steps, since
log2 8 = 3.

This is exactly what happens with binary search. As we search for a particular
item, we keep dividing the array’s cells in half until we narrow it down to the
correct number.

The following table (04.png) demonstrates a striking difference between the efficiencies of O(N) and O(log N):

While the O(N) algorithm takes as many steps as there are data elements, the
O(log N) algorithm takes just one additional step each time the data is doubled.

### Prints all the items from a list:

```java
public class Main {
    public static void main(String[] args) {
        String[] things = {"apples", "baboons", "cribs", "dulcimers"};

        for (String thing : things) {
            System.out.println("Here's a thing: " + thing);
        }
    }
}

```

How would we describe the efficiency of this algorithm in Big O notation?

1. The first thing to realize is that this is an example of an algorithm.
2. any code that does anything at all is technically an algorithm, it’s a
   particular process for solving a problem.
3. The algorithm we use to solve this problem is a for loop containing a
   println statement.

To break this down, we need to analyze how many steps this algorithm takes.
In this case, the main part of the algorithm, the for loop—takes four steps.
In this example, there are four things in the list, and we print each one out a single time.

However, the number of steps isn’t constant. If the list contained ten elements,
the for loop would take ten steps. Since this for loop takes as many steps as
there are elements, we’d say that this algorithm has an efficiency of O(N).

### Another example

```java
public class Main {

    public static boolean isPrime(int number) {
        if (number < 2) {
            return false;
        }

        for (int i = 2; i < number; i++) {
            if (number % i == 0) {
                return false;
            }
        }

        return true;
    }

    public static void main(String[] args) {
        System.out.println(isPrime(7));  // true
        System.out.println(isPrime(10)); // false
    }
}
```

In this case, the key question is slightly different than in the previous exam-
ples.

In the previous examples, our key question asked how many steps the
algorithm would take if there were N data elements in an array.

Here, we’re not dealing with an array, but we are dealing with a number that we pass into this function.

Depending on the number we pass in, this will affect how many
times the function’s loop runs.

- In this case, then, our key question will be: when passing in the number N,
  how many steps will the algorithm take?

If we pass the number 7 into is_prime, the for loop runs about 7 times. (It
technically runs 5 times, since it starts at 2 and ends right before the actual
number.) For the number 101, the loop runs about 101 times. Because the
number of steps increases in lockstep with the number passed into the
function, this is a classic example of O(N).

## Exercises

1. Use Big O notation to describe the time complexity of the following function
   that determines whether a given year is a leap year:

    ```java
     public class Main {

     public static boolean isLeapYear(int year) {
        if (year % 100 == 0) {
            if (year % 400 == 0) {
                return true;
            } else {
                return false;
            }
        }

        return year % 4 == 0;
     }

     public static void main(String[] args) {
         System.out.println(isLeapYear(2024)); // true
         System.out.println(isLeapYear(1900)); // true
         System.out.println(isLeapYear(2000)); // false
         System.out.println(isLeapYear(2023)); // false
     }
    }
    ```

    Time Complexity:
    There are no loops and the number of operations does not grow with the value of year.

    Therefore:
    Time Complexity: O(1) — Constant Time

2. Use Big O notation to describe the time complexity of the following function
   that sums up all the numbers from a given array:

    ```java
     public class Main {

     public static int arraySum(int[] array) {
         int sum = 0;

         for (int number : array) {
             sum += number;
         }

         return sum;
     }

     public static void main(String[] args) {
         int[] numbers = {10, 20, 30, 40, 50};

         System.out.println(arraySum(numbers));
     }
    }
    ```

    Time Complexity:
    If the array contains N elements, the loop processes every element once.

    Therefore:
    Time Complexity: O(N) — Linear Time

3. The following function accepts an array of strings and returns a new array
   that only contains the strings that start with the character "a". Use Big O
   notation to describe the time complexity of the function:

    ```java
     import java.util.ArrayList;

     public class Main {

         public static String[] selectAStrings(String[] array) {
             ArrayList<String> newArray = new ArrayList<>();

             for (String string : array) {
                 if (string.charAt(0) == 'a') {
                     newArray.add(string);
                 }
             }

             return newArray.toArray(new String[0]);
         }

         public static void main(String[] args) {
             String[] words = {
                 "apple",
                 "banana",
                 "avocado",
                 "cat",
                 "apricot"
             };

             String[] result = selectAStrings(words);

             for (String word : result) {
                 System.out.println(word);
             }
         }
    }
    ```

    Time Complexity:
    If the input array contains N strings, we examine every string exactly once.

    Therefore:
    Time Complexity: O(N) — Linear Time
    The charAt(0) operation is O(1), so it doesn't change the overall complexity.

4. The following function calculates the median from an ordered array.
   Describe its time complexity in terms of Big O notation:

    ```java
     public class Main {

     public static Double median(int[] array) {
         if (array.length == 0) {
             return null;
         }

         int middle = array.length / 2;

         if (array.length % 2 == 0) {
             return (array[middle - 1] + array[middle]) / 2.0;
         } else {
             return (double) array[middle];
         }
     }

     public static void main(String[] args) {

         int[] oddArray = {1, 3, 5, 7, 9};
         int[] evenArray = {1, 3, 5, 7};

         System.out.println(median(oddArray));  // 5.0
         System.out.println(median(evenArray)); // 4.0
     }
    }
    ```

    Time Complexity:
    The array is already ordered, so we don't need to sort it.
    The function directly accesses the middle element:
    Each operation takes constant time.

    Therefore:
    Time Complexity: O(1) — Constant Time
