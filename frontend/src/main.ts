import './style.css'
import confetti from 'canvas-confetti'
import { formatMessage, type FormatCase } from './utils'

// ----------------------------------------------------
// 1. Theme Management (Light / Dark)
// ----------------------------------------------------
const themeToggleBtn = document.querySelector<HTMLButtonElement>('#theme-toggle');
const htmlElement = document.documentElement;

// Initialize theme from localStorage or system preference
const savedTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
  htmlElement.setAttribute('data-theme', 'dark');
} else {
  htmlElement.setAttribute('data-theme', 'light');
}

themeToggleBtn?.addEventListener('click', () => {
  const currentTheme = htmlElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  htmlElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  
  // Fire subtle confetti on dark mode transition!
  confetti({
    particleCount: 30,
    spread: 40,
    origin: { y: 0.9 }
  });
});


// ----------------------------------------------------
// 2. Typing Greeting Effect
// ----------------------------------------------------
const GREETINGS = [
  "Hello World!",
  "Bonjour le Monde!",
  "¡Hola Mundo!",
  "Hallo Welt!",
  "Ciao Mondo!",
  "Olá Mundo!",
  "Halo Dunia!",
  "Hello, TypeScript!"
];

let greetingIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingDelay = 100;
const erasingDelay = 50;
const newTextDelay = 2000; // Delay between greetings

function typeGreeting() {
  const greetingEl = document.querySelector<HTMLSpanElement>('#greeting-text-content');
  if (!greetingEl) return;

  const currentString = GREETINGS[greetingIndex];
  
  if (isDeleting) {
    greetingEl.textContent = currentString.substring(0, charIndex - 1);
    charIndex--;
  } else {
    greetingEl.textContent = currentString.substring(0, charIndex + 1);
    charIndex++;
  }

  if (!isDeleting && charIndex === currentString.length) {
    isDeleting = true;
    setTimeout(typeGreeting, newTextDelay);
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    greetingIndex = (greetingIndex + 1) % GREETINGS.length;
    setTimeout(typeGreeting, 500);
  } else {
    setTimeout(typeGreeting, isDeleting ? erasingDelay : typingDelay);
  }
}


