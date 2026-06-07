import styles from './DashboardLayout.module.css';

export default function DashboardLayout({ wide, compactGutters, children }) {
  return (
    <div className={`${styles.dashboard}${wide ? ` ${styles.dashboardWide}` : ''}${compactGutters ? ` ${styles.dashboardCompact}` : ''}`}>
      {children}
    </div>
  );
}
