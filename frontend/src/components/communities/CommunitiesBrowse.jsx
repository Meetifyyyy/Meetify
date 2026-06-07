import { useState } from 'react';
import { categoriesList } from '../../data/communities';
import { useData } from '../../context/DataContext';
import CommunityCard from './CommunityCard';
import CommunityGrid from './CommunityGrid';
import styles from './CommunitiesBrowse.module.css';

import artBanner from '../../assets/images/art-banner.png';
import techBanner from '../../assets/images/tech-banner.png';
import designBanner from '../../assets/images/design-banner.png';
import scienceBanner from '../../assets/images/science-banner.png';
import businessBanner from '../../assets/images/business-banner.png';
import gamingBanner from '../../assets/images/gaming-banner.png';
import musicBanner from '../../assets/images/music-banner.png';
import sportsBanner from '../../assets/images/sports-banner.png';
import photographyBanner from '../../assets/images/photography-banner.png';
import foodBanner from '../../assets/images/food-banner.png';
import travelBanner from '../../assets/images/travel-banner.png';
import defaultBanner from '../../assets/images/community-banner.webp';

const getHeroContent = (category) => {
  switch (category) {
    case 'art':
      return {
        title: 'ART',
        sub: 'Discover beautiful creations and connect with artists.',
        bgImage: `url(${artBanner})`,
      };
    case 'technology':
      return {
        title: 'TECHNOLOGY',
        sub: 'Dive into the future with fellow tech enthusiasts.',
        bgImage: `url(${techBanner})`,
      };
    case 'design':
      return {
        title: 'DESIGN',
        sub: 'Explore creative ideas, share your work, and get inspired.',
        bgImage: `url(${designBanner})`,
      };
    case 'science':
      return {
        title: 'SCIENCE',
        sub: 'Uncover the mysteries of the universe and share knowledge.',
        bgImage: `url(${scienceBanner})`,
      };
    case 'business':
      return {
        title: 'BUSINESS',
        sub: 'Connect with founders, investors, and business leaders.',
        bgImage: `url(${businessBanner})`,
      };
    case 'gaming':
      return {
        title: 'GAMING',
        sub: 'Find your squad and discuss your favorite games.',
        bgImage: `url(${gamingBanner})`,
      };
    case 'music':
      return {
        title: 'MUSIC',
        sub: 'Share tracks, discover artists, and talk about sound.',
        bgImage: `url(${musicBanner})`,
      };
    case 'sports':
      return {
        title: 'SPORTS',
        sub: 'Follow the action, join the debate, and stay energetic.',
        bgImage: `url(${sportsBanner})`,
      };
    case 'photography':
      return {
        title: 'PHOTOGRAPHY',
        sub: 'Capture the moment and showcase your visual stories.',
        bgImage: `url(${photographyBanner})`,
      };
    case 'food':
      return {
        title: 'FOOD',
        sub: 'Share recipes, discover restaurants, and talk culinary arts.',
        bgImage: `url(${foodBanner})`,
      };
    case 'travel':
      return {
        title: 'TRAVEL',
        sub: 'Explore destinations, share tips, and plan your next adventure.',
        bgImage: `url(${travelBanner})`,
      };
    default:
      return {
        title: 'FIND YOUR\nCOMMUNITY',
        sub: 'From design, to tech, to startups — there\'s a place for you.',
        bgImage: `url(${defaultBanner})`,
      };
  }
};

export default function CommunitiesBrowse({ onOpenCommunity }) {
  const { communities, searchQuery } = useData();
  const [activeCategory, setActiveCategory] = useState(null);

  const filtered = Object.values(communities).filter((c) => {
    if (c.isUniversity || c.collegeId) return false;
    const matchesCategory = !activeCategory || c.categories?.includes(activeCategory);
    const matchesSearch = !searchQuery || 
      c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.desc?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const heroContent = getHeroContent(activeCategory);
  const heroStyle = heroContent.bgImage 
    ? { background: `linear-gradient(rgba(109, 93, 252, 0.35), rgba(168, 85, 247, 0.45)), ${heroContent.bgImage} no-repeat center/cover` } 
    : {};

  return (
    <div className="feed">
      <div className={styles.commBrowseHero} style={heroStyle}>
        <nav className={styles.commCatNav}>
          <a
            className={`${styles.commCatTab}${activeCategory === null ? ` ${styles.commCatTabActive}` : ''}`}
            onClick={() => setActiveCategory(null)}
          >
            Home
          </a>
          {categoriesList.map((cat) => (
            <a
              key={cat.id}
              className={`${styles.commCatTab}${activeCategory === cat.id ? ` ${styles.commCatTabActive}` : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </a>
          ))}
        </nav>
        <h1 className={styles.commBrowseHeroTitle}>
          {heroContent.title.split('\n').map((line, i) => (
            <span key={i}>
              {line}
              {i === 0 && heroContent.title.includes('\n') && <br />}
            </span>
          ))}
        </h1>
        <p className={styles.commBrowseHeroSub}>{heroContent.sub}</p>
      </div>

      <div className={styles.commSectionHeading}>Featured Communities</div>

      <CommunityGrid>
        {filtered.map((c) => (
          <CommunityCard key={c.id} comm={c} onClick={() => onOpenCommunity(c.id)} />
        ))}
      </CommunityGrid>

      {filtered.length === 0 && (
        <div className={styles.commEmpty}>No communities found in this category.</div>
      )}
    </div>
  );
}