// ----------------------------------------------------
// 3. Main UI Layout Generation
// ----------------------------------------------------
const appElement = document.querySelector<HTMLDivElement>('#app')!;
appElement.innerHTML = `
  <section class="hero-section">
    <div class="badge-wrapper">
      <span class="ts-badge">Vite + TypeScript + Confetti</span>
    </div>
    <h1 class="hero-title">TypeScript Hello World</h1>
    <p class="hero-subtitle">Step into a type-safe web development experience. Learn TypeScript fundamentals through live interactive compiler simulations below.</p>
  </section>

  <div class="dashboard-grid">
    <!-- Left Column: Interactive Playground -->
    <div class="glass-card">
      <h2 class="card-title">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent);"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>
        TS Interactive Playground
      </h2>
      <p class="card-description">Choose a TypeScript feature, configure the input values, and compile the code to view the live JS runtime response.</p>
      
      <div class="tabs">
        <button class="tab-btn active" data-tab="basic">Basic Greeting</button>
        <button class="tab-btn" data-tab="interface">Interfaces</button>
        <button class="tab-btn" data-tab="generics">Generics</button>
        <button class="tab-btn" data-tab="unions">Union Types</button>
      </div>

      <div class="playground-panel">
        <div class="editor-wrapper">
          <div class="editor-bar">
            <div class="editor-dots">
              <div class="dot dot-red"></div>
              <div class="dot dot-yellow"></div>
              <div class="dot dot-green"></div>
            </div>
            <div class="editor-filename" id="editor-filename">hello.ts</div>
          </div>
          <pre class="code-container"><code id="code-display"></code></pre>
        </div>

        <div class="input-controls" id="input-controls-area">
          <!-- Inputs will be injected here dynamically -->
        </div>

        <div class="action-row">
          <button id="run-btn" class="btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 3 20 12 6 21 6 3"/></svg>
            Compile & Run Code
          </button>
        </div>

        <div class="console-wrapper">
          <div class="console-header">
            <span class="console-green-dot"></span>
            <span>JS Runtime Console</span>
          </div>
          <div class="console-body" id="console-output">
            <div class="console-line info">Vite HMR ready. Playground initialized.</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Column: Interactive Widgets -->
    <div class="right-column">
      <!-- Dynamic Welcome Greeting -->
      <div class="glass-card greeting-display">
        <div class="greeting-text">
          <span id="greeting-text-content">Hello World!</span><span class="cursor"></span>
        </div>
        <div class="time-badge">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <span id="live-time">00:00:00 AM</span>
        </div>
        <button id="confetti-trigger" class="btn-confetti">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
          Celebrate with Confetti!
        </button>
      </div>

      <!-- Stats simulator -->
      <div class="glass-card compiler-stats-widget">
        <h2 class="card-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent);"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
          Compiler Dashboard
        </h2>
        <p class="card-description">Live Vite development and environment telemetry stats.</p>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-value" id="stat-compile">0.02s</span>
            <span class="stat-label">Compile Speed</span>
          </div>
          <div class="stat-item">
            <span class="stat-value" id="stat-errors">0</span>
            <span class="stat-label">Lint Warnings</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">TS 5.4</span>
            <span class="stat-label">SDK Version</span>
          </div>
          <div class="stat-item">
            <span class="stat-value" id="stat-memory">12.4MB</span>
            <span class="stat-label">Heap Memory</span>
          </div>
        </div>
      </div>

      <!-- Features accordion -->
      <div class="glass-card">
        <h2 class="card-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent);"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
          TypeScript Power
        </h2>
        <p class="card-description">Click a core concept below to learn why developers love TypeScript.</p>
        <div class="features-showcase">
          <div class="feature-item" data-feature="types">
            <div class="feature-info">
              <div class="feature-icon-wrapper">🔒</div>
              <span class="feature-name">Static Typing</span>
            </div>
            <span class="feature-chevron">→</span>
          </div>
          <div class="feature-item" data-feature="interfaces">
            <div class="feature-info">
              <div class="feature-icon-wrapper">📇</div>
              <span class="feature-name">Rich Interfaces</span>
            </div>
            <span class="feature-chevron">→</span>
          </div>
          <div class="feature-item" data-feature="generics">
            <div class="feature-info">
              <div class="feature-icon-wrapper">📦</div>
              <span class="feature-name">Reusable Generics</span>
            </div>
            <span class="feature-chevron">→</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Popover Details & Overlay -->
  <div class="popover-overlay" id="popover-overlay"></div>
  <div class="feature-popover" id="feature-popover">
    <div class="popover-header">
      <h3 class="popover-title" id="popover-title">Feature Details</h3>
      <button class="popover-close" id="popover-close-btn" aria-label="Close modal">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div class="popover-body" id="popover-body">Details go here.</div>
    <pre class="popover-code" id="popover-code">Code example here.</pre>
  </div>
`;

// Start greeting animation
typeGreeting();

// Clock animation
function updateClock() {
  const clockEl = document.querySelector<HTMLSpanElement>('#live-time');
  if (clockEl) {
    const now = new Date();
    clockEl.textContent = now.toLocaleTimeString();
  }
}
setInterval(updateClock, 1000);
updateClock();

// Confetti Button event handler
const confettiBtn = document.querySelector<HTMLButtonElement>('#confetti-trigger');
confettiBtn?.addEventListener('click', () => {
  // Fire high energy confetti bursts
  confetti({
    particleCount: 150,
    spread: 80,
    origin: { y: 0.6 }
  });
});


// ----------------------------------------------------
// 4. Interactive Playground Logic
// ----------------------------------------------------
type TabKey = 'basic' | 'interface' | 'generics' | 'unions';

interface PlaygroundTab {
  filename: string;
  codeTemplate: (inputs: Record<string, string>) => string;
  controlsHTML: string;
  getDefaultInputs: () => Record<string, string>;
  execute: (inputs: Record<string, string>) => string;
}

