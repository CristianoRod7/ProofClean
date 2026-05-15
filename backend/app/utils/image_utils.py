def clamp(value: float, min_value: float, max_value: float) -> float:
    return max(min_value, min(max_value, value))


def normalized_to_pixels(x, y, width, height, image_width: int, image_height: int) -> tuple[int, int, int, int]:
    nx = clamp(x or 0, 0, 1)
    ny = clamp(y or 0, 0, 1)
    nw = clamp(width or 0, 0, 1)
    nh = clamp(height or 0, 0, 1)
    left = int(nx * image_width)
    top = int(ny * image_height)
    right = int(min(image_width, left + nw * image_width))
    bottom = int(min(image_height, top + nh * image_height))
    return left, top, max(left + 1, right), max(top + 1, bottom)
