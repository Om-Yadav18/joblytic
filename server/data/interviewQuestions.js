// Static local database of interview questions to avoid Gemini API quota usage

export const localInterviewQuestions = {
  'DSA': {
    beginner: [
      {
        question: 'What is an Array? How is it different from a Linked List?',
        idealAnswer: 'An array stores elements in contiguous memory locations, allowing O(1) access. A linked list stores elements as nodes with pointers, allowing O(1) insertion/deletion but O(n) access.',
        keywords: ['contiguous', 'memory', 'nodes', 'pointer', 'access', 'insertion']
      },
      {
        question: 'Explain the concept of Big O notation with a simple example.',
        idealAnswer: 'Big O notation describes the upper bound of an algorithm\'s time or space complexity. For example, accessing an array element by index is O(1) (constant time), while iterating through an array is O(n) (linear time).',
        keywords: ['complexity', 'time', 'space', 'upper bound', 'constant', 'linear', 'performance']
      },
      {
        question: 'What is a Stack? Name two real-world applications of a Stack.',
        idealAnswer: 'A Stack is a LIFO (Last-In-First-Out) data structure. Real-world applications include the browser back button history, undo mechanisms in text editors, and call stack in programming.',
        keywords: ['lifo', 'last', 'first', 'undo', 'call stack', 'browser', 'history']
      }
    ],
    intermediate: [
      {
        question: 'Explain the difference between Quick Sort and Merge Sort. Which one would you prefer and why?',
        idealAnswer: 'Quick Sort is an in-place sorting algorithm with O(n log n) average time complexity but O(n^2) worst-case. Merge Sort is a stable, out-of-place algorithm with guaranteed O(n log n) time. I would prefer Quick Sort for arrays due to less memory usage, but Merge Sort for linked lists or when stability is required.',
        keywords: ['in-place', 'stable', 'complexity', 'average', 'worst-case', 'memory', 'arrays']
      },
      {
        question: 'What is a Hash Table and how does it handle collisions?',
        idealAnswer: 'A Hash Table uses a hash function to map keys to indices. Collisions occur when different keys hash to the same index. They are handled using techniques like Chaining (using linked lists at each index) or Open Addressing (finding the next empty slot).',
        keywords: ['hash function', 'keys', 'indices', 'chaining', 'open addressing', 'map']
      },
      {
        question: 'Explain Breadth-First Search (BFS) and Depth-First Search (DFS) on a Graph.',
        idealAnswer: 'BFS explores a graph level by level using a Queue, making it ideal for finding the shortest path in unweighted graphs. DFS explores as far down a branch as possible using a Stack or recursion, useful for cycle detection and pathfinding.',
        keywords: ['queue', 'stack', 'recursion', 'level', 'shortest path', 'branch', 'cycle']
      }
    ],
    advanced: [
      {
        question: 'Explain Dijkstra’s algorithm for finding the shortest path. How does it handle negative weights?',
        idealAnswer: 'Dijkstra’s algorithm finds the shortest path from a source to all other nodes using a priority queue. It assumes all weights are non-negative. It fails with negative weights because once a node is marked visited, its shortest path is considered final. Bellman-Ford should be used for negative weights.',
        keywords: ['priority queue', 'shortest path', 'non-negative', 'bellman-ford', 'visited', 'weights']
      },
      {
        question: 'How would you implement an LRU cache?',
        idealAnswer: 'An LRU (Least Recently Used) cache can be implemented efficiently using a combination of a Hash Map and a Doubly Linked List. The Hash Map provides O(1) access to items, and the Doubly Linked List allows O(1) removal of the oldest item and insertion of new items at the front.',
        keywords: ['hash map', 'doubly linked list', 'o(1)', 'removal', 'insertion', 'least recently']
      }
    ]
  },
  'Web Development': {
    beginner: [
      {
        question: 'What is the difference between let, const, and var in JavaScript?',
        idealAnswer: '"var" is function-scoped and hoisted. "let" and "const" are block-scoped. "let" allows reassignment, whereas "const" does not allow reassignment (though properties of const objects can be modified).',
        keywords: ['function-scoped', 'block-scoped', 'hoisted', 'reassignment', 'scope']
      },
      {
        question: 'Explain the CSS box model.',
        idealAnswer: 'The CSS box model describes the rectangular boxes generated for elements. It consists of the content area, padding (space inside border), border, and margin (space outside border).',
        keywords: ['content', 'padding', 'border', 'margin', 'space']
      }
    ],
    intermediate: [
      {
        question: 'Explain the concept of closures in JavaScript with an example.',
        idealAnswer: 'A closure is a function that remembers its outer lexical environment even after the outer function has returned. For example, a function returning another function that accesses a variable from the parent function scope.',
        keywords: ['lexical', 'environment', 'scope', 'remembers', 'outer function', 'parent']
      },
      {
        question: 'What are Promises in JavaScript and how do they differ from callbacks?',
        idealAnswer: 'Promises represent the eventual completion or failure of an asynchronous operation. They prevent "callback hell" by allowing chaining with .then() and .catch(), resulting in cleaner and more manageable asynchronous code compared to nested callbacks.',
        keywords: ['asynchronous', 'completion', 'failure', 'chaining', 'callback hell', 'then', 'catch']
      }
    ],
    advanced: [
      {
        question: 'Explain how the JavaScript Event Loop works (Call Stack, Web APIs, Microtask Queue, Macrotask Queue).',
        idealAnswer: 'The Event Loop constantly checks the Call Stack. If empty, it pushes tasks from the queues. Microtasks (Promises) have higher priority and are executed before Macrotasks (setTimeout). Web APIs handle async operations outside the JS engine.',
        keywords: ['call stack', 'microtask', 'macrotask', 'promises', 'settimeout', 'priority']
      },
      {
        question: 'Explain Server-Side Rendering (SSR) vs Client-Side Rendering (CSR).',
        idealAnswer: 'SSR generates HTML on the server for each request, offering better SEO and faster initial load. CSR sends a bare HTML file and JavaScript bundle, rendering content in the browser, providing smoother interactions but slower initial load.',
        keywords: ['server', 'browser', 'html', 'seo', 'initial load', 'javascript bundle', 'interactions']
      }
    ]
  },
  'React': {
    beginner: [
      {
        question: 'What is the Virtual DOM in React and why is it used?',
        idealAnswer: 'The Virtual DOM is a lightweight JavaScript representation of the actual DOM. React uses it to batch updates. It compares the new Virtual DOM with the previous one (diffing) and only updates the changed parts in the real DOM, improving performance.',
        keywords: ['representation', 'batch', 'diffing', 'performance', 'real dom', 'updates']
      },
      {
        question: 'What are React Hooks? Name a few common ones.',
        idealAnswer: 'Hooks are functions that let you use state and lifecycle features in functional components. Common ones include useState for state management, useEffect for side effects, and useContext for accessing context.',
        keywords: ['functional components', 'state', 'lifecycle', 'usestate', 'useeffect', 'side effects']
      }
    ],
    intermediate: [
      {
        question: 'Explain the useEffect hook and its dependency array.',
        idealAnswer: 'useEffect is used for side effects like data fetching or subscriptions. The dependency array dictates when the effect runs: if empty, it runs once on mount; if omitted, it runs on every render; if it has variables, it runs when those variables change.',
        keywords: ['side effects', 'mount', 'render', 'variables', 'fetching', 'subscriptions']
      },
      {
        question: 'How do you manage global state in a large React application?',
        idealAnswer: 'Global state can be managed using React Context API for simpler apps, or state management libraries like Redux, Zustand, or Recoil for complex apps. These prevent prop drilling by providing a centralized store.',
        keywords: ['context api', 'redux', 'zustand', 'prop drilling', 'centralized store', 'management']
      }
    ],
    advanced: [
      {
        question: 'How does React memoization work? When would you use useMemo and useCallback?',
        idealAnswer: 'Memoization caches results to prevent unnecessary re-renders. useMemo caches the result of an expensive calculation, while useCallback caches a function definition. They should be used to prevent child components from re-rendering unnecessarily.',
        keywords: ['caches', 're-renders', 'expensive calculation', 'function definition', 'prevent', 'child components']
      },
      {
        question: 'Explain React Server Components (RSC) and how they differ from SSR.',
        idealAnswer: 'React Server Components render exclusively on the server and send zero JavaScript to the client, reducing bundle size. Unlike SSR, which sends HTML and hydrates it with JS, RSCs are streamed as a special JSON format and do not need hydration.',
        keywords: ['server', 'zero javascript', 'bundle size', 'hydration', 'streamed', 'json format']
      }
    ]
  },
  'Node.js': {
    beginner: [
      {
        question: 'What is Node.js and what is it used for?',
        idealAnswer: 'Node.js is a JavaScript runtime built on Chrome\'s V8 engine. It allows developers to run JavaScript on the server side, making it ideal for building scalable network applications and RESTful APIs.',
        keywords: ['runtime', 'v8 engine', 'server side', 'scalable', 'apis', 'network applications']
      },
      {
        question: 'What is npm?',
        idealAnswer: 'npm (Node Package Manager) is the default package manager for Node.js. It allows developers to install, share, and manage project dependencies and open-source packages.',
        keywords: ['package manager', 'dependencies', 'install', 'share', 'open-source']
      }
    ],
    intermediate: [
      {
        question: 'Explain the concept of Event-Driven Architecture in Node.js.',
        idealAnswer: 'Node.js heavily relies on events. Objects called "emitters" emit named events that cause previously registered "listeners" (callbacks) to be called. This architecture powers the asynchronous nature of Node.js.',
        keywords: ['events', 'emitters', 'listeners', 'callbacks', 'asynchronous']
      },
      {
        question: 'What are Streams in Node.js?',
        idealAnswer: 'Streams are objects that let you read data from a source or write data to a destination in continuous fashion. They handle data chunk by chunk, making them memory efficient for large files.',
        keywords: ['continuous', 'chunk by chunk', 'memory efficient', 'large files', 'read', 'write']
      }
    ],
    advanced: [
      {
        question: 'How does Node.js handle concurrency despite being single-threaded?',
        idealAnswer: 'Node.js uses an event-driven, non-blocking I/O model. While the main JavaScript execution is single-threaded, it delegates blocking operations (like file I/O or network requests) to the OS or a thread pool via libuv. When finished, callbacks are pushed to the Event Loop.',
        keywords: ['event-driven', 'non-blocking i/o', 'libuv', 'thread pool', 'event loop', 'callbacks']
      },
      {
        question: 'Explain the difference between spawn, exec, and fork in Node.js child processes.',
        idealAnswer: 'spawn launches a new process with a stream interface. exec runs a command in a shell and buffers the output. fork is a special case of spawn that creates a V8 instance and establishes an IPC channel for message passing between parent and child.',
        keywords: ['stream interface', 'shell', 'buffers', 'v8 instance', 'ipc channel', 'message passing']
      }
    ]
  },
  'HR Interview': {
    beginner: [
      {
        question: 'Tell me about yourself.',
        idealAnswer: 'I am a passionate software engineer with experience in building web applications. I enjoy solving complex problems, learning new technologies, and collaborating with cross-functional teams to deliver value.',
        keywords: ['passionate', 'experience', 'solving problems', 'technologies', 'collaborating', 'value']
      },
      {
        question: 'What are your greatest strengths and weaknesses?',
        idealAnswer: 'My strength is my ability to quickly learn new concepts and adapt to changes. My weakness is that I sometimes focus too much on details, but I am learning to prioritize tasks better using time-boxing techniques.',
        keywords: ['learn quickly', 'adapt', 'focus on details', 'prioritize', 'time-boxing']
      }
    ],
    intermediate: [
      {
        question: 'Describe a time you faced a significant challenge at work and how you overcame it.',
        idealAnswer: 'I once faced a critical bug in production right before a launch. I stayed calm, isolated the issue using logs, communicated the status to stakeholders, and implemented a hotfix while pairing with a senior engineer.',
        keywords: ['critical bug', 'calm', 'isolated', 'logs', 'communicated', 'hotfix']
      },
      {
        question: 'How do you handle conflict with a team member?',
        idealAnswer: 'I handle conflict by addressing it directly and privately. I listen actively to understand their perspective, share my viewpoint respectfully, and aim for a collaborative solution that benefits the project.',
        keywords: ['directly', 'privately', 'listen actively', 'perspective', 'collaborative solution']
      }
    ],
    advanced: [
      {
        question: 'How do you balance technical debt with shipping features quickly?',
        idealAnswer: 'I believe in practical trade-offs. I advocate for shipping an MVP quickly to gather user feedback, but I document technical debt and negotiate with product managers to allocate 15-20% of sprint capacity to refactoring and debt reduction.',
        keywords: ['trade-offs', 'mvp', 'feedback', 'document', 'negotiate', 'capacity', 'refactoring']
      }
    ]
  }
};

/**
 * Fetch a random set of question objects from the local database
 */
export const getLocalQuestions = (category, difficulty, count = 5) => {
  // Map categories to match keys in the data
  let catKey = category;
  if (!localInterviewQuestions[catKey]) {
    // try case insensitive
    const found = Object.keys(localInterviewQuestions).find(k => k.toLowerCase() === category.toLowerCase());
    catKey = found || 'Web Development';
  }
  
  const diffKey = localInterviewQuestions[catKey][difficulty] ? difficulty : 'intermediate';
  const pool = localInterviewQuestions[catKey][diffKey];
  
  // Shuffle and pick
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

/**
 * Get question object by exactly matching the question string
 */
export const getQuestionObjectByString = (questionString) => {
  for (const category of Object.values(localInterviewQuestions)) {
    for (const diffPool of Object.values(category)) {
      const found = diffPool.find(q => q.question === questionString);
      if (found) return found;
    }
  }
  return null;
};
