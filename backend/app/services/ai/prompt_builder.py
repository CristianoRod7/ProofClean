MODE_INSTRUCTIONS = {
    "sns": "얼굴, 위치 태그, 프로필 텍스트, 알림 텍스트, 배경 속 장소 단서를 중점적으로 확인하세요.",
    "marketplace": "송장, 주소, 전화번호, 거래 지역, 택배 정보를 중점적으로 확인하세요.",
    "assignment": "학번, 이름, 이메일, 학교명, 파일 경로, 문서 정보를 중점적으로 확인하세요.",
    "community": "닉네임, 댓글, 이메일, 지역 단서, 게시글 속 개인정보를 중점적으로 확인하세요.",
    "other": "화면 속 텍스트, 이메일, 연락처, 문서 정보 후보를 폭넓게 확인하세요.",
}


class PromptBuilder:
    def build(self, mode: str) -> str:
        mode_instruction = MODE_INSTRUCTIONS.get(mode, MODE_INSTRUCTIONS["other"])
        return f"""
이 이미지는 업로드 전 개인정보 노출 위험을 점검하기 위한 이미지입니다.
실제 개인정보라고 단정하지 말고 모든 항목을 '후보'로 표현하세요.
화면 속 얼굴, 연락처, 주소, 이메일, 학번, 닉네임, 위치 단서, 문서 정보, 송장 정보, 파일 경로를 확인하세요.
{mode_instruction}

JSON 객체만 반환하세요. 객체에는 detections, scenarios, recommendations 배열이 반드시 있어야 합니다.
detections 항목 형식:
{{"id":"det-1","type":"EMAIL","label":"이메일 후보","confidence":0.8,"severity":"medium","description":"설명","box":{{"x":10,"y":20,"width":100,"height":40}}}}
box 좌표를 확실히 모르면 null로 반환하세요. confidence는 0~1, severity는 low, medium, high 중 하나여야 합니다.
scenarios 항목은 id, title, level, description을 포함하고 recommendations 항목은 id, title, description, completed를 포함하세요.
""".strip()
