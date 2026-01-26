from datetime import datetime

from sqlalchemy.orm import Session

from app.core.db import SessionLocal
from app.models.enums import BudgetTier, CardStatus, QuestionStatus
from app.models.models import Answer, Card, CardSource, City, Question, Topic, User, UserProfile


CITIES = [
    ("Tbilisi", "Georgia"),
    ("Istanbul", "Turkey"),
    ("Dubai", "UAE"),
    ("Bangkok", "Thailand"),
    ("Bali", "Indonesia"),
]

TOPICS = [
    "Areas",
    "Housing",
    "Internet/Work",
    "Safety",
    "Transport",
    "Documents",
    "Cost of Living",
]


def seed(db: Session) -> None:
    if db.query(City).count() == 0:
        for name, country in CITIES:
            db.add(City(name=name, country=country))
    if db.query(Topic).count() == 0:
        for name in TOPICS:
            db.add(Topic(name=name))
    db.commit()

    admin = db.query(User).filter(User.email == "admin@travel.dev").first()
    if not admin:
        admin = User(email="admin@travel.dev", is_admin=True)
        db.add(admin)
        db.commit()
        db.refresh(admin)
        db.add(UserProfile(user_id=admin.id, cities_of_experience=["Tbilisi", "Bangkok"], travel_style="Slow travel"))
    user = db.query(User).filter(User.email == "member@travel.dev").first()
    if not user:
        user = User(email="member@travel.dev")
        db.add(user)
        db.commit()
        db.refresh(user)
        db.add(UserProfile(user_id=user.id, cities_of_experience=["Bali"], travel_style="Remote work"))
    db.commit()

    if db.query(Question).count() == 0:
        tbilisi = db.query(City).filter(City.name == "Tbilisi").first()
        topic = db.query(Topic).filter(Topic.name == "Housing").first()
        question = Question(
            city_id=tbilisi.id,
            topic_id=topic.id,
            author_id=user.id,
            duration="2 months",
            budget_tier=BudgetTier.mid,
            requirements=["quiet", "good_internet"],
            question_text="Where should I stay for a 2-month remote work stint?",
            status=QuestionStatus.open,
        )
        db.add(question)
        db.commit()
        db.refresh(question)

        answer = Answer(
            question_id=question.id,
            user_id=admin.id,
            answer_text="Stay near Vake for walkability and cafes. Check internet speed before booking.",
            context={"lived": True, "when": "2023", "duration": "3 months"},
        )
        db.add(answer)
        db.commit()
        card = Card(
            title="Tbilisi — Housing for 2 months",
            city_id=tbilisi.id,
            topic_id=topic.id,
            duration="2 months",
            budget_tier=BudgetTier.mid,
            requirements=["quiet", "good_internet"],
            summary="Vake and Saburtalo are popular for mid-budget remote workers staying 1-3 months.",
            recommendations=[
                "Tour apartments for noise and internet quality.",
                "Negotiate monthly rates directly with hosts.",
                "Check proximity to groceries and cafes.",
            ],
            risks=["Short-term contracts can include surprise utilities.", "Listings may exaggerate internet speeds."],
            fit_for=["Remote workers", "Solo travelers"],
            status=CardStatus.published,
            updated_at=datetime.utcnow(),
        )
        db.add(card)
        db.commit()
        db.add(CardSource(card_id=card.id, answer_id=answer.id))
        db.commit()


if __name__ == "__main__":
    session = SessionLocal()
    try:
        seed(session)
    finally:
        session.close()
