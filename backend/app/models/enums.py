import enum


class BudgetTier(str, enum.Enum):
    low = "low"
    mid = "mid"
    high = "high"


class QuestionStatus(str, enum.Enum):
    open = "OPEN"
    compiling = "COMPILING_SUMMARY"
    resolved = "RESOLVED"


class CardStatus(str, enum.Enum):
    draft = "DRAFT"
    published = "PUBLISHED"


class ReactionType(str, enum.Enum):
    saved = "save"
    helped = "helped"
    thanks = "thanks"


class EntityType(str, enum.Enum):
    question = "question"
    answer = "answer"
    card = "card"


class ReportStatus(str, enum.Enum):
    open = "OPEN"
    reviewed = "REVIEWED"
    rejected = "REJECTED"
