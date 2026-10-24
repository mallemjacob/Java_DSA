# Filesystem Traversal Using Recursion in Java

We'll start with a simple program that prints immediate subdirectories, then move to two levels, and finally use **recursion to search through all levels**.

## 1. Understanding Filesystem Traversal

Imagine you have this folder structure on your computer:

```text
Projects/
├── Java/
│   ├── Basics/
│   │   └── HelloWorld.java
│   └── Advanced/
│       └── DSA/
├── Python/
│   └── Django/
└── README.md
```

Our goal is to print all the folder names, including the folders inside other folders.

## 2. Java Program 1: Print Immediate Subdirectories

```java
import java.io.File;

public class DirectoryTraversal {

    public static void printSubdirectories(String directoryName) {

        File directory = new File(directoryName);

        File[] files = directory.listFiles();

        if (files == null) {
            return;
        }

        for (File file : files) {

            if (file.isDirectory()) {
                System.out.println(file.getPath());
            }
        }
    }

    public static void main(String[] args) {
        printSubdirectories(".");
    }
}
```

### Explanation

- `import java.io.File;` — Imports Java's `File` class for working with files and directories.
- `new File(directoryName)` — Creates a `File` object representing the given path.
- `directory.listFiles()` — Returns an array of files and folders immediately inside the directory.
- `file.isDirectory()` — Checks whether an item is a directory.
- `file.getPath()` — Returns the directory's path.
- `"."` — Represents the current working directory.

For our example folder structure, assuming `Projects` is the current directory, the output would be:

```text
./Java
./Python
```

**Limitation:** This program doesn't print `Basics`, `Advanced`, `DSA`, or `Django`, because those folders are deeper inside the directory structure.

## 3. Java Program 2: Print Subdirectories Two Levels Deep

Now let's improve the program by adding another loop.

```java
import java.io.File;

public class DirectoryTraversal {

    public static void printSubdirectories(String directoryName) {

        File directory = new File(directoryName);

        File[] files = directory.listFiles();

        if (files == null) {
            return;
        }

        for (File file : files) {

            if (file.isDirectory()) {

                System.out.println(file.getPath());

                File[] subFiles = file.listFiles();

                if (subFiles == null) {
                    continue;
                }

                for (File subFile : subFiles) {

                    if (subFile.isDirectory()) {
                        System.out.println(subFile.getPath());
                    }
                }
            }
        }
    }

    public static void main(String[] args) {
        printSubdirectories(".");
    }
}
```

### Example output

```text
./Java
./Java/Basics
./Java/Advanced
./Python
./Python/Django
```

Now the program searches two levels deep.

However, it still cannot find:

```text
./Java/Advanced/DSA
```

**Problem:** If we want to search 5, 10, or 100 levels deep, we would need more nested loops. We also might not know how many levels exist.

This is where recursion becomes useful.

## 4. Java Program 3: Recursive Filesystem Traversal

```java
import java.io.File;

public class DirectoryTraversal {

    public static void printSubdirectories(String directoryName) {

        File directory = new File(directoryName);

        File[] files = directory.listFiles();

        // Base case: No accessible contents
        if (files == null) {
            return;
        }

        for (File file : files) {

            if (file.isDirectory()) {

                System.out.println(file.getPath());

                // Recursive call
                printSubdirectories(file.getPath());
            }
        }
    }

    public static void main(String[] args) {

        // Start from the current directory
        printSubdirectories(".");
    }
}
```

### Example output

```text
./Java
./Java/Basics
./Java/Advanced
./Java/Advanced/DSA
./Python
./Python/Django
```

Unlike the previous examples, this program can visit directories at any depth, subject to practical limits such as memory, permissions, and stack size.

