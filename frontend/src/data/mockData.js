export const initialUsers = {
  ethanwong: {
    id: 'u1',
    username: 'ethanwong',
    displayName: 'Ethan Wong',
    avatar: 'E',
    avatarUrl: null,
    bio: 'Full stack builder. Passionate about decentralization, web3 technologies, and rust development.',
    location: 'Vancouver, BC',
    role: 'Core Developer',
    email: 'ethanwong@meetifyy.app',
    followingList: ['zoemiller', 'kabirverma', 'sophiali'],
    followersList: ['zoemiller', 'kabirverma', 'sophiali', 'liamdavies', 'emmawatson', 'lucasgray', 'hannahkim', 'student'],
    followers: 9400,
    following: 180,
    communities: ['Robotics Alliance', 'Sustainability Guild'],
    course: 'B.Sc Computer Science',
    year: '4th Year',
    collegeId: 'gla',
    verified: true,
    interests: ['Rust', 'Blockchain', 'Distributed Systems', 'Cryptography', 'P2P networks'],
    skills: ['Rust', 'Go', 'React', 'Solidity', 'Linux Systems', 'Docker', 'Kubernetes'],
    projects: [
      {
        id: 'proj_1',
        title: 'DeChat',
        description: 'A completely decentralized, end-to-end encrypted messaging protocol built on top of WebRTC.',
        technologies: ['Rust', 'WebRTC', 'WASM', 'TypeScript'],
        image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&h=400&fit=crop',
        link: '#',
        type: 'Project'
      },
      {
        id: 'proj_2',
        title: 'ChainKeep',
        description: 'Multi-signature smart contract wallet for secure institutional custody of digital assets.',
        technologies: ['Solidity', 'Hardhat', 'Next.js', 'Ethers.js'],
        image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop',
        link: '#',
        type: 'Hackathon Project'
      }
    ],
    achievements: [
      { id: 'ach_1', title: 'Solana Hackathon Grand Prize', description: 'Won first prize for decentralized storage layer', icon: '🏆', date: 'May 2025' },
      { id: 'ach_2', title: 'Open Source Contributor', description: 'Main contributor to a major libp2p implementation', icon: '💻', date: 'Feb 2025' },
      { id: 'ach_3', title: 'Top Leaderboard', description: 'Ranked top developer in Robotics Alliance', icon: '⭐', date: 'Jan 2025' }
    ],
    activityLog: [
      { type: 'post', text: 'Released DeChat open beta version', icon: '🚀', time: '1 hour ago', link: '#' },
      { type: 'join', text: 'Joined Sustainability Guild', icon: '🎉', time: '4 days ago', link: '/communities/sustainability' },
      { type: 'milestone', text: 'Exceeded 9k followers milestone', icon: '🌟', time: '2 weeks ago', link: '#' }
    ],
    socialLinks: {
      github: 'https://github.com/ethanwong',
      linkedin: 'https://linkedin.com/in/ethanwong',
      twitter: 'https://twitter.com/ethanwong'
    },
    communitiesJoined: 4,
    eventsAttended: 10,
    connectionsMade: 52,
    projectsShared: 6,
    postsThisMonth: 15,
    profileVisitsThisWeek: 64,
    newConnectionsThisWeek: 5,
    recentlyActive: true,
    memberSince: 'Sep 2023'
  },
  zoemiller: {
    id: 'u2',
    username: 'zoemiller',
    displayName: 'Zoe Miller',
    avatar: 'Z',
    avatarUrl: null,
    bio: 'Product Designer. Focused on immersive design, glassmorphism, and clean interfaces.',
    location: 'Portland, OR',
    role: 'Creative Lead',
    email: 'zoemiller@meetifyy.app',
    followingList: ['ethanwong', 'emmawatson', 'kabirverma'],
    followersList: ['ethanwong', 'kabirverma', 'liamdavies', 'emmawatson', 'hannahkim', 'student'],
    followers: 6100,
    following: 290,
    communities: ['Creative Studio', 'IIT Delhi', 'Robotics Alliance'],
    course: 'B.Des Interaction Design',
    year: '3rd Year',
    collegeId: 'iitdelhi',
    verified: false,
    interests: ['Glassmorphism', 'UI Animation', 'Design Systems', '3D UI', 'Figma Plugins'],
    skills: ['Figma', 'Spline', 'Framer', 'Three.js', 'CSS/SCSS', 'HTML5', 'After Effects'],
    projects: [
      {
        id: 'proj_3',
        title: 'GlassyUI Kit',
        description: 'An open-source library of highly customisable glassmorphic react components.',
        technologies: ['Figma', 'React', 'TailwindCSS'],
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=400&fit=crop',
        link: '#',
        type: 'Project'
      }
    ],
    achievements: [
      { id: 'ach_4', title: 'Awwwards Honorable Mention', description: 'Design layout award for creative portfolio site', icon: '🎨', date: 'Mar 2025' }
    ],
    activityLog: [
      { type: 'post', text: 'Shared new glassmorphism dashboard design', icon: '📝', time: '4 hours ago', link: '#' },
      { type: 'join', text: 'Joined Creative Studio', icon: '🎉', time: '1 week ago', link: '/communities/creatives' }
    ],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/zoemiller',
      website: 'https://zoemiller.design'
    },
    communitiesJoined: 3,
    eventsAttended: 7,
    connectionsMade: 28,
    projectsShared: 4,
    postsThisMonth: 6,
    profileVisitsThisWeek: 41,
    newConnectionsThisWeek: 2,
    recentlyActive: true,
    memberSince: 'Nov 2023'
  },
  kabirverma: {
    id: 'u3',
    username: 'kabirverma',
    displayName: 'Kabir Verma',
    avatar: 'K',
    avatarUrl: null,
    bio: 'AI researcher and model optimizer. Exploring sparse attention models and Edge AI deployment.',
    location: 'New Delhi, IN',
    role: 'Research Assistant',
    email: 'kabirverma@meetifyy.app',
    followingList: ['ethanwong', 'zoemiller', 'sophiali'],
    followersList: ['ethanwong', 'zoemiller', 'sophiali', 'lucasgray', 'student'],
    followers: 13100,
    following: 65,
    communities: ['Fintech Labs', 'Sustainability Guild'],
    course: 'M.Tech AI & Data Science',
    year: '2nd Year',
    collegeId: 'gla',
    verified: true,
    interests: ['Edge AI', 'Transformers', 'Model Pruning', 'Quantization', 'PyTorch'],
    skills: ['Python', 'PyTorch', 'TensorFlow Lite', 'CUDA', 'C++', 'ONNX', 'OpenCV'],
    projects: [
      {
        id: 'proj_4',
        title: 'EdgeVision',
        description: 'Real-time object detection model optimized to run efficiently on low-power devices.',
        technologies: ['C++', 'ONNX Runtime', 'Python', 'YOLOv8'],
        image: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=600&h=400&fit=crop',
        link: '#',
        type: 'Project'
      }
    ],
    achievements: [
      { id: 'ach_5', title: 'Intel Edge AI Innovator Award', description: 'Awarded for novel quantization technique', icon: '🎓', date: 'Feb 2025' }
    ],
    activityLog: [
      { type: 'post', text: 'Published benchmarking results on edge accelerators', icon: '🤖', time: '5 hours ago', link: '#' },
      { type: 'milestone', text: 'Reached 13K followers on platform', icon: '🌟', time: '1 week ago', link: '#' }
    ],
    socialLinks: {
      github: 'https://github.com/kabirverma',
      twitter: 'https://twitter.com/kabirverma'
    },
    communitiesJoined: 4,
    eventsAttended: 14,
    connectionsMade: 92,
    projectsShared: 5,
    postsThisMonth: 16,
    profileVisitsThisWeek: 95,
    newConnectionsThisWeek: 8,
    recentlyActive: true,
    memberSince: 'Feb 2024'
  },
  sophiali: {
    id: 'u4',
    username: 'sophiali',
    displayName: 'Sophia Li',
    avatar: 'S',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?fit=crop&w=150&h=150',
    bio: 'Frontend Developer obsessed with animations. Making the web beautiful one frame at a time.',
    location: 'Toronto, ON',
    role: 'Frontend Dev',
    email: 'sophiali@meetifyy.app',
    followingList: ['ethanwong', 'kabirverma', 'liamdavies', 'lucasgray'],
    followersList: ['ethanwong', 'kabirverma', 'lucasgray'],
    followers: 1400,
    following: 420,
    communities: ['Creative Studio', 'IIT Delhi', 'Game Jam Guild'],
    course: 'B.Sc Interactive Media',
    year: '1st Year',
    collegeId: 'iitdelhi',
    verified: false,
    interests: ['Framer Motion', 'WebGL', 'GSAP Animations', 'CSS Layouts', 'Creative Coding'],
    skills: ['React', 'Framer Motion', 'JavaScript', 'WebGL', 'SASS/SCSS', 'GSAP', 'Next.js'],
    projects: [],
    achievements: [],
    activityLog: [
      { type: 'post', text: 'Deployed animated site landing page', icon: '🌍', time: '3 days ago', link: '#' }
    ],
    socialLinks: {
      github: 'https://github.com/sophiali',
      website: 'https://sophiali.dev'
    },
    communitiesJoined: 3,
    eventsAttended: 3,
    connectionsMade: 18,
    projectsShared: 1,
    postsThisMonth: 4,
    profileVisitsThisWeek: 16,
    newConnectionsThisWeek: 1,
    recentlyActive: false,
    memberSince: 'Apr 2024'
  },
  liamdavies: {
    id: 'u5',
    username: 'liamdavies',
    displayName: 'Liam Davies',
    avatar: 'L',
    avatarUrl: null,
    bio: 'Systems software engineering student. Working on custom network stack architectures and hardware.',
    location: 'London, UK',
    role: 'Systems Engineer',
    email: 'liamdavies@meetifyy.app',
    followingList: ['ethanwong', 'zoemiller', 'hannahkim'],
    followersList: ['sophiali', 'hannahkim'],
    followers: 950,
    following: 130,
    communities: ['Fintech Labs'],
    course: 'B.Eng Electronic Engineering',
    year: '4th Year',
    collegeId: 'gla',
    verified: false,
    interests: ['Embedded Systems', 'Network Protocols', 'C++', 'Hardware Design', 'Kernel Modules'],
    skills: ['C++', 'C', 'Assembly x86', 'SystemVerilog', 'Wireshark', 'Linux Kernel'],
    projects: [
      {
        id: 'proj_liam_1',
        title: 'MicroStack',
        description: 'A minimal TCP/IP stack implemented from scratch in C for microcontrollers.',
        technologies: ['C', 'lwIP', 'Ethernet Interface'],
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop',
        link: '#',
        type: 'Project'
      }
    ],
    achievements: [
      { id: 'ach_liam_1', title: 'Undergrad Research Fellow', description: 'Awarded research grant for protocol optimization', icon: '🦀', date: 'May 2025' }
    ],
    activityLog: [
      { type: 'post', text: 'Shared benchmark report on MicroStack latency', icon: '📡', time: '3 days ago', link: '#' },
      { type: 'join', text: 'Joined Fintech Labs', icon: '🎉', time: '2 months ago', link: '/communities/fintech' }
    ],
    socialLinks: {},
    communitiesJoined: 2,
    eventsAttended: 5,
    connectionsMade: 10,
    projectsShared: 1,
    postsThisMonth: 2,
    profileVisitsThisWeek: 8,
    newConnectionsThisWeek: 1,
    recentlyActive: false,
    memberSince: 'Jul 2024'
  },
  emmawatson: {
    id: 'u6',
    username: 'emmawatson',
    displayName: 'Emma Watson',
    avatar: 'E',
    avatarUrl: null,
    bio: 'Product owner and sprint leader. Loving agile methodology, wireframing, and team growth.',
    location: 'Boston, MA',
    role: 'Product Manager',
    email: 'emmawatson@meetifyy.app',
    followingList: ['zoemiller', 'ethanwong'],
    followersList: ['zoemiller'],
    followers: 3600,
    following: 220,
    communities: ['Creative Studio', 'IIT Delhi', 'Sustainability Guild'],
    course: 'MBA Tech',
    year: '3rd Year',
    collegeId: 'iitdelhi',
    verified: false,
    interests: ['Product Strategy', 'Wireframing', 'Agile Leadership', 'Customer Discovery'],
    skills: ['Confluence', 'Jira', 'Figma', 'Product Analytics', 'Miro', 'Roadmapping'],
    projects: [
      {
        id: 'proj_emma_1',
        title: 'SprintKit Playbook',
        description: 'An open-source roadmap template for startup founders to scale sprints quickly.',
        technologies: ['Notion', 'Figma', 'Miro'],
        image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&h=400&fit=crop',
        link: '#',
        type: 'Resource'
      }
    ],
    achievements: [
      { id: 'ach_emma_1', title: 'Product Launch of the Year', description: 'Managed launch for a collaboration tool with 1k active users', icon: '🚀', date: 'Jun 2025' }
    ],
    activityLog: [
      { type: 'post', text: 'Published SprintKit Playbook on Notion', icon: '📋', time: '1 week ago', link: '#' },
      { type: 'join', text: 'Joined Creative Studio', icon: '🎉', time: '3 months ago', link: '/communities/creatives' }
    ],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/emmawatson'
    },
    communitiesJoined: 3,
    eventsAttended: 8,
    connectionsMade: 35,
    projectsShared: 1,
    postsThisMonth: 3,
    profileVisitsThisWeek: 21,
    newConnectionsThisWeek: 2,
    recentlyActive: false,
    memberSince: 'May 2024'
  },
  lucasgray: {
    id: 'u7',
    username: 'lucasgray',
    displayName: 'Lucas Gray',
    avatar: 'L',
    bio: 'Mobile and game graphics programmer. Working in Unity & Vulkan bindings.',
    location: 'Seattle, WA',
    role: 'VFX programmer',
    email: 'lucasgray@meetifyy.app',
    followingList: ['ethanwong', 'kabirverma', 'sophiali'],
    followersList: ['sophiali', 'hannahkim'],
    followers: 1620,
    following: 230,
    communities: ['Sustainability Guild', 'Game Jam Guild', 'GLA University'],
    course: 'B.Sc Game Design',
    year: '2nd Year',
    collegeId: 'gla',
    verified: false,
    interests: ['Shader Programming', 'Vulkan API', 'Ray Tracing', 'Unity', 'Procedural Generation'],
    skills: ['Unity', 'C#', 'HLSL', 'C++', 'Vulkan', 'Blender'],
    projects: [
      {
        id: 'proj_5',
        title: 'VoxelWorld Engine',
        description: 'A procedural voxel engine built with Vulkan rendering backend and custom lighting.',
        technologies: ['C++', 'Vulkan', 'GLSL'],
        image: 'https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?w=600&h=400&fit=crop',
        link: '#',
        type: 'Game'
      }
    ],
    achievements: [
      { id: 'ach_7', title: 'Top VFX Contributor', description: 'Awarded at Seattle Indie Game Jam', icon: '🎮', date: 'Jan 2025' }
    ],
    activityLog: [
      { type: 'post', text: 'Showcasing real-time voxel raymarching engine', icon: '🎮', time: '3 days ago', link: '#' }
    ],
    socialLinks: {
      github: 'https://github.com/lucasgray',
      website: 'https://lucasgray.dev'
    },
    communitiesJoined: 3,
    eventsAttended: 6,
    connectionsMade: 25,
    projectsShared: 2,
    postsThisMonth: 5,
    profileVisitsThisWeek: 19,
    newConnectionsThisWeek: 3,
    recentlyActive: true,
    memberSince: 'Jun 2024'
  },
  hannahkim: {
    id: 'u8',
    username: 'hannahkim',
    displayName: 'Hannah Kim',
    avatar: 'H',
    avatarUrl: null,
    bio: 'Distributed databases developer. Expert in replication mechanisms, consensus protocols, and Go routing.',
    location: 'Geneva, CH',
    role: 'Database Engineer',
    email: 'hannahkim@meetifyy.app',
    followingList: ['ethanwong', 'zoemiller', 'lucasgray', 'liamdavies'],
    followersList: ['liamdavies', 'lucasgray'],
    followers: 4500,
    following: 140,
    communities: ['Sustainability Guild', 'IIT Delhi', 'Fintech Labs'],
    course: 'M.Tech CSE',
    year: '2nd Year',
    collegeId: 'iitdelhi',
    verified: false,
    interests: ['Distributed Databases', 'Raft Consensus', 'Go', 'Cassandra', 'Data Pipelines'],
    skills: ['Go', 'Raft', 'PostgreSQL', 'Docker', 'Kubernetes', 'Cassandra', 'Kafka'],
    projects: [
      {
        id: 'proj_hannah_1',
        title: 'LiteRaft DB',
        description: 'A resilient, highly available distributed key-value store leveraging Raft consensus in Go.',
        technologies: ['Go', 'gRPC', 'Protobuf'],
        image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&h=400&fit=crop',
        link: '#',
        type: 'Open Source'
      }
    ],
    achievements: [
      { id: 'ach_hannah_1', title: 'IEEE Distributed Systems Award', description: 'Awarded for work on consensus state-machine safety', icon: '🔧', date: 'Apr 2025' }
    ],
    activityLog: [
      { type: 'post', text: 'Wrote a new blog post explaining Raft cluster membership changes', icon: '📝', time: '4 hours ago', link: '#' },
      { type: 'milestone', text: 'Reached 4.5K followers milestone', icon: '🌟', time: '2 weeks ago', link: '#' }
    ],
    socialLinks: {
      github: 'https://github.com/hannahkim'
    },
    communitiesJoined: 3,
    eventsAttended: 11,
    connectionsMade: 45,
    projectsShared: 1,
    postsThisMonth: 3,
    profileVisitsThisWeek: 26,
    newConnectionsThisWeek: 2,
    recentlyActive: false,
    memberSince: 'Oct 2023'
  },
  student: {
    id: 'u9',
    username: 'student',
    password: 'gla123',
    displayName: 'GLA Student',
    avatar: 'S',
    avatarUrl: null,
    bio: 'Student at GLA University.',
    location: 'Mathura, India',
    role: 'Student',
    email: 'student@gla.ac.in',
    followingList: ['ethanwong', 'zoemiller', 'kabirverma'],
    followersList: ['ethanwong'],
    followers: 12,
    following: 34,
    communities: [],
    course: 'B.Tech CS',
    year: '1st Year',
    collegeId: 'gla',
    verified: true,
    interests: ['Programming', 'Technology'],
    skills: ['C++', 'Python', 'Web Dev'],
    projects: [],
    achievements: [],
    activityLog: [],
    socialLinks: {},
    communitiesJoined: 1,
    eventsAttended: 0,
    connectionsMade: 5,
    projectsShared: 0,
    postsThisMonth: 0,
    profileVisitsThisWeek: 2,
    newConnectionsThisWeek: 1,
    recentlyActive: true,
    memberSince: 'Jun 2026'
  }
};

