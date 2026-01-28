from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.core.db import get_db
from app.models.models import Question, Answer, User

router = APIRouter(tags=["feed"])

@router.get("/feed")
def get_feed(limit: int = 20, offset: int = 0, db: Session = Depends(get_db)):
    # последнее сообщение (answer) по вопросу
    last_answer_sq = (
        db.query(
            Answer.question_id.label("question_id"),
            func.max(Answer.created_at).label("last_message_at"),
        )
        .group_by(Answer.question_id)
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
        )
        .join(User, User.id == Question.author_id)
        .outerjoin(last_answer_sq, last_answer_sq.c.question_id == Question.id)
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
            }
        )

    return {"items": items}
