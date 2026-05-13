import pytest

from portal_system import Player, Portal, PortalEngine, PortalError, PortalNetwork


def build_network() -> PortalNetwork:
    net = PortalNetwork()
    for node in ["gallery", "vault", "garden", "tower"]:
        net.add_node(node)

    net.add_portal(
        Portal("g2v", "gallery", "vault", energy_cost=2, cooldown_turns=2, one_way=False)
    )
    net.add_portal(Portal("v2garden", "vault", "garden", one_way=False, energy_cost=1))
    net.add_portal(
        Portal("garden2tower", "garden", "tower", required_keys={"sunseal"}, energy_cost=1)
    )
    return net


def test_player_travel_energy_and_location():
    engine = PortalEngine(build_network())
    engine.register_player(Player("p1", "gallery", energy=5))

    destination = engine.travel("p1", "g2v")

    assert destination == "vault"
    assert engine.players["p1"].energy == 3


def test_cooldown_blocks_reuse_until_advanced_turns():
    engine = PortalEngine(build_network())
    engine.register_player(Player("p1", "gallery", energy=10))

    engine.travel("p1", "g2v")
    engine.travel("p1", "g2v__reverse")

    with pytest.raises(PortalError, match="cannot be used"):
        engine.travel("p1", "g2v")

    engine.advance_turn(2)
    assert engine.travel("p1", "g2v") == "vault"


def test_key_requirement_for_protected_portal():
    engine = PortalEngine(build_network())
    engine.register_player(Player("p1", "garden", energy=3))

    with pytest.raises(PortalError, match="cannot be used"):
        engine.travel("p1", "garden2tower")

    engine.players["p1"].keys.add("sunseal")
    assert engine.travel("p1", "garden2tower") == "tower"


def test_shortest_path_uses_portal_graph():
    engine = PortalEngine(build_network())
    assert engine.shortest_path("gallery", "tower") == ["gallery", "vault", "garden", "tower"]


def test_missing_path_raises():
    net = PortalNetwork()
    net.add_node("a")
    net.add_node("b")
    engine = PortalEngine(net)

    with pytest.raises(PortalError, match="No path"):
        engine.shortest_path("a", "b")
