import asyncio
import random

from api.models import Aircraft
from api.repo import Repo
from api.schemas import GameData, Photo
from api.services import request_async


class Game:
    """A class to represent a game of Spot the Plane."""

    BASE_URL = "https://api.planespotters.net/pub/photos/reg/"
    HEADERS = {"user-agent": "spottheplane"}
    MODELS = {
        "737": 0.889,
        "A320": 0.853,
        "Learjet": 0.828,
        "777": 0.811,
        "A330": 0.698,
        "CRJ": 0.665,
        "Dash 8": 0.623,
        "767": 0.604,
        "757": 0.591,
        "ERJ 190": 0.575,
        "787": 0.572,
        "ERJ 170": 0.556,
        "747": 0.528,
        "ERJ 140": 0.517,
        "MD-80": 0.481,
        "C-130": 0.387,
        "A350": 0.355,
        "A380": 0.347,
        "DC-3": 0.322,
        "A340": 0.309,
        "MD-11": 0.287,
        "727": 0.262,
        "ERJ 135": 0.224,
    }

    def __init__(self, seed: int, repo: Repo) -> None:
        """Initializes a game of Spot the Plane."""
        self.repo: Repo = repo
        self.initial_seed: int = seed
        self.seed: float = self.new_seed(init=True)
        self.data: list[dict[str, any]] = []
        self.images: list[str] = []
        self.used: list[str] = []
        self.planes = self.get_planes()

    def get_planes(self) -> list[str]:
        """Select ten models at random."""
        random.seed(self.initial_seed)
        return random.choices(
            list(self.MODELS.keys()), weights=list(self.MODELS.values()), k=10
        )

    def get_answers(self, typecode: str) -> list[dict[str, bool]]:
        """Get three incorrect answers for a plane."""
        random.seed(self.seed)
        return random.sample(
            [
                {"model": model, "answer": False}
                for model in list(self.MODELS.keys())
                if model != typecode and model[:3] != typecode[:3]
            ],  # type: ignore
            k=3,
        )

    def shuffle(
        self, data: list[dict[str, any]], chaos: bool = True
    ) -> list[dict[str, any]]:
        """Shuffle a list of answers."""
        seed = self.seed if chaos else self.initial_seed
        random.seed(seed)
        return random.sample(data, len(data))

    def new_seed(self, init: bool = False) -> float:
        """Generate a new seed chaotically."""
        seed = self.initial_seed if init else self.seed
        random.seed(seed)
        return random.uniform(-1, 1)

    async def call_api(
        self,
        plane: Aircraft,
        base_url: str = BASE_URL,
        headers: dict[str, str] = HEADERS,
    ) -> Photo | bool:
        """Call the Planespotters.net API to get a photo of the plane."""
        url = f"{base_url}{plane.registration}"
        json = await request_async(url, headers=headers)
        if json["photos"]:
            data = json["photos"][0]
            pic = data["thumbnail_large"]["src"]
            link = data["link"]
            photog = data["photographer"]
            return Photo(pic=pic, link=link, copyright=f"\u00a9 {photog}")
        else:
            # planespotters.net has no pics of this plane; mark it as non-viable
            await self.repo.update_plane(plane)
            return False

    async def create_game(self) -> GameData:
        """Create a new game instance."""
        for plane_type in self.planes:
            details = False
            while not details:
                plane = await self.repo.get_plane(self.seed, plane_type, self.used)
                details = await self.call_api(plane)
                await asyncio.sleep(random.uniform(0.21, 0.55))

            self.used.append(plane.registration)
            self.images.append(details["pic"])

            question = [
                {
                    "id": plane.registration,
                    "model": plane.typecode,
                    "answer": True,
                    "details": details,
                }
            ]
            answers = self.get_answers(plane.typecode)

            question.extend(answers)
            self.data.append(self.shuffle(question))

            self.seed = self.new_seed()

        return GameData(
            data=self.shuffle(self.data, chaos=False),
            images=self.images,
            day=self.initial_seed,
        )
