from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.db.database import Base, engine
from app.models import AnalysisProject, User


def create_tables() -> None:
    Base.metadata.create_all(bind=engine)


def seed_demo_data(db: Session) -> None:
    demo = db.query(User).filter(User.email == "demo@proofclean.com").first()
    if demo is None:
        demo = User(
            email="demo@proofclean.com",
            hashed_password=hash_password("password1234"),
            name="Demo User",
            role="USER",
        )
        db.add(demo)
        db.commit()
        db.refresh(demo)

    existing_demo_analyses = db.query(AnalysisProject).filter(AnalysisProject.user_id == demo.id).count()
    if existing_demo_analyses > 0:
        return

    seeds = [
        ("중고거래 게시글 사진 점검", "SECOND_HAND", 87, "송장, 전화번호, 주소 후보 탐지"),
        ("SNS 업로드 사진 점검", "SNS", 74, "위치 단서, 얼굴, EXIF 후보 탐지"),
        ("과제 제출 캡처 점검", "ASSIGNMENT", 68, "학번, 이메일, 화면 텍스트 후보 탐지"),
    ]
    for title, purpose, score, summary in seeds:
        db.add(
            AnalysisProject(
                user_id=demo.id,
                title=title,
                purpose=purpose,
                status="ANALYZED",
                risk_score=score,
                summary=summary,
            )
        )
    db.commit()


def init_db(db: Session) -> None:
    create_tables()
    seed_demo_data(db)