const PLAYGROUND_TABS: Record<TabKey, PlaygroundTab> = {
  basic: {
    filename: 'hello-world.ts',
    getDefaultInputs: () => ({ name: 'World' }),
    controlsHTML: `
      <label class="control-label" for="param-name">Greeting Subject Name</label>
      <input type="text" id="param-name" class="control-input" value="World" placeholder="Enter greeting recipient..." />
    `,
    codeTemplate: (inputs) => {
      const name = inputs.name || 'World';
      return `<span class="keyword">function</span> <span class="function">sayHello</span>(name: <span class="type">string</span>): <span class="type">string</span> {
  <span class="keyword">return</span> <span class="string">\`Hello, \${name}!\`</span>;
}

<span class="keyword">const</span> <span class="variable">message</span> = <span class="function">sayHello</span>(<span class="string">"${name}"</span>);
console.<span class="function">log</span>(<span class="variable">message</span>);`;
    },
    execute: (inputs) => {
      const name = inputs.name || 'World';
      return `Hello, ${name}!`;
    }
  },
  interface: {
    filename: 'developer-greeting.ts',
    getDefaultInputs: () => ({ name: 'Alice', role: 'Developer' }),
    controlsHTML: `
      <label class="control-label" for="param-name">Developer Name</label>
      <input type="text" id="param-name" class="control-input" value="Alice" placeholder="Developer name..." />
      
      <label class="control-label" for="param-role" style="margin-top: 0.5rem;">User Role</label>
      <select id="param-role" class="control-input">
        <option value="Developer">Developer</option>
        <option value="Visitor">Visitor</option>
      </select>
    `,
    codeTemplate: (inputs) => {
      const name = inputs.name || 'Alice';
      const role = inputs.role || 'Developer';
      return `<span class="keyword">interface</span> <span class="type">User</span> {
  name: <span class="type">string</span>;
  role: <span class="string">'Developer' | 'Visitor'</span>;
  lastActive: <span class="type">Date</span>;
}

<span class="keyword">function</span> <span class="function">welcomeUser</span>(user: <span class="type">User</span>): <span class="type">string</span> {
  <span class="keyword">if</span> (user.role === <span class="string">'Developer'</span>) {
    <span class="keyword">return</span> <span class="string">\`Welcome \${user.name}! Enjoy coding with TypeScript!\`</span>;
  }
  <span class="keyword">return</span> <span class="string">\`Hello \${user.name}! Welcome to the interactive portal.\`</span>;
}

<span class="keyword">const</span> <span class="variable">activeUser</span>: <span class="type">User</span> = {
  name: <span class="string">"${name}"</span>,
  role: <span class="string">"${role}"</span>,
  lastActive: <span class="keyword">new</span> <span class="type">Date</span>()
};

console.<span class="function">log</span>(<span class="function">welcomeUser</span>(<span class="variable">activeUser</span>));`;
    },
    execute: (inputs) => {
      const name = inputs.name || 'Alice';
      const role = inputs.role || 'Developer';
      if (role === 'Developer') {
        return `Welcome ${name}! Enjoy coding with TypeScript!`;
      }
      return `Hello ${name}! Welcome to the interactive portal.`;
    }
  },
  generics: {
    filename: 'generic-box.ts',
    getDefaultInputs: () => ({ value: 'Antigravity', type: 'string' }),
    controlsHTML: `
      <label class="control-label" for="param-value">Payload Value</label>
      <input type="text" id="param-value" class="control-input" value="Antigravity" placeholder="Enter payload..." />
      
      <label class="control-label" for="param-type" style="margin-top: 0.5rem;">Generic Type Parameter &lt;T&gt;</label>
      <select id="param-type" class="control-input">
        <option value="string">string</option>
        <option value="number">number</option>
      </select>
    `,
    codeTemplate: (inputs) => {
      const val = inputs.value || 'Antigravity';
      const type = inputs.type || 'string';
      const displayedValue = type === 'number' ? parseFloat(val) || 0 : `"${val}"`;
      return `<span class="keyword">class</span> <span class="type">Box</span>&lt;<span class="type">T</span>&gt; {
  <span class="keyword">private</span> contents: <span class="type">T</span>;

  <span class="keyword">constructor</span>(value: <span class="type">T</span>) {
    <span class="keyword">this</span>.contents = value;
  }

  <span class="function">getContents</span>(): <span class="type">T</span> {
    <span class="keyword">return</span> <span class="keyword">this</span>.contents;
  }
}

<span class="comment">// Instantiated Box &lt;${type}&gt; dynamically</span>
<span class="keyword">const</span> <span class="variable">box</span> = <span class="keyword">new</span> <span class="type">Box</span>&lt;<span class="type">${type}</span>&gt;(${displayedValue});
console.<span class="function">log</span>(<span class="string">\`Box content: \${box.getContents()}\`</span>);`;
    },
    execute: (inputs) => {
      const val = inputs.value || 'Antigravity';
      const type = inputs.type || 'string';
      const parsed = type === 'number' ? (parseFloat(val) || 0).toString() : val;
      return `Box content: ${parsed}`;
    }
  },
  unions: {
    filename: 'union-formatter.ts',
    getDefaultInputs: () => ({ name: 'hello typescript', case: 'uppercase' }),
    controlsHTML: `
      <label class="control-label" for="param-name">Target String</label>
      <input type="text" id="param-name" class="control-input" value="hello typescript" placeholder="Text to transform..." />
      
      <label class="control-label" for="param-case" style="margin-top: 0.5rem;">Format Case Style</label>
      <select id="param-case" class="control-input">
        <option value="uppercase">uppercase</option>
        <option value="lowercase">lowercase</option>
        <option value="titlecase">titlecase</option>
      </select>
    `,
    codeTemplate: (inputs) => {
      const name = inputs.name || 'hello typescript';
      const formatCase = inputs.case || 'uppercase';
      return `<span class="keyword">type</span> <span class="type">FormatCase</span> = <span class="string">'uppercase' | 'lowercase' | 'titlecase'</span>;

<span class="keyword">function</span> <span class="function">formatMessage</span>(msg: <span class="type">string</span>, format: <span class="type">FormatCase</span>): <span class="type">string</span> {
  <span class="keyword">switch</span>(format) {
    <span class="keyword">case</span> <span class="string">'uppercase'</span>: <span class="keyword">return</span> msg.<span class="function">toUpperCase</span>();
    <span class="keyword">case</span> <span class="string">'lowercase'</span>: <span class="keyword">return</span> msg.<span class="function">toLowerCase</span>();
    <span class="keyword">case</span> <span class="string">'titlecase'</span>: 
      <span class="keyword">return</span> msg
        .<span class="function">split</span>(<span class="string">' '</span>)
        .<span class="function">map</span>(w =&gt; w.<span class="function">charAt</span>(<span class="number">0</span>).<span class="function">toUpperCase</span>() + w.<span class="function">slice</span>(<span class="number">1</span>))
        .<span class="function">join</span>(<span class="string">' '</span>);
  }
}

console.<span class="function">log</span>(<span class="function">formatMessage</span>(<span class="string">"${name}"</span>, <span class="string">"${formatCase}"</span>));`;
    },
    execute: (inputs) => {
      const name = inputs.name || 'hello typescript';
      const formatCase = (inputs.case || 'uppercase') as FormatCase;
      return formatMessage(name, formatCase);
    }
  }
};

