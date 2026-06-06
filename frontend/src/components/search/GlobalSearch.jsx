import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalSearch } from '../../hooks/useGlobalSearch';
import { PostResult, CommunityResult, UserResult, CollegeResult } from './SearchResultCards';
import logo from '../../assets/images/logo.webp';
import styles from './GlobalSearch.module.css';

export default function GlobalSearch() {
  const navigate = useNavigate();
  const { query, setQuery, results, isSearching } = useGlobalSearch();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute flattened array of results for keyboard navigation
  const flattenedResults = useMemo(() => {
    const flat = [];
    if (results.posts.length > 0) {
      results.posts.forEach(r => flat.push({ type: 'post', result: r }));
    }
    if (results.communities.length > 0) {
      results.communities.forEach(r => flat.push({ type: 'community', result: r }));
    }
    if (results.users.length > 0) {
      results.users.forEach(r => flat.push({ type: 'user', result: r }));
    }
    if (results.colleges.length > 0) {
      results.colleges.forEach(r => flat.push({ type: 'college', result: r }));
    }
    return flat;
  }, [results]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(-1);
  }, [query]);

  const handleKeyDown = (e) => {
    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < flattenedResults.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < flattenedResults.length) {
        handleSelect(flattenedResults[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleSelect = (item) => {
    const { type, result } = item;
    setIsOpen(false);
    setQuery('');
    
    switch (type) {
      case 'post':
        navigate(`/post/${result.item.id}`);
        break;
      case 'community':
        navigate(`/communities/${result.item.id}`);
        break;
      case 'user':
        navigate(`/profile/${result.item.username}`);
        break;
      case 'college':
        navigate(`/colleges/${result.item.id}`);
        break;
      default:
        break;
    }
  };

  const handleNavigate = (path) => {
    setIsOpen(false);
    setQuery('');
    navigate(path);
  };

  const hasResults = flattenedResults.length > 0;

  // Helper to determine the global index offset for a section
  let currentOffset = 0;
  const getSectionOffset = (sectionArray) => {
    const offset = currentOffset;
    currentOffset += sectionArray.length;
    return offset;
  };

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.searchBox}>
        <img className={styles.searchIcon} src={logo} alt="Search" />
        <input
          ref={inputRef}
          type="text"
          className={styles.input}
          placeholder="Search for people, communities, posts..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => {
            if (query.trim()) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
        />
        {query && (
          <button 
            className={styles.clearBtn} 
            onClick={() => { setQuery(''); inputRef.current?.focus(); }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        )}
      </div>

      {isOpen && query.trim() && (
        <div className={styles.dropdown}>
          {isSearching ? (
            <div className={styles.skeletonList}>
              {[...Array(3)].map((_, i) => (
                <div key={i} className={styles.skeletonCard}>
                  <div className={styles.skeletonAvatar} />
                  <div className={styles.skeletonLines}>
                    <div className={styles.skeletonLine} />
                    <div className={styles.skeletonLine} />
                  </div>
                </div>
              ))}
            </div>
          ) : !hasResults ? (
            <div className={styles.emptyState}>
              No results found for "{query}"
            </div>
          ) : (
            <>
              {results.posts.length > 0 && (() => {
                const offset = getSectionOffset(results.posts);
                return (
                  <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                      <span className={styles.sectionTitle}>Posts</span>
                      <button className={styles.viewAll}>View All</button>
                    </div>
                    {results.posts.map((r, i) => (
                      <PostResult 
                        key={r.item.id} 
                        result={r} 
                        isSelected={selectedIndex === offset + i}
                        onClick={handleNavigate}
                      />
                    ))}
                  </div>
                );
              })()}

              {results.communities.length > 0 && (() => {
                const offset = getSectionOffset(results.communities);
                return (
                  <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                      <span className={styles.sectionTitle}>Communities</span>
                      <button className={styles.viewAll}>View All</button>
                    </div>
                    {results.communities.map((r, i) => (
                      <CommunityResult 
                        key={r.item.id} 
                        result={r} 
                        isSelected={selectedIndex === offset + i}
                        onClick={handleNavigate}
                      />
                    ))}
                  </div>
                );
              })()}

              {results.users.length > 0 && (() => {
                const offset = getSectionOffset(results.users);
                return (
                  <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                      <span className={styles.sectionTitle}>Users</span>
                      <button className={styles.viewAll}>View All</button>
                    </div>
                    {results.users.map((r, i) => (
                      <UserResult 
                        key={r.item.id} 
                        result={r} 
                        isSelected={selectedIndex === offset + i}
                        onClick={handleNavigate}
                      />
                    ))}
                  </div>
                );
              })()}

              {results.colleges.length > 0 && (() => {
                const offset = getSectionOffset(results.colleges);
                return (
                  <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                      <span className={styles.sectionTitle}>Colleges</span>
                      <button className={styles.viewAll}>View All</button>
                    </div>
                    {results.colleges.map((r, i) => (
                      <CollegeResult 
                        key={r.item.id} 
                        result={r} 
                        isSelected={selectedIndex === offset + i}
                        onClick={handleNavigate}
                      />
                    ))}
                  </div>
                );
              })()}
            </>
          )}
        </div>
      )}
    </div>
  );
}
