from __future__ import annotations

from dataclasses import dataclass, field


class PortalError(Exception):
    """Base exception for portal operations."""


@dataclass(slots=True)
class Portal:
    portal_id: str
    source: str
    destination: str
    energy_cost: int = 1
    cooldown_turns: int = 0
    required_keys: set[str] = field(default_factory=set)
    one_way: bool = True


@dataclass(slots=True)
class Player:
    player_id: str
    location: str
    energy: int = 0
    keys: set[str] = field(default_factory=set)


@dataclass(slots=True)
class PortalNetwork:
    nodes: set[str] = field(default_factory=set)
    portals: dict[str, Portal] = field(default_factory=dict)
    adjacency: dict[str, set[str]] = field(default_factory=dict)

    def add_node(self, node_id: str) -> None:
        self.nodes.add(node_id)
        self.adjacency.setdefault(node_id, set())

    def add_portal(self, portal: Portal) -> None:
        if portal.portal_id in self.portals:
            raise PortalError(f"Portal '{portal.portal_id}' already exists")
        if portal.source not in self.nodes or portal.destination not in self.nodes:
            raise PortalError("Portal endpoints must be existing nodes")

        self.portals[portal.portal_id] = portal
        self.adjacency.setdefault(portal.source, set()).add(portal.portal_id)

        if not portal.one_way:
            reverse_id = f"{portal.portal_id}__reverse"
            if reverse_id in self.portals:
                raise PortalError(f"Generated reverse portal id '{reverse_id}' conflicts")
            reverse = Portal(
                portal_id=reverse_id,
                source=portal.destination,
                destination=portal.source,
                energy_cost=portal.energy_cost,
                cooldown_turns=portal.cooldown_turns,
                required_keys=set(portal.required_keys),
                one_way=True,
            )
            self.portals[reverse.portal_id] = reverse
            self.adjacency.setdefault(reverse.source, set()).add(reverse.portal_id)

    def outgoing(self, node_id: str) -> list[Portal]:
        ids = self.adjacency.get(node_id, set())
        return [self.portals[p_id] for p_id in sorted(ids)]