let activeTabKey: TabKey = 'basic';
let activeInputs: Record<string, string> = PLAYGROUND_TABS.basic.getDefaultInputs();

// Set up UI components based on selected tab
function renderPlayground() {
  const currentTab = PLAYGROUND_TABS[activeTabKey];
  
  // Set filename
  const filenameEl = document.querySelector('#editor-filename');
  if (filenameEl) filenameEl.textContent = currentTab.filename;
  
  // Render syntax-highlighted code
  const codeDisplayEl = document.querySelector('#code-display');
  if (codeDisplayEl) codeDisplayEl.innerHTML = currentTab.codeTemplate(activeInputs);
  
  // Inject custom inputs
  const controlsEl = document.querySelector('#input-controls-area');
  if (controlsEl) {
    controlsEl.innerHTML = currentTab.controlsHTML;
    
    // Bind change listeners to input elements to update live code template
    const inputs = controlsEl.querySelectorAll<HTMLInputElement | HTMLSelectElement>('.control-input');
    inputs.forEach(input => {
      // Bind pre-fill values from activeInputs
      const id = input.id;
      const key = id.replace('param-', '');
      if (activeInputs[key]) {
        input.value = activeInputs[key];
      }

      input.addEventListener('input', () => {
        activeInputs[key] = input.value;
        // Re-render code snippet real-time
        if (codeDisplayEl) codeDisplayEl.innerHTML = currentTab.codeTemplate(activeInputs);
      });

      input.addEventListener('change', () => {
        activeInputs[key] = input.value;
        if (codeDisplayEl) codeDisplayEl.innerHTML = currentTab.codeTemplate(activeInputs);
      });
    });
  }
}

// Bind tabs click event listeners
const tabButtons = document.querySelectorAll<HTMLButtonElement>('.tab-btn');
tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    // Remove active class
    tabButtons.forEach(b => b.classList.remove('active'));
    // Add active class to clicked button
    btn.classList.add('active');
    
    const targetTab = btn.getAttribute('data-tab') as TabKey;
    activeTabKey = targetTab;
    
    // Initialize defaults
    activeInputs = PLAYGROUND_TABS[targetTab].getDefaultInputs();
    
    renderPlayground();
    
    // Log tab change in Simulated Console
    logConsole(`Changed namespace to ${PLAYGROUND_TABS[targetTab].filename}`, 'info');
  });
});

// Compile and Run Code Action
const runBtn = document.querySelector<HTMLButtonElement>('#run-btn');
const consoleOutputEl = document.querySelector<HTMLDivElement>('#console-output');

