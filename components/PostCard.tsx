import Link from "next/link";
import VoteButton from "./VoteButton";
import TimeAgo from "./TimeAgo";

interface PostCardProps {
    id: number;
    title: string;
    authorName: string;
    createdAt: string | null;
    lastMessageAt: string | null;
    answerCount?: number;
    voteScore?: number;
}

export default function PostCard({
    id,
    title,
    authorName,
    createdAt,
    lastMessageAt,
    answerCount = 0,
    voteScore = 0,
}: PostCardProps) {
    return (
        <div className="flex rounded-md border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark hover:border-muted-light dark:hover:border-muted-dark transition-colors">
            {/* Vote column */}
            <div className="flex items-start justify-center w-10 pt-2 bg-hover-light dark:bg-hover-dark rounded-l-md">
                <VoteButton initialScore={voteScore} />
            </div>

            {/* Content */}
            <Link href={`/questions/${id}`} className="flex-1 p-2 min-w-0">
                {/* Meta line */}
                <div className="flex items-center gap-1 text-xs text-muted-light dark:text-muted-dark">
                    <span className="font-medium text-ink dark:text-gray-300">
                        u/{authorName}
                    </span>
                    <span>•</span>
                    <TimeAgo date={lastMessageAt || createdAt} />
                </div>

                {/* Title */}
                <h3 className="mt-1 text-base font-semibold text-ink dark:text-gray-100 leading-snug">
                    {title}
                </h3>

                {/* Actions row */}
                <div className="mt-2 flex items-center gap-3 text-xs font-bold text-muted-light dark:text-muted-dark">
                    <span className="flex items-center gap-1 hover:bg-hover-light dark:hover:bg-hover-dark px-2 py-1 rounded-sm transition-colors">
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" className="opacity-70">
                            <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v7a2 2 0 01-2 2H8l-4 3v-3H4a2 2 0 01-2-2V5z" />
                        </svg>
                        {answerCount} {answerCount === 1 ? "Answer" : "Answers"}
                    </span>
                    <span className="hover:bg-hover-light dark:hover:bg-hover-dark px-2 py-1 rounded-sm transition-colors cursor-pointer">
                        Share
                    </span>
                    <span className="hover:bg-hover-light dark:hover:bg-hover-dark px-2 py-1 rounded-sm transition-colors cursor-pointer">
                        Save
                    </span>
                </div>
            </Link>
        </div>
    );
}
