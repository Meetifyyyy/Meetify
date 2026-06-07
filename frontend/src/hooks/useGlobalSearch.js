import { useState, useEffect, useMemo } from 'react';
import Fuse from 'fuse.js';
import { useData } from '../context/DataContext';

export function useGlobalSearch(initialQuery = '', limit = 5) {
  const { users, posts, communities } = useData();
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState({
    posts: [],
    communities: [],
    users: [],
    colleges: []
  });

  // Debounce the query
  useEffect(() => {
    setIsSearching(true);
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(handler);
  }, [query]);

  // Sync query state if initialQuery prop changes (like when URL changes)
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  // Prepare searchable data
  const { searchablePosts, searchableUsers, searchableCommunities, searchableColleges } = useMemo(() => {
    const usersList = Object.values(users || {});
    
    const postsList = (posts || []).map(p => {
      const author = usersList.find(u => u.id === p.authorId);
      const community = p.communityId ? communities[p.communityId] : null;
      return {
        ...p,
        authorName: author?.displayName || '',
        authorUsername: author?.username || '',
        authorAvatar: author?.avatar || '',
        communityName: community?.name || ''
      };
    });

    const commList = Object.values(communities || {});
    const communitiesList = commList.filter(c => !c.isUniversity && !c.collegeId);
    const collegesList = commList.filter(c => c.isUniversity);

    return {
      searchablePosts: postsList,
      searchableUsers: usersList,
      searchableCommunities: communitiesList,
      searchableColleges: collegesList
    };
  }, [users, posts, communities]);

  // Create Fuse instances
  const fuseOptions = {
    includeMatches: true,
    threshold: 0.3,
    includeScore: true,
    ignoreLocation: true,
  };

  const fuseInstances = useMemo(() => {
    return {
      posts: new Fuse(searchablePosts, {
        ...fuseOptions,
        keys: [
          { name: 'text', weight: 1.0 },
          { name: 'authorName', weight: 0.5 },
          { name: 'communityName', weight: 0.5 }
        ]
      }),
      users: new Fuse(searchableUsers, {
        ...fuseOptions,
        keys: [
          { name: 'displayName', weight: 1.0 },
          { name: 'username', weight: 0.8 },
          { name: 'bio', weight: 0.4 },
          { name: 'role', weight: 0.5 }
        ]
      }),
      communities: new Fuse(searchableCommunities, {
        ...fuseOptions,
        keys: [
          { name: 'name', weight: 1.0 },
          { name: 'desc', weight: 0.5 },
          { name: 'categories', weight: 0.8 }
        ]
      }),
      colleges: new Fuse(searchableColleges, {
        ...fuseOptions,
        keys: [
          { name: 'name', weight: 1.0 },
          { name: 'desc', weight: 0.5 }
        ]
      })
    };
  }, [searchablePosts, searchableUsers, searchableCommunities, searchableColleges]);

  // Perform search when debouncedQuery changes
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults({ posts: [], communities: [], users: [], colleges: [] });
      setIsSearching(false);
      return;
    }

    const searchPosts = fuseInstances.posts.search(debouncedQuery);
    const searchUsers = fuseInstances.users.search(debouncedQuery);
    const searchCommunities = fuseInstances.communities.search(debouncedQuery);
    const searchColleges = fuseInstances.colleges.search(debouncedQuery);

    // Helper to rank and limit results. 
    // We can add engagement weighting here if needed (e.g. subtracting from score because Fuse score: lower is better).
    const formatResults = (list, maxLimit) => {
      // For engagement weighting, we can adjust the score slightly based on popularity
      const weighted = list.map(item => {
        let weightFactor = 0;
        if (item.item.likes) weightFactor = Math.min(item.item.likes * 0.001, 0.1);
        if (item.item.followers) weightFactor = Math.min(item.item.followers * 0.00001, 0.1);
        if (item.item.members) weightFactor = Math.min(item.item.members * 0.00001, 0.1);
        
        return {
          ...item,
          score: item.score - weightFactor // Lower score is better in Fuse
        };
      });

      // Sort by modified score
      weighted.sort((a, b) => a.score - b.score);
      return weighted.slice(0, maxLimit);
    };

    setResults({
      posts: formatResults(searchPosts, limit),
      communities: formatResults(searchCommunities, limit),
      users: formatResults(searchUsers, limit),
      colleges: formatResults(searchColleges, limit)
    });
    setIsSearching(false);
  }, [debouncedQuery, fuseInstances, limit]);

  return { query, setQuery, results, isSearching };
}
