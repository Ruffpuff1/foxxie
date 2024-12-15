import dynamic from 'next/dynamic';
import styles from './AuthorInfo.module.css';

const Image = dynamic(() => import('next/image'));
const VerifiedTick = dynamic(() => import('../svgs/VerifiedTick'));

export interface Props {
    author: string;
    bot?: boolean;
    server?: boolean;
    op?: boolean;
    roleColor: string;
    roleIcon?: string;
    roleName?: string;
    verified?: boolean;
}

export default function AuthorInfo({ author, bot, op, roleColor, roleIcon, roleName, server, verified }: Props) {
    return (
        <span className={styles.discord_author_info}>
            <span className={styles.discord_author_username} style={{ color: roleColor }}>
                {author}
            </span>
            {roleIcon && <Image className={styles.discord_author_role_icon} src={roleIcon} height={20} width={20} alt={roleName} draggable={false} />}
            {
                <>
                    {bot && !server && (
                        <span className={styles.discord_application_tag}>
                            {verified && <VerifiedTick />}
                            Bot
                        </span>
                    )}
                    {server && !bot && <span className={styles.discord_application_tag}>Server</span>}
                    {op && <span className={`${styles.discord_application_tag} ${styles.discord_application_tag_op}`}>OP</span>}
                </>
            }
        </span>
    );
}
