import { useState, useEffect, useRef } from 'react';
import { classifyMeetifyyURL } from '../utils/classifyMeetifyyURL';
import { extractURL } from '../utils/urlUtils';
import { useData } from '../context/DataContext';

/**
 * Given a string of text, detects any URL, classifies it,
 * fetches the appropriate preview data, and returns it.
 */
export function useLinkPreview(inputText) {
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dismissed, setDismissed] = useState(false);
  const lastURLRef = useRef(null);
  const debounceRef = useRef(null);
  
  const { getPostById, getUserByUsername, communities, crewActivities } = useData();

  useEffect(() => {
    // Reset dismissed state when input changes significantly
    const url = extractURL(inputText);
    if (url !== lastURLRef.current) {
      setDismissed(false);
    }
  }, [inputText]);

  useEffect(() => {
    clearTimeout(debounceRef.current);

    const url = extractURL(inputText);

    if (!url || dismissed) {
      setPreview(null);
      setIsLoading(false);
      return;
    }

    if (url === lastURLRef.current && preview) return;

    debounceRef.current = setTimeout(async () => {
      lastURLRef.current = url;
      setIsLoading(true);
      setError(null);

      try {
        const classification = classifyMeetifyyURL(url);
        let data = null;

        if (classification.type === 'post') {
          // Fallback to useData() to fetch simulated data
          data = getPostById(classification.id);
          if (!data) throw new Error('Post not found');
          setPreview({ type: 'post', data, url });

        } else if (classification.type === 'profile') {
          data = getUserByUsername(classification.username);
          if (!data) throw new Error('Profile not found');
          setPreview({ type: 'profile', data, url });

        } else if (classification.type === 'community') {
          data = communities?.find(c => c.id === classification.slug || c.slug === classification.slug);
          if (!data) throw new Error('Community not found');
          setPreview({ type: 'community', data, url });

        } else if (classification.type === 'activity') {
          data = crewActivities?.find(a => a.id === classification.id || String(a.id) === classification.id);
          if (!data) throw new Error('Activity not found');
          setPreview({ type: 'activity', data, url });

        } else if (classification.type === 'external') {
          // Call backend proxy to fetch Open Graph data if available
          try {
            const res = await fetch(`/api/link-preview?url=${encodeURIComponent(url)}`);
            if (!res.ok) throw new Error('Preview unavailable');
            data = await res.json();
            setPreview({ type: 'external', data, url });
          } catch (e) {
            // Mock fallback if proxy fails or isn't set up yet
            const parsed = new URL(url);
            setPreview({
              type: 'external',
              data: {
                title: null,
                description: null,
                url,
                siteName: parsed.hostname,
                favicon: `https://www.google.com/s2/favicons?domain=${parsed.hostname}&sz=32`
              },
              url
            });
          }

        } else {
          // Unknown or unclassified — no preview
          setPreview(null);
        }

      } catch (err) {
        setError(err.message);
        setPreview(null);
      } finally {
        setIsLoading(false);
      }
    }, 400); // 400ms debounce

    return () => clearTimeout(debounceRef.current);
  }, [inputText, dismissed, getPostById, getUserByUsername, communities, crewActivities, preview]);

  return {
    preview,
    isLoading,
    error,
    dismiss: () => {
      setDismissed(true);
      setPreview(null);
    }
  };
}
