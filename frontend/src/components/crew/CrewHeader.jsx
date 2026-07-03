import React, { useState } from 'react';
import { useSmartBack } from '../../hooks/useSmartBack';
import styles from './CrewHeader.module.css';
import { ACTIVITY_CATEGORIES } from './crewData';

export default function CrewHeader({ 
  selectedTab, onTabChange, 
  searchQuery, onSearchChange,
  categoryFilter, onCategoryChange,
  locationFilter, onLocationChange,
  showFilters, onToggleFilters 
}) {
  const [isLocOpen, setIsLocOpen] = useState(false);
  const locations = ['Anywhere', 'Mumbai', 'Bangalore', 'Delhi', 'Remote'];
  const goBack = useSmartBack();

  return (
    <div className={styles.headerContainer}>
      
      {/* Mobile back row */}
      <div className={styles.mobileBackRow}>
        <button className={styles.backBtn} onClick={() => goBack('/home')} aria-label="Go back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        <h1 className={styles.backTitle}>Crew</h1>
      </div>

      {/* Search Bar */}
      <div className={styles.searchRow}>
        <div className={styles.searchBox}>
          <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input 
            type="text" 
            className={styles.searchInput}
            placeholder="Search activities, people or interests..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs Row */}
      <div className={styles.tabsRow}>
        <nav className={styles.tabsNav}>
          {['For You', 'Popular', 'My Activities', 'Saved'].map(tab => (
            <button 
              key={tab}
              className={`${styles.tabBtn} ${selectedTab === tab ? styles.tabActive : ''}`}
              onClick={() => onTabChange(tab)}
            >
              {tab}
            </button>
          ))}
        </nav>
        <div className={styles.locationWrapper}>
          <button className={styles.locationDropdown} onClick={() => setIsLocOpen(!isLocOpen)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            {locationFilter}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isLocOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          
          {isLocOpen && (
            <div className={styles.locMenu}>
              {locations.map(loc => (
                <button 
                  key={loc}
                  className={`${styles.locItem} ${locationFilter === loc ? styles.locActive : ''}`}
                  onClick={() => {
                    onLocationChange(loc);
                    setIsLocOpen(false);
                  }}
                >
                  {loc}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
}
