# Trie Data Structure (pronounced "try")

A Trie, also called a Prefix Tree, is a tree-based data structure used to store and search strings efficiently.

Unlike a regular array or list that stores complete words separately, a Trie stores words character by character, sharing common prefixes.

For example, suppose we want to store these five words:

cat, car, care, dog, door

1. cat, car, and care share the characters c → a.
2. car and care share c → a → r.
3. dog and door share d → o.

Instead of storing the same prefixes repeatedly in separate paths, a Trie reuses them.

- To find care, you follow:
  root → c → a → r → e

- To find words beginning with ca, navigate:
  root → c → a

Then explore everything beneath that point. You find cat, car, and care.

## Why do we need a Trie?

Let's imagine you're developing an autocomplete feature using Java.

You have thousands of words in a dictionary.

A user types app, and your application needs to suggest:

- app
- apple
- application
- apply

Instead, a Trie navigates directly to the characters:

a → p → p

Then it explores only the words beneath that prefix.

It doesn't need to check unrelated branches such as banana, cat, or zebra.

### Important Trie terminology

Term -------------- Meaning
Root ------------- Starting node; doesn't contain a character
Node ------------- A location representing one character
Child ------------- The next possible character
Edge ------------- Connection between nodes
Prefix ----------- Beginning characters of a word
End of word ------- Boolean marker indicating a complete stored word

- Why do we need isEndOfWord?

Suppose our Trie contains:

car and care

When we navigate c → a → r, we have reached car.

But r also has a child e, representing care.

How does Java know that car itself is also a valid word?

We use a boolean: `boolean isEndOfWord;`

## Our application will support three operations:

Basic autocomplete application.

1. Insert: Add a word to the Trie.
2. Search: Check whether a complete word exists.
3. Autocomplete: Return all words starting with a given prefix.
   We'll use Java's built-in HashMap to store the children of each Trie node.

above 1 million words

cat,
catch
car

root
c
a
t --> endofword, r --> endofword
c
h --> endofword
