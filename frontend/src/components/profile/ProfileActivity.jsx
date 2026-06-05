import { useAuth } from '../../context/AuthContext';

export default function ProfileActivity() {
  const { username, initial } = useAuth();

  const posts = [
    { time: '2 days ago', text: 'Just pushed a new open-source project — a real-time whiteboard collab tool! Built with WebSockets and Canvas API. Check it out on my GitHub 🚀', likes: 12, comments: 4 },
    { time: '1 week ago', text: 'Had an amazing session at the NYC Hackathon this weekend! Met 10+ devs from Meetify and we ended up building a working prototype together. This community is unreal 🔥', likes: 34, comments: 11 },
  ];

  return (
    <div className="profile-section">
      <h2 className="section-title">Recent Activity</h2>
      {posts.map((p, i) => (
        <div key={i} className="profile-post">
          <div className="profile-post-header">
            <div className="profile-post-avatar">{initial}</div>
            <div className="profile-post-user">
              <div className="profile-post-name">{username}</div>
              <div className="profile-post-time">{p.time}</div>
            </div>
          </div>
          <div className="profile-post-body">{p.text}</div>
          <div className="profile-post-actions">
            <div className="action-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span>{p.likes} Likes</span>
            </div>
            <div className="action-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
              <span>{p.comments} Comments</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
