from typing import TypedDict


class GameData(TypedDict):
    data: list[list[dict[str, any]]]
    images: list[str]
    day: int


class Photo(TypedDict):
    pic: str
    link: str
    copyright: str
