from copy import deepcopy


def normalize_mode(mode: str | None) -> str:
    value = (mode or "other").strip().lower().replace("-", "_")
    aliases = {
        "second_hand": "marketplace",
        "secondhand": "marketplace",
        "market": "marketplace",
        "etc": "other",
        "sns_upload": "sns",
    }
    value = aliases.get(value, value)
    return value if value in {"sns", "marketplace", "assignment", "community", "other"} else "other"


def detection(item_id: str, item_type: str, label: str, confidence: float, severity: str, description: str, box: tuple[int, int, int, int]) -> dict:
    x, y, width, height = box
    return {
        "id": item_id,
        "type": item_type,
        "label": label,
        "confidence": confidence,
        "severity": severity,
        "description": description,
        "box": {"x": x, "y": y, "width": width, "height": height},
    }


DETECTIONS = {
    "sns": [
        detection("det-face", "FACE", "얼굴 후보", 0.91, "high", "공유 시 개인을 식별할 수 있는 얼굴 후보입니다.", (300, 145, 180, 210)),
        detection("det-location", "LOCATION_HINT", "위치 단서", 0.82, "medium", "간판이나 위치 태그를 통해 장소가 추정될 수 있습니다.", (90, 390, 260, 55)),
        detection("det-profile", "PROFILE_TEXT", "프로필 텍스트", 0.88, "medium", "계정명이나 알림 문구가 포함된 텍스트 후보입니다.", (55, 45, 300, 48)),
    ],
    "marketplace": [
        detection("det-invoice", "INVOICE", "송장 정보 후보", 0.94, "high", "택배 송장에 수취인 정보가 포함될 수 있습니다.", (155, 170, 430, 190)),
        detection("det-phone", "PHONE", "전화번호 후보", 0.92, "high", "연락 가능한 전화번호로 보이는 후보입니다.", (260, 315, 245, 42)),
        detection("det-address", "ADDRESS", "주소 후보", 0.89, "high", "주소 또는 생활권을 추정할 수 있는 정보 후보입니다.", (180, 235, 360, 56)),
        detection("det-market-location", "LOCATION_HINT", "거래 지역 단서", 0.76, "medium", "거래 장소나 활동 지역을 추정할 수 있습니다.", (590, 400, 210, 48)),
    ],
    "assignment": [
        detection("det-student", "STUDENT_ID", "학번 후보", 0.95, "high", "개인을 식별할 수 있는 학번 형식의 텍스트입니다.", (205, 330, 205, 44)),
        detection("det-email", "EMAIL", "이메일 후보", 0.93, "high", "학교 또는 개인 이메일 주소 후보입니다.", (430, 330, 300, 44)),
        detection("det-path", "FILE_PATH", "저장 경로 후보", 0.83, "medium", "사용자명이나 프로젝트 정보가 포함된 경로입니다.", (130, 500, 520, 42)),
        detection("det-document", "DOCUMENT_INFO", "문서 정보 후보", 0.78, "low", "문서 제목과 작성 환경을 드러낼 수 있습니다.", (180, 90, 410, 60)),
    ],
    "community": [
        detection("det-nickname", "NICKNAME", "닉네임 후보", 0.88, "medium", "다른 서비스와 연결될 수 있는 닉네임 후보입니다.", (120, 110, 190, 42)),
        detection("det-community-email", "EMAIL", "이메일 후보", 0.94, "high", "댓글에 포함된 이메일 주소 후보입니다.", (255, 395, 340, 45)),
        detection("det-community-location", "LOCATION_HINT", "지역 단서", 0.81, "medium", "활동 지역이나 생활권을 추정할 수 있습니다.", (315, 112, 215, 40)),
        detection("det-comment", "COMMENT_TEXT", "댓글 단서", 0.72, "low", "댓글 문맥에 개인 정보가 포함될 가능성이 있습니다.", (95, 350, 650, 105)),
    ],
    "other": [
        detection("det-text", "TEXT", "텍스트 후보", 0.84, "medium", "공유 전 확인이 필요한 화면 텍스트입니다.", (120, 140, 540, 62)),
        detection("det-other-email", "EMAIL", "이메일 후보", 0.91, "high", "이메일 주소 형식의 개인정보 후보입니다.", (220, 310, 350, 46)),
        detection("det-other-document", "DOCUMENT_INFO", "문서 정보", 0.75, "low", "파일명이나 문서 속성에 포함된 정보 후보입니다.", (110, 470, 420, 50)),
    ],
}


