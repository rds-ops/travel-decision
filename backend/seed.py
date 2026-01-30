from datetime import datetime

from sqlalchemy.orm import Session

from app.core.db import SessionLocal, engine, Base
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
    # Ensure tables exist (helpful for SQLite/Local mode)
    Base.metadata.create_all(bind=engine)
    
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
        bali = db.query(City).filter(City.name == "Bali").first()
        bangkok = db.query(City).filter(City.name == "Bangkok").first()
        
        topic_housing = db.query(Topic).filter(Topic.name == "Housing").first()
        topic_work = db.query(Topic).filter(Topic.name == "Internet/Work").first()
        topic_safety = db.query(Topic).filter(Topic.name == "Safety").first()

        # 1. Tbilisi Data
        q_tbilisi = Question(
            city_id=tbilisi.id,
            topic_id=topic_housing.id,
            author_id=user.id,
            duration="2 months",
            budget_tier=BudgetTier.mid,
            requirements=["quiet", "good_internet"],
            question_text="Where should I stay in Tbilisi for a 2-month remote work stint?",
            status=QuestionStatus.open,
        )
        db.add(q_tbilisi)
        db.commit()
        db.refresh(q_tbilisi)

        a_tbilisi = Answer(
            question_id=q_tbilisi.id,
            user_id=admin.id,
            answer_text="Stay near Vake for walkability and cafes. Saburtalo is also good and more affordable.",
            context={"lived": True, "when": "2023"}
        )
        db.add(a_tbilisi)
        
        card_tbilisi = Card(
            title="Tbilisi — Housing for 2 months",
            city_id=tbilisi.id,
            topic_id=topic_housing.id,
            duration="2 months",
            budget_tier=BudgetTier.mid,
            requirements=["quiet", "good_internet"],
            summary="Vake and Saburtalo are popular for mid-budget remote workers.",
            recommendations=["Tour apartments for noise.", "Check internet speed before booking."],
            risks=["Short-term contracts can be tricky."],
            fit_for=["Remote workers", "Solo travelers"],
            status=CardStatus.published,
            updated_at=datetime.utcnow(),
        )
        db.add(card_tbilisi)
        db.commit()
        db.add(CardSource(card_id=card_tbilisi.id, answer_id=a_tbilisi.id))

        # 2. Bali Data
        q_bali = Question(
            city_id=bali.id,
            topic_id=topic_work.id,
            author_id=user.id,
            duration="1 month",
            budget_tier=BudgetTier.low,
            requirements=["fast_wifi", "coworking_near"],
            question_text="Digital nomad beginner here: Best area in Bali for reliable internet and community?",
            status=QuestionStatus.open,
        )
        db.add(q_bali)
        db.commit()
        db.refresh(q_bali)

        a_bali = Answer(
            question_id=q_bali.id,
            user_id=admin.id,
            answer_text="Canggu is the hub, but for better internet, try Ubud's specialized coworking spaces like Outpost.",
            context={"spent_time": "6 months"}
        )
        db.add(a_bali)
        
        card_bali = Card(
            title="Bali Internet Guide",
            city_id=bali.id,
            topic_id=topic_work.id,
            duration="1-3 months",
            budget_tier=BudgetTier.low,
            requirements=["wifi"],
            summary="Bali is great but internet can be spotty. Fix it by staying near coworking hubs.",
            recommendations=["Get a Telkomsel SIM as backup.", "Join FB groups for villa wifi."],
            risks=["Power outages in rainy season."],
            fit_for=["Nomads", "Freelancers"],
            status=CardStatus.published,
            updated_at=datetime.utcnow(),
        )
        db.add(card_bali)
        db.commit()

        # 3. Bangkok Data
        q_bk = Question(
            city_id=bangkok.id,
            topic_id=topic_safety.id,
            author_id=user.id,
            duration="3 months",
            budget_tier=BudgetTier.high,
            requirements=["safe_at_night", "walkable"],
            question_text="Looking for a high-end, safe neighborhood in Bangkok for a family stay.",
            status=QuestionStatus.open,
        )
        db.add(q_bk)
        db.commit()
        db.refresh(q_bk)

        a_bk = Answer(
            question_id=q_bk.id,
            user_id=admin.id,
            answer_text="Thong Lo or Ekkamai are very safe, upscale, and have everything you need.",
            context={"family_travel": True}
        )
        db.add(a_bk)
        db.commit()

if __name__ == "__main__":
    session = SessionLocal()
    try:
        seed(session)
        print("Database seeded successfully with expanded demo data!")
    finally:
        session.close()