> **Note:** The sample outputs show one possible traversal order. `listFiles()` does not guarantee alphabetical ordering, and path separators differ by operating system (for example, `\` on Windows).

## 5. How Does Recursion Work Here?

Let's follow the execution.

### Step 1: Start from `Projects`

We call:

```java
printSubdirectories(".");
```

Java looks inside the `Projects` directory and finds `Java`.

### Step 2: Enter `Java`

Since `Java` is a directory, Java prints it and calls:

```java
printSubdirectories("./Java");
```

The original `Projects` call is **paused** while the `Java` call runs.

### Step 3: Enter `Basics`

Java finds `Basics` and calls:

```java
printSubdirectories("./Java/Basics");
```

The `Basics` folder contains no subdirectories, so this call finishes and returns to `Java`.

### Step 4: Enter `Advanced`

The unfinished `Java` call continues to its next folder, `Advanced`:

```java
printSubdirectories("./Java/Advanced");
```

### Step 5: Enter `DSA`

Inside `Advanced`, Java finds `DSA`:

```java
printSubdirectories("./Java/Advanced/DSA");
```

After this call finishes, the calls for `Advanced` and `Java` can also finish, and execution returns to `Projects`.

### Step 6: Enter `Python`

The original `Projects` call continues and finds `Python`:

```java
printSubdirectories("./Python");
```

### Step 7: Enter `Django`

The `Python` call finds `Django`:

```java
printSubdirectories("./Python/Django");
```

`Django` has no subdirectories, so Java returns to `Python`, then to `Projects`. The traversal is complete.

### Call stack walkthrough

Each time the function calls itself, Java pushes another function call onto the **call stack**. When that call finishes, Java removes it and resumes the previous call.

| Stage | Active calls (bottom → top)        | What happens                           |
| ----- | ---------------------------------- | -------------------------------------- |
| 1     | `Projects`                         | Initial call starts                    |
| 2     | `Projects → Java`                  | Enter `Java`                           |
| 3     | `Projects → Java → Basics`         | Enter `Basics`, then return            |
| 4     | `Projects → Java → Advanced`       | Enter `Advanced`                       |
| 5     | `Projects → Java → Advanced → DSA` | Enter `DSA`, then unwind to `Projects` |
| 6     | `Projects → Python`                | Enter `Python`                         |
| 7     | `Projects → Python → Django`       | Enter `Django`, then finish all calls  |

Example of the call stack at its deepest point in the `Java` branch:

```text
TOP OF STACK
┌─────────────────────────────────────────────────┐
│ printSubdirectories("./Java/Advanced/DSA")      │  ← currently running
├─────────────────────────────────────────────────┤
│ printSubdirectories("./Java/Advanced")          │  ← waiting
├─────────────────────────────────────────────────┤
│ printSubdirectories("./Java")                   │  ← waiting
├─────────────────────────────────────────────────┤
│ printSubdirectories(".")                        │  ← waiting
└─────────────────────────────────────────────────┘
BOTTOM OF STACK
```

When the `DSA` call finishes, Java resumes `Advanced`, then `Java`, then `Projects` as appropriate.

## 6. Where Is the Base Case?

In our factorial example, we explicitly wrote:

```java
if (number <= 1) {
    return 1;
}
```

But in filesystem traversal, our stopping condition is different.

```java
if (files == null) {
    return;
}
```

This handles a directory that can't be listed.

More importantly, **if a directory has no subdirectories, the loop makes no further recursive calls**. The function naturally finishes and returns.

For example, when Java enters `DSA` and finds no subdirectories, it stops exploring that branch and returns to the previous directory.

One important detail: Java's `File` class works with both files and directories, despite its name.

For ordinary learning examples, `File` is sufficient. In modern production Java applications, `java.nio.file.Files` and `Path` are often preferred because they provide more flexible file operations and error handling.

Also, real filesystems can contain symbolic links, inaccessible directories, and extremely deep folder structures. Those require additional handling in production programs.

## Key Takeaway

**Recursion is useful for filesystem traversal because each directory contains a smaller version of the same problem: find its subdirectories, print them, and repeat.**

You don't need to know the number of directory levels in advance.
