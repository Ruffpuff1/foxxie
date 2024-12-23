import Image from 'next/image';
import { ReactNode } from 'react';
import AuthorInfo, { Props as AuthorProps } from '../AuthorInfo/AuthorInfo';
import styles from './DiscordMessage.module.css';

export default function DiscordMessage(props: Props) {
    const { author, avatar, children, timestamp } = props;

    return (
        <div className={styles.discord_message}>
            <div className={styles.discord_message_inner}>
                <div className={styles.discord_author_avatar}>
                    <Image width={40} height={40} src={avatar} alt={author} />
                </div>
                <div className={styles.discord_message_content}>
                    <AuthorInfo
                        author={author ?? ''}
                        bot={props.bot ?? false}
                        server={props.server ?? false}
                        verified={props.verified ?? false}
                        op={props.op ?? false}
                        roleColor={props.roleColor ?? ''}
                        roleIcon={props.roleIcon ?? ''}
                        roleName={props.roleName ?? ''}
                    />
                    <span className={styles.discord_message_timestamp}>{timestamp?.toDateString()}</span>
                    <div className={styles.discord_message_body}>
                        <span className={styles.discord_message_markup}>{children}</span>
                        {props.edited ? <span className={styles.discord_message_edited}>(edited)</span> : ''}
                    </div>
                </div>
            </div>
        </div>
    );
}

interface Props extends AuthorProps {
    avatar: string;
    edited?: boolean;
    highlight?: boolean;
    ephemeral?: boolean;
    timestamp?: Date;
    twentyFour?: boolean;
    children?: ReactNode;
}
