import styles from './DashboardLayout.module.css';

export default function DashboardLayout({ wide, children }) {
  return (
    <div className={`${styles.dashboard}${wide ? ` ${styles.dashboardWide}` : ''}`}>
      {children}
    </div>
  );
}
