import VoteButton from "./VoteButton";
import TimeAgo from "./TimeAgo";

interface CommentCardProps {
    id: number;
    authorName?: string;
    text: string;
    createdAt?: string;
    context?: Record<string, string>;
}

export default function CommentCard({
    id,
    authorName = "Anonymous",
    text,
    createdAt,
    context,
}: CommentCardProps) {
    return (
        <div className="flex gap-2 group">
            {/* Thread line + vote */}
            <div className="flex flex-col items-center">
                <VoteButton initialScore={0} />
                <div className="flex-1 w-px bg-border-light dark:bg-border-dark group-hover:bg-accent-blue transition-colors" />
            </div>

            {/* Body */}
            <div className="flex-1 min-w-0 pb-3">
                {/* Author line */}
                <div className="flex items-center gap-1 text-xs">
                    <span className="font-semibold text-ink dark:text-gray-200">
                        u/{authorName}
                    </span>
                    <span className="text-muted-light dark:text-muted-dark">•</span>
                    <span className="text-muted-light dark:text-muted-dark">
                        <TimeAgo date={createdAt} />
                    </span>
                </div>

                {/* Text */}
                <p className="mt-1 text-sm text-ink dark:text-gray-300 leading-relaxed">
                    {text}
                </p>

                {/* Context tags */}
                {context && Object.keys(context).length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                        {Object.entries(context).map(([key, value]) => (
                            <span
                                key={key}
                                className="text-[10px] rounded-full border border-border-light dark:border-border-dark bg-hover-light dark:bg-hover-dark px-2 py-0.5 text-muted-light dark:text-muted-dark"
                            >
                                {key}: {value}
                            </span>
                        ))}
                    </div>
                )}

                {/* Actions */}
                <div className="mt-2 flex gap-2 text-xs font-bold text-muted-light dark:text-muted-dark">
                    <button className="hover:bg-hover-light dark:hover:bg-hover-dark px-2 py-1 rounded-sm transition-colors">
                        Helpful
                    </button>
                    <button className="hover:bg-hover-light dark:hover:bg-hover-dark px-2 py-1 rounded-sm transition-colors">
                        Save
                    </button>
                    <button className="hover:bg-hover-light dark:hover:bg-hover-dark px-2 py-1 rounded-sm transition-colors">
                        Reply
                    </button>
                </div>
            </div>
        </div>
    );
}
