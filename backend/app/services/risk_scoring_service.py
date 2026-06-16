SEVERITY_POINTS = {"high": 25, "medium": 15, "low": 8}


def calculate_risk(detections: list[dict]) -> tuple[int, str]:
    if not detections:
        return 8, "low"
    severity_score = sum(SEVERITY_POINTS.get(str(item.get("severity", "low")).lower(), 8) for item in detections)
    count_bonus = min(12, max(0, len(detections) - 1) * 3)
    average_confidence = sum(float(item.get("confidence", 0)) for item in detections) / len(detections)
    confidence_bonus = round(average_confidence * 12)
    score = min(100, severity_score + count_bonus + confidence_bonus)
    level = "high" if score >= 70 else "medium" if score >= 40 else "low"
    return score, level
