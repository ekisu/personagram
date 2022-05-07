import * as React from "react";
import styles from './ChatMessageBubble.module.css';

export type ChatMessageBubbleProps = {
    className: string
    children: React.ReactNode
}

const ChatMessageBubble = (props: ChatMessageBubbleProps) => (
  <div className={props.className}>
    <svg
        width="100%"
        height="100%"
        viewBox="0 0 479.863 164.992"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.chatMessageBubble}
    >
        <path
        style={{
            fill: "#fff",
            fillOpacity: 1,
            stroke: "none",
            strokeWidth: 1,
            strokeLinecap: "butt",
            strokeLinejoin: "miter",
            strokeOpacity: 1,
        }}
        d="m184.468 667.793 3.492 11.077 8.067-5.9 8.79-44.913 422.428-50.662-33.384 144.582-410.356 20.41 3.792-25.708-13.184 4.636-5.84-15.894-20.891 4.395Z"     
        transform="translate(-147.382 -577.395)"
        />
        <path
        style={{
            opacity: 1,
            fill: "#000",
            fillOpacity: 1,
            stroke: "none",
            strokeWidth: 1,
            strokeLinecap: "butt",
            strokeLinejoin: "miter",
            strokeOpacity: 1,
        }}
        d="m156.322 701.83 24.01-24.861 5.364 10.387 16.092-8.685 6.556-41.464 393.103-50.57-13.486 125.527-395.155 18.573 4.847-30.795s-19.024 6.997-19.364 6.827c-.341-.17-5.364-12.942-5.364-12.942Z"
        transform="translate(-147.382 -577.395)"
        />

        <foreignObject x="15%" y="40%" width="75%" height="50%" className={styles.foreignContent}>
            <div className={styles.content}>
                {props.children}
            </div>
        </foreignObject>
    </svg>
  </div>
);

export default ChatMessageBubble;