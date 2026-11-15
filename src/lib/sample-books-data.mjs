const sampleBookEntries = [
	{
		title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
		author: 'Robert C. Martin',
		category: 'Programming',
		isbn: '9780132350884',
		quantity: 8,
		description: 'Practical guidance on naming, functions, testing, and maintaining readable software.'
	},
	{
		title: 'The Pragmatic Programmer',
		author: 'Andy Hunt and Dave Thomas',
		category: 'Programming',
		isbn: '9780135957059',
		quantity: 6,
		description: 'A broad collection of practices for adaptable, thoughtful software development.'
	},
	{
		title: 'Code Complete',
		author: 'Steve McConnell',
		category: 'Programming',
		isbn: '9780735619678',
		quantity: 5,
		description: 'A detailed reference on construction practices, design, debugging, and code quality.'
	},
	{
		title: 'Effective Java',
		author: 'Joshua Bloch',
		category: 'Programming',
		isbn: '9780134685991',
		quantity: 7,
		description: 'Java best practices covering APIs, generics, concurrency, and common design choices.'
	},
	{
		title: 'Refactoring: Improving the Design of Existing Code',
		author: 'Martin Fowler',
		category: 'Programming',
		isbn: '0201485672',
		quantity: 4,
		description: 'A catalog of behavior-preserving transformations for improving existing code.'
	},
	{
		title: 'Head First Design Patterns',
		author: 'Eric Freeman, Elisabeth Robson, Kathy Sierra, and Bert Bates',
		category: 'Programming',
		isbn: '9780596007126',
		quantity: 6,
		description: 'An illustrated introduction to reusable object-oriented design patterns.'
	},
	{
		title: 'Structure and Interpretation of Computer Programs',
		author: 'Harold Abelson, Gerald Jay Sussman, and Julie Sussman',
		category: 'Programming',
		isbn: '9780262510875',
		quantity: 3,
		description: 'A classic exploration of abstraction, computation, and programming language concepts.'
	},
	{
		title: 'DEMO - Practical Python Projects for Campus Libraries',
		author: 'BBMS Demo Collection',
		category: 'Programming',
		isbn: '',
		quantity: 9,
		description: 'Fictional demonstration title about building small Python tools for library workflows.'
	},
	{
		title: 'DEMO - C Programming Workshop: From Functions to Files',
		author: 'BBMS Demo Collection',
		category: 'Programming',
		isbn: '',
		quantity: 5,
		description: 'Fictional demonstration title covering C fundamentals through file-based exercises.'
	},
	{
		title: 'DEMO - Java Foundations for Student Developers',
		author: 'BBMS Demo Collection',
		category: 'Programming',
		isbn: '',
		quantity: 12,
		description: 'Fictional demonstration title introducing Java syntax, classes, and simple applications.'
	},
	{
		title: 'Eloquent JavaScript',
		author: 'Marijn Haverbeke',
		category: 'Web Development',
		isbn: '9781593279509',
		quantity: 8,
		description: 'A hands-on introduction to JavaScript, browser programming, and asynchronous code.'
	},
	{
		title: 'DEMO - Building Accessible Websites with HTML and CSS',
		author: 'BBMS Demo Collection',
		category: 'Web Development',
		isbn: '',
		quantity: 10,
		description: 'Fictional demonstration title about semantic markup, accessible forms, and responsive styling.'
	},
	{
		title: 'DEMO - Modern JavaScript Interfaces from the Ground Up',
		author: 'BBMS Demo Collection',
		category: 'Web Development',
		isbn: '',
		quantity: 7,
		description: 'Fictional demonstration title exploring interactive interfaces and browser APIs.'
	},
	{
		title: 'DEMO - Responsive Layout Patterns for Small Screens',
		author: 'BBMS Demo Collection',
		category: 'Web Development',
		isbn: '',
		quantity: 5,
		description: 'Fictional demonstration title focused on fluid grids, breakpoints, and mobile-first design.'
	},
	{
		title: 'DEMO - SvelteKit Applications: Routes, Forms, and Data',
		author: 'BBMS Demo Collection',
		category: 'Web Development',
		isbn: '',
		quantity: 6,
		description: 'Fictional demonstration title introducing route-driven SvelteKit application patterns.'
	},
	{
		title: 'DEMO - Web APIs and Asynchronous JavaScript',
		author: 'BBMS Demo Collection',
		category: 'Web Development',
		isbn: '',
		quantity: 11,
		description: 'Fictional demonstration title about promises, fetch requests, and browser capabilities.'
	},
	{
		title: 'DEMO - Design Systems for Student Web Projects',
		author: 'BBMS Demo Collection',
		category: 'Web Development',
		isbn: '',
		quantity: 4,
		description: 'Fictional demonstration title on reusable interface tokens and consistent component styling.'
	},
	{
		title: 'DEMO - Testing Web Applications in the Browser',
		author: 'BBMS Demo Collection',
		category: 'Web Development',
		isbn: '',
		quantity: 9,
		description: 'Fictional demonstration title covering browser-based interaction and regression testing.'
	},
	{
		title: 'Designing Data-Intensive Applications',
		author: 'Martin Kleppmann',
		category: 'Database Management',
		isbn: '9781449373320',
		quantity: 7,
		description: 'An overview of data systems, storage engines, distributed processing, and reliability.'
	},
	{
		title: 'Database System Concepts',
		author: 'Abraham Silberschatz, Henry F. Korth, and S. Sudarshan',
		category: 'Database Management',
		isbn: '9780078022159',
		quantity: 10,
		description: 'A comprehensive textbook on relational models, query languages, transactions, and design.'
	},
	{
		title: 'SQL Cookbook',
		author: 'Anthony Molinaro',
		category: 'Database Management',
		isbn: '9780596009762',
		quantity: 6,
		description: 'Practical SQL recipes for reporting, aggregation, data conversion, and query problems.'
	},
	{
		title: 'DEMO - Relational Database Design for Community Projects',
		author: 'BBMS Demo Collection',
		category: 'Database Management',
		isbn: '',
		quantity: 5,
		description: 'Fictional demonstration title about modeling entities, keys, and relationships.'
	},
	{
		title: 'DEMO - Transactions, Indexes, and Query Planning',
		author: 'BBMS Demo Collection',
		category: 'Database Management',
		isbn: '',
		quantity: 8,
		description: 'Fictional demonstration title covering ACID transactions, indexing, and query plans.'
	},
	{
		title: 'DEMO - NoSQL Data Modeling in Practice',
		author: 'BBMS Demo Collection',
		category: 'Database Management',
		isbn: '',
		quantity: 4,
		description: 'Fictional demonstration title comparing document-oriented and relational data models.'
	},
	{
		title: 'DEMO - Database Administration Lab Manual',
		author: 'BBMS Demo Collection',
		category: 'Database Management',
		isbn: '',
		quantity: 13,
		description: 'Fictional demonstration title with exercises for backups, access control, and monitoring.'
	},
	{
		title: 'Computer Networking: A Top-Down Approach',
		author: 'James Kurose and Keith Ross',
		category: 'Computer Networking',
		isbn: '9780135415504',
		quantity: 9,
		description: 'A layered introduction to networking protocols, applications, transport, and routing.'
	},
	{
		title: 'Computer Networks',
		author: 'Andrew S. Tanenbaum and David J. Wetherall',
		category: 'Computer Networking',
		isbn: '9780132126953',
		quantity: 7,
		description: 'A broad treatment of network architectures, protocols, wireless systems, and security.'
	},
	{
		title: 'DEMO - Routing and Switching Fundamentals',
		author: 'BBMS Demo Collection',
		category: 'Computer Networking',
		isbn: '',
		quantity: 6,
		description: 'Fictional demonstration title introducing addressing, switching, and route selection.'
	},
	{
		title: 'DEMO - Practical TCP/IP Troubleshooting',
		author: 'BBMS Demo Collection',
		category: 'Computer Networking',
		isbn: '',
		quantity: 8,
		description: 'Fictional demonstration title about diagnosing connectivity and protocol problems.'
	},
	{
		title: 'DEMO - Wireless Networks and Campus Connectivity',
		author: 'BBMS Demo Collection',
		category: 'Computer Networking',
		isbn: '',
		quantity: 5,
		description: 'Fictional demonstration title covering Wi-Fi planning, roaming, and interference.'
	},
	{
		title: 'DEMO - Network Services: DNS, DHCP, and Time',
		author: 'BBMS Demo Collection',
		category: 'Computer Networking',
		isbn: '',
		quantity: 4,
		description: 'Fictional demonstration title exploring common infrastructure services and their operation.'
	},
	{
		title: 'DEMO - Building and Monitoring a Small Network',
		author: 'BBMS Demo Collection',
		category: 'Computer Networking',
		isbn: '',
		quantity: 11,
		description: 'Fictional demonstration title about documenting, monitoring, and maintaining a small network.'
	},
	{
		title: "The Web Application Hacker's Handbook",
		author: 'Dafydd Stuttard and Marcus Pinto',
		category: 'Cybersecurity',
		isbn: '9781118026472',
		quantity: 6,
		description: 'A security reference describing common web application risks and defensive testing concepts.'
	},
	{
		title: 'Security Engineering',
		author: 'Ross J. Anderson',
		category: 'Cybersecurity',
		isbn: '9781119642787',
		quantity: 5,
		description: 'An engineering-focused survey of security systems, threat models, and practical defenses.'
	},
	{
		title: 'DEMO - Secure Coding and Input Validation',
		author: 'BBMS Demo Collection',
		category: 'Cybersecurity',
		isbn: '',
		quantity: 8,
		description: 'Fictional demonstration title on validating untrusted input and avoiding common coding risks.'
	},
	{
		title: 'DEMO - Identity, Sessions, and Access Control',
		author: 'BBMS Demo Collection',
		category: 'Cybersecurity',
		isbn: '',
		quantity: 7,
		description: 'Fictional demonstration title covering authentication flows and least-privilege authorization.'
	},
	{
		title: 'DEMO - Incident Response for Learning Labs',
		author: 'BBMS Demo Collection',
		category: 'Cybersecurity',
		isbn: '',
		quantity: 4,
		description: 'Fictional demonstration title introducing incident triage, evidence handling, and recovery.'
	},
	{
		title: 'DEMO - Applied Cryptography Concepts',
		author: 'BBMS Demo Collection',
		category: 'Cybersecurity',
		isbn: '',
		quantity: 9,
		description: 'Fictional demonstration title explaining encryption, hashes, signatures, and key management.'
	},
	{
		title: 'Introduction to Algorithms',
		author: 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, and Clifford Stein',
		category: 'Algorithms & Data Structures',
		isbn: '9780262033848',
		quantity: 8,
		description: 'A rigorous reference to algorithm design, analysis, data structures, and computational methods.'
	},
	{
		title: 'Algorithms',
		author: 'Robert Sedgewick and Kevin Wayne',
		category: 'Algorithms & Data Structures',
		isbn: '9780321573513',
		quantity: 7,
		description: 'An applied introduction to algorithms, data structures, graph processing, and analysis.'
	},
	{
		title: 'DEMO - Data Structures Through Visual Examples',
		author: 'BBMS Demo Collection',
		category: 'Algorithms & Data Structures',
		isbn: '',
		quantity: 6,
		description: 'Fictional demonstration title illustrating lists, trees, heaps, and hash-based structures.'
	},
	{
		title: 'DEMO - Graph Algorithms for Everyday Problems',
		author: 'BBMS Demo Collection',
		category: 'Algorithms & Data Structures',
		isbn: '',
		quantity: 5,
		description: 'Fictional demonstration title exploring traversal, shortest paths, and graph connectivity.'
	},
	{
		title: 'DEMO - Algorithm Analysis and Problem Solving',
		author: 'BBMS Demo Collection',
		category: 'Algorithms & Data Structures',
		isbn: '',
		quantity: 9,
		description: 'Fictional demonstration title about complexity, recurrences, and choosing efficient approaches.'
	},
	{
		title: 'DEMO - Sorting, Searching, and Selection',
		author: 'BBMS Demo Collection',
		category: 'Algorithms & Data Structures',
		isbn: '',
		quantity: 4,
		description: 'Fictional demonstration title comparing sorting, searching, and order-statistic techniques.'
	},
	{
		title: 'The Elements of Style',
		author: 'William Strunk Jr. and E. B. White',
		category: 'General Education',
		isbn: '9780486447988',
		quantity: 11,
		description: 'A concise guide to clear English usage, composition, and writing style.'
	},
	{
		title: 'A Brief History of Time',
		author: 'Stephen Hawking',
		category: 'General Education',
		isbn: '9780553109535',
		quantity: 6,
		description: 'An accessible introduction to cosmology, space, time, and major questions in physics.'
	},
	{
		title: 'DEMO - Foundations of Critical Thinking',
		author: 'BBMS Demo Collection',
		category: 'General Education',
		isbn: '',
		quantity: 7,
		description: 'Fictional demonstration title on evaluating evidence, arguments, and information sources.'
	},
	{
		title: 'DEMO - Research Skills and Academic Writing',
		author: 'BBMS Demo Collection',
		category: 'General Education',
		isbn: '',
		quantity: 8,
		description: 'Fictional demonstration title covering research questions, citations, and structured essays.'
	},
	{
		title: 'DEMO - Statistics for Informed Citizens',
		author: 'BBMS Demo Collection',
		category: 'General Education',
		isbn: '',
		quantity: 5,
		description: 'Fictional demonstration title introducing data literacy, uncertainty, and statistical reasoning.'
	},
	{
		title: 'DEMO - Communication, Culture, and Society',
		author: 'BBMS Demo Collection',
		category: 'General Education',
		isbn: '',
		quantity: 3,
		description: 'Fictional demonstration title exploring communication, cultural context, and civic participation.'
	}
];

export const sampleBooks = sampleBookEntries.map((book) => ({
	...book,
	available_quantity: book.quantity
}));

/** @param {{ category: string }} book @param {number} index */
export function sampleBookDocumentId(book, index) {
	const category = book.category
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
	return `sample-${category}-${String(index + 1).padStart(2, '0')}`;
}
