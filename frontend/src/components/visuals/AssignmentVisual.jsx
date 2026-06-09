export default function AssignmentVisual() {
  return (
    <div className="pc-visual assignment-visual-v2" aria-label="과제 제출 화면의 학번과 이메일 탐지 예시">
      <div className="laptop"><div className="laptop-bar"><i /><i /><i /><span>과제 제출 미리보기</span></div><div className="code-pane"><b>FINAL_REPORT.pdf</b><span>학번　20231234</span><span>메일　student@school.ac.kr</span><span>경로　github.com/user/project</span><em className="assignment-box student-box"><small>학번 후보</small></em><em className="assignment-box email-box"><small>이메일</small></em></div></div><div className="laptop-base" />
    </div>
  );
}
