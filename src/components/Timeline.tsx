import styles from './Timeline.module.scss';
import { useEffect, useMemo } from 'react';

function Title({ children }: { children: React.ReactNode }) {
    return <h3 className={styles['timeline--title']}>{children}</h3>;
}

function Content({ children }: { children: React.ReactNode }) {
    return <p className={styles['timeline--content']}>{children}</p>;
}

function Section({ children }: { children: React.ReactNode }) {
    return (
        <li className={styles['timeline--section']}>
            <div className={styles['bead']}></div>
            {children}
        </li>
    );
}

function select(el: string, all = false) {
    el = el.trim();
    if (all) {
        return [...document.querySelectorAll(el)];
    } else {
        return document.querySelector(el);
    }
}

function isItemInView(item: HTMLElement) {
    var rect = item.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function Timeline({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        function callBackFunc() {
            console.count('callBackFunc');
            var items = select(`.${styles.timeline} li`, true) as HTMLElement[];
            items.forEach((item) => {
                if (isItemInView(item) && !item.classList.contains(`${styles.visible}`)) {
                    item.classList.add(`${styles.visible}`);
                }
            });

            checkIfAllVisible();
        }

        function wrapup() {
            document.removeEventListener('scroll', callBackFunc);
            document.removeEventListener('resize', callBackFunc);
        }

        function checkIfAllVisible() {
            var items = select(`.${styles.timeline} li`, true) as HTMLElement[];
            var allVisible = items.every((item) => item.classList.contains(`${styles.visible}`));
            if (allVisible) {
                console.log('all visible');
                wrapup();
            }
        }

        document.addEventListener('scroll', callBackFunc);
        document.addEventListener('resize', callBackFunc);
        callBackFunc();
        return () => {
            wrapup();
        };
    }, []);

    return (
        <div className={styles.container}>
            <ul className={styles.timeline}>
                <div className={styles.line}></div>
                {children}
            </ul>
        </div>
    );
}

Timeline.Section = Section;
Timeline.Title = Title;
Timeline.Content = Content;

export default Timeline;
