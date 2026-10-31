export type Project = {
  id: string;
  title: string;
  client: string;
  category: string;
  summary: string;
  points: string[];
  outcome: string;
  stack: string[];
  image?: string;
  url?: string;
  repo?: string;
};

export type Role = {
  title: string;
  company: string;
  period: string;
  points: string[];
};

export const profile = {
  name: "Shoubhik Pan",
  role: "Full Stack Developer",
  metaDescription:
    "Full stack developer with 4 years of experience. CRM systems, e-commerce, recruitment, and referral platforms with Next.js, Node.js, PostgreSQL, and Redis.",
  quote: "Scalable, high-performance web applications.",
  summary:
    "Full stack developer with 4 years of experience. 10+ enterprise systems used by clients, plus e-commerce, recruitment, and referral platforms. Frontend with React, Next.js, and Tailwind CSS. Backend with Node.js, PostgreSQL, and Redis.",
  about: [
    "I build scalable, high-performance web applications and take them through to delivery. That includes REST APIs, database architecture, and the interface on top.",
    "I have delivered 10+ enterprise systems used by clients, an e-commerce product with an admin panel, a recruitment system, and a referral platform with queued payouts. I currently lead development at AIdeas Tech Solutions: task assignment, sprint planning, and technical design.",
    "Day to day I use Claude and Cursor to plan and implement complex work, alongside Git, PostgreSQL, and the rest of the stack below.",
  ],
  facts: [
    { label: "Role", value: "Software Developer & Team Lead" },
    { label: "Experience", value: "4 years" },
    { label: "Now", value: "AIdeas Tech Solutions" },
    {
      label: "Education",
      value:
        "B.Tech CSE, Malla Reddy College of Engineering and Technology, Hyderabad, 2018–2022",
    },
  ],
  email: "shoubhikpan2015@gmail.com",
  phone: "+91 9100493743",
  phoneHref: "tel:+919100493743",
  github: "https://github.com/shoubhik18",
  linkedin: "https://www.linkedin.com/in/shoubhik-pan/",
  skills: [
    {
      title: "Frontend",
      detail: "Interfaces for product and internal tools.",
      items: [
        "HTML",
        "CSS",
        "JavaScript",
        "TypeScript",
        "React",
        "Next.js",
        "Angular",
        "Tailwind CSS",
        "Bootstrap",
      ],
    },
    {
      title: "Backend",
      detail: "APIs, services, and the jobs behind them.",
      items: [
        "Node.js",
        "NestJS",
        "Next.js",
        "Java",
        "Spring Boot",
        "REST APIs",
        "Maven",
      ],
    },
    {
      title: "Databases",
      detail: "Schema design and the stores those APIs use.",
      items: ["PostgreSQL", "MySQL", "MongoDB", "Supabase", "Redis"],
    },
  ],
  tools: [
    "Git & GitHub",
    "Vercel",
    "Postman",
    "BullMQ",
    "Cursor",
    "Claude",
    "OpenAI",
  ],
  softSkills: "Communication, team collaboration, adaptability, and proactive learning.",
};

