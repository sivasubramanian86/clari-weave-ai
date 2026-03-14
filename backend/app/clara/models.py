from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class ClarityMap(BaseModel):
    """The ephemeral session state mapping out the user's current chaos."""
    main_topics: List[str] = Field(description="Core subjects mentioned, e.g., 'rent', 'exam'")
    stressors: List[str] = Field(description="Specific points of anxiety or pressure")
    opportunities: List[str] = Field(description="Neutral observations or positive facts")
    suggested_actions: List[str] = Field(description="1-2 micro-actions recommended to the user")

class SessionMemoryShard(BaseModel):
    """Persisted in Firestore for longitudinal context."""
    timestamp: datetime
    main_topics: List[str]
    emotional_tone: str = Field(description="e.g., 'overwhelmed', 'calm', 'rushed'")
    suggested_actions: List[str]
    agreed_to_try: Optional[bool] = None  # Updated later if user confirms
