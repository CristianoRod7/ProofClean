from threading import RLock
from typing import Any


class InMemoryStore:
    def __init__(self) -> None:
        self.users: dict[str, dict[str, Any]] = {}
        self.users_by_email: dict[str, str] = {}
        self.analyses: dict[str, dict[str, Any]] = {}
        self.files: dict[str, dict[str, Any]] = {}
        self.masked_files: dict[str, dict[str, Any]] = {}
        self.lock = RLock()


store = InMemoryStore()
