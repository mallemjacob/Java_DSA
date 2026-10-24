# Searching Algorithms

## What is Searching?

Given some data, find whether a particular value exists and, usually, where it is located.

## Linear Search

Start at the beginning and check every element one by one until you find the target.

## Linear Search Complexity

for n elements, O(n)

### ArrayList

```java
ArrayList<String> fruits = new ArrayList<>();

fruits.add("Apple");
fruits.add("Banana");
fruits.add("Mango");
fruits.add("Orange");
fruits.add("Grapes");

fruits.remove("Mango");
```

### common array operations

```java
// Read
System.out.println(fruits.get(2));     // Mango

// Add to end
fruits.add("Grapes");

// Insert at index 1
fruits.add(1, "Pineapple");

// Update index 2
fruits.set(2, "Watermelon");

// Delete by index
fruits.remove(2);

// Delete by value
fruits.remove("Mango");

// Number of elements
System.out.println(fruits.size());

```

### Finding maximum

```Java
static int findMax(int[] numbers) {

    int max = numbers[0];

    for (int i = 1; i < numbers.length; i++) {

        if (numbers[i] > max) {
            max = numbers[i];
        }
    }

    return max;
}

```