SCENARIOS = {
    "sns": [("개인 식별 가능성", "high", "얼굴과 계정 정보가 함께 노출되면 개인을 식별할 수 있습니다."), ("방문 장소 추정", "medium", "위치 태그와 배경 단서로 방문 장소가 추정될 수 있습니다.")],
    "marketplace": [("생활권 추정 가능성", "high", "주소나 거래 지역 단서가 함께 노출될 경우 생활권이 추정될 수 있습니다."), ("직접 연락 위험", "high", "전화번호가 노출되면 원치 않는 연락을 받을 수 있습니다.")],
    "assignment": [("학생 신원 연결", "high", "학번과 학교 이메일이 함께 노출되면 학생 신원이 연결될 수 있습니다."), ("개발 환경 노출", "medium", "저장 경로로 사용자명이나 프로젝트 구조가 드러날 수 있습니다.")],
    "community": [("온라인 계정 연결", "medium", "닉네임과 이메일을 통해 다른 계정이 연결될 수 있습니다."), ("생활권 추정", "medium", "게시글의 지역 단서로 활동 지역이 추정될 수 있습니다.")],
    "other": [("문서 소유자 추정", "medium", "텍스트와 문서 정보가 결합되면 소유자가 추정될 수 있습니다."), ("연락처 노출", "high", "이메일 주소가 의도하지 않게 공유될 수 있습니다.")],
}


RECOMMENDATIONS = {
    "sns": [("얼굴 영역을 확인하세요.", "식별이 불필요한 얼굴은 마스킹하거나 잘라내세요."), ("위치 태그를 제거하세요.", "게시 전 위치 태그와 배경 장소 단서를 확인하세요."), ("알림과 계정명을 확인하세요.", "화면 상단의 계정명과 알림 문구를 정리하세요.")],
    "marketplace": [("송장 영역을 마스킹하세요.", "송장이나 주소가 보이는 부분은 공유 전 가리는 것을 권장합니다."), ("전화번호를 가리세요.", "연락처가 필요한 경우에도 일부 숫자를 마스킹하세요."), ("주소와 거래 지역을 확인하세요.", "생활권을 추정할 수 있는 지역 단서를 제거하세요.")],
    "assignment": [("학번과 이메일을 가리세요.", "제출 화면을 공유할 때 학생 식별 정보를 마스킹하세요."), ("파일 경로를 확인하세요.", "사용자명이나 저장소명이 포함된 경로를 정리하세요."), ("이름 포함 여부를 확인하세요.", "문서 본문과 속성에 작성자 이름이 있는지 확인하세요.")],
    "community": [("닉네임과 지역명을 확인하세요.", "다른 계정과 연결되는 닉네임이나 지역 단서를 검토하세요."), ("댓글 속 개인정보를 확인하세요.", "댓글에 이메일이나 연락처가 포함되지 않았는지 확인하세요.")],
    "other": [("화면 텍스트 후보를 확인하세요.", "공유 목적과 무관한 텍스트 영역을 마스킹하세요."), ("이메일과 문서 정보를 확인하세요.", "연락처와 파일 속성 정보를 공유 전에 검토하세요.")],
}


def generate_analysis(mode: str) -> tuple[list[dict], list[dict], list[dict]]:
    normalized = normalize_mode(mode)
    detections = deepcopy(DETECTIONS[normalized])
    scenarios = [
        {"id": f"scenario-{index}", "title": title, "level": level, "description": description}
        for index, (title, level, description) in enumerate(SCENARIOS[normalized], 1)
    ]
    recommendations = [
        {"id": f"rec-{index}", "title": title, "description": description, "completed": False}
        for index, (title, description) in enumerate(RECOMMENDATIONS[normalized], 1)
    ]
    return detections, scenarios, recommendations
