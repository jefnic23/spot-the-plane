import styles from '../styles/Loader.module.css';

export default function Loader() {
    return (
        <div className={styles.container}>
            <span className={styles.title}>Loading Data</span>
            <span className={styles.loader}></span>
        </div>
    );
}