function logConsole(message: string, type: 'success' | 'info' | 'error' = 'success') {
  if (!consoleOutputEl) return;
  const line = document.createElement('div');
  line.className = `console-line ${type}`;
  line.textContent = `[${new Date().toLocaleTimeString()}] ${type === 'success' ? '✓' : type === 'error' ? '✗' : 'i'} ${message}`;
  consoleOutputEl.appendChild(line);
  consoleOutputEl.scrollTop = consoleOutputEl.scrollHeight;
}

runBtn?.addEventListener('click', () => {
  const currentTab = PLAYGROUND_TABS[activeTabKey];
  
  // Simulated compile effect
  runBtn.disabled = true;
  const originalText = runBtn.innerHTML;
  runBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s infinite linear;"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>
    Compiling...
  `;

  // Simulate compiler telemetry fluctuations
  const compileTime = (Math.random() * 0.05 + 0.01).toFixed(3);
  const memoryUsage = (Math.random() * 5 + 10).toFixed(1);
  
  setTimeout(() => {
    // Restore button state
    runBtn.disabled = false;
    runBtn.innerHTML = originalText;
    
    // Execute output
    const output = currentTab.execute(activeInputs);
    logConsole(output, 'success');
    
    // Update stats widgets
    const compileSpeedEl = document.querySelector('#stat-compile');
    const heapMemoryEl = document.querySelector('#stat-memory');
    if (compileSpeedEl) compileSpeedEl.textContent = `${compileTime}s`;
    if (heapMemoryEl) heapMemoryEl.textContent = `${memoryUsage}MB`;
    
    // Celebrate successful compilation!
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 }
    });
  }, 450);
});

// Add spin animation CSS in JS dynamically to avoid clutter
const style = document.createElement('style');
style.textContent = `
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
`;
document.head.appendChild(style);

// Initialize playground on load
renderPlayground();


// ----------------------------------------------------
// 5. Feature Information Modal (Popover)
// ----------------------------------------------------
const overlay = document.querySelector<HTMLDivElement>('#popover-overlay')!;
const popover = document.querySelector<HTMLDivElement>('#feature-popover')!;
const popoverTitle = document.querySelector<HTMLHeadingElement>('#popover-title')!;
const popoverBody = document.querySelector<HTMLDivElement>('#popover-body')!;
const popoverCode = document.querySelector<HTMLPreElement>('#popover-code')!;
const popoverCloseBtn = document.querySelector<HTMLButtonElement>('#popover-close-btn')!;

interface FeatureDetails {
  title: string;
  body: string;
  code: string;
}

const FEATURE_DATA: Record<string, FeatureDetails> = {
  types: {
    title: 'Static Typing System',
    body: 'By specifying types for your variables, function arguments, and return objects, TypeScript detects errors during design time before you load your code in the browser. It gives you immediate code completion and prevents runtime bugs such as null dereferences.',
    code: `let greeting: string = "Hello World";
// Compiler Error: Type 'number' is not assignable to type 'string'
greeting = 42;`
  },
  interfaces: {
    title: 'Structural Interfaces',
    body: 'Interfaces describe the shape of complex objects. TypeScript uses structural typing (duck typing), meaning as long as an object matches the properties defined by the interface, it is accepted. This permits rapid design modeling without rigid class hierarchies.',
    code: `interface Profile {
  username: string;
  admin: boolean;
}

function printRole(p: Profile) {
  console.log(p.username + " is admin: " + p.admin);
}`
  },
  generics: {
    title: 'Reusable Generics',
    body: 'Generics are templates that allow components to work over a variety of types rather than a single one. This maintains strong type-safety while supporting flexible inputs, making objects reusable and scalable across your application.',
    code: `function identity<T>(arg: T): T {
  return arg;
}

const outputString = identity<string>("hello");
const outputNumber = identity<number>(100);`
  }
};

const featureItems = document.querySelectorAll<HTMLDivElement>('.feature-item');
featureItems.forEach(item => {
  item.addEventListener('click', () => {
    const featureKey = item.getAttribute('data-feature');
    if (!featureKey || !FEATURE_DATA[featureKey]) return;
    
    const details = FEATURE_DATA[featureKey];
    popoverTitle.textContent = details.title;
    popoverBody.textContent = details.body;
    popoverCode.textContent = details.code;
    
    overlay.classList.add('active');
    popover.classList.add('active');
  });
});

function closePopover() {
  overlay.classList.remove('active');
  popover.classList.remove('active');
}

popoverCloseBtn.addEventListener('click', closePopover);
overlay.addEventListener('click', closePopover);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closePopover();
});
