# Insertion Sort Implementation in Library Management System

## Overview
This project implements insertion sort algorithm for sorting booked books in the admin panel. The implementation includes both standard insertion sort and an optimized version with binary search.

## How Insertion Sort Works

### Basic Concept
Insertion sort works like sorting playing cards in your hand:
1. Start with the second card
2. Compare it with all previous cards
3. Insert it in the correct position
4. Repeat for all remaining cards

### Step-by-Step Algorithm

#### Step 1: Initial Setup
- Start with the second element (index 1)
- Assume the first element is already sorted

#### Step 2: Iterate Through Array
- For each element starting from index 1:
  - Store the current element as `key`
  - Compare `key` with all previous elements

#### Step 3: Shift and Insert
- While the previous element is greater than `key`:
  - Shift the previous element one position ahead
  - Move to the previous element
- Insert `key` in its correct position

#### Step 4: Repeat
- Continue until all elements are processed

### Example with Book Titles

Let's sort books by title: `["Zebra", "Apple", "Banana", "Cat"]`

**Initial Array:** `["Zebra", "Apple", "Banana", "Cat"]`

**Step 1:** Start with "Apple" (index 1)
- Compare "Apple" with "Zebra"
- "Apple" < "Zebra", so shift "Zebra" right
- Insert "Apple" at index 0
- **Result:** `["Apple", "Zebra", "Banana", "Cat"]`

**Step 2:** Process "Banana" (index 2)
- Compare "Banana" with "Zebra"
- "Banana" < "Zebra", so shift "Zebra" right
- Compare "Banana" with "Apple"
- "Banana" > "Apple", so insert "Banana" after "Apple"
- **Result:** `["Apple", "Banana", "Zebra", "Cat"]`

**Step 3:** Process "Cat" (index 3)
- Compare "Cat" with "Zebra"
- "Cat" < "Zebra", so shift "Zebra" right
- Compare "Cat" with "Banana"
- "Cat" > "Banana", so insert "Cat" after "Banana"
- **Final Result:** `["Apple", "Banana", "Cat", "Zebra"]`

## Implementation in Your Project

### 1. Standard Insertion Sort
```javascript
const insertionSort = (arr, field, direction) => {
  const sortedArr = [...arr];
  for (let i = 1; i < sortedArr.length; i++) {
    const current = sortedArr[i];
    let j = i - 1;

    while (j >= 0 && shouldSwap(sortedArr[j], current, direction)) {
      sortedArr[j + 1] = sortedArr[j];
      j--;
    }
    sortedArr[j + 1] = current;
  }
  return sortedArr;
};
```

### 2. Optimized Insertion Sort (Binary Search)
```javascript
const optimizedInsertionSort = (arr, field, direction) => {
  const sortedArr = [...arr];
  
  for (let i = 1; i < sortedArr.length; i++) {
    const current = sortedArr[i];
    const insertIndex = binarySearch(sortedArr, current, 0, i);
    
    // Shift elements
    for (let j = i; j > insertIndex; j--) {
      sortedArr[j] = sortedArr[j - 1];
    }
    
    sortedArr[insertIndex] = current;
  }
  return sortedArr;
};
```

## Features in Your Project

### 1. Multi-Field Sorting
- **Book Title:** `Book.BookName`
- **Author:** `Book.Author`
- **User Name:** `User.Name`
- **Email:** `User.Email`
- **Booked Date:** `Booked_date`
- **Return Date:** `Return_date`

### 2. Bidirectional Sorting
- **Ascending:** A to Z, 1 to 9, oldest to newest
- **Descending:** Z to A, 9 to 1, newest to oldest

### 3. Performance Metrics
- **Comparisons:** Number of element comparisons
- **Swaps:** Number of element movements
- **Execution Time:** Time taken to complete sorting
- **Array Size:** Number of elements being sorted

### 4. Step-by-Step Visualization
- Shows each step of the sorting process
- Displays current element being processed
- Tracks comparisons and swaps
- Expandable accordion interface

## Time Complexity

### Standard Insertion Sort
- **Best Case:** O(n) - When array is already sorted
- **Average Case:** O(n²) - When array is randomly ordered
- **Worst Case:** O(n²) - When array is reverse sorted

### Optimized Insertion Sort (Binary Search)
- **Best Case:** O(n log n) - When array is already sorted
- **Average Case:** O(n²) - Still O(n²) due to shifting operations
- **Worst Case:** O(n²) - When array is reverse sorted

## Space Complexity
- **Both Versions:** O(1) - In-place sorting algorithm
- No additional data structures required

## When to Use Insertion Sort

### Advantages
1. **Simple Implementation:** Easy to understand and implement
2. **In-Place Sorting:** No extra memory required
3. **Stable Algorithm:** Maintains relative order of equal elements
4. **Adaptive:** Efficient for nearly sorted arrays
5. **Online Algorithm:** Can sort as data arrives

### Disadvantages
1. **Poor Performance:** O(n²) complexity for large datasets
2. **Not Suitable for Large Arrays:** Better algorithms exist for big data

### Best Use Cases
1. **Small Arrays:** Less than 50 elements
2. **Nearly Sorted Data:** When most elements are in correct position
3. **Educational Purposes:** Learning sorting algorithms
4. **Real-time Sorting:** When data arrives incrementally

## Usage in Your Project

### 1. Click Column Headers
- Click any column header to sort by that field
- Click again to reverse sort order
- Visual indicators show current sort field and direction

### 2. Use Sorting Controls
- **Sort with Steps:** Shows detailed sorting process
- **Optimized Sort:** Uses binary search for better performance

### 3. View Performance Metrics
- Real-time performance data
- Comparison and swap counts
- Execution time measurement

## Code Structure

### State Variables
```javascript
const [sortField, setSortField] = useState("Booked_date");
const [sortDirection, setSortDirection] = useState("asc");
const [sortingSteps, setSortingSteps] = useState([]);
const [showSortingSteps, setShowSortingSteps] = useState(false);
const [sortPerformance, setSortPerformance] = useState({});
```

### Helper Functions
```javascript
const getFieldValue = (obj, fieldPath) => {
  return fieldPath.split('.').reduce((current, key) => current?.[key], obj);
};

const compareValues = (a, b) => {
  // Handles strings, dates, and numbers
  // Returns -1, 0, or 1 for comparison
};
```

## Testing the Implementation

### 1. Load the Admin Panel
- Navigate to the booked books section
- Ensure you have some booked books data

### 2. Test Different Sort Fields
- Click on Title, Author, Date columns
- Verify sorting works correctly
- Check ascending/descending order

### 3. Test Performance
- Use "Sort with Steps" to see detailed process
- Use "Optimized Sort" for better performance
- Compare execution times

### 4. Verify Data Integrity
- Ensure no data is lost during sorting
- Check that relationships between books and users are maintained
- Verify date formatting remains correct

## Future Enhancements

### 1. Additional Algorithms
- Merge Sort for better performance
- Quick Sort for large datasets
- Heap Sort for memory efficiency

### 2. Advanced Features
- Multi-column sorting
- Custom sort functions
- Sort history and favorites

### 3. Performance Improvements
- Web Workers for large datasets
- Virtual scrolling for many items
- Caching sorted results

## Conclusion

The insertion sort implementation in your project provides:
- **Educational Value:** Clear visualization of sorting process
- **Performance Monitoring:** Real-time metrics and analysis
- **Flexibility:** Multiple sorting options and directions
- **User Experience:** Intuitive interface with visual feedback

This implementation serves as both a functional sorting tool and an educational resource for understanding how insertion sort works in practice. 