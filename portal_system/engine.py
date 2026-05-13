from __future__ import annotations

from collections import deque

from .models import Player, Portal, PortalError, PortalNetwork


class PortalEngine:
    def __init__(self, network: PortalNetwork):
        self.network = network
        self.players: dict[str, Player] = {}
        self.turn = 0
        self._cooldowns: dict[tuple[str, str], int] = {}

    def register_player(self, player: Player) -> None:
        if player.player_id in self.players:
            raise PortalError(f"Player '{player.player_id}' already registered")
        if player.location not in self.network.nodes:
            raise PortalError(f"Unknown starting node '{player.location}'")
        self.players[player.player_id] = player

    def advance_turn(self, turns: int = 1) -> None:
        if turns < 0:
            raise PortalError("Turns must be non-negative")
        self.turn += turns

    def get_available_portals(self, player_id: str) -> list[Portal]:
        player = self._player(player_id)
        available = []
        for portal in self.network.outgoing(player.location):
            if self._can_use(player, portal):
                available.append(portal)
        return available

    def travel(self, player_id: str, portal_id: str) -> str:
        player = self._player(player_id)
        portal = self.network.portals.get(portal_id)
        if portal is None:
            raise PortalError(f"Portal '{portal_id}' not found")
        if portal.source != player.location:
            raise PortalError("Player is not at the portal source")
        if not self._can_use(player, portal):
            raise PortalError("Portal cannot be used right now")

        player.energy -= portal.energy_cost
        player.location = portal.destination
        if portal.cooldown_turns > 0:
            self._cooldowns[(player.player_id, portal.portal_id)] = (
                self.turn + portal.cooldown_turns
            )
        return player.location

    def shortest_path(self, start: str, goal: str) -> list[str]:
        if start not in self.network.nodes or goal not in self.network.nodes:
            raise PortalError("Start or goal node is unknown")
        if start == goal:
            return [start]

        queue = deque([start])
        prev: dict[str, str | None] = {start: None}

        while queue:
            node = queue.popleft()
            for portal in self.network.outgoing(node):
                nxt = portal.destination
                if nxt in prev:
                    continue
                prev[nxt] = node
                if nxt == goal:
                    return self._reconstruct(prev, goal)
                queue.append(nxt)

        raise PortalError(f"No path from '{start}' to '{goal}'")

    def _reconstruct(self, prev: dict[str, str | None], goal: str) -> list[str]:
        path = []
        cur: str | None = goal
        while cur is not None:
            path.append(cur)
            cur = prev[cur]
        return list(reversed(path))

    def _can_use(self, player: Player, portal: Portal) -> bool:
        cooldown_until = self._cooldowns.get((player.player_id, portal.portal_id), -1)
        if cooldown_until > self.turn:
            return False
        if player.energy < portal.energy_cost:
            return False
        if not portal.required_keys.issubset(player.keys):
            return False
        return True

    def _player(self, player_id: str) -> Player:
        try:
            return self.players[player_id]
        except KeyError as exc:
            raise PortalError(f"Player '{player_id}' not registered") from exc
