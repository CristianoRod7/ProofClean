SEVERITY_SCORE = {
    "LOW": 10,
    "MEDIUM": 20,
    "HIGH": 35,
    "CRITICAL": 50,
}


def calculate_risk_score(purpose: str, findings: list[dict]) -> int:
    score = 0
    has_critical = False
    for finding in findings:
        severity = finding.get("severity", "LOW")
        detection_type = finding.get("detection_type")
        score += SEVERITY_SCORE.get(severity, 0)
        has_critical = has_critical or severity == "CRITICAL"

        if purpose == "SECOND_HAND" and detection_type in {"ADDRESS", "PHONE", "INVOICE"}:
            score += 15
        if purpose == "SNS" and detection_type in {"LOCATION_HINT", "FACE", "EXIF"}:
            score += 10
        if purpose == "ASSIGNMENT" and detection_type in {"STUDENT_ID", "EMAIL", "SCREEN_TEXT"}:
            score += 10

    if len(findings) >= 5:
        score += 10
    if has_critical:
        score = max(score, 80)
    return max(0, min(100, score))
