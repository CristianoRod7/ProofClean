MODE_INSTRUCTIONS = {
    "sns": "얼굴, 위치 태그, 프로필 텍스트, 알림 텍스트, 배경 속 장소 단서를 중점적으로 확인하세요.",
    "marketplace": "송장, 주소, 전화번호, 거래 지역, 택배 정보를 중점적으로 확인하세요.",
    "assignment": "학번, 이름, 이메일, 학교명, 파일 경로, 문서 정보를 중점적으로 확인하세요.",
    "community": "닉네임, 댓글, 이메일, 지역 단서, 게시글 속 개인정보를 중점적으로 확인하세요.",
    "messenger": "전화번호, 계좌번호, 링크, 프로필명, 대화 내용 속 개인정보 후보를 중점적으로 확인하세요.",
    "other": "화면 속 텍스트, 이메일, 연락처, 문서 정보 후보를 폭넓게 확인하세요.",
}


class PromptBuilder:
    def build(self, mode: str) -> str:
        mode_instruction = MODE_INSTRUCTIONS.get(mode, MODE_INSTRUCTIONS["other"])
        return f"""
이 이미지는 업로드 전 개인정보 노출 위험을 점검하기 위한 이미지입니다.
실제 개인정보라고 단정하지 말고 모든 항목을 '후보'로 표현하세요.
이미지 안에서 실제로 보이는 텍스트를 최대한 읽고, 화면 속 얼굴, 전화번호, 주소, 이메일, 학번, 계좌번호, 링크, 이름, 닉네임, 위치 단서, 문서 정보, 송장 정보, 파일 경로를 확인하세요.
{mode_instruction}

JSON 객체만 반환하세요. 객체에는 detections, summary, scenarios, recommendations가 반드시 있어야 합니다.
detections 항목 형식:
{{"id":"det-1","type":"EMAIL","label":"이메일","confidence":0.8,"severity":"high","description":"설명","reason":"이메일 주소 형식과 일치합니다.","evidence":"화면에서 실제로 읽은 문자열 또는 null","box":{{"x":0.1,"y":0.2,"width":0.3,"height":0.08}},"boxStatus":"estimated","coordinateSpace":"normalized"}}
type은 PHONE, ADDRESS, EMAIL, STUDENT_ID, ACCOUNT_NUMBER, URL, NAME, LOCATION_HINT, INVOICE, FILE_PATH, DOCUMENT_INFO, NICKNAME, FACE, TEXT 중 하나여야 합니다.
이미지에서 실제로 확인한 evidence만 반환하고, 확실하지 않으면 confidence를 낮추세요.
box는 이미지 전체를 0~1로 본 normalized 좌표로 반환하세요. 위치를 확실히 특정할 수 없으면 임의 좌표를 만들지 말고 box를 null로 반환하세요.
box가 null이면 boxStatus는 none, coordinateSpace도 null로 반환하세요. 좌표를 추정한 경우 boxStatus는 estimated로 두고, 정확히 확인한 경우에만 exact로 두세요.
탐지 후보가 없으면 detections를 빈 배열로 반환하고 데모 항목을 만들지 마세요.
confidence는 0~1, severity는 low, medium, high, critical 중 하나여야 합니다.
summary는 실제 탐지 결과를 한 문장으로 요약하세요. scenarios 항목은 id, title, level, description을 포함하고 recommendations 항목은 id, title, description, completed를 포함하세요.
""".strip()
