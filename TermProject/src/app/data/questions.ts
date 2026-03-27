import { Question } from '../components/QuizQuestion';

export const questions: Question[] = [
  // Dynamic Memory Allocation Questions
  {
    id: 1,
    type: 'code-body',
    difficulty: 'easy',
    question: 'Which code correctly allocates memory for an array of 10 integers using malloc()?',
    code: 'int* createArray() {\n    // Which implementation is correct?\n}',
    options: [
      'int *arr = (int*)malloc(10 * sizeof(int));\nreturn arr;',
      'int *arr = (int*)malloc(10);\nreturn arr;',
      'int *arr = malloc(10 * sizeof(int));\nreturn arr;',
      'int *arr = (int*)calloc(10);\nreturn arr;'
    ],
    correctAnswer: 'int *arr = (int*)malloc(10 * sizeof(int));\nreturn arr;',
    explanation: 'malloc() requires the total number of bytes to allocate. Use sizeof(int) multiplied by the number of elements. Always cast the void* return value to the appropriate type.'
  },
  {
    id: 2,
    type: 'multiple-choice',
    difficulty: 'medium',
    question: 'What is the key difference between malloc() and calloc()?',
    options: [
      'calloc() initializes memory to zero, malloc() does not',
      'malloc() is faster than calloc()',
      'calloc() takes one parameter, malloc() takes two',
      'There is no difference'
    ],
    correctAnswer: 'calloc() initializes memory to zero, malloc() does not',
    explanation: 'calloc() allocates memory and initializes all bytes to zero, while malloc() allocates memory without initialization, leaving it with garbage values.'
  },
  {
    id: 3,
    type: 'code-body',
    difficulty: 'medium',
    question: 'Which code correctly reallocates an array to double its size?',
    code: 'int* expandArray(int *arr, int oldSize) {\n    int newSize = oldSize * 2;\n    // Which implementation is correct?\n}',
    options: [
      'int *newArr = (int*)realloc(arr, newSize * sizeof(int));\nreturn newArr;',
      'int *newArr = (int*)malloc(newSize * sizeof(int));\nfree(arr);\nreturn newArr;',
      'arr = (int*)realloc(arr, newSize);\nreturn arr;',
      'int *newArr = (int*)realloc(newSize * sizeof(int));\nreturn newArr;'
    ],
    correctAnswer: 'int *newArr = (int*)realloc(arr, newSize * sizeof(int));\nreturn newArr;',
    explanation: 'realloc() takes the old pointer and new size in bytes. It preserves existing data and returns a pointer to the new memory block (which may be at a different address).'
  },
  {
    id: 4,
    type: 'code-body',
    difficulty: 'easy',
    question: 'Which code properly deallocates dynamically allocated memory?',
    code: 'void cleanup(int *arr) {\n    // Which implementation is correct?\n}',
    options: [
      'free(arr);\narr = NULL;',
      'delete arr;',
      'free(*arr);',
      'dealloc(arr);'
    ],
    correctAnswer: 'free(arr);\narr = NULL;',
    explanation: 'Use free() to deallocate memory allocated with malloc/calloc/realloc. Setting the pointer to NULL after freeing is good practice to avoid dangling pointers.'
  },

  // Recursion Questions
  {
    id: 5,
    type: 'code-body',
    difficulty: 'medium',
    question: 'Which recursive function correctly calculates the sum of digits of a number?',
    code: 'int sumDigits(int n) {\n    // Which implementation is correct?\n}',
    options: [
      'if (n == 0)\n    return 0;\nreturn (n % 10) + sumDigits(n / 10);',
      'if (n < 10)\n    return n;\nreturn n + sumDigits(n / 10);',
      'return (n % 10) + sumDigits(n - 1);',
      'if (n == 0)\n    return 1;\nreturn n + sumDigits(n / 10);'
    ],
    correctAnswer: 'if (n == 0)\n    return 0;\nreturn (n % 10) + sumDigits(n / 10);',
    explanation: 'Base case: when n is 0, return 0. Recursive case: extract last digit (n % 10) and add to sum of remaining digits (n / 10).'
  },
  {
    id: 6,
    type: 'multiple-choice',
    difficulty: 'hard',
    question: 'Given: int fib(int n) { if (n <= 1) return n; return fib(n-1) + fib(n-2); }\nHow many times is fib(2) called when computing fib(5)?',
    code: 'Trace the recursive call tree for fib(5)',
    options: [
      '3',
      '5',
      '8',
      '2'
    ],
    correctAnswer: '3',
    explanation: 'Drawing the call tree: fib(5) calls fib(4) and fib(3). fib(4) calls fib(3) and fib(2) [1st]. fib(3) from fib(4) calls fib(2) [2nd]. fib(3) from fib(5) calls fib(2) [3rd]. Total: 3 calls to fib(2).'
  },
  {
    id: 7,
    type: 'code-body',
    difficulty: 'hard',
    question: 'Which recursive function correctly generates all permutations of a string?',
    code: 'void permute(char *str, int l, int r) {\n    // Which implementation is correct?\n}',
    options: [
      'if (l == r) {\n    printf("%s\\n", str);\n    return;\n}\nfor (int i = l; i <= r; i++) {\n    swap(&str[l], &str[i]);\n    permute(str, l + 1, r);\n    swap(&str[l], &str[i]);\n}',
      'if (l == r) {\n    printf("%s\\n", str);\n}\nfor (int i = l; i <= r; i++) {\n    permute(str, l + 1, r);\n}',
      'for (int i = l; i <= r; i++) {\n    swap(&str[l], &str[i]);\n    permute(str, l + 1, r);\n}',
      'if (l > r)\n    return;\npermute(str, l + 1, r);\nprintf("%s\\n", str);'
    ],
    correctAnswer: 'if (l == r) {\n    printf("%s\\n", str);\n    return;\n}\nfor (int i = l; i <= r; i++) {\n    swap(&str[l], &str[i]);\n    permute(str, l + 1, r);\n    swap(&str[l], &str[i]);\n}',
    explanation: 'Permutation uses backtracking: swap current position with each remaining position, recurse, then backtrack by swapping again. Base case prints when all positions are fixed (l == r).'
  },
  {
    id: 8,
    type: 'code-body',
    difficulty: 'medium',
    question: 'Which recursive function correctly implements the Tower of Hanoi solution?',
    code: 'void hanoi(int n, char from, char to, char aux) {\n    // Which implementation is correct?\n}',
    options: [
      'if (n == 1) {\n    printf("Move disk 1 from %c to %c\\n", from, to);\n    return;\n}\nhanoi(n - 1, from, aux, to);\nprintf("Move disk %d from %c to %c\\n", n, from, to);\nhanoi(n - 1, aux, to, from);',
      'if (n == 0)\n    return;\nhanoi(n - 1, from, to, aux);\nprintf("Move disk %d from %c to %c\\n", n, from, to);',
      'printf("Move disk %d from %c to %c\\n", n, from, to);\nhanoi(n - 1, from, aux, to);\nhanoi(n - 1, aux, to, from);',
      'if (n == 1)\n    return;\nhanoi(n - 1, from, to, aux);\nhanoi(n - 1, aux, to, from);'
    ],
    correctAnswer: 'if (n == 1) {\n    printf("Move disk 1 from %c to %c\\n", from, to);\n    return;\n}\nhanoi(n - 1, from, aux, to);\nprintf("Move disk %d from %c to %c\\n", n, from, to);\nhanoi(n - 1, aux, to, from);',
    explanation: 'Tower of Hanoi: (1) Move n-1 disks from source to auxiliary using destination. (2) Move largest disk to destination. (3) Move n-1 disks from auxiliary to destination using source.'
  },

  // Linked Lists Questions
  {
    id: 9,
    type: 'code-body',
    difficulty: 'medium',
    question: 'Which function correctly inserts a node at the beginning of a singly linked list?',
    code: 'struct Node {\n    int data;\n    struct Node *next;\n};\n\nvoid insertAtHead(struct Node **head, int data) {\n    // Which implementation is correct?\n}',
    options: [
      'struct Node *newNode = (struct Node*)malloc(sizeof(struct Node));\nnewNode->data = data;\nnewNode->next = *head;\n*head = newNode;',
      'struct Node *newNode = (struct Node*)malloc(sizeof(struct Node));\nnewNode->data = data;\nnewNode->next = NULL;\n*head = newNode;',
      'struct Node newNode;\nnewNode.data = data;\nnewNode.next = *head;\n*head = &newNode;',
      'struct Node *newNode = (struct Node*)malloc(sizeof(struct Node));\n*head = newNode;\nnewNode->next = *head;'
    ],
    correctAnswer: 'struct Node *newNode = (struct Node*)malloc(sizeof(struct Node));\nnewNode->data = data;\nnewNode->next = *head;\n*head = newNode;',
    explanation: 'Create new node, set its data, point its next to current head, then update head to point to new node. Must use double pointer to modify the actual head pointer.'
  },
  {
    id: 10,
    type: 'code-body',
    difficulty: 'hard',
    question: 'Which recursive function correctly reverses a singly linked list?',
    code: 'struct Node* reverseRecursive(struct Node *head) {\n    // Which implementation is correct?\n}',
    options: [
      'if (head == NULL || head->next == NULL)\n    return head;\nstruct Node *rest = reverseRecursive(head->next);\nhead->next->next = head;\nhead->next = NULL;\nreturn rest;',
      'if (head == NULL)\n    return NULL;\nstruct Node *rest = reverseRecursive(head->next);\nhead->next = NULL;\nreturn rest;',
      'if (head->next == NULL)\n    return head;\nstruct Node *rest = reverseRecursive(head->next);\nrest->next = head;\nreturn rest;',
      'if (head == NULL)\n    return head;\nreverseRecursive(head->next);\nhead->next = NULL;\nreturn head;'
    ],
    correctAnswer: 'if (head == NULL || head->next == NULL)\n    return head;\nstruct Node *rest = reverseRecursive(head->next);\nhead->next->next = head;\nhead->next = NULL;\nreturn rest;',
    explanation: 'Recursively reverse the rest of the list, then make the next node point back to current node and set current node\'s next to NULL. Return the new head (rest).'
  },
  {
    id: 11,
    type: 'code-body',
    difficulty: 'medium',
    question: 'Which function correctly deletes a node from a doubly linked list?',
    code: 'struct DNode {\n    int data;\n    struct DNode *prev, *next;\n};\n\nvoid deleteNode(struct DNode **head, struct DNode *del) {\n    // Which implementation is correct?\n}',
    options: [
      'if (*head == NULL || del == NULL)\n    return;\nif (*head == del)\n    *head = del->next;\nif (del->next != NULL)\n    del->next->prev = del->prev;\nif (del->prev != NULL)\n    del->prev->next = del->next;\nfree(del);',
      'if (del->next != NULL)\n    del->next->prev = del->prev;\nif (del->prev != NULL)\n    del->prev->next = del->next;\nfree(del);',
      'del->prev->next = del->next;\ndel->next->prev = del->prev;\nfree(del);',
      'if (*head == del)\n    *head = del->next;\nfree(del);'
    ],
    correctAnswer: 'if (*head == NULL || del == NULL)\n    return;\nif (*head == del)\n    *head = del->next;\nif (del->next != NULL)\n    del->next->prev = del->prev;\nif (del->prev != NULL)\n    del->prev->next = del->next;\nfree(del);',
    explanation: 'Handle edge cases: if deleting head, update head pointer. Update prev node\'s next (if exists) and next node\'s prev (if exists) to skip the deleted node.'
  },
  {
    id: 12,
    type: 'code-body',
    difficulty: 'easy',
    question: 'Which function correctly searches for a value in a linked list iteratively?',
    code: 'int searchIterative(struct Node *head, int key) {\n    // Which implementation is correct?\n}',
    options: [
      'struct Node *current = head;\nwhile (current != NULL) {\n    if (current->data == key)\n        return 1;\n    current = current->next;\n}\nreturn 0;',
      'while (head != NULL) {\n    if (head->data == key)\n        return 1;\n}\nreturn 0;',
      'struct Node *current = head;\nwhile (current->next != NULL) {\n    if (current->data == key)\n        return 1;\n    current = current->next;\n}\nreturn 0;',
      'if (head->data == key)\n    return 1;\nreturn 0;'
    ],
    correctAnswer: 'struct Node *current = head;\nwhile (current != NULL) {\n    if (current->data == key)\n        return 1;\n    current = current->next;\n}\nreturn 0;',
    explanation: 'Traverse the list from head to end (NULL), checking each node\'s data. Return 1 if found, 0 if not found after traversing entire list.'
  },

  // Stacks and Queues Questions
  {
    id: 13,
    type: 'code-body',
    difficulty: 'easy',
    question: 'Which function correctly implements a push operation for an array-based stack?',
    code: '#define MAX 100\nstruct Stack {\n    int arr[MAX];\n    int top;\n};\n\nvoid push(struct Stack *s, int item) {\n    // Which implementation is correct?\n}',
    options: [
      'if (s->top >= MAX - 1) {\n    printf("Stack Overflow\\n");\n    return;\n}\ns->arr[++s->top] = item;',
      'if (s->top == MAX) {\n    printf("Stack Overflow\\n");\n    return;\n}\ns->arr[s->top++] = item;',
      's->arr[s->top] = item;\ns->top++;',
      's->top++;\ns->arr[s->top] = item;'
    ],
    correctAnswer: 'if (s->top >= MAX - 1) {\n    printf("Stack Overflow\\n");\n    return;\n}\ns->arr[++s->top] = item;',
    explanation: 'Check for overflow (top >= MAX-1). Pre-increment top then insert item. If top is initialized to -1, first push makes top = 0.'
  },
  {
    id: 14,
    type: 'code-body',
    difficulty: 'medium',
    question: 'Which function correctly converts infix expression to postfix using a stack?',
    code: 'int precedence(char op) {\n    if (op == \'+\' || op == \'-\') return 1;\n    if (op == \'*\' || op == \'/\') return 2;\n    return 0;\n}\n\nvoid infixToPostfix(char *infix, char *postfix) {\n    // Which implementation is correct?\n}',
    options: [
      'struct Stack s;\ns.top = -1;\nint k = 0;\nfor (int i = 0; infix[i]; i++) {\n    if (isalnum(infix[i]))\n        postfix[k++] = infix[i];\n    else if (infix[i] == \'(\')\n        push(&s, infix[i]);\n    else if (infix[i] == \')\') {\n        while (s.top != -1 && s.arr[s.top] != \'(\')\n            postfix[k++] = pop(&s);\n        pop(&s);\n    } else {\n        while (s.top != -1 && precedence(s.arr[s.top]) >= precedence(infix[i]))\n            postfix[k++] = pop(&s);\n        push(&s, infix[i]);\n    }\n}\nwhile (s.top != -1)\n    postfix[k++] = pop(&s);\npostfix[k] = \'\\0\';',
      'struct Stack s;\nint k = 0;\nfor (int i = 0; infix[i]; i++) {\n    if (isalnum(infix[i]))\n        postfix[k++] = infix[i];\n    else\n        push(&s, infix[i]);\n}\nwhile (s.top != -1)\n    postfix[k++] = pop(&s);\npostfix[k] = \'\\0\';',
      'for (int i = 0; infix[i]; i++) {\n    postfix[i] = infix[i];\n}\npostfix[i] = \'\\0\';',
      'struct Stack s;\nint k = 0;\nfor (int i = 0; infix[i]; i++) {\n    push(&s, infix[i]);\n}\nwhile (s.top != -1)\n    postfix[k++] = pop(&s);'
    ],
    correctAnswer: 'struct Stack s;\ns.top = -1;\nint k = 0;\nfor (int i = 0; infix[i]; i++) {\n    if (isalnum(infix[i]))\n        postfix[k++] = infix[i];\n    else if (infix[i] == \'(\')\n        push(&s, infix[i]);\n    else if (infix[i] == \')\') {\n        while (s.top != -1 && s.arr[s.top] != \'(\')\n            postfix[k++] = pop(&s);\n        pop(&s);\n    } else {\n        while (s.top != -1 && precedence(s.arr[s.top]) >= precedence(infix[i]))\n            postfix[k++] = pop(&s);\n        push(&s, infix[i]);\n    }\n}\nwhile (s.top != -1)\n    postfix[k++] = pop(&s);\npostfix[k] = \'\\0\';',
    explanation: 'Operands go directly to output. For operators: pop stack while top has higher/equal precedence, then push current. Handle parentheses specially: ( pushes to stack, ) pops until matching (.'
  },
  {
    id: 15,
    type: 'code-body',
    difficulty: 'medium',
    question: 'Which function correctly evaluates a postfix expression?',
    code: 'int evaluatePostfix(char *exp) {\n    // Which implementation is correct?\n}',
    options: [
      'struct Stack s;\ns.top = -1;\nfor (int i = 0; exp[i]; i++) {\n    if (isdigit(exp[i]))\n        push(&s, exp[i] - \'0\');\n    else {\n        int val2 = pop(&s);\n        int val1 = pop(&s);\n        switch (exp[i]) {\n            case \'+\': push(&s, val1 + val2); break;\n            case \'-\': push(&s, val1 - val2); break;\n            case \'*\': push(&s, val1 * val2); break;\n            case \'/\': push(&s, val1 / val2); break;\n        }\n    }\n}\nreturn pop(&s);',
      'struct Stack s;\nfor (int i = 0; exp[i]; i++) {\n    push(&s, exp[i] - \'0\');\n}\nreturn pop(&s);',
      'int result = 0;\nfor (int i = 0; exp[i]; i++) {\n    if (isdigit(exp[i]))\n        result += exp[i] - \'0\';\n}\nreturn result;',
      'struct Stack s;\nfor (int i = 0; exp[i]; i++) {\n    if (isdigit(exp[i]))\n        push(&s, exp[i]);\n}\nreturn pop(&s);'
    ],
    correctAnswer: 'struct Stack s;\ns.top = -1;\nfor (int i = 0; exp[i]; i++) {\n    if (isdigit(exp[i]))\n        push(&s, exp[i] - \'0\');\n    else {\n        int val2 = pop(&s);\n        int val1 = pop(&s);\n        switch (exp[i]) {\n            case \'+\': push(&s, val1 + val2); break;\n            case \'-\': push(&s, val1 - val2); break;\n            case \'*\': push(&s, val1 * val2); break;\n            case \'/\': push(&s, val1 / val2); break;\n        }\n    }\n}\nreturn pop(&s);',
    explanation: 'Push operands to stack. For operators: pop two values, apply operation (ORDER MATTERS: second pop is first operand), push result. Final stack value is answer.'
  },
  {
    id: 16,
    type: 'code-body',
    difficulty: 'hard',
    question: 'Which function correctly implements enqueue for a circular queue?',
    code: '#define MAX 5\nstruct Queue {\n    int arr[MAX];\n    int front, rear;\n};\n\nvoid enqueue(struct Queue *q, int item) {\n    // Which implementation is correct?\n}',
    options: [
      'if ((q->rear + 1) % MAX == q->front) {\n    printf("Queue Full\\n");\n    return;\n}\nif (q->front == -1)\n    q->front = 0;\nq->rear = (q->rear + 1) % MAX;\nq->arr[q->rear] = item;',
      'if (q->rear == MAX - 1) {\n    printf("Queue Full\\n");\n    return;\n}\nq->rear++;\nq->arr[q->rear] = item;',
      'q->rear = (q->rear + 1) % MAX;\nq->arr[q->rear] = item;',
      'if (q->rear + 1 == q->front) {\n    printf("Queue Full\\n");\n    return;\n}\nq->arr[++q->rear] = item;'
    ],
    correctAnswer: 'if ((q->rear + 1) % MAX == q->front) {\n    printf("Queue Full\\n");\n    return;\n}\nif (q->front == -1)\n    q->front = 0;\nq->rear = (q->rear + 1) % MAX;\nq->arr[q->rear] = item;',
    explanation: 'Circular queue uses modulo to wrap around. Check full condition: (rear+1) % MAX == front. Initialize front to 0 on first insert. Use modulo to increment rear circularly.'
  },
  {
    id: 17,
    type: 'multiple-choice',
    difficulty: 'medium',
    question: 'What is the main advantage of a circular queue over a naive queue implementation?',
    options: [
      'Better space utilization - can reuse freed front space',
      'Faster enqueue operation',
      'Simpler implementation',
      'No overflow possible'
    ],
    correctAnswer: 'Better space utilization - can reuse freed front space',
    explanation: 'In naive queue, dequeued front space is wasted. Circular queue wraps around using modulo, allowing reuse of freed positions, thus better utilizing the array.'
  },

  // Algorithm Analysis Questions
  {
    id: 18,
    type: 'multiple-choice',
    difficulty: 'medium',
    question: 'What is the time complexity of binary search on a sorted array of size n?',
    options: [
      'O(log n)',
      'O(n)',
      'O(n log n)',
      'O(1)'
    ],
    correctAnswer: 'O(log n)',
    explanation: 'Binary search divides the search space in half each iteration. After k iterations, size becomes n/2^k. When n/2^k = 1, k = log₂(n), giving O(log n) time complexity.'
  },
  {
    id: 19,
    type: 'code-body',
    difficulty: 'medium',
    question: 'Which function correctly implements iterative binary search?',
    code: 'int binarySearch(int arr[], int n, int key) {\n    // Which implementation is correct?\n}',
    options: [
      'int left = 0, right = n - 1;\nwhile (left <= right) {\n    int mid = left + (right - left) / 2;\n    if (arr[mid] == key)\n        return mid;\n    if (arr[mid] < key)\n        left = mid + 1;\n    else\n        right = mid - 1;\n}\nreturn -1;',
      'int left = 0, right = n;\nwhile (left < right) {\n    int mid = (left + right) / 2;\n    if (arr[mid] == key)\n        return mid;\n    if (arr[mid] < key)\n        left = mid;\n    else\n        right = mid;\n}\nreturn -1;',
      'for (int i = 0; i < n; i++) {\n    if (arr[i] == key)\n        return i;\n}\nreturn -1;',
      'int mid = n / 2;\nif (arr[mid] == key)\n    return mid;\nreturn -1;'
    ],
    correctAnswer: 'int left = 0, right = n - 1;\nwhile (left <= right) {\n    int mid = left + (right - left) / 2;\n    if (arr[mid] == key)\n        return mid;\n    if (arr[mid] < key)\n        left = mid + 1;\n    else\n        right = mid - 1;\n}\nreturn -1;',
    explanation: 'Binary search: initialize left=0, right=n-1. Calculate mid, compare with key. If key is larger, search right half (left=mid+1), else search left half (right=mid-1). Loop while left <= right.'
  },
  {
    id: 20,
    type: 'multiple-choice',
    difficulty: 'hard',
    question: 'Given two sorted arrays A[n] and B[m], what is the time complexity to find all common elements?',
    code: '// Sorted List Matching Problem\nint A[] = {1, 3, 5, 7, 9};\nint B[] = {2, 3, 5, 8, 9, 10};',
    options: [
      'O(n + m)',
      'O(n * m)',
      'O(n log m)',
      'O(min(n, m))'
    ],
    correctAnswer: 'O(n + m)',
    explanation: 'Use two pointers, one for each array. Compare elements: if equal, found match and advance both; if A[i] < B[j], advance i; else advance j. Each element visited once, total O(n+m).'
  },
  {
    id: 21,
    type: 'multiple-choice',
    difficulty: 'medium',
    question: 'What is the value of log₂(64)?',
    options: [
      '6',
      '8',
      '32',
      '7'
    ],
    correctAnswer: '6',
    explanation: 'log₂(64) asks "2 to what power equals 64?" Since 2^6 = 64, log₂(64) = 6. Properties: log₂(2^k) = k.'
  },
  {
    id: 22,
    type: 'multiple-choice',
    difficulty: 'hard',
    question: 'What is the closed form of the summation: Σ(i=1 to n) i ?',
    code: '// Sum of first n natural numbers\n1 + 2 + 3 + ... + n = ?',
    options: [
      'n(n + 1) / 2',
      'n²',
      '2^n - 1',
      'n(n - 1) / 2'
    ],
    correctAnswer: 'n(n + 1) / 2',
    explanation: 'The sum of first n natural numbers is n(n+1)/2. This is a classic arithmetic series. For n=5: 1+2+3+4+5 = 15 = 5(6)/2.'
  },
  {
    id: 23,
    type: 'multiple-choice',
    difficulty: 'hard',
    question: 'What is the time complexity of the following nested loop?',
    code: 'for (int i = 1; i <= n; i = i * 2) {\n    for (int j = 1; j <= n; j++) {\n        printf("%d %d\\n", i, j);\n    }\n}',
    options: [
      'O(n log n)',
      'O(n²)',
      'O(log n)',
      'O(n)'
    ],
    correctAnswer: 'O(n log n)',
    explanation: 'Outer loop runs log₂(n) times (i doubles: 1,2,4,8,...,n). Inner loop runs n times for each outer iteration. Total: log(n) * n = O(n log n).'
  },
  {
    id: 24,
    type: 'code-body',
    difficulty: 'hard',
    question: 'Which function correctly finds if two sorted lists have a pair that sums to target?',
    code: 'int findPairSum(int A[], int n, int B[], int m, int target) {\n    // Which implementation is correct?\n}',
    options: [
      'int i = 0, j = m - 1;\nwhile (i < n && j >= 0) {\n    int sum = A[i] + B[j];\n    if (sum == target)\n        return 1;\n    else if (sum < target)\n        i++;\n    else\n        j--;\n}\nreturn 0;',
      'for (int i = 0; i < n; i++) {\n    for (int j = 0; j < m; j++) {\n        if (A[i] + B[j] == target)\n            return 1;\n    }\n}\nreturn 0;',
      'int i = 0, j = 0;\nwhile (i < n && j < m) {\n    if (A[i] + B[j] == target)\n        return 1;\n    i++;\n    j++;\n}\nreturn 0;',
      'if (A[0] + B[0] == target)\n    return 1;\nreturn 0;'
    ],
    correctAnswer: 'int i = 0, j = m - 1;\nwhile (i < n && j >= 0) {\n    int sum = A[i] + B[j];\n    if (sum == target)\n        return 1;\n    else if (sum < target)\n        i++;\n    else\n        j--;\n}\nreturn 0;',
    explanation: 'Two-pointer technique: start i at beginning of A, j at end of B. If sum < target, need larger value, increment i. If sum > target, need smaller value, decrement j. O(n+m) time.'
  },
  {
    id: 25,
    type: 'multiple-choice',
    difficulty: 'medium',
    question: 'What does empirical analysis of algorithms involve?',
    options: [
      'Running the algorithm with different inputs and measuring actual execution time',
      'Counting the number of lines of code',
      'Analyzing the algorithm theoretically without implementation',
      'Proving correctness mathematically'
    ],
    correctAnswer: 'Running the algorithm with different inputs and measuring actual execution time',
    explanation: 'Empirical analysis involves implementing the algorithm and measuring its actual performance on various inputs, plotting execution times, and validating theoretical complexity predictions.'
  }
];
