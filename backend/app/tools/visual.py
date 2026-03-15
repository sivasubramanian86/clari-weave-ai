"""tools/visual.py — Visual cue extraction tool used by Clara and Analyst."""


def extract_visual_cues(image_base64: str = "") -> dict:
    """
    Extracts visual cues from an uploaded image (e.g., dates, warnings, clutter).
    In production this would call Gemini vision with the image_base64 bytes.
    """
    return {
        "text_snippets": ["DUE: Friday 24th", "Final Notice"],
        "objects": ["Stack of envelopes", "Coffee cup"],
        "urgent_flags": True,
    }
