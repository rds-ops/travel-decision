from datetime import datetime
from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    String,
    Text,
    JSON,
)
from sqlalchemy.orm import relationship

from app.core.db import Base
from app.models.enums import (
    BudgetTier,
    CardStatus,
    EntityType,
    QuestionStatus,
    ReactionType,
    ReportStatus,
)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    is_admin = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    profile = relationship("UserProfile", back_populates="user", uselist=False)
    answers = relationship("Answer", back_populates="author")
    questions = relationship("Question", back_populates="author")
    reactions = relationship("Reaction", back_populates="user")


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    language = Column(String(50))
    travel_style = Column(String(120))
    budget_tier = Column(Enum(BudgetTier), default=BudgetTier.mid)
    cities_of_experience = Column(JSON, default=list)

    user = relationship("User", back_populates="profile")


class City(Base):
    __tablename__ = "cities"

    id = Column(Integer, primary_key=True)
    name = Column(String(120), unique=True, nullable=False)
    country = Column(String(120), nullable=False)

    cards = relationship("Card", back_populates="city")


class Topic(Base):
    __tablename__ = "topics"

    id = Column(Integer, primary_key=True)
    name = Column(String(120), unique=True, nullable=False)


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True)
    city_id = Column(Integer, ForeignKey("cities.id"), nullable=False)
    topic_id = Column(Integer, ForeignKey("topics.id"), nullable=False)
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    duration = Column(String(50), nullable=False)
    budget_tier = Column(Enum(BudgetTier), nullable=False)
    requirements = Column(JSON, default=list)
    question_text = Column(Text, nullable=False)
    status = Column(Enum(QuestionStatus), default=QuestionStatus.open)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    author = relationship("User", back_populates="questions")
    answers = relationship("Answer", back_populates="question")
    city = relationship("City")
    topic = relationship("Topic")


class Answer(Base):
    __tablename__ = "answers"

    id = Column(Integer, primary_key=True)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    answer_text = Column(Text, nullable=False)
    context = Column(JSON, default=dict)
    media_url = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    question = relationship("Question", back_populates="answers")
    author = relationship("User", back_populates="answers")


class Reaction(Base):
    __tablename__ = "reactions"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    entity_type = Column(Enum(EntityType), nullable=False)
    entity_id = Column(Integer, nullable=False)
    reaction_type = Column(Enum(ReactionType), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="reactions")


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True)
    reporter_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    entity_type = Column(Enum(EntityType), nullable=False)
    entity_id = Column(Integer, nullable=False)
    reason = Column(String(255), nullable=False)
    status = Column(Enum(ReportStatus), default=ReportStatus.open)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class Card(Base):
    __tablename__ = "cards"

    id = Column(Integer, primary_key=True)
    title = Column(String(200), nullable=False)
    city_id = Column(Integer, ForeignKey("cities.id"), nullable=False)
    topic_id = Column(Integer, ForeignKey("topics.id"), nullable=False)
    duration = Column(String(50), nullable=False)
    budget_tier = Column(Enum(BudgetTier), nullable=False)
    requirements = Column(JSON, default=list)
    season = Column(String(50))
    summary = Column(Text, nullable=False)
    recommendations = Column(JSON, default=list)
    risks = Column(JSON, default=list)
    fit_for = Column(JSON, default=list)
    status = Column(Enum(CardStatus), default=CardStatus.draft)
    updated_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    city = relationship("City", back_populates="cards")
    sources = relationship("CardSource", back_populates="card")


class CardSource(Base):
    __tablename__ = "card_sources"

    id = Column(Integer, primary_key=True)
    card_id = Column(Integer, ForeignKey("cards.id"), nullable=False)
    answer_id = Column(Integer, ForeignKey("answers.id"), nullable=False)

    card = relationship("Card", back_populates="sources")
    answer = relationship("Answer")


class OtpCode(Base):
    __tablename__ = "otp_codes"

    id = Column(Integer, primary_key=True)
    email = Column(String(255), nullable=False)
    code = Column(String(6), nullable=False)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
