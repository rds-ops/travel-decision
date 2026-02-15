from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.core.db import get_db
from app.models.models import Question, Answer, User, Reaction
from app.models.enums import EntityType

router = APIRouter(tags=["feed"])

@router.get("/feed")
def get_feed(limit: int = 20, offset: int = 0, db: Session = Depends(get_db)):
    # last answer timestamp per question
    last_answer_sq = (
        db.query(
            Answer.question_id.label("question_id"),
            func.max(Answer.created_at).label("last_message_at"),
            func.count(Answer.id).label("answer_count"),
        )
        .group_by(Answer.question_id)
        .subquery()
    )

    # vote score: count of helpful/thanks reactions on each question
    vote_sq = (
        db.query(
            Reaction.entity_id.label("question_id"),
            func.count(Reaction.id).label("vote_score"),
        )
        .filter(Reaction.entity_type == EntityType.question.value)
        .group_by(Reaction.entity_id)
        .subquery()
    )

    q = (
        db.query(
            Question.id,
            Question.question_text,
            Question.created_at,
            User.id.label("author_id"),
            User.email.label("author_name"),
            last_answer_sq.c.last_message_at,
            func.coalesce(last_answer_sq.c.answer_count, 0).label("answer_count"),
            func.coalesce(vote_sq.c.vote_score, 0).label("vote_score"),
        )
        .join(User, User.id == Question.author_id)
        .outerjoin(last_answer_sq, last_answer_sq.c.question_id == Question.id)
        .outerjoin(vote_sq, vote_sq.c.question_id == Question.id)
        .order_by(func.coalesce(last_answer_sq.c.last_message_at, Question.created_at).desc())
        .offset(offset)
        .limit(limit)
    )

    rows = q.all()

    items = []
    for r in rows:
        items.append(
            {
                "id": r.id,
                "title": r.question_text[:80] + ("…" if len(r.question_text) > 80 else ""),
                "created_at": r.created_at.isoformat() if r.created_at else None,
                "last_message_at": r.last_message_at.isoformat() if r.last_message_at else None,
                "author": {"id": r.author_id, "display_name": r.author_name},
                "answer_count": r.answer_count,
                "vote_score": r.vote_score,
            }
        )

    return {"items": items}