export const projects: Project[] = [
  {
    id: "crm",
    title: "CRM system",
    client: "Nagarjuna Steels",
    category: "Product modules",
    summary:
      "User and contact modules for a customer relationship system, with full create, read, update, and delete flows wired to the API.",
    points: [
      "Built the user module and the contact module, each with complete CRUD.",
      "Integrated the frontend with backend APIs so the two modules share one data flow.",
      "Worked with the team on module integration and testing.",
      "Version control with Git: add, commit, push, pull, and merge.",
      "Used ChatGPT 3.5 while implementing the modules and working through hard spots.",
    ],
    outcome: "User and contact modules shipping against a PostgreSQL API, with AG Grid in the interface.",
    stack: ["Next.js", "Node.js", "AG Grid", "PostgreSQL"],
    image: "/projects/project-crm.jpg",
  },
  {
    id: "loam",
    title: "Loam and Root",
    client: "E-commerce",
    category: "Commerce product",
    summary:
      "A full e-commerce application: catalog, cart, checkout, orders, payments, and an admin panel. I owned architecture, both sides of the stack, and the client demos.",
    points: [
      "Designed and built the store: products, cart, checkout, orders, payments, and admin.",
      "Handled architecture, frontend, backend, and the iteration after client demos.",
      "Admin covers product management, order history, and users.",
      "Used Cursor with Claude 4 Sonnet for the heavier features and for debugging.",
    ],
    outcome: "Storefront and admin on Next.js, with Supabase behind the data and auth.",
    stack: ["Next.js", "Supabase"],
    image: "/projects/project-loam-root.jpg",
  },
  {
    id: "rms",
    title: "Recruitment system",
    client: "Hawksense",
    category: "Hiring platform",
    summary:
      "Candidates, job openings, and companies, each with full CRUD, in a responsive interface built around AG Grid.",
    points: [
      "Built the candidates, job openings, and companies modules with full CRUD.",
      "Frontend in React, Next.js, Tailwind CSS, and AG Grid.",
      "Used Cursor with Claude 3.5 to move the implementation along.",
      "Managed the work in Git, pushed to GitHub, and handled merges.",
    ],
    outcome: "Three hiring modules on Next.js and Node.js, stored in PostgreSQL.",
    stack: ["Next.js", "Node.js", "AG Grid", "PostgreSQL"],
    image: "/projects/project-rms.jpg",
  },
  {
    id: "mlm",
    title: "MLM platform",
    client: "AIdeas Tech Solutions",
    category: "Referral system",
    summary:
      "A referral platform with multi-tier commissions, a user hierarchy, and payout calculations, with the heavy work moved onto a Redis queue.",
    points: [
      "Built multi-tier commission tracking, hierarchy management, and payout calculations.",
      "Designed the PostgreSQL schema and the background jobs.",
      "Queue processing with BullMQ and Redis so payouts are not computed inside the request.",
      "Led the cycle from requirements and architecture through delivery.",
    ],
    outcome: "Hierarchy and commissions in PostgreSQL, with BullMQ and Redis carrying the queue.",
    stack: ["Next.js", "Node.js", "PostgreSQL", "Redis", "BullMQ"],
    image: "/projects/project-mlm.jpg",
  },
];

export const roles: Role[] = [
  {
    title: "Software Developer & Team Lead",
    company: "AIdeas Tech Solutions Pvt Ltd",
    period: "Jan 2026 – Present",
    points: [
      "Leading the team: assigning tasks, explaining requirements, and running sprint planning and delivery.",
      "Designing database architecture and the technical decisions across projects.",
      "Delivered a multi-level marketing platform with multi-tier commissions and queue-based processing.",
      "Using Claude and Cursor for planning and for the harder features.",
    ],
  },
  {
    title: "Product Developer",
    company: "KDigital Technologies Pvt Ltd",
    period: "Jan 2025 – Jan 2026",
    points: [
      "Ran planning, meetings, task assignment, and oversight across the development team.",
      "Delivered Loam and Root, an e-commerce application with frontend, backend, and an admin panel.",
      "Owned architecture, implementation, and the client demos.",
      "Built a real-time rental management application for tenants and landlords.",
      "Used ChatGPT and Cursor for day-to-day development and planning.",
      "Handled developer syncs, sprint planning, client meetings, and deliveries on other projects.",
    ],
  },
  {
    title: "Full Stack Developer",
    company: "Digital Edify Technologies Pvt Ltd",
    period: "Oct 2023 – Jan 2025",
    points: [
      "Built responsive UI with React, Next.js, and Tailwind CSS.",
      "Built and consumed REST APIs with Node.js and Java Spring Boot.",
      "Integrated Auth0 for authentication and role-based access.",
      "Worked with third-party APIs, including OYO and Airbnb, for data aggregation.",
      "Used ChatGPT and Cursor for development support and planning.",
      "Wrote maintainable code with the team: features, fixes, and performance.",
    ],
  },
  {
    title: "Web / IT Intern",
    company: "BASKETHUNT Pvt Ltd",
    period: "Aug 2023 – Oct 2023",
    points: [
      "Led the HRMS frontend: dashboard, login and logout, and session management with HTML, CSS, and JavaScript.",
      "Integrated Rocket.Chat for internal communication.",
      "Built a browser extension with facial-recognition unlock and a PIN fallback.",
    ],
  },
  {
    title: "Project Engineer / Intern",
    company: "Wipro",
    period: "Feb 2022 – Feb 2023",
    points: [
      "Training: 4 months in C++, then about 3 months in Java, J2EE, and Spring Boot.",
      "Contributed to an electronic voting system with role-based access, using Spring Boot and MySQL.",
      "Cleared internal certifications and joined team development and code reviews.",
    ],
  },
];