export const initialPosts = [
  {
    id: 'f_main_1',
    authorId: 'u1',
    time: '2 hours ago',
    text: "Just completed building an end-to-end encrypted messaging engine with @zoemiller and @kabirverma 🚀 We leveraged WebRTC and WASM for direct browser-to-browser tunnels. Deployed the beta and works perfectly!",
    mentions: [
      { userId: 'u2', username: 'zoemiller', start: 57, end: 67 },
      { userId: 'u3', username: 'kabirverma', start: 72, end: 83 }
    ],
    media: { type: 'image', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=900&h=550&fit=crop' },
    poll: {
      question: 'Which browser support should we optimize next?',
      options: ['Safari Mobile', 'Firefox Focus', 'Chromium Embedded', 'Brave Shield integration'],
      votes: [25, 14, 40, 18],
      selectedUsers: {}
    },
    likes: 142,
    comments: 18,
    replies: [
      {
        id: 'r_1_1',
        authorId: 'u4',
        time: '1 hour ago',
        text: 'This is absolutely gorgeous @ethanwong — the WebRTC protocol implementation is stellar.',
        mentions: [{ userId: 'u1', username: 'ethanwong', start: 29, end: 39 }],
        likes: 11,
        isLikedByMe: false,
        replies: [
          {
            id: 'r_1_1_1',
            authorId: 'u2',
            time: '45 min ago',
            text: 'Agree with @sophiali — we definitely should host a walkthrough session!',
            mentions: [{ userId: 'u4', username: 'sophiali', start: 12, end: 21 }],
            likes: 4,
            isLikedByMe: false,
            replies: []
          }
        ]
      },
      {
        id: 'r_1_2',
        authorId: 'u5',
        time: '30 min ago',
        text: 'Voted for Chromium Embedded. Solid integration targets will expand utility dramatically.',
        mentions: [],
        likes: 6,
        isLikedByMe: false,
        replies: []
      }
    ]
  },
  {
    id: 'f_main_2',
    authorId: 'u2',
    time: '5 hours ago',
    text: "Latest design drop 🎬 Here is the glassmorphic analytics dashboard template @sophiali and I spent the weekend detailing out. Smooth background blurs and vibrant gradients. Full Figma design system coming next week — cc @emmawatson for feedback!",
    mentions: [
      { userId: 'u4', username: 'sophiali', start: 58, end: 67 },
      { userId: 'u6', username: 'emmawatson', start: 228, end: 239 }
    ],
    media: { type: 'video', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
    likes: 203,
    comments: 31,
    replies: []
  },
  {
    id: 'f_main_3',
    authorId: 'u3',
    time: 'Yesterday',
    text: "Deep-dive session this Saturday at 4 PM EST with @emmawatson as our guest speaker! We will analyze early product validation frameworks and roadmaps. Post your queries below 👇",
    mentions: [
      { userId: 'u6', username: 'emmawatson', start: 51, end: 62 }
    ],
    media: { type: 'image', url: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=900&h=500&fit=crop' },
    poll: {
      question: 'Which framework does your product team prioritize?',
      options: ['User Story Mapping', 'Lean Canvas Validation', 'Jobs To Be Done (JTBD)', 'Product Opportunity Tree'],
      votes: [35, 52, 44, 21],
      selectedUsers: {}
    },
    likes: 89,
    comments: 22,
    replies: []
  },
  {
    id: 'f_main_4',
    authorId: 'u4',
    time: '2 days ago',
    text: "Milestone alert! 🎮 The skeletal animation system we designed for our web framework now hits a stable 90 FPS. Shoutout to @ethanwong for math optimizations and @hannahkim for verifying memory management constraints.",
    mentions: [
      { userId: 'u1', username: 'ethanwong', start: 114, end: 124 },
      { userId: 'u8', username: 'hannahkim', start: 147, end: 157 }
    ],
    media: { type: 'video', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
    linkPreview: {
      url: 'https://github.com/',
      site: 'github.com',
      title: '90FPS Web Animation System',
      description: 'A compact skeletal model animator compiled to WASM with Rust and JS canvas bindings.',
      image: 'https://images.unsplash.com/photo-1556438064-2d7646166914?w=300&h=160&fit=crop'
    },
    likes: 317,
    comments: 44,
    replies: []
  },
  {
    id: 'f_main_5',
    authorId: 'u1',
    time: '2 days ago',
    text: "Just integrated consensus checks into my logging pipeline on @lucasgray's recommendation 🧠 Reduced data recovery time by 30% under stress test. Check out this guide, it makes the math intuitive ☕",
    mentions: [
      { userId: 'u7', username: 'lucasgray', start: 62, end: 72 }
    ],
    linkPreview: {
      url: 'https://martinfowler.com/',
      site: 'martinfowler.com',
      title: 'Consensus Systems Explained Simply',
      description: 'A deep look at consensus logs, replication checks, and cluster safety guarantees.',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&h=160&fit=crop'
    },
    poll: {
      question: 'Do you leverage Raft or Paxos databases?',
      options: ['Raft in production', 'Paxos variant', 'No consensus databases', 'Unsure'],
      votes: [88, 41, 102, 34],
      selectedUsers: {}
    },
    likes: 241,
    comments: 37,
    replies: []
  },
  {
    id: 'f_main_6',
    authorId: 'u7',
    time: '3 days ago',
    text: "Indie Game Jam starts soon and I need a team! I'm doing shaders and Vulkan rendering. @hannahkim — if you want to run networking logic, let's team up! 👀",
    mentions: [
      { userId: 'u8', username: 'hannahkim', start: 79, end: 89 }
    ],
    media: { type: 'video', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4' },
    likes: 54,
    comments: 12,
    replies: []
  },
  {
    id: 'f_main_7',
    authorId: 'u5',
    time: '4 days ago',
    text: "Delivered a workshop at Robotics Alliance on embedded protocol safety rules. Slides and diagrams are posted! Special thanks to @zoemiller for polishing the custom system diagrams! 😄",
    mentions: [
      { userId: 'u2', username: 'zoemiller', start: 104, end: 114 }
    ],
    media: { type: 'image', url: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=900&h=500&fit=crop' },
    linkPreview: {
      url: 'https://speakerdeck.com/',
      site: 'speakerdeck.com',
      title: 'Embedded Network Protocol Slides',
      description: 'Safety design tips, buffer overflow mitigations, and performance charts.',
      image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&h=160&fit=crop'
    },
    likes: 178,
    comments: 28,
    replies: []
  },
  {
    id: 'f_main_8',
    authorId: 'u6',
    time: '5 days ago',
    text: "Hot take 🌶️ Junior engineers should focus on reading open source code repositories rather than doing online tutorials. @ethanwong and @kabirverma agreed on this reading list. What would you add?",
    mentions: [
      { userId: 'u1', username: 'ethanwong', start: 111, end: 121 },
      { userId: 'u3', username: 'kabirverma', start: 126, end: 137 }
    ],
    poll: {
      question: 'Which open source code format is easiest to read?',
      options: ['Small modular packages', 'Large popular libraries', 'Standard library code', 'CLI tools'],
      votes: [120, 60, 90, 80],
      selectedUsers: {}
    },
    likes: 412,
    comments: 63,
    replies: [
      {
        id: 'r_8_1',
        authorId: 'u3',
        time: '4 days ago',
        text: "Fully agree — studying the Go standard library taught me more about design than any coding course did.",
        mentions: [],
        likes: 34,
        isLikedByMe: false,
        replies: []
      }
    ]
  }
];